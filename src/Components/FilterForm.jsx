import { useDispatch, useSelector } from "react-redux";
import { setFilter, clearFilters } from "../Redux/Features/eventSlice.js";

const FilterForm = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.events);

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(
      setFilter({
        [name]: value,
      }),
    );
  };

  const handlePriceChange = (e) => {
    dispatch(
      setFilter({
        priceRange: [0, Number(e.target.value)],
      }),
    );
  };

  const handleClear = () => {
    dispatch(clearFilters());
  };

  return (
    <div className="bg-white  mb-4 grid grid-cols-1 gap-4 sm:max-w-full ">
      {/* <h1 className="text-xl font-semibold col-span-full">Filter</h1> */}
      {/* Search */}
      <input
        type="text"
        name="search"
        placeholder="Search events..."
        value={filters.search}
        onChange={handleChange}
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      />

      {/* Category */}
      <select
        name="category"
        value={filters.category}
        onChange={handleChange}
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
        <option value="">All Categories</option>
        <option value="Conference">Conference</option>
        <option value="Workshop">Workshop</option>
        <option value="Concert">Concert</option>
        <option value="Webinar">Webinar</option>
        <option value="Festival">Festival</option>
        <option value="Sports">Sports</option>
        <option value="Other">Other</option>
      </select>

      {/* Location */}
      <input
        type="text"
        name="location"
        value={filters.location}
        onChange={handleChange}
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        placeholder="Enter Location"
      />

      {/* Date */}
      <input
        type="date"
        name="date"
        value={filters.date || ""}
        onChange={handleChange}
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      />

      {/* Price */}
      <div>
        <label className="text-sm">Max Price: ₹{filters.priceRange[1]}</label>
        <input
          type="range"
          min="0"
          max="10000"
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
          className="w-full"
        />
      </div>

      {/* Clear Button */}
      <div className="max-w-2xl">
        <button
          onClick={handleClear}
          className="p-4 bg-red-500 text-white py-2 rounded-sm hover:bg-red-5600">
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterForm;
