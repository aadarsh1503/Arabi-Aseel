import React from "react";

const BlogSection = () => {
  return (
    <div className="flex flex-col items-center py-12 bg-white">
      {/* Section Title */}
      <h1 className="mb-4 font-serif text-lg text-yellow-700"> ----- NEWS & BLOGS -----</h1>
      <h2 className="text-3xl md:text-5xl font-serif text-gray-800 mb-8">Our Latest News & Blog</h2>
      
      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
        
        {/* Blog Post 1 */}
        <div className="relative bg-white shadow-lg">
          <div className="overflow-hidden">
            <img
              src="https://wp.validthemes.net/restan/wp-content/uploads/2023/12/1.jpg"
              alt="Blog Post 1"
              className="w-full h-64 sm:h-96 object-cover" // Adjust height for mobile
            />
          </div>
          <div className="absolute top-4 right-4 bg-[#9b815d] text-white py-2 px-4 rounded-lg">
            <p className="text-sm font-bold">13 MAY</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-white px-4 sm:px-10 p-4 sm:p-6">
            <p className="text-sm text-gray-600 mb-2">BY VALIDTHEME • BURGER, FOOD</p>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4"> {/* Adjusted font size for mobile */}
              Picked up a Brussels burger Sprouts with ham
            </h3>
            <a href="#" className="text-[#9b815d] font-semibold">
              READ MORE &rarr;
            </a>
          </div>
        </div>

        {/* Blog Post 2 */}
        <div className="relative bg-white shadow-lg">
          <div className="overflow-hidden">
            <img
              src="https://wp.validthemes.net/restan/wp-content/uploads/2024/05/2-2.jpg"
              alt="Blog Post 2"
              className="w-full h-64 sm:h-96 object-cover" // Adjust height for mobile
            />
          </div>
          <div className="absolute top-4 right-4 bg-[#9b815d] text-white py-2 px-4 rounded-lg">
            <p className="text-sm font-bold">13 MAY</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-white p-4 sm:p-6">
            <p className="text-sm text-gray-600 mb-2">BY VALIDTHEME • BURGER, FOOD</p>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4"> {/* Adjusted font size for mobile */}
              This prefabricated passive house is highly sustainable
            </h3>
            <a href="#" className="text-[#9b815d] font-semibold">
              READ MORE &rarr;
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogSection;
