import React from 'react';

const ReportFilter = ({ filter, setFilter }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Filter by Category
      </label>
      <select
        name="category"
        value={filter.category || ""}
        onChange={handleFilterChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option value="">All</option>
        <option value="news">News</option>
        <option value="event">Event</option>
        <option value="update">Update</option>
      </select>
    </div>
  );
};

export default ReportFilter;
