import React from 'react';


const OpeningHours = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen px-4  max-w-7xl mx-auto lg:py-16 relative gap-8">

      {/* Left Column: Video and RESTAN text */}
      <div className="relative flex flex-col justify-center items-center lg:items-start">
        {/* RESTAN Text */}
        <div className="absolute top-0  font-serif text-5xl lg:py-16 lg:text-9xl font-bold opacity-5 z-20">
          RESTAN
        </div>

        {/* Video */}
        <video
          className="w-full lg:w-[150%] h-[300px] lg:h-[500px] rounded-md "
          src="https://videos.pexels.com/video-files/4253721/4253721-uhd_2732_1440_25fps.mp4"
          loop
          autoPlay
          muted
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Right Column: Card and Image */}
      <div className="flex flex-col justify-between items-center lg:-mt-4 lg:mr-24 lg:items-start lg:w-full">
        {/* Card Section */}
        <div className="relative z-10 lg:w-3/4 w-full bg-white shadow-xl rounded-md p-6 mb-8 lg:mb-0"> {/* Reduced padding for mobile */}
          <h2 className="text-3xl font-semibold mb-4 text-center lg:text-left">Opening Hours</h2>
          <p className="mb-6 text-gray-600 text-center lg:text-left">
            A relaxing and pleasant atmosphere, good jazz, dinner, and cocktails.
          </p>

          {/* Opening Hours */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center border-b border-gray-300 pb-2">
              <p className="font-medium">Sunday To Tuesday:</p>
              <p className="text-gray-600">10:00 - 09:00</p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-300 pb-2">
              <p className="font-medium">Wednesday To Thursday:</p>
              <p className="text-gray-600">11:30 - 10:30</p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-300 pb-2">
              <p className="font-medium">Friday & Saturday:</p>
              <p className="text-gray-600">10:30 - 12:00</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex items-center mt-6">
            <div className="bg-gray-200 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h4l3 9l4-16l3 7h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Call Anytime</p>
              <p className="text-lg font-serif font-semibold">+964733-378901</p>
            </div>
          </div>
        </div>




        {/* Image Section */}
        <div className="lg:w-5/5">
  <img
    className="rounded-md w-full opacity-15 h-auto" // Set width to 100% and height auto for responsiveness
    src="https://wp.validthemes.net/restan/wp-content/uploads/2024/01/4-1.png"
    alt="Flower"
  />
</div>

      </div>

    </div>
  );
};

export default OpeningHours;
