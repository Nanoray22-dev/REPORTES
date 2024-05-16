import  { useState } from "react";

const Selector = ({ selectedColumns, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const columns = [
    { name: "Username", value: "username" },
    { name: "Email", value: "email" },
    { name: "Address", value: "address" },
    { name: "Phone", value: "phone" },
    { name: "Age", value: "age" },
    { name: "Residence ", value: "residenceType" },
    { name: "Role", value: "role" },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (column) => {
    const newSelectedColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((col) => col !== column)
      : [...selectedColumns, column];
    onChange(newSelectedColumns);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"
      >
        Show by
      </button>
      {isOpen && (
        <div
          className="absolute mt-2 bg-white border border-gray-300 rounded-md shadow-lg"
          style={{ zIndex: 1000 }}
        >
          <div className="p-2">
            {columns.map((column) => (
              <label key={column.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column.value)}
                  onChange={() => handleCheckboxChange(column.value)}
                  className="mr-2"
                />
                {column.name}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Selector;
