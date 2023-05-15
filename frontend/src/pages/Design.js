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
        margin: "",
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
        margin: "",
      },
    ],
  });

  useEffect(() => {
    HtmlRenderFunction(jsonValue, setChangeJson);
    return () => {};
  }, [jsonValue]);

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
    console.log(e.target.value);
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

  return (
    <div>
      <Navbar />
      <div className="fixed left-[10px] mt-[10px] w-[50px] bg-[rgba(53,54,66,.9825)] rounded-lg text-[30px] z-50">
        <div className="p-3 text-[28px]">
          <ImPlus className="text-gray-300 rounded-full hover:text-white hover:cursor-pointer" />
        </div>
        <div className="p-3 text-[28px]">
          <FaArrowLeft className="text-gray-300 rounded-full hover:text-white hover:cursor-pointer" />
        </div>
        <div className="p-3 text-[28px]">
          <FaArrowRight className="text-gray-300  rounded-full hover:text-white hover:cursor-pointer" />
        </div>
        <div className="p-3 text-[28px]">
          <BsFillDatabaseFill className="text-gray-300  rounded-full hover:text-white hover:cursor-pointer" />
        </div>
        <div className="p-3 text-[28px]">
          <GiHamburgerMenu className="text-gray-300  rounded-full hover:text-white hover:cursor-pointer" />
        </div>
      </div>
      <div
        id="EditContainer"
        className="fixed flex justify-center bg-gray-300/50 w-full h-full z-10 text-black"
        onClick={(e) => clickedElement(e)}
      ></div>
      {/* Edit modal Begins here*/}
      {elementName.name !== undefined ? (
        <div className="fixed right-0 h-full w-[22em] bg-[rgba(53,54,66,.9825)] z-50">
          <div className="text-white">
            <h1 className="px-5 py-3 border-b-2 border-black text-lg">
              {elementName.values.name}
            </h1>
            <div className="pt-5 px-5">
              <div className="pb-2 flex">
                <div
                  className="w-[20px] h-[20px] border-2 mr-2"
                  style={{ background: elementName.values.background_color }}
                ></div>
                <div className="">Background</div>
              </div>
              <input
                id="background_color"
                className="bg-black mr-5 rounded px-1 w-[180px]"
                value={elementName.values.background_color}
                onChange={updateElementsValues}
              />
              <PickColor updateElementsValues={updateElementsValues} />
            </div>
            <div className="px-5 pt-3">
              <div className="flex justify-between">
                <div>Height</div>
                <input
                  id="height"
                  className="mr-5 rounded px-1 w-[50px] bg-transparent"
                  value={elementName.values.height}
                  onChange={updateElementsValues}
                />
              </div>
              <div>
                <input
                  id="height"
                  type="range"
                  max={1000}
                  className="mr-5 rounded px-1 w-full "
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
                className="mr-5 rounded px-1 w-full "
                value={elementName.values.width}
                onChange={updateElementsValues}
              />
              <div>
                <div>Margin</div>
                <input
                  id="margin"
                  type="range"
                  value={elementName.values.margin}
                  onChange={updateElementsValues}
                />
              </div>
              <div>
                <div>Border</div>
                <input />
              </div>
              <div>
                <div>Padding</div>
                <input />
              </div>
              <div>
                <div>padding</div>
                <input />
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* Edit modal Ends here*/}
    </div>
  );
};

// parent: "EditContainer",
// type: "div",
// name: "Page",
// height: "500px",
// width: "500px",
// background_color: "white",
// padding: "10px",
// border: "",
// text: "testing ",
// position: "",
// display: "",

export default Design;
