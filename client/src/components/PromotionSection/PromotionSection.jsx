import React from 'react';

const PromotionSection = () => {
  return (
    <div className="relative min-h-screen w-full py-16">
      {/* Yellow Background Image */}
      <div className="relative mx-auto max-w-7xl">
        <img 
          src="https://wp.validthemes.net/restan/wp-content/uploads/2024/04/4.jpg" // Add your yellow background image here
          alt="Yellow Background"
          className="absolute inset-0 w-[400vw] lg:h-[40vw] h-[250vw] rounded-3xl object-fill" // Cover the entire section
        />

        <div className="container mx-auto relative flex flex-col lg:flex-row items-center justify-between px-8 z-10">
          {/* Left Section with Images */}
          <div className="relative flex flex-col items-center lg:items-start w-full lg:w-1/2">
            {/* Image 1 */}
            <img 
              src="https://wp.validthemes.net/restan/wp-content/uploads/2024/04/1-1.png" // Replace with your first image
              alt="Dish 1"
              className="absolute lg:-top-10 lg:left-20 w-40 h-40 lg:w-52 lg:h-52 rounded-full object-cover" // Adjusted for mobile
            />
            {/* Image 2 */}
            <img 
              src="https://wp.validthemes.net/restan/wp-content/uploads/2024/04/15-1.png" // Replace with your second image
              alt="Dish 2"
              className="absolute left-1 lg:left-72 lg:top-2 top-20 lg:top-22 w-64 h-64 lg:w-80 lg:h-80 rounded-full object-cover" // Adjusted for mobile
            />
            {/* Image 3 */}
            <img 
              src="https://wp.validthemes.net/restan/wp-content/uploads/2024/04/12.png" // Replace with your third image
              alt="Dish 3"
              className="absolute left-16 lg:left-20 lg:top-48 w-36 h-36 lg:w-44 lg:h-44 rounded-full object-cover" // Adjusted for mobile
            />
          </div>

          {/* Right Section with Text */}
          <div className="relative w-full lg:w-1/2 top-20 lg:py-0 py-64 lg:top-44 lg:px-4">
            <p className="text-lg font-bold uppercase tracking-wider   text-gray-800 lg:mb-2">
              Today Special Offer
            </p>
            <h2 className="text-4xl lg:text-6xl font-serif text-gray-900 lg:mb-4">
              Explore Irresistible <br /> Promotions!
            </h2>
            <p className="text-gray-900 mb-6">
              Contrasted dissimilar get joy you instrument out reasonably. Again keeps at no meant stuff. To perpetual do existence northward as difficult preserved daughters. Continued at up to zealously necessary.
            </p>
            <button className="text-white lg:py-3 lg:px-6 bg-black bg-opacity-30 p-3 rounded-full hover:bg-gray-700">
              Order Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionSection;
