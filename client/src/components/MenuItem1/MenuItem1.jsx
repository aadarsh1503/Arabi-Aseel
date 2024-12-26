import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import i1 from "./i1.jpg"; // Import the image
import MenuSection from './MenuSection';
import Reservation from '../Reservation/Reservation';
import ReservationSection from '../ReservationSection/ReservationSection';
import Testimonials from '../Testimonials/Testimonials';


const MenuItem1 = () => {
  return (
    <div>
   
     
<MenuSection />
<ReservationSection />
<Testimonials />
    </div>
  );
};

export default MenuItem1;
