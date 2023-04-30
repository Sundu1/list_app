import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../index.css";
import { getTableValue } from "../model/Get";
import { createNewRow, addColumnPost } from "../model/Post";
import { DeleteRow } from "../model/Delete";
import { editRow } from "../model/Put";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiFillWarning,
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";
import { useParams } from "react-router-dom";
import { UserContext } from "../components/LoginProvider";

const List = () => {
  const { tableName } = useParams();
  const { value, setValue } = useContext(UserContext);
  const [table, setTable] = useState({});

  const [updatedTable, setUpdatedTable] = useState([]);
  const [draggedColumnName, setDraggedColumnName] = useState("");
  const [columnValue, setColumnValue] = useState({});

  const [insertValues, setInsertValues] = useState({});
  const [columnInfo, setColumnInfo] = useState({ Name: "", Type: "Number" });
  const [modal, setModal] = useState(false);
  const [addColumnModal, setAddColumnModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [editModal, setEditModal] = useState(false);
  const [editValues, setEditValues] = useState({});

  const [refreshList, setRefreshList] = useState(false);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    if (value.Username != undefined) {
      getTableValue(tableName, setTable, value.Username);
    }
    return () => {};
  }, [value.Username, refreshList]);

  const dataTypes = new Object({
    integer: {
      inputType: "number",
      value: "Enter a number",
    },
    "character varying": {
      inputType: "text",
      value: "Enter value here",
    },
    "timestamp without time zone": {
      inputType: "date",
      value: "2023-04-01",
    },
  });

  const newButton = () => {
    setModal(!modal);
  };

  const saveButton = () => {
    const createNewRowData = new Object({
      TableName: tableName,
      User: value.Username,
      Values: insertValues,
    });
    createNewRow(createNewRowData);
    setRefreshList(!refreshList);
    setModal(!modal);
    setInsertValues({});
  };

  const addColumn = () => {
    setAddColumnModal(!addColumnModal);
  };

  const saveColumnInfo = () => {
    if (columnInfo.Name) {
      addColumnPost(tableName, value.Username, columnInfo);
      setRefreshList(!refreshList);
      setAddColumnModal(!addColumnModal);
      return;
    }
    console.log("no");
  };

  const handleChecked = (e, id) => {
    if (e.target.checked) setChecked((old) => [...old, id]);
    else {
      checked.forEach((value, i) => {
        if (value == id) checked.splice(i, 1);
        if (checked.length == 0) setChecked([]);
      });
    }
  };

  const handleCheckedAll = (e) => {
    const checkboxes = document.querySelectorAll("#checkbox");
    if (e.target.checked) {
      setChecked([]);
      table.data.tableValues.forEach((value) =>
        setChecked((old) => [...old, value.pkid])
      );
      checkboxes.forEach((value) => (value.checked = true));
    } else {
      setChecked([]);
      checkboxes.forEach((value) => (value.checked = false));
    }
  };

  const handleDeleteButton = () => {
    const deleteRowsInfo = new Object({
      TableName: tableName,
      User: value.Username,
      delete_pkid: checked,
    });

    DeleteRow(deleteRowsInfo);
    setDeleteModal(!deleteModal);
    setRefreshList(!refreshList);
    setChecked([]);
  };

  const handleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const handleEditButton = () => {
    setEditModal(!editModal);

    table.data.tableValues.forEach((value) => {
      if (value.pkid == checked[0]) {
        console.log(value);
        setEditValues(value);
      }
    });
  };

  const handleEditModal = () => {
    setEditModal(!editModal);
  };

  const saveEditModal = () => {
    const editRowData = new Object({
      TableName: tableName,
      User: value.Username,
      editValues,
    });
    editRow(editRowData);
    setEditModal(!editModal);
    setRefreshList(!refreshList);
  };

  const handleDragStart = (e, columnName, columnValue) => {
    setDraggedColumnName(columnName);
    setColumnValue(columnValue);

    setUpdatedTable([...table.data.columns]);
  };

  const handleDrop = (e, columnName) => {
    updatedTable.forEach((value, i) => {
      if (value.column_name == draggedColumnName) {
        updatedTable.splice(i, 1);
        return;
      }
    });

    updatedTable.forEach((value, i) => {
      if (value.column_name == columnName) {
        updatedTable.splice(i + 1, 0, columnValue);
        return;
      }
    });

    setRefreshList(!refreshList);
    console.log(updatedTable);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleColumnButton = (columnName) => {
    console.log(columnName);
  };

  return (
    <div className="relative">
      <Navbar />
      <Sidebar />
      <div className="fixed top-0 pt-[60px] h-full w-full bg-gray-400">
        <div className="h-full ml-[12.8em]">
          <div className="absolute w-full bg-white p-3 flex">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 pr-3 
                      pl-2 rounded flex text-[15px]"
              onClick={newButton}
            >
              <AiOutlinePlus className="mt-[2px] mr-2 text-[18px]" />
              New
            </button>
            <button
              className={
                checked.length > 0
                  ? "ml-5 bg-red-500 hover:bg-red-700 text-white font-bold py-1 p-2 rounded flex text-[15px]"
                  : "hidden"
              }
              onClick={handleDeleteModal}
            >
              <AiOutlineDelete className="mt-[2px] mr-2 text-[18px]" />
              Delete
            </button>
            <button
              className={
                checked.length > 0
                  ? "ml-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 p-2 rounded flex text-[15px]"
                  : "hidden"
              }
              onClick={handleEditButton}
            >
              <AiOutlineEdit className="mt-[2px] mr-2 text-[18px]" />
              Edit
            </button>
          </div>
          <div className="pt-[55px] h-full w-full overflow-auto">
            <div className="h-full p-5 text-[12.5px]">
              <div className="inline-block p-5 mr-5 bg-white rounded-lg min-w-full min-h-full">
                {Object.keys(table).length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th className="border-2 p-2">
                          <input type="checkbox" onClick={handleCheckedAll} />
                        </th>
                        {Object.values(table.data.columns).map((object) => {
                          return (
                            <th
                              onDragStart={(e) =>
                                handleDragStart(e, object.column_name, object)
                              }
                              onDrop={(e) => handleDrop(e, object.column_name)}
                              onDragOver={(e) => handleDragOver(e)}
                              draggable
                              onClick={(e) =>
                                handleColumnButton(object.column_name)
                              }
                              key={object.column_name}
                              className={
                                object.column_name != "pkid"
                                  ? "border-2 min-w-[100px] text-left font-serif hover:bg-gray-200 hover:cursor-pointer "
                                  : "hidden"
                              }
                            >
                              <div className="p-2">{object.column_name}</div>
                            </th>
                          );
                        })}
                        <th
                          className="border-2 min-w-[130px] hover:bg-gray-200 hover:cursor-pointer"
                          onClick={addColumn}
                        >
                          <div className="font-serif flex px-2">
                            <AiOutlinePlus className="mt-[2px] mr-2 text-[14px]" />
                            New column
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(table.data.tableValues).map((values) => {
                        return (
                          <tr key={values.pkid}>
                            <td className="border-2 p-2 text-center">
                              <input
                                id="checkbox"
                                type="checkbox"
                                onClick={(e) => handleChecked(e, values.pkid)}
                              />
                            </td>
                            {Object.entries(values).map(([key, value], i) => {
                              return (
                                <td
                                  className={
                                    key != "pkid"
                                      ? "border-2 min-w-[100px]"
                                      : "hidden"
                                  }
                                  key={key}
                                >
                                  <div className="p-2">{value}</div>
                                </td>
                              );
                            })}
                            <th className="border-2 min-w-[100px]">
                              <div className=""></div>
                            </th>
                          </tr>
                        );
                      })}
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

      {/* Beginning Create New Row Modal ---New--- */}
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
                      key={object.column_name}
                      className={
                        object.column_name != "pkid"
                          ? "min-w-[100px] text-left"
                          : "hidden"
                      }
                    >
                      <div className="p-2 font-serif">{object.column_name}</div>
                      <input
                        className="border-2 p-1 rounded"
                        type={
                          dataTypes[object.data_type]
                            ? dataTypes[object.data_type].inputType
                            : ""
                        }
                        required
                        value={
                          insertValues[object.column_name]
                            ? insertValues[object.column_name]
                            : object.data_type == "timestamp without time zone"
                            ? dataTypes[object.data_type]
                            : ""
                        }
                        placeholder={
                          dataTypes[object.data_type]
                            ? dataTypes[object.data_type].value
                            : ""
                        }
                        onChange={(e) =>
                          setInsertValues((old) => ({
                            ...old,
                            [object.column_name]: e.target.value,
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
      {/* Ending Create New Row Modal ---New--- */}

      {/* Beginning Edit Row Modal ---Edit--- */}
      <div
        className={
          editModal
            ? "fixed w-full h-full z-40 top-0 left-0 pt-[59px]"
            : "hidden"
        }
      >
        <div className="w-full h-full right-0 bottom-0 z-50 bg-gray-500/50 flex justify-end">
          <div className="w-[40em] min-h-full bg-white overflow-y-auto">
            <div className="flex justify-between w-full p-2 border-b-2">
              <button
                className="hover:bg-gray-300 p-1 px-2 rounded"
                onClick={saveEditModal}
              >
                Save
              </button>
              <button
                className="text-lg p-2 hover:bg-gray-300 rounded-full transition ease-in-out"
                onClick={handleEditModal}
              >
                <AiOutlineClose />
              </button>
            </div>
            <div className="px-5 pb-10 ">
              {Object.keys(table).length > 0 ? (
                Object.values(table.data.columns).map((object) => {
                  return (
                    <div
                      key={object.column_name}
                      className={
                        object.column_name != "pkid"
                          ? "min-w-[100px] text-left"
                          : "hidden"
                      }
                    >
                      <div className="p-2 font-serif">{object.column_name}</div>
                      <input
                        className="border-2 p-1 rounded"
                        type={
                          dataTypes[object.data_type]
                            ? dataTypes[object.data_type].inputType
                            : ""
                        }
                        required
                        value={
                          editValues[object.column_name]
                            ? editValues[object.column_name]
                            : object.data_type == "timestamp without time zone"
                            ? dataTypes[object.data_type]
                            : ""
                        }
                        placeholder={
                          dataTypes[object.data_type]
                            ? dataTypes[object.data_type].value
                            : ""
                        }
                        onChange={(e) =>
                          setEditValues((old) => ({
                            ...old,
                            [object.column_name]: e.target.value,
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
      {/* Ending Edit Row Modal ---Edit--- */}

      {/* Beginning Add Column Modal ---Column--- */}
      <div
        className={
          addColumnModal
            ? "fixed w-full h-full z-40 top-0 left-0 pt-[59px]"
            : "hidden"
        }
      >
        <div className="w-full h-full right-0 bottom-0 z-50 bg-gray-500/50 flex justify-end">
          <div className="w-[40em] min-h-full bg-white overflow-y-auto">
            <div className="flex justify-between w-full p-2 border-b-2">
              <button
                className="hover:bg-gray-300 p-1 px-2 rounded"
                onClick={saveColumnInfo}
              >
                Save
              </button>
              <button
                className="text-lg p-2 hover:bg-gray-300 rounded-full transition ease-in-out"
                onClick={addColumn}
              >
                <AiOutlineClose />
              </button>
            </div>
            <div className="px-5 pb-10 ">
              <div>Name</div>
              <input
                type="text"
                className="border-2 w-[150px]"
                value={columnInfo["Name"]}
                onChange={(e) =>
                  setColumnInfo((old) => ({ ...old, Name: e.target.value }))
                }
              />
            </div>
            <div className="px-5 pb-10 ">
              <div>Type</div>
              <select
                id="Type"
                className="border-2 w-[150px]"
                onChange={(e) =>
                  setColumnInfo((old) => ({
                    ...old,
                    Type: e.target.value,
                  }))
                }
              >
                <option value="Number">Number</option>
                <option value="Text">Text</option>
                <option value="Date">Date</option>
                <option value="Choice">Choice</option>
                <option value="Lookup">Lookup</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Ending Add Column Modal ---Column--- */}

      {/* Beginning Delete Modal ---Delete--- */}
      <div
        className={
          deleteModal
            ? "fixed top-0 left-0 h-full w-full z-50 bg-gray-500/50 flex justify-center"
            : "hidden"
        }
      >
        <div className="mt-[100px] h-[15em] w-[30em] bg-white rounded-[40px] p-5 text-center shadow-lg">
          <div className="">
            <div className="text-red text-center">
              <div className="text-[40px] flex justify-center py-3">
                <AiFillWarning className="" />
              </div>
            </div>
            <div className="font-bold text-[20px] font-serif">
              Are you sure you want to delete it ?
            </div>
            <div className="pt-10">
              <button
                className="mr-2 p-2 bg-red-500 hover:bg-red-700 rounded-lg font-bold text-white"
                onClick={handleDeleteButton}
              >
                Delete
              </button>
              <button
                className="ml-2 p-2 bg-blue-500 hover:bg-blue-700 rounded-lg font-bold text-white"
                onClick={handleDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Ending Delete Modal ---Delete---*/}
    </div>
  );
};

export default List;
