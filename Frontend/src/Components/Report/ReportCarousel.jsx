import { useState } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import { IoClose } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Modal } from "@mui/material";
import ModalCarousel from "./ModalCarousel";

const thumbImages = [Product1, Product2, Product3, Product4];

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <button
      className="cursor-pointer flex justify-center items-center z-30 shadow-sm right-4 bg-white w-10 h-10
      absolute rounded-full opacity-100 top-1/2 -translate-y-1/2 md:hidden group"
      onClick={onClick}
    >
      <MdKeyboardArrowRight
        size={30}
        className="text-very-dark-blue group-hover:text-oranges"
        aria-label="Next"
      />
    </button>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      className="cursor-pointer flex justify-center items-center z-30 shadow-sm left-4 bg-white w-10 h-10
      absolute rounded-full opacity-100 top-1/2 -translate-y-1/2 md:hidden group"
      onClick={onClick}
    >
      <MdKeyboardArrowLeft
        size={30}
        className="text-very-dark-blue group-hover:text-oranges"
        aria-label="Prev"
      />
    </button>
  );
}

const ReportCarousel = ({ imagesArray }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const settings = {
    customPaging: function (i) {
      return (
        <div
          className="relative w-full h-full hover:after:bg-white hover:after:bg-opacity-60 hover:after:w-full 
          hover:after:h-full hover:after:absolute hover:after:z-20 hover:after:top-0 hover:after:rounded-xl"
        >
          <img
            className="rounded-xl"
            src={thumbImages[i]}
            alt={`thumb-${i + 1}`}
          />
        </div>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      <Slider {...settings} className="w-full md:rounded-2xl max-w-[450px]">
        {imagesArray.map((image, index) => (
          <div key={index}>
            <span
              onClick={handleOpen}
              className="w-full overflow-hidden cursor-zoom-in"
            >
              <img
                src={image}
                className="object-cover w-full md:rounded-2xl h-[300px] md:h-auto"
                alt={`image-${index}`}
              />
            </span>
          </div>
        ))}
      </Slider>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex justify-center h-screen items-center">
          <div className="max-w-[450px] md:w-[55%] w-5/6 mb-5">
            <div className="mb-5 flex justify-end">
              <button onClick={handleClose} className="w-fit">
                <IoClose
                  fontSize={32}
                  className="text-white font-bold  hover:text-oranges"
                />
              </button>
            </div>
            <ModalCarousel />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReportCarousel;

ReportCarousel.propTypes = {
  imagesArray: PropTypes.array.isRequired,
};
