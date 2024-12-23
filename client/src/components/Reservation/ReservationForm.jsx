import React from 'react';

const ReservationForm = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen px-4 max-w-7xl mx-auto lg:py-16 relative gap-8">

      {/* Left Column: Video and RESTAN text */}
      <div className="relative flex flex-col justify-center items-center lg:items-start">
        {/* RESTAN Text */}
        <div className="absolute top-0 font-serif text-5xl lg:py-16 lg:text-9xl font-bold opacity-5 z-20">
          RESTAN
        </div>

        {/* Video - Visible on large screens only */}
        <video
          className="w-full lg:w-[150%] h-[300px] lg:h-[500px] rounded-md hidden lg:block" // Hidden on mobile, shown on large screens
          src="https://videos.pexels.com/video-files/4253721/4253721-uhd_2732_1440_25fps.mp4"
          loop
          autoPlay
          muted
          playsInline
        >
          Your browser does not support the video tag.
        </video>

        {/* Image - Visible on mobile screens only */}
        <img
          className="w-full h-auto rounded-md block lg:hidden" // Shown on mobile, hidden on large screens
          src="https://img.freepik.com/premium-vector/cartoon-chef-character-holding-silver-platter_1151483-34531.jpg?w=1060" // Replace with your desired image URL
          alt="Chef Character"
        />
      </div>

      {/* Right Column: Card and Image */}
      <div className="flex flex-col justify-between items-center lg:-mt-4 lg:mr-24 lg:items-start lg:w-full">
  {/* Card Section */}
  <div className="relative z-10 font-poppins lg:w-3/4 w-full bg-white shadow-xl rounded-md p-6 mb-8 lg:mb-0">
    <h2 className="text-4xl font-semibold mb-4 font-poppins text-center lg:text-left">Book a Table</h2>
    
    {/* Booking Form */}
    <form>
      <div className="flex flex-col space-y-4">
        {/* Phone Number */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700" htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            className="mt-2 p-3 border border-gray-300 rounded-md"
            placeholder="Enter your phone number"
            required
          />
        </div>

        {/* Number of People */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700" htmlFor="people">Number of People</label>
          <select
            id="people"
            className="mt-2 p-3 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Number of People</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        {/* Date Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700" htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            className="mt-2 p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Time Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700" htmlFor="time">Time</label>
          <input
            id="time"
            type="time"
            className="mt-2 p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-400"
        >
          Book a Table
        </button>
      </div>
    </form>
  </div>

  {/* Image Section */} 
  <div className="lg:w-5/5">
    <img
      className="rounded-md w-full opacity-15 h-auto"
      src="https://wp.validthemes.net/restan/wp-content/uploads/2024/01/4-1.png"
      alt="Flower"
    />
  </div>
</div>

    </div>
  );
};

export default ReservationForm;
