import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import i1 from "./i1.jpg"; // Import the image
import Partners from '../Partners/Partners';
import RestaurantSection from '../RestaurantSection/RestaurantSection';
import ChefsSection from '../ChefSection/ChefSection';
import OpeningHours from '../OpeningHours/OpeningHours';

const AboutUs = () => {
  return (
    <div>
    <div
      className="flex items-center lg:-mt-[136px] justify-center h-[532px] bg-cover bg-center"
      style={{ backgroundImage: `url(${i1})` }} // Correct way to reference the imported image
    >
      <div className="text-center flex flex-col items-center bg-opacity-50  p-6 rounded">
        <div className="text-white text-5xl font-semibold">About</div>
        <div className="mt-4 text-white text-sm">
          {/* Home is clickable, About Us is plain text */}
          <Link to="/" className="text-white font-bold hover:underline">
            Home
          </Link>
         <span className='text-normal'> / About Us</span>
        </div>
      </div>
      </div>

      <RestaurantSection />
      <ChefsSection />
      <OpeningHours />
    </div>
  );
};

export default AboutUs;
