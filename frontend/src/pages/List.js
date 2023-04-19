import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../index.css";
import { getAll } from "../model/Get";

const List = () => {
  const [tableName, setTableName] = useState("ComplaintAndSuggestionList");
  const [table, setTable] = useState({});

  useEffect(() => {
    return () => {
      getAll(tableName, setTable);
    };
  }, []);

  return (
    <div className="relative">
      <Navbar />
      <Sidebar />
      <div className="fixed h-full w-full bg-gray-400">
        <div className="h-full pt-[58px] ml-[12.5em]">
          <div className="absolute w-full bg-white p-5">
            <button className="">New</button>
          </div>
          <div className="pt-[60px] h-full w-full overflow-auto">
            <div className="h-full p-5 text-white text-[12.5px]">
              <div className="inline-block p-5 mr-5 bg-black rounded-lg min-w-full min-h-full">
                <table>
                  {table[tableName] ? (
                    <tbody>
                      <th className="border-2 min-w-[100px]">
                        <input type="checkbox" />
                      </th>
                      {Object.keys(table[tableName][0]).map((key) => {
                        return (
                          <th
                            key={key}
                            className="border-2 min-w-[100px] text-left"
                          >
                            <div className="p-2">{key}</div>
                          </th>
                        );
                      })}
                      {table[tableName].map((values, keys) => {
                        return (
                          <tr key={keys}>
                            <td className="border-2 min-w-[100px] text-center">
                              <input type="checkbox" />
                            </td>
                            {Object.entries(values).map(([key, value]) => {
                              return (
                                <td
                                  key={key.concat(keys)}
                                  className="border-2 min-w-[100px]"
                                >
                                  <div className="p-2">{value}</div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  ) : (
                    "Please wait"
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
