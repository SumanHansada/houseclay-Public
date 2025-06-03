import { format } from "date-fns";

import { formatINRCurrency } from "@/common/utils";
import { PropertyUpdate } from "@/interfaces/PropertyUpdate";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PostedAndRentDetails(props: any) {
  const { property } = props;
  if (!property) return null;
  console.log("property", property);
  const lastPropertyUpdate: PropertyUpdate | null =
    property && property.propertyUpdates.length > 0
      ? property.propertyUpdates[property.propertyUpdates.length - 1]
      : null;
  console.log(lastPropertyUpdate);
  return (
    <section className="grid grid-flow-row 2xl:grid-cols-2 max-md:grid-cols-2 gap-2 w-full py-6 max-md:py-3">
      <div className="flex-col flex-1 px-4 py-2 border rounded-xl">
        <div className="text-sm text-gray-500 text-center">Posted On</div>
        <div className="text-center text-lg">
          {lastPropertyUpdate?.updateTime
            ? format(lastPropertyUpdate.updateTime, "MMM d, yyyy")
            : "-"}
        </div>
      </div>
      <div className="flex-col flex-1 px-4 py-2 border rounded-xl">
        <div className="text-sm text-gray-500 text-center">
          {property?.propertyCategory === "Sale" ? "Price" : "Rent"}
        </div>
        <div className="text-center text-lg">
          {property?.propertyCategory === "Sale"
            ? formatINRCurrency(property?.price)
            : formatINRCurrency(property?.rent)}
        </div>
      </div>
    </section>
  );
}
