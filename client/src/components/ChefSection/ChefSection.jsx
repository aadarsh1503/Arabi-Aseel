import React from "react";

const ChefsSection = () => {
    return (
        <div className="flex flex-col min-h-screen items-center py-12 bg-gray-50">
            {/* Section Title */}
            <h2 className="text-5xl mt-20 font-serif text-gray-800 mb-8 text-center">Meet Our Special Chefs</h2>

            {/* Chefs Grid */}
            <div className="flex flex-col sm:flex-row justify-center space-y-8 sm:space-y-0 sm:space-x-24">
                {/* Chef 1 */}
                <div className="text-center">
                    <div className="relative w-72 h-72 mx-auto mb-4">
                        {/* Black outline circle with gap */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full rounded-full border-4 border-black flex items-center justify-center" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center p-2">
                            <img
                                src="https://wp.validthemes.net/restan/wp-content/uploads/2024/01/1-1.jpg"
                                alt="Alexander Petllo"
                                className="w-full h-full rounded-full border-4 border-gray-300 object-cover"
                            />
                        </div>
                    </div>
                    {/* Name with background image */}
                    <div className="relative bg-cover bg-center rounded-lg px-4 py-3 text-black"
                        style={{
                            backgroundImage: 'url(https://img.freepik.com/premium-photo/white-square-frame_1284565-5480.jpg?w=1060)', // Replace with your image path
                        }}>
                        <h3 className="font-bold font-serif text-xl">Alexander Petllo</h3>
                        <p className="text-lg">Assistant Chef</p>
                    </div>
                </div>

                {/* Chef 2 */}
                <div className="text-center">
                    <div className="relative w-72 h-72 mx-auto mb-4">
                        {/* Black outline circle with gap */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full rounded-full border-4 border-black flex items-center justify-center" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center p-2">
                            <img
                                src="https://wp.validthemes.net/restan/wp-content/uploads/2024/01/3-2.jpg"
                                alt="Mendia Juxef"
                                className="w-full h-full rounded-full border-4 border-gray-300 object-cover"
                            />
                        </div>
                    </div>
                    {/* Name with background image */}
                    <div className="relative bg-cover bg-center rounded-lg px-4 py-3 text-black"
                        style={{
                            backgroundImage: 'url(https://img.freepik.com/premium-photo/white-square-frame_1284565-5480.jpg?w=1060)', // Replace with your image path
                        }}>
                        <h3 className="font-bold font-serif text-xl">Mendia Juxef</h3>
                        <p className="text-lg">Burger King</p>
                    </div>
                </div>

                {/* Chef 3 */}
                <div className="text-center">
                    <div className="relative w-72 h-72 mx-auto mb-4">
                        {/* Black outline circle with gap */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full rounded-full border-4 border-black flex items-center justify-center" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center p-2">
                            <img
                                src="https://wp.validthemes.net/restan/wp-content/uploads/2024/01/2-2.jpg"
                                alt="Petro William"
                                className="w-full h-full rounded-full border-4 border-gray-300 object-cover"
                            />
                        </div>
                    </div>
                    {/* Name with background image */}
                    <div className="relative bg-cover bg-center rounded-lg px-4 py-3 text-black"
                        style={{
                            backgroundImage: 'url(https://img.freepik.com/premium-photo/white-square-frame_1284565-5480.jpg?w=1060)', // Replace with your image path
                        }}>
                        <h3 className="font-bold font-serif text-xl">Petro William</h3>
                        <p className="text-lg">Main Chef</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChefsSection;
