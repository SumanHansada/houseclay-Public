import { Testimonial } from "@/interfaces/Testimonial";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

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

export const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
  testimonial,
}) => {
  return (
    <div className="flex h-full flex-col max-md:p-4">
      <div className="px-6 md:px-8 pt-8 md:pt-10 pb-4 rounded-t-2xl rounded-es-2xl bg-gray-50 h-[220px] md:h-[280px]">
        <Quote className="mb-4 h-10 w-10 text-red-500 fill-red-500 transform rotate-180" />
        <p className="text-lg xl:text-xl max-md:text-sm font-nunito text-gray-800">
          {testimonial.content}
        </p>
      </div>

      <div className="flex items-center">
        <div className="flex items-center gap-3 bg-white pt-4 pr-4 pb-2 pl-2  rounded-se-2xl w-5/12">
          <div className="h-12 w-12 overflow-hidden rounded-full relative">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              className="h-full w-full object-cover"
              fill
            />
          </div>
          <span className="font-medium">{testimonial.name}</span>
        </div>
        <div className="flex-1 h-full flex items-center justify-center rounded-b-2xl bg-gray-50">
          <StarRating rating={testimonial.rating} />
        </div>
      </div>
    </div>
  );
};
