import { UserPropertyInfo } from "@/interfaces/User";
import { PropertyCard } from "./PropertyCard";

interface ContactedPropertiesProps {
  contactedProperties: UserPropertyInfo[];
}

export const ContactedProperties: React.FC<ContactedPropertiesProps> = ({
  contactedProperties,
}) => {
  return (
    <section className="flex flex-col px-28">
      <h2
        className="sticky top-0 z-10 text-3xl bg-white
       font-medium border-b-2 border-gray-400 mb-4"
      >
        User Contacted Properties
      </h2>

      {contactedProperties.length === 0 ? (
        <p className="text-gray-600 text-2xl">No Contacted properties.</p>
      ) : (
        <ul className="space-y-6">
          {contactedProperties.map((prop) => (
            <PropertyCard key={prop.propertyID} currentProperty={prop} />
          ))}
        </ul>
      )}
    </section>
  );
};
