import React from "react";

const UsersList = ({ users }) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-6 py-4">
        <div className="font-bold text-xl">Users by average mark</div>
        <div className="text-gray-600 text-right">Descending</div>
      </div>
      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <li key={user._id} className="flex items-center px-6 py-4 hover:bg-gray-50">
            <img
              src={user.profileImage}
              alt={user.username}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{user.username}</div>
              <div className="text-gray-500">{user.email}</div>
            </div>
            <div className="font-bold text-gray-900">{user.averageMark}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
