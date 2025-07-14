// src/components/ItemModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FiX, FiChevronDown } from "react-icons/fi";
import { toast } from "react-toastify";

import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ASPECT_RATIO = 16 / 9;

const ItemModal = ({
  showModal,
  onClose,
  editingItem,
  onSubmit,
  darkMode,
  categories,
  isLoading,
}) => {
  const initialFormState = {
    category_name: "",
    category_name_ar: "",
    key_name: "",
    image_url: "",
    price: { Q: "", H: "", F: "" },
    price_type: "portion",
    price_per_portion: "",
    translations: [
      { language: "en", name: "", description: "" },
      { language: "ar", name: "", description: "" },
    ],
    categoryOption: "existing",
  };

  const [form, setForm] = useState(initialFormState);
  // REMOVED: formErrors state is no longer needed.
  // const [formErrors, setFormErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");

  const [imageSrcForCrop, setImageSrcForCrop] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImageFile, setCroppedImageFile] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [showEnSuggestions, setShowEnSuggestions] = useState(false);
  const [showArSuggestions, setShowArSuggestions] = useState(false);
  const categoryWrapperRef = useRef(null);

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const categoryMap = new Map();
      categories.forEach((item) => {
        if (item && item.category_name && item.category_name_ar) {
          const key = item.category_name.trim().toLowerCase();
          if (!categoryMap.has(key)) {
            categoryMap.set(key, {
              category_name: item.category_name.trim(),
              category_name_ar: item.category_name_ar.trim(),
            });
          }
        }
      });
      setUniqueCategories(Array.from(categoryMap.values()));
    }
  }, [categories]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryWrapperRef.current &&
        !categoryWrapperRef.current.contains(event.target)
      ) {
        setShowEnSuggestions(false);
        setShowArSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const canvasToBlob = (canvas, type = "image/jpeg", quality = 0.9) => {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, type, quality);
    });
  };

  const generateCroppedImage = async () => {
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    if (!image || !canvas || !completedCrop) {
      throw new Error("Crop details not available");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    const blob = await canvasToBlob(canvas);
    if (blob) {
      const file = new File([blob], "cropped-image.jpeg", {
        type: "image/jpeg",
      });
      setCroppedImageFile(file);
      setPreviewUrl(URL.createObjectURL(blob));
    }
  };

  const handleCropAndSave = async () => {
    try {
      await generateCroppedImage();
      setImageSrcForCrop("");
      toast.success(t("Image_Cropped_Success"));
    } catch (e) {
      console.error("Cropping failed:", e);
      toast.error(t("Image_Cropped_Error"));
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, ASPECT_RATIO, width, height),
      width,
      height
    );
    setCrop(crop);
    setCompletedCrop(crop);
  };

  const clearCropState = () => {
    setImageSrcForCrop("");
    setCroppedImageFile(null);
    setPreviewUrl("");
    setCrop(undefined);
    setCompletedCrop(null);
  };

  useEffect(() => {
    if (showModal) {
      if (editingItem) {
        setForm({
          ...editingItem,
          category_name: editingItem.category_name || "",
          category_name_ar: editingItem.category_name_ar || "",
          key_name: editingItem.key_name || "",
          image_url: editingItem.image_url || "",
          price_type: editingItem.price_type || "portion",
          price: {
            Q: editingItem.price_q || "",
            H: editingItem.price_h || "",
            F: editingItem.price_f || "",
          },
          price_per_portion: editingItem.price_per_portion || "",
          translations: editingItem.translations?.length
            ? editingItem.translations
            : initialFormState.translations,
          categoryOption: "existing",
        });
        setPreviewUrl(editingItem.image_url || "");
        setCroppedImageFile(null);
        setImageSrcForCrop("");
      } else {
        setForm(initialFormState);
        clearCropState();
      }
      // No need to reset formErrors anymore
      setShowEnSuggestions(false);
      setShowArSuggestions(false);
    }
  }, [editingItem, showModal]);

  const resetForm = () => {
    clearCropState();
    onClose();
  };

  // --- NEW: SIMPLIFIED VALIDATION FUNCTION ---
  const areAllFieldsFilled = () => {
    const {
      category_name,
      category_name_ar,
      price_type,
      price,
      price_per_portion,
      translations,
    } = form;

    // Check mandatory text fields
    if (!category_name.trim() || !category_name_ar.trim() || !translations[0].name.trim() || !translations[1].name.trim() || !translations[1].description.trim() || !translations[0].description.trim()) {
      return false;
    }

    // Check pricing
    if (price_type === "portion") {
      if (
        !String(price.Q).trim() ||
        !String(price.H).trim() ||
        !String(price.F).trim()
      ) {
        return false; // All three prices are required
      }
    }
     else { // 'per_portion'
      if (!String(price_per_portion).trim()) {
        return false;
      }
    }
    
    // Check image for new items
    if (!editingItem && !croppedImageFile) {
        return false;
    }

    return true; // All checks passed
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("Validation_Image_File_Type"));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("Validation_Image_Size", { size: "5MB" }));
        return;
      }

      clearCropState();
      
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrcForCrop(reader.result?.toString() || "");
      });
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryOption") {
      setForm((prev) => ({
        ...prev,
        categoryOption: value,
        category_name: value === "new" ? "" : prev.category_name,
        category_name_ar: value === "new" ? "" : prev.category_name_ar,
      }));
      return;
    }

    if (name.startsWith("price.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({ ...prev, price: { ...prev.price, [key]: value } }));
    } else if (name.startsWith("translations.")) {
      const [_, index, field] = name.split(".");
      setForm((prev) => {
        const updatedTranslations = [...prev.translations];
        updatedTranslations[index][field] = value;
        return { ...prev, translations: updatedTranslations };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEnSuggestionSelect = (category) => {
    setForm((prev) => ({
      ...prev,
      category_name: category.category_name,
      category_name_ar: category.category_name_ar,
    }));
    setShowEnSuggestions(false);
    setShowArSuggestions(false);
  };

  const handleArSuggestionSelect = (category) => {
    setForm((prev) => ({
      ...prev,
      category_name: category.category_name,
      category_name_ar: category.category_name_ar,
    }));
    setShowEnSuggestions(false);
    setShowArSuggestions(false);
  };

  // --- NEW: UPDATED SUBMIT HANDLER ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!areAllFieldsFilled()) {
      toast.error(t("All_Fields_Mandatory"));
      return;
    }
    onSubmit(form, croppedImageFile, editingItem?.menu_id);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`relative rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
          darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
        }`}
      >
        <canvas ref={previewCanvasRef} style={{ display: "none" }} />

        {imageSrcForCrop && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col p-4 rounded-xl">
            <h3 className="text-xl font-bold text-white text-center mb-2">
              {t("Crop_Image")}
            </h3>
            <p className="text-center text-gray-300 mb-4">
              {t("Required_Ratio")}: 16:9
            </p>
            <div className="flex-grow flex items-center justify-center min-h-0 my-4">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={ASPECT_RATIO}
                minWidth={100}
                ruleOfThirds >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={imageSrcForCrop}
                  onLoad={onImageLoad}
                  style={{ maxHeight: "60vh", objectFit: "contain" }}
                />
              </ReactCrop>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setImageSrcForCrop("")}
                className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition-colors"
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                onClick={handleCropAndSave}
                className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                {t("Crop_Save")}
              </button>
            </div>
          </div>
        )}
        <button
          onClick={resetForm}
          className={`absolute ${
            isRTL ? "top-4 left-4" : "top-4 right-4"
          } p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200`}
        >
          <FiX size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {editingItem ? t("Editing_Item") : t("Add_New_Menu_Item")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-6">
              <label className="block mb-3 font-medium text-lg">
                {t("Category_Type")}*
              </label>
              <div
                className={`relative flex w-full rounded-full ${
                  darkMode ? "bg-gray-900" : "bg-gray-200"
                }`}
              >
                <div
                  className={`absolute top-0 left-0 h-full w-1/2 rounded-full bg-black transition-transform duration-300 ease-in-out transform ${
                    form.categoryOption === "new" ? "translate-x-full" : "translate-x-0"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({ target: { name: "categoryOption", value: "existing" } })
                  }
                  className={`relative w-1/2 py-2.5 text-center font-semibold transition-colors duration-300 ${
                    form.categoryOption === "existing"
                      ? "text-white"
                      : darkMode ? "text-gray-300" : "text-black"
                  }`} >
                  {t("Existing_Category")}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleChange({ target: { name: "categoryOption", value: "new" } })
                  }
                  className={`relative w-1/2 py-2.5 text-center font-semibold transition-colors duration-300 ${
                    form.categoryOption === "new"
                      ? "text-white"
                      : darkMode ? "text-gray-300" : "text-black"
                  }`} >
                  {t("New_Category")}
                </button>
              </div>
            </div>
            <div
              ref={categoryWrapperRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="relative">
                <label className="block mb-2 font-medium">
                  {t("Category_Name_English")}*
                </label>
                {form.categoryOption === "existing" ? (
                  <div className="relative">
                    <div
                      className={`w-full p-3 rounded-lg border-2 ${
                        darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                      } flex items-center justify-between cursor-pointer`}
                      onClick={() => setShowEnSuggestions(!showEnSuggestions)}
                    >
                      <span>{form.category_name || t("Select_Category")}</span>
                      <FiChevronDown
                        className={`transition-transform duration-200 ${
                          showEnSuggestions ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {showEnSuggestions && (
                      <ul
                        className={`absolute z-20 w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto ${
                          darkMode ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
                        }`}
                      >
                        {uniqueCategories.map((cat, index) => (
                          <li
                            key={`en-${index}`}
                            onClick={() => handleEnSuggestionSelect(cat)}
                            className={`p-3 cursor-pointer ${
                              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                            } border-b ${
                              darkMode ? "border-gray-700" : "border-gray-200"
                            } last:border-0`}
                          >
                            <div className="font-medium">{cat.category_name}</div>
                            <div className="text-sm opacity-70">{cat.category_name_ar}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <input
                    name="category_name"
                    value={form.category_name}
                    onChange={handleChange}
                    autoComplete="off"
                    placeholder={t("Enter_New_Category")}
                    className={`w-full p-3 rounded-lg border-2 ${
                      darkMode ? "bg-gray-700 border-pink-500/50" : "bg-white border-pink-300"
                    } focus:border-pink-500`}
                  />
                )}
              </div>
              <div className="relative">
                <label className="block mb-2 font-medium">
                  {t("Category_Name_Arabic")}*
                </label>
                {form.categoryOption === "existing" ? (
                  <div className="relative">
                    <div
                      className={`w-full p-3 rounded-lg border-2 ${
                        darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                      } flex items-center justify-between cursor-pointer`}
                      onClick={() => setShowArSuggestions(!showArSuggestions)}
                    >
                      <span>{form.category_name_ar || t("Select_Category")}</span>
                      <FiChevronDown
                        className={`transition-transform duration-200 ${
                          showArSuggestions ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {showArSuggestions && (
                      <ul
                        className={`absolute z-20 w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto ${
                          darkMode ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
                        }`}
                      >
                        {uniqueCategories.map((cat, index) => (
                          <li
                            key={`ar-${index}`}
                            onClick={() => handleArSuggestionSelect(cat)}
                            className={`p-3 cursor-pointer ${
                              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                            } border-b ${
                              darkMode ? "border-gray-700" : "border-gray-200"
                            } last:border-0`}
                          >
                            <div className="font-medium">{cat.category_name_ar}</div>
                            <div className="text-sm opacity-70">{cat.category_name}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <input
                    name="category_name_ar"
                    value={form.category_name_ar}
                    onChange={handleChange}
                    autoComplete="off"
                    placeholder={t("Enter_Arabic_Category")}
                    className={`w-full p-3 rounded-lg border-2 ${
                      darkMode ? "bg-gray-700 border-pink-500/50" : "bg-white border-pink-300"
                    } focus:border-pink-500`}
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">{t("Item_Image")}*</label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {t("Image_Crop_Info")} (Ratio: 16:9)
              </p>
              <div className="flex items-center space-x-4">
                <label
                  className={`flex-1 p-3 rounded-lg border-2 ${
                    darkMode ? "bg-gray-700 border-gray-600 hover:border-gray-500" : "bg-white border-gray-300 hover:border-gray-400"
                  } transition-colors duration-300 cursor-pointer text-center`}
                >
                  {previewUrl ? t("Change_Image") : t("Choose_File")}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              {previewUrl && (
                <div className="mt-4 flex justify-center bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                  <img
                    src={previewUrl}
                    alt="Cropped Preview"
                    className="h-32 object-contain rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-3 font-medium text-lg">{t("Pricing_Type")}*</label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input type="radio" name="price_type" value="portion" checked={form.price_type === "portion"} onChange={handleChange} className="mr-2 ml-2 h-5 w-5 accent-purple-500" />{" "}
                  <span>{t("Q_H_F")}</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="price_type" value="per_portion" checked={form.price_type === "per_portion"} onChange={handleChange} className="mr-2 ml-2 h-5 w-5 accent-pink-500" />{" "}
                  <span>{t("Per_Portion")}</span>
                </label>
              </div>
            </div>

            {form.price_type === "portion" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 font-medium">{t("Quarter_Price")}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">Q</span>
                    <input name="price.Q" value={form.price.Q} onChange={handleChange} placeholder={t("Placeholder_Quarter_Price")}
                      className={`w-full p-3 pl-8 rounded-lg border-2 ${ darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300" } focus:border-purple-500 transition-colors duration-300`} />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-medium">{t("Half_Price")}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">H</span>
                    <input name="price.H" value={form.price.H} onChange={handleChange} placeholder={t("Placeholder_Half_Price")}
                      className={`w-full p-3 pl-8 rounded-lg border-2 ${ darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300" } focus:border-purple-500 transition-colors duration-300`} />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-medium">{t("Full_Price")}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">F</span>
                    <input name="price.F" value={form.price.F} onChange={handleChange} placeholder={t("Placeholder_Full_Price")}
                      className={`w-full p-3 pl-8 rounded-lg border-2 ${ darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300" } focus:border-purple-500 transition-colors duration-300`} />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block mb-2 font-medium">{t("Per_Portion_Price")}*</label>
                <input name="price_per_portion" value={form.price_per_portion} onChange={handleChange}
                  className={`w-full p-3 rounded-lg border-2 ${ darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300" } focus:border-pink-500 transition-colors duration-300`} />
              </div>
            )}

            {form.translations.map((translation, i) => (
              <div key={i} className={`p-4 rounded-xl border-2 ${ darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200" }`} >
                <h3 className="font-medium mb-3 text-lg">
                  {translation.language.toUpperCase()} {t("Version")}*
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">{t("Name")}*</label>
                    <input name={`translations.${i}.name`} value={translation.name} onChange={handleChange}
                      className={`w-full p-3 rounded-lg border-2 ${ darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300" } focus:border-purple-500 transition-colors duration-300`} />
                  </div>
                  <div>
                    <label className="block mb-2">{t("Description")}</label>
                    <textarea name={`translations.${i}.description`} value={translation.description} onChange={handleChange} rows={3}
                      className={`w-full p-3 rounded-lg border-2 ${ darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300" } focus:border-purple-500 transition-colors duration-300`} />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end space-x-4 pt-6">
              <button type="button" onClick={resetForm} disabled={isLoading}
                className={`px-6 py-3 ml-2 rounded-xl border-2 ${ darkMode ? "bg-gray-700 border-gray-600 hover:border-gray-500" : "bg-gray-100 border-gray-300 hover:border-gray-400" } transition-colors duration-300 ${ isLoading ? "opacity-50" : "" }`} >
                {t("Cancel")}
              </button>
              <button type="submit" disabled={isLoading}
                className={`px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 transition-all duration-300 flex items-center justify-center min-w-[140px] ${ isLoading ? "opacity-80" : "shadow-lg hover:shadow-xl" }`} >
                {isLoading ? ( <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> ) : editingItem ? ( t("Update_Item") ) : ( t("Add_Item") )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;