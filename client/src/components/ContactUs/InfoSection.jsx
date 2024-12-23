import React from 'react';
import i1 from "./i1.png"
import i2 from "./i2.png"
import i3 from "./i3.png"

const InfoSection = () => {
  return (
    <section className="bg-white max-w-4xl mt-10 mx-auto py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Hotline Block */}
        <div className="border rounded-lg p-6 text-center">
          <img
            src={i1}
            alt="Hotline Icon"
            className="mx-auto w-16 h-16 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hotline</h3>
          <p className="text-gray-600">+973 17772211</p>
        </div>

        {/* Location Block */}
        <div className="border rounded-lg p-6 text-center">
          <img
            src={i2}
            alt="Location Icon"
            className="mx-auto w-16 h-16 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Our Location
          </h3>
          <p className="text-gray-600">
          Building 1320, Road 4149, Block 441, North Sehla, Bahrain
          </p>
        </div>

        {/* Email Block */}
        <div className="border rounded-lg p-6 text-center">
          <img
            src={i3}
            alt="Email Icon"
            className="mx-auto w-16 h-16 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Official Email
          </h3>
          <p className="text-gray-600">arabiaseelrest@gmail.com</p>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
