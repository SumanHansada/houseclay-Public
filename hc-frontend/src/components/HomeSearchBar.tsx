import SearchSvg from "public/icons/search.svg";

import Dropdown from "./Dropdown";

const Search = SearchSvg as React.FC<React.SVGProps<SVGSVGElement>>;

const HomeSearchBar: React.FC = () => {
  return (
    <div className="flex pl-8 pr-2 rounded-full bg-white shadow-lg overflow-hidden justify-between items-center">
      {/* City */}
      <div className="flex-1 px-3 py-2 border-r border-gray-200">
        <div className="text-sm font-medium text-gray-900 mb-1">City</div>
        <div className="text-gray-500 text-sm flex items-center">
          <Dropdown
            options={[
              { id: 1, label: "Featured" },
              { id: 2, label: "Posted (Latest First)" },
              { id: 3, label: "Posted (Older First)" },
              { id: 4, label: "Availability (Early First)" },
              { id: 5, label: "Availability (Late First)" },
              { id: 6, label: "Price (Lower First)" },
              { id: 7, label: "Price (Higher First)" },
            ]}
            defaultSelected={{ id: 1, label: "Featured" }}
            onChange={(option) => console.log(option)}
          />
        </div>
      </div>

      {/* Location */}
      <div className="flex-1 px-3 py-2 border-gray-200">
        <div className="text-sm font-medium text-gray-900 mb-1">Location</div>
        <input
          type="text"
          placeholder="Type localities..."
          className="text-gray-500 text-sm w-full"
        />
      </div>

      {/* Search Button */}
      <button className=" text-white flex items-center justify-center">
        <Search height={50} width={50} />
      </button>
    </div>
  );
};

export default HomeSearchBar;
