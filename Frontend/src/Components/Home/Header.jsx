import { RiSearch2Line } from "react-icons/ri";
import { FaLayerGroup } from "react-icons/fa";

const Header = ({ username }) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-2xl md:text-3xl font-bold ">
     
         <span className="text-xl flex gap-3 "><FaLayerGroup />User: </span>
         {username}
      </h1>
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
    </header>
  );
};

export default Header;
