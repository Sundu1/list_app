import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { RiFileList3Line } from "react-icons/ri";
import { getTableList, getDesignList } from "../model/Get";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { json, useNavigate } from "react-router-dom";
import { UserContext } from "../components/LoginProvider";
import { insertNewTable, createNewDesign } from "../model/Post";

const DesignList = () => {
  const { value, setValue } = useContext(UserContext);
  const [tableList, setTableList] = useState([]);
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

  const handleNavigateDesign = (e) =>{
    const designName = e.target.id
    navigate(`/design/${designName}`)
    localStorage.setItem(`design-jsonvalue-${designName}`, e.target.dataset.jsonvalue)
    localStorage.setItem(`design-valuecounts-${designName}`, e.target.dataset.valuecounts)
  }

  return (
    <div className="relative">
      <Navbar />
      <Sidebar />
      <div className="fixed h-full w-full overflow-y-scroll flex justify-center">
        <div className="pl-[250px] pt-10 h-full w-[70em] flex flex-wrap gap-[50px]">
          <div
            className="h-[200px] w-[250px] bg-trasparent rounded-lg border-2 border-dashed border-black 
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
          {
            tableList.length > 0 ? 
              tableList.map(design =>{
                return (
                  <div
                  className="h-[200px] w-[250px] bg-trasparent rounded-lg border-2 border-black 
                            flex justify-center items-center hover:cursor-pointer hover:bg-[#5A5A5A] transition ease-in"
                  id={design.designname}
                  data-jsonvalue={
                    JSON.stringify(design.jsonvalue)
                  }
                  data-valuecounts={
                    JSON.stringify(design.valuecounts)
                  }
                  onClick={handleNavigateDesign}
                  key={design.designname}
                  >
                    <div className="pointer-events-none">
                      {design.designname}
                    </div>
                  </div>
                )
              })
              : null
          }
        </div>
      </div>
    </div>
  );
};

export default DesignList;
