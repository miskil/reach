import React from "react";

interface SelectBlogsProps {
  siteId: string; // The site ID
  filterType: string; // The type of filter (e.g., category, tag, etc.)
  filterValueArray: string[]; // Array of values to populate the dropdown
  view?: string; // Optional inline styles for the component
}

const SelectBlogs: React.FC<SelectBlogsProps> = ({
  siteId,
  filterType,
  filterValueArray,
  view,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">{filterType}:</label>
      <select className="p-2 border border-gray-300 rounded bg-white text-black">
        {valueArray.map((value, index) => (
          <option key={index} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectBlogs;
