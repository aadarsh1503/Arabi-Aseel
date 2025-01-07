import React from "react";
import { useTranslation } from "react-i18next"; // Import i18next hook for translation

const ChefsSection = ({ isRTL }) => {
  const { t } = useTranslation(); // Use i18next translation hook

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex flex-col min-h-screen font-poppins items-center py-12"
    >
      {/* Section Title */}
      <h2 className="text-5xl mt-20 font-serif text-gray-800 mb-8 text-center">
        {t("meet_our_special_chefs")} {/* Translated title */}
      </h2>

      {/* Chefs Grid */}
      <div className="flex flex-col sm:flex-row justify-center space-y-8 sm:space-y-0 sm:space-x-24">
        {/* Chef 1 */}
        <div className="text-center">
          <div className="relative w-72 h-72 mx-auto mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full border-4 border-black flex items-center justify-center" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <img
                src="https://wp.validthemes.net/restan/wp-content/uploads/2024/01/1-1.jpg"
                alt={t("alexander_petllo")} // Translated alt text
                className="w-full h-full rounded-full border-4 border-gray-300 object-cover"
              />
            </div>
          </div>
          <div
            className="relative bg-cover bg-center rounded-lg px-4 py-3 text-black"
            style={{
              backgroundImage:
                "url(https://img.freepik.com/premium-photo/white-square-frame_1284565-5480.jpg?w=1060)",
            }}
          >
            <h3 className="font-bold font-serif text-xl">
              {t("alexander_petllo")} {/* Translated name */}
            </h3>
            <p className="text-lg">{t("assistant_chef")}</p> {/* Translated role */}
          </div>
        </div>

        {/* Chef 2 */}
        <div className="text-center">
          <div className="relative w-72 h-72 mx-auto mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full border-4 border-black flex items-center justify-center" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <img
                src="https://wp.validthemes.net/restan/wp-content/uploads/2024/01/3-2.jpg"
                alt={t("mendia_juxef")}
                className="w-full h-full rounded-full border-4 border-gray-300 object-cover"
              />
            </div>
          </div>
          <div
            className="relative bg-cover bg-center rounded-lg px-4 py-3 text-black"
            style={{
              backgroundImage:
                "url(https://img.freepik.com/premium-photo/white-square-frame_1284565-5480.jpg?w=1060)",
            }}
          >
            <h3 className="font-bold font-serif text-xl">
              {t("mendia_juxef")}
            </h3>
            <p className="text-lg">{t("burger_king")}</p>
          </div>
        </div>

        {/* Chef 3 */}
        <div className="text-center">
          <div className="relative w-72 h-72 mx-auto mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full border-4 border-black flex items-center justify-center" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <img
                src="https://wp.validthemes.net/restan/wp-content/uploads/2024/01/2-2.jpg"
                alt={t("petro_william")}
                className="w-full h-full rounded-full border-4 border-gray-300 object-cover"
              />
            </div>
          </div>
          <div
            className="relative bg-cover bg-center rounded-lg px-4 py-3 text-black"
            style={{
              backgroundImage:
                "url(https://img.freepik.com/premium-photo/white-square-frame_1284565-5480.jpg?w=1060)",
            }}
          >
            <h3 className="font-bold font-serif text-xl">{t("petro_william")}</h3>
            <p className="text-lg">{t("main_chef")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefsSection;
