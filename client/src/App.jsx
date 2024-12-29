import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import Routes and Route from react-router-dom
import Hero from './components/Hero/Hero';
import Navbar from './components/RootLayout/Navbar/Navbar';
import AboutUs from './components/AboutUs/AboutUs';
import ContactUs from './components/ContactUs/ContactUs';
import Footer from './components/RootLayout/Footer/Footer';

import OurFirst from './components/OurChef/OurFirst';
import Reservation from './components/Reservation/Reservation';
import MenuItem1 from './components/MenuItem1/MenuItem1';
import { DirectionProvider } from './components/DirectionContext';
import LanguageSwitcher from './components/LanguageSwticher/LanguageSwitcher';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
    <DirectionProvider >
      
      <Navbar /> 
      
      <Routes>

        <Route path="/" element={<Hero />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/our-chef" element={<OurFirst />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/menu" element={<MenuItem1 />} />

      </Routes>
     <Footer />
     </DirectionProvider>
    </BrowserRouter>
  );
}

export default App;
