import { useState, useEffect } from "react";

interface DropDownWithAddProps {
  fetchItems: () => Promise<string[]>; // Function to fetch item list
  onSelect: (value: string) => void; // Callback for when a item is selected
  onInsert?: (newItem: string) => Promise<void>; // Callback to insert new item (optional)
  value?: string; // Optional value prop to set the initial selected item
}

const DropDownWithAdd: React.FC<DropDownWithAddProps> = ({
  fetchItems,
  onSelect,
  onInsert,
  value, // Optional value prop to set the initial selected item
}) => {
  const [items, setItems] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>(value || ""); // Initialize selected with the optional value prop
  const [newItem, setNewItem] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      const categories = await fetchItems();
      setItems([...categories, "Add New"]); // Append "Add New item" option
    };
    fetchData();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === "Add New") {
      setIsAdding(true); // Show input field for adding new item
      setSelected("");
    } else {
      setSelected(value);
      setIsAdding(false);
      onSelect(value); // Pass selected item to parent component
    }
  };

  const handleAddNew = async () => {
    if (newItem.trim() && onInsert) {
      await onInsert(newItem.trim()); // Insert into DB
      const updatedItems = await fetchItems(); // Fetch updated item list
      setItems([...updatedItems, "Add New"]); // Update dropdown
      setSelected(newItem);
      onSelect(newItem);
      setNewItem("");
      setIsAdding(false);
    }
  };

  return (
    <div className="relative">
      {isAdding ? (
        <div className="flex gap-2 ">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item"
            className="p-2 border border-gray-300  rounded w-full bg-white text-black"
          />
          <button
            onClick={handleAddNew}
            className="bg-blue-500  px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      ) : (
        <select
          value={selected}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded bg-white text-black w-full"
        >
          <option value="" disabled>
            Select or Add New
          </option>
          {items.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default DropDownWithAdd;
