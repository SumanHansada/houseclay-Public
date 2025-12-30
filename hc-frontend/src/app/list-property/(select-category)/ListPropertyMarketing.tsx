import Carousel2D from "@/components/Carousel2D";
import ListPropertyAdvantages from "@/components/ListPropertyAdvantages";
import ListWithUs from "@/components/ListWithUs";
import { TestimonialCard } from "@/components/Testimonials";
import PropertiesData from "@/data/PropertiesData.json";
import { Footer } from "@/layout-components";

import CustomerSupportBanner from "../components/CustomerSupportBanner";

const ListPropertyMarketing = () => {
  const testimonials = PropertiesData.testimonials;

  return (
    <>
      {/* Marketing sections rendered server-side */}
      <section className="w-full overflow-hidden max-md:hidden">
        <ListWithUs />
      </section>

      <section className="w-full overflow-hidden max-md:hidden">
        <CustomerSupportBanner />
      </section>

      <section className="w-full overflow-hidden max-md:hidden">
        <div className="container pt-12 mx-auto xl:px-28 lg:px-14 md:px-8 px-8">
          <div className="flex justify-around items-center gap-16">
            <div className="flex flex-col w-1/2">
              <h2 className="text-3xl font-bold text-gray-800">
                Trusted by Landlords Across Bengaluru
              </h2>
              <p className="mt-4 text-base text-gray-600">
                Trusted by landlords in Bengaluru to deliver fast, reliable, and
                hassle-free property listing solutions!
              </p>
            </div>

            <div className="flex w-1/2">
              <Carousel2D gap={4} showArrows slidesPerView={2}>
                {testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                  />
                ))}
              </Carousel2D>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden max-md:hidden">
        <ListPropertyAdvantages />
      </section>

      <Footer />
    </>
  );
};

export default ListPropertyMarketing;
