import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import "./popular.css";

const BookingForm = () => {
  return (
    <div className="shadow-lg rounded-lg py-4 lg:p-6 w-full max-w-sm mx-auto">
  <div className="flex justify-center mb-4">
    <div className="bg-white border-4 border-black rounded-full p-4 shadow-md">
      <FontAwesomeIcon icon={faUtensils} className="text-4xl text-brown-600" />
    </div>
  </div>
  {/* Apply the animation class to the heading */}
  <h2 className="text-3xl font-bold font-serif text-center text-yellow-600 mb-4 p-2 best-food-text">Book a Table</h2>
  <form className="w-full px-4"> {/* Added full width and horizontal padding */}
    <input
      type="text"
      placeholder="+4733378901"
      className="block w-full px-3 py-2 mb-4 border rounded-lg focus:ring focus:ring-purple-300 focus:outline-none transition duration-300 ease-in-out"
    />
    <select className="block w-full px-3 py-2 mb-4 border rounded-lg bg-white text-brown-600 focus:ring focus:ring-purple-300 focus:outline-none transition duration-300 ease-in-out">
      <option>1 Person</option>
      <option>2 People</option>
      <option>3 People</option>
      <option>4 People</option>
    </select>
    <input
      type="date"
      className="block w-full px-3 py-2 mb-4 border rounded-lg bg-white focus:ring focus:ring-purple-300 focus:outline-none transition duration-300 ease-in-out"
    />
    <select className="block w-full px-3 py-2 mb-4 border rounded-lg bg-white text-brown-600 focus:ring focus:ring-purple-300 focus:outline-none transition duration-300 ease-in-out">
      <option>10:00 AM</option>
      <option>12:00 PM</option>
      <option>2:00 PM</option>
      <option>6:00 PM</option>
    </select>
    <button className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-brown-700 transition duration-300 shadow-md transform hover:scale-105">
      Book A Table
    </button>
  </form>
</div>

  
  );
};

const PopularCategory = () => {
  const categories = [
    { id: 1, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/04/27.jpg', title: 'Salmon Fry', subtitle: 'Sea Food' },
    { id: 2, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/04/25.jpg', title: 'Beverage', subtitle: 'Hot Chocolate' },
    { id: 3, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/04/26.jpg', title: 'Salmon Fry', subtitle: 'Sea Food' },
  ];

  return (
    <div className="flex flex-wrap justify-center">
      {categories.map((category) => (
        <div
          key={category.id}
          className="relative w-64 m-2 overflow-hidden rounded-lg shadow-lg"
        >
          {/* Image with zoom effect on hover */}
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-100 object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
          />
          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-70 text-center">
            <p className="text-yellow-500 font-bold">{category.subtitle}</p>
            <h3 className="text-xl text-white font-semibold">{category.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

const PopularCategories = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start p-12">
      {/* Booking Form on the left */}
      <div className="lg:w-1/3 w-full mb-6 lg:mb-0">
        <BookingForm />
      </div>
      {/* Popular Categories on the right */}
      <div className="lg:w-2/3 w-full">
        <h2 className="text-3xl font-bold text-center mb-6">🔥 Our Popular Category</h2>
        <PopularCategory />
      </div>
    </div>
  );
};

export default PopularCategories;
