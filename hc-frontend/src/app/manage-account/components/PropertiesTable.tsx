import CircleCheckIconSvg from "public/icons/circle-check.svg";
import ThreeDotsIconSvg from "public/icons/three-dots-horizontal.svg";

import { PropertyCategory } from "@/common/enums";
import { Column, WebsiteDataTable } from "@/components/DataTable";

const CircleCheckIcon = CircleCheckIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;
const ThreeDotsIcon = ThreeDotsIconSvg as React.FC<
  React.SVGProps<SVGSVGElement>
>;

interface Property {
  propertyID: string;
  propertyName: string;
  category: PropertyCategory;
  listedOn: string;
  builtupArea: string;
  price: string;
  status: string;
}

export const PropertyTable = ({ properties }: { properties: Property[] }) => {
  const columns: Column<Property>[] = [
    {
      key: "propertyName",
      label: "Property Name",
      cellClassName: "whitespace-nowrap max-w-80",
      render: (item) => (
        <span
          title={item.propertyName}
          className="inline-block max-w-[90%] truncate align-middle font-medium text-gray-800"
        >
          {item.propertyName}
        </span>
      ),
    },
    { key: "type", label: "Type", accessor: "category" },
    { key: "listedOn", label: "Listed on", accessor: "listedOn" },
    { key: "builtupArea", label: "Buildup Area", accessor: "builtupArea" },
    {
      key: "price",
      label: "Price",
      render: (item) => (
        <span className="font-medium text-gray-800">{item.price}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) =>
        item.status === "Active" ? (
          <div className="flex gap-1 items-center">
            <CircleCheckIcon width={20} height={20} className="text-lime-500" />
            <span>Active</span>
          </div>
        ) : (
          <span className="text-gray-500 px-1">Inactive</span>
        ),
    },
    {
      key: "action",
      label: "Action",
      cellClassName: "text-center",
      render: () => (
        <button className="text-gray-400 hover:text-gray-600">
          <ThreeDotsIcon width={20} height={20} className="text-black" />
        </button>
      ),
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      <WebsiteDataTable
        columns={columns}
        data={properties}
        getRowId={(row) => row.propertyID}
        noDataMessage="No properties found"
      />
    </div>
  );
};
