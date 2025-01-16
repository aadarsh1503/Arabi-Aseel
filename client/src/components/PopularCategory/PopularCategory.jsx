import React, { useState } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import "./popular.css";

const PopularCategories = () => {
  const { t } = useTranslation(); // Hook to get translation
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime);
  };

  const currentDate = new Date();
  const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes(); // current time in minutes

  const categories = [
    { id: 1, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/04/27.jpg', title: t('salmon_fry'), subtitle: t('sea_food') },
    { id: 2, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/04/25.jpg', title: t('beverage'), subtitle: t('hot_chocolate') },
    { id: 3, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/04/26.jpg', title: t('salmon_fry'), subtitle: t('sea_food') },
    { id: 4, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/04/28.jpg', title: t('burger'), subtitle: t('fast_food') },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1200,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    arrows: false,  // Hide prev and next arrows
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col lg:flex-row font-poppins justify-between items-start p-12">
     
      <div className="lg:w-100 ml-0  mr-0  w-full">
        <h2 className="text-3xl font-bold text-center mb-6">{t('popular_categories')}</h2>
        <Slider {...settings} className="font-poppins">
          {categories.map((category) => (
            <div key={category.id} className="relative w-20 bg-white gap-8 overflow-hidden rounded-xl shadow-lg">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-100 bg-white object-cover"
              />
              <div className="absolute inset-0 mt-32 bg-gradient-to-b from-transparent to-black opacity-50"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 w-[254px] ml-[16px] shadow-none text-center rounded-b-xl">
                <p className="text-yellow-500 text-left font-bold">{category.subtitle}</p>
                <h3 className="text-xl text-white text-left font-semibold">{category.title}</h3>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default PopularCategories;
