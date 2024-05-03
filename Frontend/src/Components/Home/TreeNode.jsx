import { Link } from "react-router-dom";

export const TreeNode = ({ icon, label, to }) => {
    return (
      <Link to={to} className="flex items-center gap-2 text-black py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors">
        {icon}
        <span>{label}</span>
      </Link>
    );
  }