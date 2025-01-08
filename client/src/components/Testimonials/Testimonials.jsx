import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import i1 from "./i1.jpg";
import { useTranslation } from "react-i18next"; // Import i18next hook for translation

const Testimonials = () => {
  const { t } = useTranslation(); // Use i18next translation hook

  const testimonials = [
    {
      rating: "5/5",
      title: t('awesome_food'), // Translated text
      content: t('testimonial_content_1'), // Translated content
      author: t("Anthom_Bu_Spar"),
      position: t("Marketing_Manager"),
    },
    {
      rating: "4.5/5",
      title: t('great_ambience'), // Translated text
      content: t('testimonial_content_2'), // Translated content
      author: t("Jane_Doe"),
      position: t("Designer"),
    },
    // Add two more testimonials
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="bg-Grey font-poppins">
      <div className="flex flex-col max-w-5xl mx-auto lg:flex-row items-center lg:items-start p-6 lg:p-12 space-y-6 lg:space-y-0 lg:space-x-12">
        
        {/* Left Section */}
        <div className="w-full mt-20 lg:w-1/2">
          <img
            src={i1}
            alt={t('testimonial_image_alt')} // Translated alt text
            className="rounded-full lg:h-[300px] shadow-lg Clip-pentagon"
          />
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-4xl font-semibold lg:-ml-[500px] mb-20 text-center">
            {t('our_customers_feedback')} {/* Translated heading */}
          </h2>
          
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500 font-bold">{testimonial.rating}</span>
                  <span>⭐</span>
                </div>
                <h3 className="text-lg font-semibold">{testimonial.title}</h3>
                <p className="text-gray-600 mt-4">{testimonial.content}</p>
                <hr className="my-4" />
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.position}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
