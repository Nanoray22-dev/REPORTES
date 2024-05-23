

const Header = ({username, MdOutlineContactMail, CgDarkMode, Link, RiLogoutBoxRLine, logout}) => {
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
                <form
                  action="#"
                  method="GET"
                  className="hidden lg:block lg:pl-32"
                >
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
                    className="text-gray-500 hover:text-gray-900 focus:outline-none"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 2a6 6 0 016 6v3.586l.293.293a1 1 0 01-.707 1.707H4.414a1 1 0 01-.707-1.707L4 11.586V8a6 6 0 016-6z" />
                      <path d="M12 18a2 2 0 11-4 0h4z" />
                    </svg>
                  </button>
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
