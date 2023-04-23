import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { RiFileList3Line } from "react-icons/ri";
import { getTableList } from "../model/Get";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/LoginProvider";

const Home = () => {
  const [tableList, setTableList] = useState([]);
  const { value, setValue } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      getTableList(setTableList);
    };
  }, []);

  const createNewTable = () => {
    console.log("create table");
  };

  return (
    <div className="relative">
      <Navbar />
      <Sidebar />
      <div className="fixed h-full w-full overflow-y-scroll">
        <div className="p-4 sm:ml-[13em] flex justify-center">
          <div className="ml-[100px] p-4 rounded-lg dark:border-gray-700 mt-14 w-[65em]">
            <div className="ml-[300px] pb-5">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 pr-4 pl-2 rounded flex text-[15px]"
                onClick={createNewTable}
              >
                <AiOutlinePlus className="mt-[2px] mr-2 text-[20px]" />
                New
              </button>
            </div>
            <div className="grid grid-cols-5 gap-[30px] w-[900px]">
              {tableList.map((value) => {
                return (
                  <div
                    key={value.TableId}
                    className="bg-gray-100 hover:bg-gray-300 h-[180px] w-[151px] rounded transition ease-in-out cursor-pointer"
                    onClick={() => navigate(`/list/${value.TableName}`)}
                  >
                    <div className="p-5 flex justify-center content-between text-[80px]">
                      <RiFileList3Line />
                    </div>
                    <p className="p-2 text-center text-[12px] font-san">
                      {value.TableName.length > 18
                        ? value.TableName.substring(0, 18) + "..."
                        : value.TableName}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
