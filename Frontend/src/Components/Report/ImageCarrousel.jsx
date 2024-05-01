import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import axios from "axios";

const ImageCarousel = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reports, setReports] = useState([]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlide(index),
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/report");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="mt-4">
      <Slider {...settings}>
        {reports.map((report, index) => (
          <div key={index}>
            <img
              src={report.image}
              alt={`Report Image ${index + 1}`}
              className="h-48 w-full object-cover rounded-lg"
            />
          </div>
        ))}
      </Slider>
      <div className="text-center mt-2">
        <p>
        {currentSlide + 1} de {images ? images.length : 0}

        </p>
      </div>
    </div>
  );
};

export default ImageCarousel;
