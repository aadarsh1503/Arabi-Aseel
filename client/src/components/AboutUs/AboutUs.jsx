import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import i1 from "./i1.jpg"; // Import the image
import Partners from '../Partners/Partners';
import RestaurantSection from '../RestaurantSection/RestaurantSection';
import ChefsSection from '../ChefSection/ChefSection';
import OpeningHours from '../OpeningHours/OpeningHours';
import LanguageToggle from '../../LanguageToggle';
////

const AboutUs = () => {
  return (
    <div>


      <RestaurantSection />
      <ChefsSection />
      <OpeningHours />
    </div>
  );
};

export default AboutUs;
