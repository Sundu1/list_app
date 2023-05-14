import React, { useState, useEffect, useContext, useRef } from "react";
import { json, useParams } from "react-router-dom";
import { UserContext } from "../components/LoginProvider";

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
        height: "500px",
        width: "500px",
        background_color: "white",
        padding: "10px",
        border: "",
        text: "testing ",
        position: "",
        display: "",
      },
      {
        parent: "Page",
        type: "div",
        name: "container",
        height: "100px",
        width: "100px",
        background_color: "black",
        padding: "10px",
        border: "",
        text: "testing ",
        position: "",
        display: "",
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
    if (e.target.id) {
      setElementName((old) => ({
        ...old,
        values: (old) => ({
          ...old,
          [e.target.id]: elementName.values[e.target.id],
        }),
      }));
    }

    console.log(elementName);

    let newValues;
    const newState = jsonValue.elements.map((element) => {
      if (element.name == elementName.name) {
        newValues = {
          ...element,
          [e.target.id]: elementName.values[e.target.id],
        };
        return newValues;
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
                  style={{ background: elementName.background_color }}
                ></div>
                <div className="">Background</div>
              </div>
              <input
                className="bg-black mr-5 rounded px-1 w-[180px]"
                value={elementName.background_color}
              />
              <PickColor setElementName={setElementName} />
            </div>
            <div className="px-5 grid grid-cols-2">
              <div>Height</div>
              <div>width</div>
              <input
                id="height"
                className="bg-black mr-5 rounded px-1"
                value={elementName.values.height}
                onChange={updateElementsValues}
              />
              <input
                id="width"
                className="bg-black mr-5 rounded px-1"
                value={elementName.values.width}
                onChange={updateElementsValues}
              />
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
// height: "100%",
// width: "500px",
// background_color: "white",
// padding: "10px",
// border: "",
// text: "testing ",
// position: "",
// display: "",
export default Design;
