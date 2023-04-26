import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { RiFileList3Line } from "react-icons/ri";
import { getTableList } from "../model/Get";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/LoginProvider";
import { insertNewTable } from "../model/Post";

const Home = () => {
  const { value, setValue } = useContext(UserContext);
  const [tableList, setTableList] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [tableName, setTableName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (value.Username != undefined) {
      getTableList(setTableList, value.Username);
    }
    return () => {};
  }, [value.Username]);

  console.log(tableList);

  const createNewTable = async () => {
    const result = await insertNewTable(tableName, value.Username);
    console.log(result);
    setCreateModal(!createModal);
  };

  const newButton = () => {
    setCreateModal(!createModal);
  };

  return (
    <div className="relative">
      <Navbar />
      <Sidebar />
      <div className="fixed h-full w-full overflow-y-scroll">
        <div className="p-4 sm:ml-[13em] flex justify-center">
          <div className="ml-[100px] p-4 rounded-lg dark:border-gray-700 w-[65em]">
            <div className="ml-[300px] pb-5">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 pr-4 pl-2 rounded flex text-[15px]"
                onClick={newButton}
              >
                <AiOutlinePlus className="mt-[2px] mr-2 text-[20px]" />
                New
              </button>
            </div>
            <div className="grid grid-cols-5 gap-[30px] w-[900px]">
              {tableList.length > 0 ? (
                tableList.map((value) => {
                  return (
                    <div
                      key={value.tablename}
                      className="bg-gray-100 hover:bg-gray-300 h-[180px] w-[151px] rounded transition ease-in-out cursor-pointer"
                      onClick={() => navigate(`/list/${value.tablename}`)}
                    >
                      <div className="p-5 flex justify-center content-between text-[80px]">
                        <RiFileList3Line />
                      </div>
                      <p className="p-2 text-center text-[12px] font-san">
                        {value.tablename.length > 18
                          ? value.tablename.substring(0, 18) + "..."
                          : value.tablename}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Begginig Create Table Modal */}
      <div
        className={
          createModal ? "fixed w-full h-full z-40 top-0 left-0" : "hidden"
        }
      >
        <div className="w-full h-full z-50 bg-gray-500/50 flex justify-center">
          <div className="w-[40em] h-[25em] mt-[70px]  bg-white overflow-y-auto">
            <div className="flex justify-end w-full p-2 border-b-2">
              <button
                className="text-lg p-2 hover:bg-gray-300 rounded-full transition ease-in-out"
                onClick={newButton}
              >
                <AiOutlineClose />
              </button>
            </div>
            <div className="px-5 pb-10 h-[150px]">
              <div className="">Name of the table</div>
              <input
                type="text"
                className="border-2"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="hover:bg-gray-300 p-1 px-2 rounded"
                onClick={createNewTable}
              >
                Create
              </button>
              <button className="hover:bg-gray-300 p-1 px-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Ending Create Table Modal */}
    </div>
  );
};

export default Home;
