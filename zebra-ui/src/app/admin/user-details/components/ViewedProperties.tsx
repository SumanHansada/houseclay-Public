import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Column, DataTable } from "@/components/DataTable";
import { TablePagination } from "@/components/TablePagination";
import { UserPropertyInfo } from "@/interfaces/User";

import { RenderPropertyStatus } from "./RenderPropertyStatus";
import { TableCellActions } from "./TableCellActions";

interface ViewedPropertiesProps {
  viewedProperties: UserPropertyInfo[];
}

export const ViewedProperties: React.FC<ViewedPropertiesProps> = ({
  viewedProperties,
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const allProperties = useMemo<UserPropertyInfo[]>(() => {
    return viewedProperties ?? [];
  }, [viewedProperties]);

  const totalProperties = viewedProperties.length;
  console.log("properties: " + totalProperties);

  const totalPages = Math.ceil(totalProperties / rowsPerPage);
  console.log("pages: " + totalPages);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const viewPropertyDetails = (propertyID: string) => {
    router.push(`/admin/property-details/${propertyID}`);
  };

  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return allProperties.slice(start, start + rowsPerPage);
  }, [allProperties, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const nextPage = () => !isLast && setCurrentPage((p) => p + 1);
  const prevPage = () => !isFirst && setCurrentPage((p) => p - 1);

  const dataWithSerial = useMemo(() => {
    return paginatedProperties.map((prop, idx) => ({
      ...prop,
      _serial: (currentPage - 1) * rowsPerPage + idx + 1,
    }));
  }, [paginatedProperties, currentPage]);

  const columns: Column<UserPropertyInfo & { _serial: number }>[] = [
    {
      key: "serial",
      label: "Sr. No.",
      accessor: "_serial",
      className: "w-20",
    },
    {
      key: "location",
      label: "Location",
      accessor: "location",
    },
    {
      key: "type",
      label: "Type",
      accessor: "type",
    },
    {
      key: "config",
      label: "Config",
      accessor: "config",
    },
    {
      key: "status",
      label: "Status",
      render: (property) => <RenderPropertyStatus status={property.status} />,
    },
    {
      key: "action",
      label: "Action",
      render: (property) => (
        <TableCellActions
          viewDetails={() => viewPropertyDetails(property.propertyID)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col flex-1 h-full">
        {/* Table area */}
        <div className="flex flex-1 bg-gray-100 py-6 px-16">
          <div className="flex flex-col flex-1 bg-white shadow-sm rounded-lg p-4 gap-5">
            <div className="text-3xl">User viewed properties</div>
            <DataTable
              columns={columns}
              data={dataWithSerial}
              getRowId={(property) => property.propertyID}
            />
          </div>
        </div>

        {/* Sticky bottom pagination */}
        <div className="sticky bottom-0 z-10 border border-t-gray-200 shadow-sm">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            isFirst={isFirst}
            isLast={isLast}
            goToPage={goToPage}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        </div>
      </div>
    </div>
  );
};
