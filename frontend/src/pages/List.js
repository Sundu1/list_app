import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../index.css";
import { getTableValue } from "../model/Get";
import { Post } from "../model/Post";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { useParams } from "react-router-dom";

const List = () => {
  const { tableName } = useParams();

  const [table, setTable] = useState({});
  const [insertValues, setInsertValues] = useState({});
  const [modal, setModal] = useState(false);

  useEffect(() => {
    return () => {
      getTableValue(tableName, setTable);
    };
  }, []);

  const dataTypes = new Object({
    int: {
      inputType: "number",
      value: "Enter a number",
    },
    nvarchar: {
      inputType: "text",
      value: "Enter value here",
    },
    datetime: {
      inputType: "date",
      value: "2023-04-21",
    },
    datetime2: {
      inputType: "date",
      value: "2023-04-21",
    },
  });

  const newButton = () => {
    setModal(!modal);
  };

  const saveButton = () => {
    localStorage.removeItem(tableName);
    Post(tableName, insertValues);
  };

  return (
    <div className="relative">
      <Navbar />
      <Sidebar />
      <div className="fixed h-full w-full bg-gray-400">
        <div className="h-full ml-[12.8em]">
          <div className="absolute w-full bg-white p-3">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 pr-3 pl-2 rounded flex text-[15px]"
              onClick={newButton}
            >
              <AiOutlinePlus className="mt-[2px] mr-2 text-[18px]" />
              New
            </button>
          </div>
          <div className="pt-[55px] h-full w-full">
            <div className="h-full p-5 text-[12.5px] overflow-auto">
              <div className="inline-block p-5 mr-5 bg-white rounded-lg min-w-full min-h-full">
                {Object.keys(table).length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th className="border-2 min-w-[100px]">
                          <input type="checkbox" />
                        </th>
                        {Object.values(table.data.columns).map((object) => {
                          return (
                            <th
                              key={object.ColumnName}
                              className="border-2 min-w-[100px] text-left"
                            >
                              <div className="p-2">{object.ColumnName}</div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(table.data.tableValues).map(
                        (values, keys) => {
                          return (
                            <tr key={keys}>
                              <td className="border-2 min-w-[100px] text-center">
                                <input type="checkbox" />
                              </td>
                              {Object.entries(values).map(([key, value]) => {
                                return (
                                  <td
                                    key={key.concat(value)}
                                    className="border-2 min-w-[100px]"
                                  >
                                    <div className="p-2">{value}</div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                ) : (
                  <div>Please wait</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Beginning Modal ---New--- */}
      <div
        className={
          modal ? "fixed w-full h-full z-40 top-0 left-0 pt-[59px]" : "hidden"
        }
      >
        <div className="w-full h-full right-0 bottom-0 z-50 bg-gray-500/50 flex justify-end">
          <div className="w-[40em] min-h-full bg-white overflow-y-auto">
            <div className="flex justify-between w-full p-2 border-b-2">
              <button
                className="hover:bg-gray-300 p-1 px-2 rounded"
                onClick={saveButton}
              >
                Save
              </button>
              <button
                className="text-lg p-2 hover:bg-gray-300 rounded-full transition ease-in-out"
                onClick={newButton}
              >
                <AiOutlineClose />
              </button>
            </div>
            <div className="px-5 pb-10 ">
              {Object.keys(table).length > 0 ? (
                Object.values(table.data.columns).map((object) => {
                  return (
                    <div
                      key={object.ColumnName}
                      className="min-w-[100px] text-left"
                    >
                      <div className="p-2">
                        {object.ColumnName} - {object.DataType}
                      </div>
                      <input
                        className="border-2"
                        type={
                          dataTypes[object.DataType]
                            ? dataTypes[object.DataType].inputType
                            : ""
                        }
                        value={
                          insertValues[object.ColumnName]
                            ? insertValues[object.ColumnName]
                            : object.DataType == "datetime"
                            ? "2023-04-21"
                            : ""
                        }
                        placeholder={
                          dataTypes[object.DataType]
                            ? dataTypes[object.DataType].value
                            : ""
                        }
                        onChange={(e) =>
                          setInsertValues((old) => ({
                            ...old,
                            [object.ColumnName]: e.target.value,
                          }))
                        }
                      />
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
      {/* Ending Modal ---New--- */}
    </div>
  );
};

export default List;
