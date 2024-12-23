import React from 'react';
import { AiOutlineSend } from 'react-icons/ai';

const ContactForm = () => {
  return (
    <section className="bg-white py-12 px-4 mt-10 sm:px-6 shadow-2xl lg:px-8">
      <div className="max-w-2xl shadow-xl p-4 mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm uppercase text-yellow-600 tracking-wide">Keep in Touch</p>
          <h2 className="text-2xl font-bold text-gray-900">Send us a Massage</h2>
        </div>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <input
            type="email"
            placeholder="Email*"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <textarea
            rows="5"
            placeholder="Your Message *"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          ></textarea>
          <div className="">
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-brown text-white px-6 py-3 rounded-lg hover:bg-yellow-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600"
            >
              <AiOutlineSend className="mr-2" />
              Get In Touch
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
