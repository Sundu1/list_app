import React from "react";
import { FaRegListAlt } from "react-icons/fa";
import { RiContactsBookFill } from "react-icons/ri";
import { AiFillAppstore } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside
      className="fixed top-0 left-0 z-30 w-[13em] h-screen pt-20 transition-transhtmlForm -translate-x-full bg-white border-r 
                 border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100
                       dark:hover:bg-gray-700"
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 
                          dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
              <span className="ml-3">Dashboard</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100
                       dark:hover:bg-gray-700"
            >
              <svg
                aria-hidden="true"
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400
                          group-hover:text-gray-900
                           dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Users</span>
            </a>
          </li>
          <li>
            <a
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100
                        dark:hover:bg-gray-700 hover:cursor-pointer"
              onClick={() => navigate(`/apps`)}
            >
              <div
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400
                          group-hover:text-gray-900
                           dark:group-hover:text-white p-[3px] text-[24px]"
              >
                <AiFillAppstore />
              </div>
              <span className="flex-1 ml-3 whitespace-nowrap">Apps</span>
            </a>
          </li>
          <li>
            <a
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100
                        dark:hover:bg-gray-700 hover:cursor-pointer"
              onClick={() => navigate(`/home`)}
            >
              <div
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400
                          group-hover:text-gray-900
                           dark:group-hover:text-white text-lg p-[3px]"
              >
                <FaRegListAlt />
              </div>
              <span className="flex-1 ml-3 whitespace-nowrap">Lists</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100
                        dark:hover:bg-gray-700"
            >
              <div
                className="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400
                          group-hover:text-gray-900
                           dark:group-hover:text-white text-[20px] p-[2px]"
              >
                <RiContactsBookFill />
              </div>
              <span className="flex-1 ml-3 whitespace-nowrap">Contact</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
