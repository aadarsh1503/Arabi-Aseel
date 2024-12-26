import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import i1 from "./i1.jpg"; // Import the image
import InfoSection from './InfoSection';
import ContactForm from './ContactForm';

const ContactUs = () => {
  return (
    <div>
    
<InfoSection />
<ContactForm />
    </div>
  );
};

export default ContactUs;
