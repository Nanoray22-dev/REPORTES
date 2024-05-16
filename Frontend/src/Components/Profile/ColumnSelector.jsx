

const ColumnSelector = ({ selectedColumns, onChange }) => {
  const columns = [
    { name: "Username", value: "username" },
    { name: "Email", value: "email" },
    { name: "Address", value: "address" },
    { name: "Phone", value: "phone" },
    { name: "Age", value: "age" },
    { name: "Residence", value: "residenceType" },
    { name: "Role", value: "role" },
  ];

  return (
    <div className="flex gap-4">
      {columns.map((column) => (
        <label key={column.value} className="flex items-center">
          <input
            type="checkbox"
            checked={selectedColumns.includes(column.value)}
            onChange={() => onChange(column.value)}
            className="mr-2"
          />
          {column.name}
        </label>
      ))}
    </div>
  );
};

export default ColumnSelector;
