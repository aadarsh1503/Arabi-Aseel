import React from 'react';
import { useTranslation } from 'react-i18next'; // Import i18next hook for translation
import i1 from "./i1.png";
import i2 from "./i2.png";
import i3 from "./i3.png";

const InfoSection = () => {
  const { t } = useTranslation(); // Use translation hook

  return (
    <section className="bg-white max-w-4xl mt-10 mx-auto py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Hotline Block */}
        <div className="border rounded-lg p-6 text-center">
  <img
    src={i1}
    alt={t('hotline_icon_alt')}
    className="mx-auto w-16 h-16 mb-4"
  />
  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('hotline')}</h3>
  <p className="text-gray-600" dir="ltr">+973 17772211</p> {/* Ensure LTR direction for phone number */}
</div>

        {/* Location Block */}
        <div className="border rounded-lg p-6 text-center">
          <img
            src={i2}
            alt={t('location_icon_alt')}
            className="mx-auto w-16 h-16 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('our_location')}</h3>
          <p className="text-gray-600">{t('location_address')}</p>
        </div>

        {/* Email Block */}
        <div className="border rounded-lg p-6 text-center">
          <img
            src={i3}
            alt={t('email_icon_alt')}
            className="mx-auto w-16 h-16 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('official_email')}</h3>
          <p className="text-gray-600">{t('email_address')}</p>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
