import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useTranslation } from 'react-i18next';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Popular.css";

const BASEURL = import.meta.env.VITE_API_BASE_URL || '';

const PopularCategories = () => {
  const { t, i18n } = useTranslation();
  
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASEURL}/api/admin/menu`);
        const data = await res.json();
        
        // Filter for available items that have an image URL
        const availableItems = data.filter(
          item => item.status === 'available' && item.image_url
        );
        
        // To simulate "popular" items, we'll take the first 6 from the available list.
        // You could later implement a proper "is_popular" flag in your API.
        const popularItems = availableItems.slice(0, 6);

        // Transform the API data to match the format your component needs
        const transformedCategories = popularItems.map(item => {
          const isRTL = i18n.language === 'ar';
          
          // Get the correct translation for the item name (title)
          const title = isRTL 
            ? item.translations.find(t => t.language === 'ar')?.name || item.translations.find(t => t.language === 'en')?.name
            : item.translations.find(t => t.language === 'en')?.name;
          
          // Get the correct translation for the category name (subtitle)
          const subtitle = isRTL 
            ? item.category_name_ar || item.category_name 
            : item.category_name;

          return {
            id: item.menu_id,
            image: item.image_url,
            title: title,
            subtitle: subtitle,
            link: '/menu' // Static link as in the original code
          };
        });

        setCategories(transformedCategories);
        
      } catch (err) {
        console.error("Error fetching popular categories:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularItems();
  }, [i18n.language]); // Re-fetch if the language changes

  const settings = {
    dots: true,
    infinite: true,
    speed: 1200,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  // Display a loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <h2 className="text-xl">Loading Popular Items...</h2>
      </div>
    );
  }

  // Display an error state
  if (error) {
    return (
      <div className="flex justify-center items-center p-12 text-red-500">
        <h2 className="text-xl">{error}</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row font-poppins justify-between items-start p-12">
      <div className="lg:w-100 ml-0 mr-0 w-full">
        <h2 className="text-3xl font-bold text-center mb-6">{t('popular_categories')}</h2>

        <Slider {...settings} className="font-poppins">
          {categories.map((category) => (
            <div key={category.id} className="relative w-20 bg-white gap-8 overflow-hidden rounded-xl shadow-lg">
              <a href={category.link}>
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-[200px] bg-white object-cover"
                />
              </a>
              <a href="/menu">
                <div className="absolute inset-0 mt-38 bg-gradient-to-b from-transparent to-black opacity-50"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 w-[254px] ml-[16px] shadow-none text-center rounded-b-xl">
                  <p className="text-yellow-500 text-left font-bold">{category.subtitle}</p>
                  <h3 className="text-xl text-white text-left font-semibold">{category.title}</h3>
                </div>
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default PopularCategories;