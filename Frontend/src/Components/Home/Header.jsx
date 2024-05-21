import { RiSearch2Line } from "react-icons/ri";
import { FaLayerGroup, FaBell } from "react-icons/fa";

const Header = ({ username, notifications }) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
        <FaLayerGroup className="text-xl" />
        {username}
      </h1>
      <div className="flex items-center gap-4">
        <form className="w-full md:w-auto">
          <div className="relative">
            <RiSearch2Line className="absolute top-1/2 -translate-y-1/2 left-2" />
            <input
              type="text"
              className="bg-gray-200 outline-none py-2 pl-8 pr-4 rounded-xl w-full md:w-auto"
              placeholder="Search for reports"
            />
          </div>
        </form>
        <div className="relative">
          <FaBell className="text-2xl text-gray-600 hover:text-gray-800 cursor-pointer" />
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
              {notifications.length}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
