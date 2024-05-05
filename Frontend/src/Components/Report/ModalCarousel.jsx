
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { Product1, Product2, Product3, Product4 } from '/image-product-2.jpg';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import PropTypes from "prop-types";
const thumbImages = [Product1, Product2, Product3, Product4];


function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <button
      className=" cursor-pointer flex justify-center items-center z-30 shadow-sm -right-5 md:-right-7 bg-white md:w-14 md:h-14 w-10 h-10
      absolute rounded-full opacity-100 md:top-[40%] md:-translate-y-[60%] top-[50%] -translate-y-[50%] group"
      onClick={onClick}
    >
      <MdKeyboardArrowRight size={30} className="text-very-dark-blue group-hover:text-oranges" aria-label="Right" />
    </button>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      className="
      cursor-pointer flex justify-center items-center shadow-sm z-30 -left-5 md:-left-7 bg-white md:w-14 md:h-14 w-10 h-10
      absolute rounded-full opacity-100 md:top-[40%] top-[50%] -translate-y-[50%] md:-translate-y-[60%] group"
      onClick={onClick}
    >
      <MdKeyboardArrowLeft size={30} className=" text-very-dark-blue group-hover:text-oranges" aria-label="Left" />
    </button>
  );
}

const ModalCarousel = () => {
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
    dotsClass: 'slick-dots slick-thumb',
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  return (
    <>
      <Slider {...settings} className="w-full rounded-2xl">
        <div>
          <img src={Product1} className="object-cover w-full rounded-2xl h-auto" alt="product1" />
        </div>
        <div>
          <img src={Product2} className="object-cover w-full rounded-2xl h-auto" alt="product2" />
        </div>
        <div>
          <img src={Product3} className="object-cover w-full rounded-2xl h-auto" alt="product3" />
        </div>
        <div>
          <img src={Product4} className="object-cover w-full rounded-2xl h-auto" alt="product4" />
        </div>
      </Slider>
    </>
  );
};

export default ModalCarousel;

SamplePrevArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
  };
  SampleNextArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
  };