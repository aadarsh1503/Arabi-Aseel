import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDirection } from '../DirectionContext'; // Assuming this is managing the language direction
import { useTranslation } from 'react-i18next'; // Import i18next hook for translation



const ServiceSection = () => {
  const { direction } = useDirection(); // Get the current direction (ltr or rtl)
  const { t } = useTranslation(); // Use i18next translation hook
  const [isVisible, setIsVisible] = useState(false);

  const services = [
    { 
      id: 1, 
      title: t('quality_foods'), // Use translation key
      description: t('service_description'), // Use translation key
      image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/04/13.png' 
    },
    { 
      id: 2, 
      title: t('fast_delivery'), // Use translation key
      description: t('service_description'), // Use translation key
      image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/04/14.png' 
    },
    { 
      id: 3, 
      title: t('delicious_recipes'), // Use translation key
      description: t('service_description'), // Use translation key
      image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/04/15.png' 
    },
  ];

  // Effect to handle scroll detection and visibility
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('service-section');
      if (section) {
        const { top, bottom } = section.getBoundingClientRect();
        // Check if section is in viewport
        if (top < window.innerHeight && bottom >= 0) {
          // Set visibility after 3 seconds
          setTimeout(() => {
            setIsVisible(true);
          }, 1000); // Change this value to 3000 for 3 seconds
        }
      }
    };

    // Attach the event listener
    window.addEventListener('scroll', handleScroll);
    // Call the handler immediately to check visibility on initial load
    handleScroll();

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Run only once on mount

  return (
    <div id="service-section" className="container font-poppins mx-auto py-16">
      {/* Optional: Place LanguageToggle here */}


      <div className={`flex ${direction === 'rtl' ? 'lg:flex-row-reverse' : 'lg:flex-row'} flex-col justify-center items-center space-x-0 lg:space-x-20 relative`}>
        {services.map((service, index) => (
          <motion.div 
            key={service.id} 
            className="relative flex flex-col p-8 w-80 service-card mb-6 lg:mb-0"
            initial={{ opacity: 0, y: 20 }} // Start with opacity 0 and move down 20px
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} // Animate based on visibility
            transition={{ duration: 1, delay: index * 0.5 }} // Staggered delay for each card
          >
            <img src={service.image} alt={service.title} className="w-32 h-32 mb-4 mx-auto" />
            <h3 className="text-2xl font-serif mb-2 text-center">{service.title}</h3>
            <p className="text-gray-500 text-center">{service.description}</p>
            {/* Divider after all cards except the last one */}
            {index < services.length - 1 && (
              <div className="absolute top-1/2 right-[-36px] transform -translate-y-1/2 h-32 w-px bg-gray-600 hidden lg:block"></div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSection;
