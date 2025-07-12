import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import leaf from "./leaf.png"

const API_URL = 'https://arabi-aseel-1.onrender.com/api/chefs';

const ChefsSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // State to store chefs, loading status, and errors
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchChefs = async () => {
      try {
        setLoading(true);
        // Using the public route to get all chefs
        const response = await axios.get(API_URL);
        // We will display only the first 3 chefs to match the design
        setChefs(response.data.slice(0, 3)); 
      } catch (err) {
        console.error("Failed to fetch chefs:", err);
        setError(t('error_fetching_chefs', 'Could not load chef information.'));
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, [t]); // Added 't' to dependency array to refetch on language change if needed

  // A. Loading State: Display skeletons that match the design
  if (loading) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} className="flex flex-col min-h-screen font-poppins items-center">
        <h2 className="text-5xl mt-20 font-serif text-gray-800 mb-8 text-center">{t("meet_our_special_chefs")}</h2>
        <div className="flex flex-col sm:flex-row justify-center space-y-8 sm:space-y-0 sm:space-x-24 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="relative w-72 h-72 mx-auto mb-4 bg-gray-200 rounded-full"></div>
              <div className="w-56 h-10 mx-auto bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // B. Error State: Display a clear error message
  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center text-center text-red-500">
        <h2 className="text-2xl font-bold">{t('error', 'An Error Occurred')}</h2>
        <p>{error}</p>
      </div>
    );
  }

  // C. Success State: Display the fetched data
  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex flex-col min-h-screen font-poppins items-center "
    >
      <h2 className="text-5xl mt-20 font-serif text-gray-800 mb-8 text-center">
        {t("meet_our_special_chefs")}
      </h2>

      <div className="flex flex-col sm:flex-row justify-center space-y-8 sm:space-y-0 sm:space-x-24">
        {/* Map through the fetched chefs data */}
        {chefs.map((chef) => (
          <div key={chef.id} className="text-center">
            <div className="relative w-72 h-72 mx-auto mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full border-4 border-black flex items-center justify-center" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <img
                  src={chef.image_url} // <-- Dynamic Image URL
                  alt={isRTL ? chef.name_ar : chef.name} // <-- Dynamic Alt Text (Language Aware)
                  className="w-full h-full rounded-full border-4 border-gray-300 object-cover"
                />
              </div>
            </div>
            <div
              className="relative bg-cover bg-center rounded-lg px-4 py-3 text-black"
              style={{
                backgroundImage: `url(${leaf})`,
              }}
            >
              <h3 className="font-bold font-serif text-xl">
                {isRTL ? chef.name_ar : chef.name} {/* <-- Dynamic Name (Language Aware) */}
              </h3>
              <p className="text-gray-600 font-semibold">
                {isRTL ? chef.designation_ar : chef.designation} {/* <-- Dynamic Designation (Language Aware) */}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChefsSection;