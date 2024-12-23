import React, { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import i1 from "./i1.png";
import i2 from "./i2.png";
import i3 from "./i3.png";

import i7 from "./i7.png";

const Partners = () => {
    const images = [i1, i2, i3, i7,i1];
    const imageLinks = [
        
    ];

    const [isLoaded, setIsLoaded] = useState(false);
    const sliderRef = useRef(null);

    const preloadImages = (images) => {
        let loadedImages = 0;
        const totalImages = images.length;

        images.forEach((src) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedImages += 1;
                if (loadedImages === totalImages) {
                    setIsLoaded(true);
                }
            };
        });
    };

    useEffect(() => {
        preloadImages(images);
    }, [images]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2100,
        cssEase: "linear",
        pauseOnHover: false,
        beforeChange: (current, next) => {
            if (sliderRef.current) {
                sliderRef.current.slickGoTo(next);
            }
        },
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 360,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <section className="py-10 bg-Grey font-poppins lg:w-full w-[200px] mx-auto">

<p className="text-center text-black text-xl  font-semibold mb-8 my-4">
OUR TRUSTED 8K HAPPY PARTNER
</p>
        <div className="max-w-7xl mx-auto">
            {isLoaded ? (
                <Slider ref={sliderRef} {...settings}>
                    {images.map((src, index) => (
                        <div key={index} className="slide-item">
                            <a href={imageLinks[index]} target="_blank" rel="noopener noreferrer" className="image-link">
                                <img
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    className="object-contain w-full md:w-3/4 mx-auto slide-image"
                                    style={{ maxHeight: '300px' }}
                                />
                            </a>
                        </div>
                    ))}
                </Slider>
            ) : (
                <div className="flex justify-center items-center" style={{ height: '300px' }}>
                    <span>Loading...</span>
                </div>
            )}
        </div>
    </section>
    

    );
};

export default Partners;






