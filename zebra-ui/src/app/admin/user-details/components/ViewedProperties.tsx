import { UserPropertyInfo } from "@/interfaces/User";
import { PropertyCard } from "./PropertyCard";

interface ViewedPropertiesProps {
  viewedProperties: UserPropertyInfo[];
}

export const ViewedProperties: React.FC<ViewedPropertiesProps> = ({
  viewedProperties,
}) => {
  return (
    <section className="flex flex-col px-28">
      <h2
        className="sticky top-0 z-10 text-3xl bg-white
       font-medium border-b-2 border-gray-400 mb-4"
      >
        User Viewed Properties
      </h2>

      {viewedProperties.length === 0 ? (
        <p className="text-gray-600 text-2xl">No Viewed properties.</p>
      ) : (
        <ul className="space-y-6">
          {viewedProperties.map((prop) => (
            <PropertyCard key={prop.propertyID} currentProperty={prop} />
          ))}
        </ul>
      )}
    </section>
  );
};
