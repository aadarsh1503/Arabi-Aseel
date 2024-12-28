import React from 'react';
import i2 from "./i2.jpg";
import i3 from "./i3.jpg";
import i4 from "./i4.jpg";
import i5 from "./i5.jpg";
import i6 from "./i6.jpg";
import i7 from "./i7.jpg";
import i8 from "./i8.jpg";
import i9 from "./i9.jpg";

const MenuSection = () => {
    const menuItems = [
        {
            id: 1,
            name: 'Pizza Slice',
            description: 'Cheese, Ham & Pineapple',
            price: '$12.99',
            image: i2,
            category: 'Starter',
        },
        {
            id: 2,
            name: 'Cheese Burger',
            description: 'Cheese, Ham & Pineapple',
            price: '$9.99',
            image: i3,
            category: 'Starter',
        },
        {
            id: 3,
            name: 'Chicken Paradise',
            description: 'Cheese, Ham & Pineapple',
            price: '$15.99',
            image: i4,
            category: 'Starter',
        },
        {
            id: 4,
            name: 'Shawarma',
            description: 'Cheese, Ham & Pineapple',
            price: '$8.99',
            image: i5,
            category: 'Starter',
        },
        {
            id: 5,
            name: 'Salmon Steak',
            description: 'Cheese, Ham & Pineapple',
            price: '$12.99',
            image: i6,
            category: 'Main Course',
        },
        {
            id: 6,
            name: "Fries McDonald's",
            description: 'Cheese, Ham & Pineapple',
            price: '$9.99',
            image: i7,
            category: 'Main Course',
        },
        {
            id: 7,
            name: 'Chocolate chip',
            description: 'Cheese, Ham & Pineapple',
            price: '$15.99',
            image: i8,
            category: 'Main Course',
        },
        {
            id: 8,
            name: 'Meatballs Pasta',
            description: 'Cheese, Ham & Pineapple',
            price: '$8.99',
            image: i9,
            category: 'Main Course',
        },
    ];

    return (
        <div className="bg-white py-10 max-w-6xl mx-auto px-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Starter</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.filter(item => item.category === 'Starter').map(item => (
                        <div
                            key={item.id}
                            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-48 w-full object-cover"
                            />
                            <div className="p-8">
                                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <p className="text-xl font-bold text-gray-900 mt-2">{item.price}</p>
                                <button className="mt-4 text-sm font-medium text-brown hover:underline flex items-center">
                                    ORDER NOW <span className="ml-2">→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Main Course</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.filter(item => item.category === 'Main Course').map(item => (
                        <div
                            key={item.id}
                            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-48 w-full object-cover"
                            />
                            <div className="p-8">
                                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <p className="text-xl font-bold text-gray-900 mt-2">{item.price}</p>
                                <button className="mt-4 text-sm font-medium text-brown hover:underline flex items-center">
                                    ORDER NOW <span className="ml-2">→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuSection;
