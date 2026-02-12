import React from 'react';
import Navbar from './Navbar/Navbar';



const RootLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default RootLayout;
