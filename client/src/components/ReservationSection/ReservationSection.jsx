import React, { useState } from "react";
import i1 from "./i1.png";
import { useTranslation } from "react-i18next"; // Import i18next hook for translation
import "./R.css";

const ReservationSection = () => {
  const { t } = useTranslation(); // Use i18next translation hook
  const [formData, setFormData] = useState({
    phone: "",
    person: "1 Person",
    date: "",
    time: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Restrict past dates
  const today = new Date().toISOString().split("T")[0];

  return (
    <section
      className="bg-cover font-poppins bg-center lg:mb-56 bg-black bg-opacity-70 h-full lg:h-[500px] bg-no-repeat"
      style={{ backgroundImage: `url(${i1})` }}
    >
      
      <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto py-32 px-8 space-y-10 lg:space-y-0">
        {/* Left Content */}
        <div className="lg:w-1/2 text-white mt-0 lg:-mt-56 lg:py-0">
          <h3 className="text-sm uppercase font-medium tracking-wider mb-3">{t('reservation')}</h3>
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            {t('reserve_table')}
          </h1>
          <p className="text-lg mb-8">
            {t('description')}
          </p>
          <div className="flex space-x-8">
            <div>
              <h4 className="text-lg font-semibold">{t('launch_menu')}</h4>
              <p className="text-sm text-gray-300">{t('30+_items')}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold">{t('dinner_menu')}</h4>
              <p className="text-sm text-gray-300">{t('50+_items')}</p>
            </div>
          </div>
        </div>

        {/* Right Content (Form) */}
        <div className="lg:w-2/5">
          <div className="bg-dblack p-10 rounded-3xl shadow-lg">
            <form className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2" htmlFor="phone">
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+4733378901"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-dblack text-white border border-gray-600 rounded-md py-2 px-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2" htmlFor="person">
                  {t('person')}
                </label>
                <select
                  id="person"
                  value={formData.person}
                  onChange={handleInputChange}
                  className="w-full bg-dblack text-white border border-gray-600 rounded-md py-2 px-3"
                >
                  <option>{t('1_person')}</option> {/* Use translation key here */}
                  <option>{t('2_persons')}</option> {/* Use translation key here */}
                  <option>{t('3_persons')}</option> {/* Use translation key here */}
                  <option>{t('4_persons')}</option> {/* Use translation key here */}
                  <option>{t('5_persons')}</option> {/* Use translation key here */}
                </select>
              </div>
             

              <div>
                <label className="block text-sm text-gray-300 mb-2" htmlFor="date">
                  {t('date')}
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={today}
                  className="block w-full text-white px-3 py-2 mb-4 border border-gray-600 rounded-lg bg-dblack focus:outline-none transition duration-300 ease-in-out"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2" htmlFor="time">
                  {t('time')}
                </label>
                <input
                  type="time"
                  id="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full bg-dblack text-white border border-gray-600 rounded-md py-2 px-3"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-md hover:bg-yellow-700 transition-colors"
              >
                {t('book_table')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;
