import React, { useState } from "react";
import i1 from "./i1.avif";
import "./R.css"

const ReservationSection = () => {
  const [formData, setFormData] = useState({
    phone: "",
    person: "1 Person",
    date: "",
    time: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Restrict past dates
  const today = new Date().toISOString().split("T")[0];

  return (
    <section
      className="bg-cover font-poppins  bg-center  lg:mb-56 h-full lg:h-[500px] bg-no-repeat"
      style={{ backgroundImage: `url(${i1})` }}
    >
      <div className="flex flex-col  lg:flex-row items-center justify-between max-w-6xl mx-auto py-32 px-8 space-y-10 lg:space-y-0">
        {/* Left Content */}
        <div className="lg:w-1/2 text-white mt-0 lg:-mt-56 lg:py-0">
          <h3 className="text-sm uppercase font-medium tracking-wider mb-3">Reservation</h3>
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Reservation Your Favorite Private Table
          </h1>
          <p className="text-lg mb-8">
            A relaxing and pleasant atmosphere, good jazz, dinner, and cocktails. The Patio Time Bar
            opens in the center of Florence. The only bar inspired by the 1960s, it will give you an
            experience that you’ll have a hard time forgetting.
          </p>
          <div className="flex space-x-8">
            <div>
              <h4 className="text-lg font-semibold">Launch Menu</h4>
              <p className="text-sm text-gray-300">30+ items</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold">Dinner Menu</h4>
              <p className="text-sm text-gray-300">50+ items</p>
            </div>
          </div>
        </div>

        {/* Right Content (Form) */}
        <div className="lg:w-2/5">
          <div className="bg-dblack p-10 rounded-3xl shadow-lg">
            <form className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2" htmlFor="phone">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+4733378901"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-dblack text-white border border-gray-600 rounded-md py-2 px-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2" htmlFor="person">
                  Person
                </label>
                <select
                  id="person"
                  value={formData.person}
                  onChange={handleInputChange}
                  className="w-full bg-dblack text-white border border-gray-600 rounded-md py-2 px-3"
                >
                  <option>1 Person</option>
                  <option>2 Persons</option>
                  <option>3 Persons</option>
                  <option>4 Persons</option>
                  <option>5 Persons</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2" htmlFor="date">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={today}
                  className="block w-full text-white px-3 py-2 mb-4 border border-gray-600  rounded-lg bg-dblack   focus:outline-none transition duration-300 ease-in-out"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2" htmlFor="time">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full bg-dblack text-white border border-gray-600 rounded-md py-2 px-3"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-md hover:bg-yellow-700 transition-colors"
              >
                Book A Table
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;
