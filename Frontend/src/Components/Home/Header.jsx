import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";

const Header = ({
  username,
  MdOutlineContactMail,
  CgDarkMode,
  Link,
  RiLogoutBoxRLine,
  logout,
  notifications,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(notifications);

  useEffect(() => {
    if (showNotifications) {
      setUnreadNotifications([]);
    }
  }, [showNotifications]);

  useEffect(() => {
    setUnreadNotifications(notifications);
  }, [notifications]);

  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              id="toggleSidebarMobile"
              aria-expanded="true"
              aria-controls="sidebar"
              className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
            >
              <svg
                id="toggleSidebarMobileHamburger"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                id="toggleSidebarMobileClose"
                className="w-6 h-6 hidden"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <a
              href="#"
              className="text-xl font-bold flex items-center lg:ml-2.5"
            >
              <img
                src={"/logo.png"}
                className="h-12 mr-2"
                alt="Windster Logo"
              />
              <p className="text-gray-500">
                Fix
                <span className="self-center whitespace-nowrap text-orange-500">
                  Oasis
                </span>
              </p>
            </a>
            <form action="#" method="GET" className="hidden lg:block lg:pl-32">
              <label htmlFor="topbar-search" className="sr-only">
                Search
              </label>
              <div className="mt-1 relative lg:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  name="email"
                  id="topbar-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full pl-10 p-2.5"
                  placeholder="Search"
                />
              </div>
            </form>
          </div>
          <div className="flex items-center">
            <div className="relative ml-5">
              <button
                type="button"
                className="relative bg-gray-50 p-2 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-100"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FaBell className="w-6 h-6" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute top-16 right-4 w-80 bg-white shadow-lg rounded-lg z-20 overflow-y-auto max-h-80">
                  <div className="py-2">
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <img
                                src={
                                  "http://ssl.gstatic.com/accounts/ui/avatar_2x.png"
                                }
                                alt="Profile"
                                className="w-10 h-10 rounded-full mr-3"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </span>
                              <span className="text-xs text-gray-500">
                                {notification.createdBy}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {notification.creatAd}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="dropdown ml-5">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {username}
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <Link className="dropdown-item flex gap-2" to={"/profile"}>
                  <MdOutlineContactMail className="mt-1 text-xl" />
                  Perfil
                </Link>
                <button className="dropdown-item flex gap-2" href="#">
                  <CgDarkMode className="mt-1 text-xl" />
                  Dark/Light
                </button>
                <button
                  onClick={() => logout()}
                  className="dropdown-item flex gap-2 text-red-600"
                >
                  <RiLogoutBoxRLine className="mt-1 text-xl" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
