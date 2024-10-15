import React, { useState } from "react";
import { FaWhatsapp, FaTimes, FaArrowRight } from "react-icons/fa";
import "./ChatWidget.css"; // Import your CSS file

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    const whatsappNumber = "917300648999"; // Without the "+" symbol
    const message = replyMessage || " Hii I have a Query ";

    // Check if the user is on a mobile device
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    // Generate the appropriate link based on the device type
    const whatsappLink = isMobile 
      ? `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`
      : `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="fixed bottom-10 right-5 z-50">
      {/* WhatsApp Button with Message */}
      <button
        onClick={toggleChat}
        className="bg-green-500 text-white p-2 pl-3 pr-4 rounded-full shadow-lg flex items-center hover:bg-green-600 transition duration-300" // Reduced padding for smaller size
      >
        {isOpen ? (
          <div className="flex items-center justify-center bg-green-600 rounded-full p-1 sm:p-2"> {/* Smaller background for close icon only on mobile */}
            <FaTimes size={16} className="sm:size={18}" /> {/* Adjusted size for close button */}
          </div>
        ) : (
          <>
            <FaWhatsapp size={18} className="mr-1" /> {/* Reduced icon size */}
            <span className="hidden sm:inline">Hi, how can I help?</span>
          </>
        )}
      </button>

      {/* Chat Box with Slide-Up Animation */}
      {isOpen && (
        <div className={`shadow-lg rounded-lg p-4 w-80 mt-2 relative animate-slide-up`}>
          {/* Circular Avatar outside the container */}
          <div className="absolute -left-14 top-10">
            <img
              src="https://img.freepik.com/premium-photo/man-with-glasses-blue-shirt-that-says-he-is-smiling_1132399-5341.jpg?w=740"
              alt="Customer Avatar"
              className="w-12 h-12 rounded-full border-2 border-gray-200"
            />
          </div>

          {/* Header */}
          <div className="bg-green-500 text-white p-3 rounded-t-lg">
            <p className="text-sm sm:text-base">
              Our customer support team is here to answer your questions. Ask us anything!
            </p>
          </div>

          {/* Message */}
          <div className="p-4">
            {/* Fixed Message: "How can I help?" (Non-editable) */}
            <p className="bg-gray-100 p-3 rounded-lg mb-4 text-sm">
              👋 How can I help?
            </p>

            {/* Input with Green Arrow Button Inside */}
            <div className="relative">
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm shadow-md"
                placeholder="Reply to Restan..."
              />
              <button
                onClick={handleSendMessage}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition duration-300"
              >
                <FaArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
