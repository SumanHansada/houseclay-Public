import { UserPropertyInfo } from "@/interfaces/User";
import { PropertyCard } from "./PropertyCard";

interface ShortlistedPropertiesProps {
  shortlistedProperties: UserPropertyInfo[];
}

export const ShortlistedProperties: React.FC<ShortlistedPropertiesProps> = ({
  shortlistedProperties,
}) => {
  return (
    <section className="flex flex-col px-28">
      <h2
        className="sticky top-0 z-10 text-3xl bg-white
       font-medium border-b-2 border-gray-400 mb-4"
      >
        User Shortlisted Properties
      </h2>

      {shortlistedProperties.length === 0 ? (
        <p className="text-gray-600 text-2xl">No shortlisted properties.</p>
      ) : (
        <ul className="space-y-6">
          {shortlistedProperties.map((prop) => (
            <PropertyCard key={prop.propertyID} currentProperty={prop} />
          ))}
        </ul>
      )}
    </section>
  );
};
