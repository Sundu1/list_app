import React, { useState, useEffect, useContext, useRef } from "react";
import { json, useParams } from "react-router-dom";
import { LoginProvider, UserContext } from "../components/LoginProvider";

import Navbar from "../components/Navbar";

import { BsFillDatabaseFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import HtmlRenderFunction from "../components/HtmlRenderFunction";
import PickColor from "../components/PickColor";

const Design = () => {
  const { designTable } = useParams();
  const { value, setValue } = useContext(UserContext);

  const [newCount, setNewCount] = useState(1);

  const [changeJson, setChangeJson] = useState({
    name: undefined,
    values: {},
    isChanged: false,
  });

  const [colorUpdate, setColorUpdate] = useState({});
  const [isAddElement, setIsAddElement] = useState(false);
  const [jsonValue, setJsonValue] = useState({
    elements: [
      {
        type: "background",
        id: "Background",
        height: "100%",
        width: "100%",
        position: "fixed",
        background_style_type: "color",
        background_style_types: {
          color: { background_color: "white" },
          gradient: [
            {
              color: "rgba(2,0,36,1)",
              percentage: "0",
            },
            {
              color: "rgba(67,9,121,1)",
              percentage: "35",
            },
            {
              color: "rgba(0,212,255,1)",
              percentage: "100",
            },
          ],
          image: "",
          video: "",
        },
        children: [
          {
            type: "page",
            id: "Page",
            height: "500",
            width: "500",
            position_div: "relative",
            position: "center",
            background_color: "rgb(220,220,220)",
            padding: "10px",
            border: "2px solid black",
            text: "testing ",
            display: "",
            margin_top: "0",
            margin_left: "0",
            margin_right: "0",
            margin_bottom: "0",
            padding_top: "0",
            padding_left: "0",
            padding_right: "0",
            padding_bottom: "0",
            children: [],
          },
        ],
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
    HtmlRenderFunction(
      jsonValue,
      setChangeJson,
      handleDragStart,
      handleDragOver,
      handleDrop
    );
    return () => {};
  }, [jsonValue]);

  useEffect(() => {
    if (colorUpdate.target) {
      if (changeJson.values.type == "background") {
        updateBackGround(colorUpdate);
      } else {
        updateElementsValues(colorUpdate);
      }
    }
  }, [colorUpdate]);

  const clickedElement = (e) => {
    if (changeJson.isClicked !== false && jsonValue && jsonValue.elements) {
      const matchAndUpdate = (changeJson, children) => {
        return children.map((_child) => {
          if (changeJson.id === _child.id) {
            return {
              ...changeJson,
              border: "2px solid red",
              children:
                _child.children && Array.isArray(_child.children)
                  ? matchAndUpdate(changeJson, _child.children)
                  : null,
            };
          } else {
            return {
              ..._child,
              border: "",
              children:
                _child.children && Array.isArray(_child.children)
                  ? matchAndUpdate(changeJson, _child.children)
                  : null,
            };
          }
        });
      };

      const newState = matchAndUpdate(changeJson.values, jsonValue.elements);
      setChangeJson((old) => ({ ...old, isChanged: false }));
      setJsonValue({ elements: newState });
    }
  };

  const updateElementsValues = (e) => {
    if (e.target.id) {
      const matchAndUpdate = (values, changeJson, children) => {
        return children.map((_child) => {
          if (changeJson.id === _child.id) {
            return {
              ...changeJson,
              [values.id]: values.value,
              children:
                _child.children && Array.isArray(_child.children)
                  ? matchAndUpdate(values, changeJson, _child.children)
                  : null,
            };
          } else {
            return {
              ..._child,
              children:
                _child.children && Array.isArray(_child.children)
                  ? matchAndUpdate(values, changeJson, _child.children)
                  : null,
            };
          }
        });
      };
      const newState = matchAndUpdate(
        e.target,
        changeJson.values,
        jsonValue.elements
      );

      setChangeJson((old) => ({
        ...old,
        values: { ...old.values, [e.target.id]: e.target.value },
      }));

      setJsonValue({ elements: newState });
    }
  };

  const handleAddElement = () => {
    setIsAddElement(!isAddElement);
  };

  const matchAndAdd = (elements, parent, newElementValue) => {
    return elements.map((ele) => {
      if (ele.id == parent) {
        return {
          ...ele,
          children: [...ele.children, newElementValue],
        };
      } else {
        return {
          ...ele,
          children: matchAndAdd(ele.children, parent, newElementValue),
        };
      }
    });
  };

  const matchAndDelete = (elements, deleteElement) => {
    const removeRecursive = (obj) => {
      if (obj.id === deleteElement.id) return null;

      if (obj.children && Array.isArray(obj.children)) {
        const updatedChildren = obj.children.map((child) =>
          removeRecursive(child)
        );
        obj.children = updatedChildren.filter((child) => child !== null);
      }
      return obj;
    };
    return new Array(removeRecursive(elements[0]));
  };

  const addNewElement = (e) => {
    if (e.target.id == "container_element") {
      const newElement = new Object({
        type: "container",
        id: `Container-${newCount}`,
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
        padding_top: "0",
        padding_left: "0",
        padding_right: "0",
        padding_bottom: "0",
        children: [],
      });

      const addedElement = matchAndAdd(
        jsonValue.elements,
        changeJson.values.id ? changeJson.values.id : "Page",
        newElement
      );
      setJsonValue({ elements: addedElement });
    }

    setNewCount(newCount + 1);
  };

  const css_font_family = [
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
    "system-ui",
    "ui-serif",
    "ui-sans-serif",
    "ui-monospace",
    "ui-rounded",
    "emoji",
    "math",
    "fangsong",
  ];

  // const markdownParser = (text) => {
  //   const toHTML = text
  //     .replace(/^###(.*$)/gim, "<h3>$1</h3>") // h3 tag
  //     .replace(/^##(.*$)/gim, "<h2>$1</h2>") // h2 tag
  //     .replace(/^#(.*$)/gim, "<h1>$1</h1>") // h1 tag
  //     .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>") // bold text
  //     .replace(/\*(.*)\*/gim, "<i>$1</i>"); // italic text
  //   return toHTML.trim(); // using trim method to remove whitespace
  // };

  const updateElementParent = (e) => {
    const newParentEle = e.target.id;
    const newEle = changeJson.values;

    if (newParentEle == newEle.id || newParentEle == "Background") return;

    const deletedState = matchAndDelete(jsonValue.elements, newEle);
    const newState = matchAndAdd(jsonValue.elements, newParentEle, newEle);
    setJsonValue({ elements: deletedState });
    setJsonValue({ elements: newState });
  };

  const handleDragStart = (e) => {};
  const handleDrop = (e) => {
    e.preventDefault();
    if (changeJson.values.id == "Page") return;
    updateElementParent(e);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDeleteElement = () => {
    const deletedState = matchAndDelete(jsonValue.elements, changeJson.values);
    setJsonValue({ elements: deletedState });
    setChangeJson((old) => ({ ...old, values: {} }));
  };

  const backgroundStyleOnChange = (e) => {
    // console.log("testing", e.target.value);
  };

  const updateBackGround = (e) => {
    if (e.target.id) {
      const matchAndUpdate = (values, changeJson, children) => {
        return children.map((_child) => {
          if (changeJson.id === _child.id) {
            return {
              ...changeJson,
              background_style_types: {
                ...changeJson.background_style_types,
                [changeJson.background_style_type]: {
                  [e.target.id]: e.target.value,
                },
              },
            };
          } else {
            return {
              ..._child,
              children:
                _child.children && Array.isArray(_child.children)
                  ? matchAndUpdate(values, changeJson, _child.children)
                  : null,
            };
          }
        });
      };
      const newState = matchAndUpdate(
        e.target,
        changeJson.values,
        jsonValue.elements
      );

      setChangeJson((old) => ({
        ...old,
        values: {
          ...old.values,
          background_style_types: {
            ...old.values.background_style_types,
            [old.values.background_style_type]: {
              [e.target.id]: e.target.value,
            },
          },
        },
      }));
      setJsonValue({ elements: newState });

      console.log("newState", newState);
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="fixed left-[10px] mt-[10px] w-[50px] bg-[rgba(53,54,66,.9825)] 
                        rounded-lg text-[30px] z-50"
      >
        <div className="text-[28px] h-[50px]">
          <svg
            className="block h-full w-full text-center"
            viewBox="-13 0 50 30"
          >
            <path
              id="test"
              onClick={handleAddElement}
              className="fill-white scale-[1.5] hover:fill-gray-500 
                         hover:cursor-pointer filter drop-shadow"
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

      {/* EditContainer is where all new divs will append to */}

      <div
        id="EditContainer"
        className="fixed top-0 pt-[60px] flex justify-center bg-gray-300/50 w-full 
                   h-full text-black overflow-auto"
        onPointerDown={clickedElement}
      ></div>

      {/* Edit modal Begins here*/}

      {/* Container beginning */}
      {changeJson.values && changeJson.values.type == "container" ? (
        <div
          className="fixed right-0 h-full w-[22em] bg-[rgba(53,54,66,.9825)]
                           z-50 overflow-auto"
        >
          <div className="text-white">
            <h1
              className="px-5 py-3 border-b-2 border-black text-lg flex 
                            justify-between items-center"
            >
              {changeJson.values.id}
              <div
                className="p-2 bg-[rgba(71,73,88,.475)] rounded-lg 
                              hover:bg-gray-900/90 hover:cursor-pointer"
                onClick={handleDeleteElement}
              >
                Delete
              </div>
            </h1>
            <div className="pt-5 px-10 h-full">
              Display
              <div className="pt-2">
                <select
                  id="display"
                  className="bg-[rgba(71,73,88,.475)] rounded w-full p-2"
                  value={changeJson.values.display}
                  onChange={updateElementsValues}
                >
                  <option value="flex" className="bg-[rgba(53,54,66,.9825)]">
                    Flex
                  </option>
                  <option value="Block" className="bg-[rgba(53,54,66,.9825)]">
                    Block
                  </option>
                  <option value="Inline" className="bg-[rgba(53,54,66,.9825)]">
                    Inline
                  </option>
                  <option value="Grid" className="bg-[rgba(53,54,66,.9825)]">
                    Grid
                  </option>
                  <option value="" className="bg-[rgba(53,54,66,.9825)]">
                    None
                  </option>
                </select>
              </div>
            </div>
            <div className="pt-5 px-10 h-full">
              <div className="pb-2 flex">
                <div
                  className="w-[20px] h-[20px] mr-2 mt-1 border-2 border-black rounded-sm"
                  style={{ background: changeJson.values.background_color }}
                ></div>
                <div className="">Background</div>
              </div>
              <input
                id="background_color"
                className="bg-[rgba(71,73,88,.475)] mr-5 rounded-t-[6px] p-2 w-full border-b-0"
                value={changeJson.values.background_color}
                onChange={updateElementsValues}
              />
              <PickColor setColorUpdate={setColorUpdate} test={changeJson} />
            </div>
            <div className="px-10 pt-3 absolute h-full">
              <div className="flex justify-between pt-3 pb-1">
                <div>Height</div>
                <input
                  id="height"
                  className="mr-5 rounded px-1 w-[50px] bg-transparent "
                  value={changeJson.values.height}
                  onChange={updateElementsValues}
                />
              </div>
              <div>
                <input
                  id="height"
                  type="range"
                  max={1000}
                  className="slider_style"
                  value={changeJson.values.height}
                  onChange={updateElementsValues}
                />
              </div>
              <div className="flex justify-between pt-3 pb-1">
                <div>Width</div>
                <input
                  id="width"
                  className="mr-5 rounded px-1 w-[50px] bg-transparent"
                  value={changeJson.values.width}
                  onChange={updateElementsValues}
                />
              </div>
              <input
                id="width"
                type="range"
                max={1000}
                className="slider_style"
                value={changeJson.values.width}
                onChange={updateElementsValues}
              />
              <div className="pt-5">
                <div className="pb-5">Spacing</div>
                <div className="grid h-[120px] w-[224px] grid-cols-[36px_1fr_36px] grid-rows-[24px_minmax(16px,_1fr)_24px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={224}
                    height={120}
                    className="bg-[rgba(53,54,66,.9825)]"
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
                      value={changeJson.values.margin_top}
                      onChange={updateElementsValues}
                    />
                  </div>
                  <div className="col-start-1 col-end-1 text-center pt-[50%]">
                    <input
                      id="margin_left"
                      type="number"
                      className="margin_webkit"
                      value={changeJson.values.margin_left}
                      onChange={updateElementsValues}
                    />
                  </div>
                  <div className="col-start-3 col-end-0 text-center pt-[50%]">
                    <input
                      id="margin_right"
                      type="number"
                      className="margin_webkit"
                      value={changeJson.values.margin_right}
                      onChange={updateElementsValues}
                    />
                  </div>
                  <div className="col-start-3 col-end-2 text-center">
                    <input
                      id="margin_bottom"
                      type="number"
                      className="margin_webkit"
                      value={changeJson.values.margin_bottom}
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
      {/* Container Ending */}

      {/* Text Beginning */}
      {changeJson.name !== undefined && changeJson.values.type == "text" ? (
        <div className="fixed right-0 h-full w-[22em] bg-[rgba(53,54,66,.9825)] z-50 overflow-auto">
          <div className="text-white h-full">
            <h1 className="px-5 py-3 border-b-2 border-black text-lg">
              {changeJson.values.id}
            </h1>
            <div className="pt-5 px-10">
              <div className="pb-2">Text</div>
              <textarea
                contentEditable
                suppressContentEditableWarning={true}
                id="text_value"
                className="bg-[rgba(71,73,88,.475)] p-2 rounded-lg inline-block w-full"
                value={changeJson.values.text_value}
                onChange={updateElementsValues}
              />
            </div>
            <div className="pt-5 px-10">
              <div className="pb-2">Font type</div>
              <select
                id="text_fontfamily"
                className="bg-[rgba(71,73,88,.475)] rounded p-2 w-full"
                value={changeJson.values.text_fontfamily}
                onChange={updateElementsValues}
              >
                {css_font_family.map((font) => {
                  return (
                    <option
                      value={font}
                      key={font}
                      className="bg-[rgba(53,54,66,.9825)]"
                    >
                      {font}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="pt-5 px-10">
              <div className="flex justify-between pb-2">
                <div>Text size</div>
                <input
                  id="text_size"
                  className="mr-5 rounded px-1 w-[50px] bg-transparent "
                  value={changeJson.values.text_size}
                  onChange={updateElementsValues}
                />
              </div>
              <input
                id="text_size"
                type="range"
                max={100}
                className="slider_style w-full"
                value={changeJson.values.text_size}
                onChange={updateElementsValues}
              />
            </div>
            <div className="pt-5 px-10 h-full">
              <div className="pb-2 flex">
                <div
                  className="w-[20px] h-[20px] mr-2 mt-1 border-2 border-black rounded-sm"
                  style={{ background: changeJson.values.text_color }}
                ></div>
                <div className="">Color</div>
              </div>
              <input
                id="text_color"
                className="bg-[rgba(71,73,88,.475)] mr-5 rounded-t-[6px] px-1 w-full border-b-0 p-2"
                value={changeJson.values.text_color}
                onChange={updateElementsValues}
              />
              <PickColor setColorUpdate={setColorUpdate} test={changeJson} />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* Text Ending */}

      {/* Background container Beginning */}

      {changeJson.values && changeJson.values.type == "background" ? (
        <div className="fixed right-0 h-full w-[22em] bg-[rgba(53,54,66,.9825)] z-50 overflow-auto">
          <div className="text-white h-full">
            <h1 className="px-5 py-3 border-b-2 border-black text-lg">
              {changeJson.values.id}
            </h1>
            <div className="pt-5 px-10">
              Style
              <div className="pt-2">
                <select
                  id="background_style_type"
                  className="bg-[rgba(71,73,88,.475)] rounded w-full p-2"
                  value={changeJson.values.background_style_type}
                  onChange={updateElementsValues}
                >
                  <option value="color" className="bg-[rgba(53,54,66,.9825)]">
                    Color
                  </option>
                  <option
                    value="gradient"
                    className="bg-[rgba(53,54,66,.9825)]"
                  >
                    Gradient
                  </option>
                  <option value="image" className="bg-[rgba(53,54,66,.9825)]">
                    Image
                  </option>
                  <option value="video" className="bg-[rgba(53,54,66,.9825)]">
                    Video
                  </option>
                </select>
              </div>
            </div>
            {changeJson.values.background_style_type == "color" ? (
              <div className="pt-5 px-10">
                <div className="pb-2 flex">
                  <div
                    className="w-[20px] h-[20px] mr-2 mt-1 border-2 border-black rounded-sm"
                    style={{
                      background:
                        changeJson.values.background_style_types[
                          changeJson.values.background_style_type
                        ].background_color,
                    }}
                  ></div>
                  <div className="">Color</div>
                </div>
                <input
                  id="background_color"
                  className="bg-[rgba(71,73,88,.475)] mr-5 rounded-t-[6px] px-1 w-full border-b-0 p-2"
                  value={
                    changeJson.values.background_style_types[
                      changeJson.values.background_style_type
                    ].background_color
                  }
                  onChange={updateBackGround}
                />
                <PickColor setColorUpdate={setColorUpdate} test={changeJson} />
              </div>
            ) : (
              ""
            )}

            {changeJson.values.background_style_type == "gradient" ? (
              // linear-gradient(90deg,rgba(2,0,36,1) 0%,rgba(67,9,121,1) 35%,rgba(0,212,255,1) 100%)
              <div></div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}

      {/* Background container Ending */}

      {/* Page container Beginning */}

      {changeJson.values && changeJson.values.type == "page" ? (
        <div className="fixed right-0 h-full w-[22em] bg-[rgba(53,54,66,.9825)] z-50 overflow-auto">
          <div className="text-white h-full">
            <h1 className="px-5 py-3 border-b-2 border-black text-lg">
              {changeJson.values.id}
            </h1>
            <div className="pt-5 px-10">
              Position
              <div className="pt-2">
                <select
                  id="position"
                  className="bg-[rgba(71,73,88,.475)] rounded w-full p-2"
                  value={changeJson.values.position}
                  onChange={updateElementsValues}
                >
                  <option value="right" className="bg-[rgba(53,54,66,.9825)]">
                    Right
                  </option>
                  <option value="center" className="bg-[rgba(53,54,66,.9825)]">
                    Center
                  </option>
                  <option value="left" className="bg-[rgba(53,54,66,.9825)]">
                    Left
                  </option>
                </select>
              </div>
            </div>
            <div className="pt-5 px-10 h-full">
              <div className="pb-2 flex">
                <div
                  className="w-[20px] h-[20px] mr-2 mt-1 border-2 border-black rounded-sm"
                  style={{ background: changeJson.values.background_color }}
                ></div>
                <div className="">Color</div>
              </div>
              <input
                id="background_color"
                className="bg-[rgba(71,73,88,.475)] mr-5 rounded-t-[6px] px-1 w-full border-b-0 p-2"
                value={changeJson.values.background_color}
                onChange={updateElementsValues}
              />
              <PickColor setColorUpdate={setColorUpdate} test={changeJson} />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {/* Page container Ending */}

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
              id="container_element"
              onClick={addNewElement}
            >
              Container
            </div>
            <div
              className="design_new_elements"
              id="text"
              onClick={addNewElement}
            >
              Text
            </div>
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
