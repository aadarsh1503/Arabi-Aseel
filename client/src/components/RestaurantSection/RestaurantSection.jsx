import React from 'react';
import i2 from "./i2.jpg";
import i3 from "./i3.jpg";
import i1 from "./i1.png";

const RestaurantSection = ({ isRTL }) => {
  return (
    <section className="bg-white py-12">
      <div dir={isRTL ? "rtl" : "ltr"} className="flex items-center justify-between">
        {/* Left Side Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:w-2/4">
          <img
            src={i2}
            alt="Serving Food"
            className="w-full lg:h-[500px] object-cover"
          />
          <img
            src={i3}
            alt="Serving Drinks"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side Content */}
        <div className='p-8 mt-16 max-w-sm mx-auto lg:w-1/2'>
          <div className="lg:h-[472px] -ml-64 bg-white shadow-xl lg:w-[700px] z-0 lg:mt-0 p-16 relative">
            {/* Small Image Above the Content */}
            <img
              src={i1} // Small image source
              alt="Small Image"
              className="absolute top-[-50px] right-0 w-64 h-32 object-cover border-4 border-white"
            />
            
            <h5 className="text-lg text-gray-700 z-50 p-1 font-semibold uppercase mb-2">
              About Us
            </h5>
            <h2 className="text-5xl font-poppins text-gray-900 mb-4">
              We Invite You <br />To Visit Our Restaurant
            </h2>
            <p className="text-gray-600 mb-6">
              A relaxing and pleasant atmosphere, good jazz, dinner, and cocktails. The Patio Time Bar opens in the center of Florence. The only bar inspired by the 1960s, it will give you an experience that you’ll have a hard time forgetting.
            </p>
            <a href='/aboutUs'>
              <button className="bg-brown text-white px-6 py-2 text-lg rounded-lg hover:bg-yellow-600 transition">
                Discover More
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantSection;
