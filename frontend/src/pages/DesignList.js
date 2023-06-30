import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { RiFileList3Line } from "react-icons/ri";
import { getTableList, getDesignList } from "../model/Get";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { json, useNavigate } from "react-router-dom";
import { LoginProvider, UserContext } from "../components/LoginProvider";
import { insertNewTable, createNewDesign } from "../model/Post";
import { DeleteDesign } from "../model/Delete";

import { BASE_URL } from "../model/config.js";

const DesignList = () => {
  const { value, setValue } = useContext(UserContext);
  const [tableList, setTableList] = useState([]);
  const [refreshList, setRefreshList] = useState(false);
  const [selectButton, setSelectButton] = useState({id: "", isActive: false});
  const [deleteModal, setDeleteModal] = useState({id: "", isActive: false})

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

  const handleDeleteDesign = (e) =>{
    const deleteDesignInfo = new Object({
      user: value,
      designName: deleteModal.id
    })
    DeleteDesign(deleteDesignInfo)
  }

  return (
    <div className="relative">
      <Navbar />
      <Sidebar />
      <div className="fixed w-full overflow-y-scroll flex justify-center">
        <div className="pl-[250px] pt-10 w-full flex flex-wrap gap-[50px]">
          <div
            id="new"
            className="h-[200px] w-[320px] bg-trasparent rounded-lg border-2 border-dashed border-black 
                       flex justify-center items-center hover:cursor-pointer hover:bg-[#5A5A5A] transition ease-in"
            onMouseOver={(e) => {
              setSelectButton({name: "new", isActive: true});
            }}
            onMouseOut={(e) => {
              setSelectButton({name: "", isActive: false});
            }}
            onClick={handleSelectClick}
          >
            {selectButton.name == "new" && selectButton.isActive == true ? (
              <div className="text-white h-[40px] w-[90px] bg-[#136565] rounded-lg text-center pt-1.5">
                Select
              </div>
            ) : null}
          </div>
          {
            tableList.length > 0 ? 
              tableList.map(design =>{
                return (
                  <div className="relative rounded-lg border-2 border-black
                                  bg-black hover:cursor-pointer 
                                  design_list_hover"
                      key={design.designname}
                      onMouseOver={() => {
                        setSelectButton({name: design.designname, isActive: true});
                      }}
                      onMouseOut={() => {
                        setSelectButton({name: "", isActive: false});
                      }}
                   >
                    <img
                    className="h-[200px] w-[320px] rounded-lg
                                pointer-events-none
                                design_list_img
                                "
                    src={`${BASE_URL}/images/${design.screenshotimg}`}
                    />
                    {
                      selectButton.name == design.designname && selectButton.isActive == true ? (
                        <div className="absolute 
                                        top-[50%] transform translate-y-[-50%] 
                                        left-[50%] transform translate-x-[-50%]
                                        flex justify-center gap-4
                                        ">
                          <div className="
                                            text-white h-[40px] w-[90px] bg-[#136565] 
                                            rounded-lg text-center pt-1.5
                                            " 
                              onClick={handleNavigateDesign}
                              key={design.designname}
                              id={design.designname}
                              data-jsonvalue={
                                JSON.stringify(design.jsonvalue)
                              }
                              data-valuecounts={
                                JSON.stringify(design.valuecounts)
                              }
                          > 
                            Select
                          </div>
                          <div className="
                                        text-white h-[40px] w-[90px] bg-[#ff3333] 
                                        rounded-lg text-center pt-1.5
                                        " 
                              id={design.designname}
                              onClick={() => setDeleteModal({id: design.designname, isActive: true})}
                          > 
                            Delete
                          </div>
                        </div>
                      ) : null
                    }
                  </div>
                )
              })
              : null
          }
        </div>
      </div>
      {/* Delete Begin Modal */}
      {
        deleteModal && deleteModal.isActive ? 
          <div className="fixed top-0 left-0 h-full w-full bg-black z-50 bg-opacity-80 flex justify-center items-center">
            <div className="h-[15em] w-[25em] bg-white rounded-lg text-center flex justify-center items-center">
              <div className="">
                <div className="flex justify-center pb-5"> 
                  <svg height="80px" 
                      width="80px"
                      version="1.1" 
                      id="_x32_" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 512 512"  
                      fill="red"
                      >
                  <g>
                    <path className="st0" d="M437.014,74.978C390.77,28.696,326.608-0.014,256,0C185.393-0.014,121.222,28.696,74.977,74.978
                      C28.696,121.222-0.015,185.392,0,256c-0.015,70.608,28.696,134.778,74.977,181.022C121.222,483.304,185.393,512.015,256,512
                      c70.608,0.015,134.77-28.696,181.014-74.978c46.289-46.244,75-110.414,74.986-181.022
                      C512.014,185.392,483.304,121.222,437.014,74.978z M399.474,112.526c36.763,36.799,59.414,87.355,59.43,143.474
                      c-0.015,56.118-22.667,106.674-59.43,143.474c-36.807,36.763-87.363,59.416-143.474,59.43
                      c-56.119-0.014-106.674-22.667-143.474-59.43C75.762,362.674,53.111,312.118,53.096,256
                      c0.014-56.118,22.666-106.674,59.429-143.474c36.8-36.763,87.356-59.415,143.474-59.43
                      C312.111,53.112,362.667,75.763,399.474,112.526z"/>
                    <path className="st0" d="M246.681,303.592c0.312,2.075,1.349,4.067,3.104,5.986c1.748,1.911,3.822,2.866,6.215,2.866
                      c5.57,0,8.681-2.948,9.311-8.852l18.644-143.214c0.311-2.533,0.474-6.126,0.474-10.748c0-7.17-2.466-13.689-7.4-19.593
                      c-4.94-5.889-11.948-8.837-21.029-8.837c-9.415,0-16.496,3.022-21.266,9.066c-4.778,5.904-7.171,12.356-7.171,19.364
                      c0,4.31,0.156,7.888,0.474,10.748L246.681,303.592z"/>
                    <path className="st0" d="M256,390.792c8.118,0,14.962-2.778,20.548-8.362c5.57-5.563,8.356-12.422,8.356-20.541
                      c0-8.126-2.785-14.978-8.356-20.556c-5.414-5.422-12.266-8.126-20.548-8.126c-8.118,0-14.971,2.8-20.556,8.364
                      c-5.578,5.585-8.356,12.348-8.356,20.318c0,7.637,2.778,14.407,8.356,20.303C241.029,387.934,247.882,390.792,256,390.792z"/>
                  </g>
                  </svg>
                </div>
                <p className="pb-[10px]">You sure, you really wanna delete this web design ?</p>
                <button className="mx-3 text-white h-[40px] w-[90px] bg-[#ff3333] 
                                  rounded-lg text-center
                                  hover:bg-opacity-[0.8]
                                  "
                  onClick={handleDeleteDesign}
                        >
                  Delete
                </button>
                <button className="mx-3 text-white h-[40px] w-[90px] bg-[#136565] 
                                  rounded-lg text-center
                                  hover:bg-opacity-[0.8]
                                  "
                  onClick={() => setDeleteModal({id : "", isActive : false})}                  
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          : null }
      {/* Delete End Modal */}
    </div>
  );
};

export default DesignList;
