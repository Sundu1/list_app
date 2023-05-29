import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { RiFileList3Line } from "react-icons/ri";
import { getTableList, getDesignList } from "../model/Get";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/LoginProvider";
import { insertNewTable, createNewDesign } from "../model/Post";

const DesignList = () => {
  const { value, setValue } = useContext(UserContext);
  const [tableList, setTableList] = useState([]);
  const [designName, setDesignName] = useState("");
  const [refreshList, setRefreshList] = useState(false);

  const [selectButton, setSelectButton] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (value.Username != undefined) {
      getDesignList(setTableList, value.Username);
    }
    return () => {};
  }, [value.Username, refreshList]);

  const handleSelectClick = () => {
    navigate(`/design/newDesign`);
  };

  return (
    <div className="relative">
      <Navbar />
      <Sidebar />
      <div className="fixed h-full w-full overflow-y-scroll">
        <div className="pl-[250px] pt-10 h-full w-full grid grid-cols-3 gap-5">
          <div
            className="h-[200px] w-[300px] bg-trasparent rounded-lg border-2 border-dashed border-black 
                       flex justify-center items-center hover:cursor-pointer hover:bg-[#5A5A5A] transition ease-in"
            onMouseOver={() => {
              setSelectButton(true);
            }}
            onMouseOut={() => {
              setSelectButton(false);
            }}
            onClick={handleSelectClick}
          >
            {selectButton ? (
              <div className="text-white h-[40px] w-[90px] bg-[#136565] rounded-lg text-center pt-1.5">
                Select
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignList;
