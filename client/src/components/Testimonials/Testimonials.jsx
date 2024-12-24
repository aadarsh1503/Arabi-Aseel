import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import i1 from "./i1.jpg";

const Testimonials = () => {
  const swiperRef = useRef(null);

  const testimonials = [
    {
      rating: "5/5",
      title: "Awesome and delicious food",
      content:
        "Targeting consultation discover apartments, indulgence off under folly death wrote cause her way spite...",
      author: "Anthom Bu Spar",
      position: "Marketing Manager",
    },
    {
      rating: "4.5/5",
      title: "Great Ambience",
      content: "Lorem ipsum dolor sit amet consectetur adipiscing elit...",
      author: "Jane Doe",
      position: "Designer",
    },
    // Add two more testimonials
  ];

  useEffect(() => {
    // Set an interval to automatically change the slide every 5 seconds
    const interval = setInterval(() => {
      if (swiperRef.current) {
        swiperRef.current.swiper.slideNext();
      }
    }, 5000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-Grey font-poppins">
    <div className="flex flex-col max-w-5xl mx-auto lg:flex-row items-center lg:items-start  p-6 lg:p-12 space-y-6 lg:space-y-0 lg:space-x-12">
      
      {/* Left Section */}
      <div className="w-full mt-20 lg:w-1/2">
        <img
          src={i1}
          alt="Customer enjoying meal"
          className="rounded-full lg:h-[300px] shadow-lg Clip-pentagon"
        />
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-4xl font-semibold lg:-ml-[500px] mb-20 text-center ">Our Customers Feedback</h2> {/* Heading */}
        
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          loop
          ref={swiperRef}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500 font-bold">{testimonial.rating}</span>
                  <span>⭐</span>
                </div>
                <h3 className="text-lg font-semibold">{testimonial.title}</h3>
                <p className="text-gray-600 mt-4">{testimonial.content}</p>
                <hr className="my-4" />
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.position}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
    </div>
  );
};

export default Testimonials;
