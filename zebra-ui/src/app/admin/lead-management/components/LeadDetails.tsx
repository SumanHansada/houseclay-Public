import { LeadType, TLead } from "@/common/Types";
import { useRouter } from "next/navigation";

interface LeadDetailsProps {
  lead: TLead;
}

export const LeadDetails: React.FC<LeadDetailsProps> = ({ lead }) => {
  const router = useRouter();
  return (
    <div className="flex w-full h-[calc(100vh-4rem)]">
      <div className="w-2/3 bg-gray-200">
        <div className="flex flex-col flex-1 h-full">
          {/* <div className="sticky top-0 z-10 border border-b-gray-200 bg-black text-white shadow-sm">
            Header
          </div> */}

          <div className="flex items-center flex-1 overflow-auto px-4">
            Lead Details - Lead ID: {lead.id} & Lead Type: {lead.type}
          </div>

          <div className="sticky bottom-0 z-10 border border-t-gray-200 bg-gray-100 shadow-sm flex justify-between px-8 py-2">
            <button
              onClick={() => router.push("/admin/add-property")}
              className="px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white"
            >
              Add Property
            </button>
            <button className="px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white">
              Resolved
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/3 bg-gray-300 flex flex-col overflow-y-auto">
        <h1>Comments</h1>
      </div>
    </div>
  );
};
