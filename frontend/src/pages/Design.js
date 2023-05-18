import React, { useState, useEffect, useContext, useRef } from "react";
import { json, useParams } from "react-router-dom";
import { LoginProvider, UserContext } from "../components/LoginProvider";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { ImPlus } from "react-icons/im";
import { BsFillDatabaseFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import HtmlRenderFunction from "../components/HtmlRenderFunction";
import PickColor from "../components/PickColor";

const Design = () => {
  const { designTable } = useParams();
  const { value, setValue } = useContext(UserContext);

  const [changeJson, setChangeJson] = useState({ isClicked: false });
  const [elementName, setElementName] = useState({
    name: undefined,
    values: {},
  });

  const [colorUpdate, setColorUpdate] = useState({});
  const [isAddElement, setIsAddElement] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [jsonValue, setJsonValue] = useState({
    elements: [
      {
        parent: "EditContainer",
        type: "div",
        name: "Page",
        height: "500",
        width: "500",
        background_color: "white",
        padding: "10px",
        border: "",
        text: "testing ",
        position: "",
        display: "",
        margin_top: "0",
        margin_left: "0",
        margin_right: "0",
        margin_bottom: "0",
      },
      {
        parent: "Page",
        type: "div",
        name: "container",
        height: "100",
        width: "100",
        background_color: "black",
        padding: "10px",
        border: "",
        text: "testing ",
        position: "",
        display: "",
        margin_top: "0",
        margin_left: "0",
        margin_right: "0",
        margin_bottom: "0",
      },
    ],
  });

  const refAddElement = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        isAddElement &&
        refAddElement.current &&
        !refAddElement.current.contains(e.target) &&
        e.target.id !== "test"
      ) {
        setIsAddElement(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isAddElement]);

  useEffect(() => {
    HtmlRenderFunction(jsonValue, setChangeJson);
    return () => {};
  }, [jsonValue, refresh]);

  useEffect(() => {
    if (colorUpdate.target) {
      updateElementsValues(colorUpdate);
    }
  }, [colorUpdate]);

  const clickedElement = (e) => {
    const changeName = changeJson.name;
    let newValues = {};

    if (e.target.id == elementName.name) {
      if (changeJson.isClicked !== false && jsonValue && jsonValue.elements) {
        const newState = jsonValue.elements.map((element) => {
          if (element.name == changeName) {
            return { ...element, border: "" };
          }
          return { ...element, border: "" };
        });
        setChangeJson((old) => ({ ...old, isClicked: false }));
        setJsonValue({ elements: newState });
        setElementName({ name: undefined, values: {} });
      }
      return;
    }

    if (changeJson.isClicked !== false && jsonValue && jsonValue.elements) {
      const newState = jsonValue.elements.map((element) => {
        if (element.name == changeName) {
          newValues = { ...element, border: "2px red solid" };
          return newValues;
        }
        return { ...element, border: "" };
      });
      setChangeJson((old) => ({ ...old, isClicked: false }));
      setJsonValue({ elements: newState });
      setElementName({ name: changeName, values: newValues });
    }
  };

  const updateElementsValues = (e) => {
    if (e.target.id) {
      setElementName((old) => ({
        ...old,
        values: { ...old.values, [e.target.id]: e.target.value },
      }));
    }

    const newState = jsonValue.elements.map((element) => {
      if (element.name == elementName.name) {
        return { ...elementName.values, [e.target.id]: e.target.value };
      }
      return { ...element };
    });
    setJsonValue({ elements: newState });
  };

  const handleAddElement = () => {
    setIsAddElement(!isAddElement);
  };

  const addNewElement = (e) => {
    if (e.target.id == "container") {
      const newElement = new Object({
        parent: "Page",
        type: "div",
        name: "container",
        height: "1000",
        width: "100",
        background_color: "green",
        padding: "10px",
        border: "",
        text: "testing ",
        position: "",
        display: "",
        margin_top: "0",
        margin_left: "0",
        margin_right: "0",
        margin_bottom: "0",
      });
      // jsonValue.elements.push(newElement);
      setJsonValue((old) => ({
        elements: [...old.elements, newElement],
      }));
    }
  };

  console.log(jsonValue);

  return (
    <div>
      <Navbar />
      <div
        className="fixed left-[10px] mt-[10px] w-[50px] bg-[rgba(53,54,66,.9825)] 
                        rounded-lg text-[30px] z-50"
      >
        <div className="text-[28px] h-[50px]">
          <svg
            className="block hover:icon_style h-full w-full text-center"
            viewBox="-13 0 50 30"
          >
            <path
              id="test"
              onClick={handleAddElement}
              className="fill-white scale-[1.5] hover:scale-[1.8] hover:fill-gray-500 hover:cursor-pointer
                         filter drop-shadow"
              d="M15.5 6h-5.5v-5.5c0-0.276-0.224-0.5-0.5-0.5h-3c-0.276 
                0-0.5 0.224-0.5 0.5v5.5h-5.5c-0.276 0-0.5 0.224-0.5 
                0.5v3c0 0.276 0.224 0.5 0.5 0.5h5.5v5.5c0 0.276 0.224 
                0.5 0.5 0.5h3c0.276 0 0.5-0.224 0.5-0.5v-5.5h5.5c0.276 
                0 0.5-0.224 0.5-0.5v-3c0-0.276-0.224-0.5-0.5-0.5z"
            ></path>
          </svg>
        </div>
        <div className="p-3 text-[28px]">
          <FaArrowLeft className="design_icon" />
        </div>
        <div className="p-3 text-[28px]">
          <FaArrowRight className="design_icon" />
        </div>
        <div className="p-3 text-[28px]">
          <BsFillDatabaseFill className="design_icon" />
        </div>
        <div className="p-3 text-[28px]">
          <GiHamburgerMenu className="design_icon" />
        </div>
      </div>
      <div
        id="EditContainer"
        className="fixed flex justify-center bg-gray-300/50 w-full h-full z-10 text-black"
        onClick={(e) => clickedElement(e)}
      ></div>
      {/* Edit modal Begins here*/}
      {elementName.name !== undefined ? (
        <div className="fixed right-0 h-full w-[22em] bg-[rgba(53,54,66,.9825)] z-50 overflow-auto">
          <div className="text-white">
            <h1 className="px-5 py-3 border-b-2 border-black text-lg">
              {elementName.values.name}
            </h1>
            <div className="pt-5 px-10 h-full">
              <div className="pb-2 flex">
                <div
                  className="w-[20px] h-[20px] border-2 mr-2"
                  style={{ background: elementName.values.background_color }}
                ></div>
                <div className="">Background</div>
              </div>
              <input
                id="background_color"
                className="bg-black mr-5 rounded-t-[6px] px-1 w-[184px] border-2 border-b-0 border-[#3071a9]"
                value={elementName.values.background_color}
                onChange={updateElementsValues}
              />
              <PickColor setColorUpdate={setColorUpdate} />
            </div>
            <div className="px-10 pt-3 absolute h-full">
              <div className="flex justify-between">
                <div>Height</div>
                <input
                  id="height"
                  className="mr-5 rounded px-1 w-[50px] bg-transparent "
                  value={elementName.values.height}
                  onChange={updateElementsValues}
                />
              </div>
              <div>
                <input
                  id="height"
                  type="range"
                  max={1000}
                  className="slider_style"
                  value={elementName.values.height}
                  onChange={updateElementsValues}
                />
              </div>
              <div className="flex justify-between">
                <div>width</div>
                <input
                  id="width"
                  className="mr-5 rounded px-1 w-[50px] bg-transparent"
                  value={elementName.values.width}
                  onChange={updateElementsValues}
                />
              </div>
              <input
                id="width"
                type="range"
                max={1000}
                className="slider_style"
                value={elementName.values.width}
                onChange={updateElementsValues}
              />
              <div className="pt-5">
                <div className="pb-5">Spacing</div>
                <div className="grid h-[120px] w-[224px] grid-cols-[36px_1fr_36px] grid-rows-[24px_minmax(16px,_1fr)_24px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={224}
                    height={120}
                    className="bg-[#3071a9]"
                  >
                    <text>sdfsdfsd</text>
                    <path
                      className="fill-gray-600/90 hover:fill-gray-500/90"
                      d="
                    m1,1
                    h223
                    l-36,24
                    h-151
                    l-36,-24z
                       "
                    ></path>
                    <path
                      className="fill-gray-600 hover:fill-gray-500"
                      d="
                    m223,1
                    v119
                    l-36,-24
                    v-71
                    l36,-24z
                       "
                    ></path>
                    <path
                      className="fill-gray-600 hover:fill-gray-500"
                      d="
                    m1,1
                    v119
                    l36,-24
                    v-71
                    l-36,-24z
                       "
                    ></path>
                    <path
                      className="fill-gray-600/90 hover:fill-gray-500/90"
                      d="
                    m1,119
                    h223
                    l-36,-24
                    h-151
                    l-36,24z
                       "
                    ></path>
                  </svg>
                  <div className="text-black col-start-2 row-start-2 pt-1 pl-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={144}
                      height={64}
                    >
                      <path
                        className="fill-gray-600/90 hover:fill-gray-600/80"
                        d="
                        m1,1
                        h143
                        l-36,24
                        h-71
                        l-36,-24z
                      "
                      ></path>
                      <path
                        className="fill-gray-600 hover:fill-gray-500"
                        d="
                        m1,1
                        v63
                        l36,-24
                        v-15
                        l-36,-24z
                      "
                      ></path>
                      <path
                        className="fill-gray-600 hover:fill-gray-500"
                        d="
                        m143,1
                        v63
                        l-36,-24
                        v-15
                        l36,-24z
                      "
                      ></path>

                      <path
                        className="fill-gray-600/90 hover:fill-gray-600/80"
                        d="
                        m1,63
                        h143
                        l-36,-24
                        h-71
                        l-36,24z
                      "
                      ></path>
                    </svg>
                  </div>
                  <div className="col-start-0 col-end-0 text-center">
                    <input
                      id="margin_top"
                      type="number"
                      className="margin_webkit"
                      value={elementName.values.margin_top}
                      onChange={updateElementsValues}
                    />
                  </div>
                  <div className="col-start-1 col-end-1 text-center pt-[50%]">
                    <input
                      id="margin_left"
                      type="number"
                      className="margin_webkit"
                      value={elementName.values.margin_left}
                      onChange={updateElementsValues}
                    />
                  </div>
                  <div className="col-start-3 col-end-0 text-center pt-[50%]">
                    <input
                      id="margin_right"
                      type="number"
                      className="margin_webkit"
                      value={elementName.values.margin_right}
                      onChange={updateElementsValues}
                    />
                  </div>
                  <div className="col-start-3 col-end-2 text-center">
                    <input
                      id="margin_bottom"
                      type="number"
                      className="margin_webkit"
                      value={elementName.values.margin_bottom}
                      onChange={updateElementsValues}
                    />
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg"></svg>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* Edit modal Ends here*/}
      {/* New element Beginning here */}

      {isAddElement ? (
        <div
          ref={refAddElement}
          className="fixed mt-[10px] left-[70px] rounded-lg w-[15em] h-[20em] z-50
                   bg-[rgba(53,54,66,.9825)] 
      "
        >
          <div className="grid grid-cols-2 gap-y-[10px] gap-x-[30px] pt-5 px-5 text-white">
            <div
              className="design_new_elements"
              id="container"
              onClick={addNewElement}
            >
              Container
            </div>
            <div className="design_new_elements">Text</div>
            <div className="design_new_elements">Image</div>
            <div className="design_new_elements">Video</div>
            <div className="design_new_elements">Icons</div>
            <div className="design_new_elements">Buttons</div>
          </div>
        </div>
      ) : null}

      {/* New element Ending here */}
    </div>
  );
};

export default Design;
