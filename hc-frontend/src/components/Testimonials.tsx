import { Quote, Star } from "lucide-react";
import Image from "next/image";
import React from "react";

import Carousel2D from "./Carousel2D";

export interface Testimonial {
  id: number;
  name: string;
  initial: string;
  avatar: string;
  rating: number;
  content: string;
}

interface TestimonialProps {
  testimonials: Testimonial[];
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-2">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
  testimonial,
}) => {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl bg-gray-50 p-8 shadow-sm">
      <div>
        <Quote className="mb-4 h-10 w-10 text-red-500 fill-red-500 transform rotate-180" />
        <p className="text-lg text-gray-800">{testimonial.content}</p>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full">
            <Image src={testimonial.avatar} alt={testimonial.name} className="h-full w-full object-cover" layout="fill"/>
          </div>
          <span className="font-medium">{testimonial.name}</span>
        </div>
        <StarRating rating={testimonial.rating} />
      </div>
    </div>
  );
};

const Testimonials: React.FC<TestimonialProps> = ({ testimonials }) => {
  // const [activeSlide, setActiveSlide] = useState(0);
  // const totalSlides = Math.ceil(testimonials.length / 3);

  // const goToSlide = (index: number) => {
  //   setActiveSlide(index);
  // };

  // const nextSlide = () => {
  //   setActiveSlide((prev) => (prev + 1) % totalSlides);
  // };

  // const prevSlide = () => {
  //   setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  // };

  return (
    <div className="mx-auto xl:px-40 lg:px-14 px-14 py-20">
      {/* Top user avatars row */}
      <div className="mb-8 flex justify-center">
        <Image
          src="/images/testimonial.png"
          alt="Testimonial"
          height={75}
          width={400}
        />
      </div>

      {/* Heading section */}
      <div className="mb-10 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900">
          Sign up and become part of a vibrant community of <br />
          <span className="text-5xl">5,000+ flatwappers.</span>
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-700">
          Our users success stories reflect our commitment to delivering
          excellent service, transparency, and value.
        </p>
      </div>

      {/* Testimonials grid */}
      <Carousel2D
        slideWidth={400}
        gap={24}
        showArrows={true}
        autoScroll={false}
      >
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </Carousel2D>
    </div>
  );
};

export default Testimonials;
