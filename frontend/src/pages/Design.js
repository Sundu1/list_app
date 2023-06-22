import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Children,
} from "react";
import { useParams } from "react-router-dom";
import { LoginProvider, UserContext } from "../components/LoginProvider";

import Navbar from "../components/Navbar";
import { BsFillDatabaseFill, BsTrashFill } from "react-icons/bs";

import {
  GiDustCloud,
  GiHamburgerMenu,
  GiJamesBondAperture,
} from "react-icons/gi";

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
  });

  const [inputColorPicker, setInputColorPicker] = useState({});
  const [columnsCount, setColumnsCount] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const [colorUpdate, setColorUpdate] = useState({});
  const [isAddElement, setIsAddElement] = useState(false);

  const [scrollValue, setScrollValue] = useState(0);
  const [dragValue, setDragValue] = useState("");

  const [jsonValue, setJsonValue] = useState({
    elements: [
      {
        type: "background",
        id: "Background",
        scroll_top: 0,
        height: "100%",
        width: "100%",
        position: "fixed",
        background_style_type: "color",
        background_style_types: {
          color: { background_color: "white" },
          gradient: [
            {
              color: " rgba(135, 92, 161, 0.79)",
              percentage: "21",
            },
            {
              color: "rgba(66, 95, 199, 0.69)",
              percentage: "68",
            },
            {
              color: "rgba(0, 148, 255, 0.54)",
              percentage: "100",
            },
          ],
          image: {
            background_color: "white",
            background_url: "",
            gradient: [
              {
                color: " rgba(135, 92, 161, 0.79)",
                percentage: "21",
                transparency: "0.79",
              },
              {
                color: "rgba(66, 95, 199, 0.69)",
                percentage: "68",
                transparency: "0.69",
              },
              {
                color: "rgba(0, 148, 255, 0.54)",
                percentage: "100",
                transparency: "0.54",
              },
            ],
          },
        },

        isActive: false,
        children: [
          {
            type: "page",
            id: "Page",
            height: "200",
            width: "500",
            position_div: "relative",
            text_align: "center",
            position: "center",
            background_color: "rgb(220,220,220)",
            padding: "10px",
            text: "text here",
            display: "",
            margin_top: "0",
            margin_left: "0",
            margin_right: "0",
            margin_bottom: "0",
            padding_vertical: "20",
            padding_horizontal: "20",
            isActive: false,
            border_color: "",
            border_style: "",
            border_size: "0",
            border_roundness: "0",
            children: [],
          },
        ],
      },
    ],
  });

  // const [isDragging, setIsDragging] = useState(false);
  // const [offset, setOffset] = useState({ x: 0, y: 0 });
  // const [movableDiv, setMovableDiv] = useState({});
  // const [placeholderDiv, setPlaceholderDiv] = useState({});
  // const [moved, setMoved] = useState(false);
  // const [columnValue, setcolumnValue] = useState("");

  const [savedColumns, setSavedColumns] = useState([]);
  const [ctrlDown, setCtrlDown] = useState(false);
  const [columnDropDown, setColumnDropDown] = useState({
    name: "",
    isActive: false,
  });

  const [buttonDropDown, setButtonDropDown] = useState({
    name: "",
    isActive: false,
  });

  const uploadImageRef = useRef(null);
  const refAddElement = useRef();


  // Icons
  const iconItems = [
    "ArrowDown",
    "ArrowLeft",
    "Mail",
    "Phone",
    "SocialFacebook",
    "SocialInstagram",
    "SocialTiktok",
  ];

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        isAddElement &&
        refAddElement.current &&
        !refAddElement.current.contains(e.target) &&
        e.target.id !== "addElementBox"
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
      handleDrop,
      handleDragging,
      handleDragEnd,
      handleScroll,
      scrollValue
    );

    if (document.querySelector("#Background")) {
      const bg = document.querySelector("#Background");
      bg.scrollTo(scrollValue, scrollValue);
    }

    return () => {};
  }, [jsonValue, refresh]);

  useEffect(() => {
    if (colorUpdate.target) {
      if (
        changeJson.values.type == "background" ||
        changeJson.values.type == "container"
      ) {
        updateBackGround(colorUpdate);
      } else {
        updateElementsValues(colorUpdate);
      }
    }
  }, [colorUpdate]);

  const matchAndUpdate = (values, changeJson, children) => {
    return children.map((_child) => {
      if (changeJson.id === _child.id) {
        return {
          ..._child,
          [values.id]: values.value,
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

  const updateElementsValues = (e) => {
    if (e.target.id) {
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
    let newElement = null;
    let addedElement = null;

    if (
      changeJson.values.type == "page" ||
      changeJson.values.type == "container"
    ) {
      const containers = matchAndGet(jsonValue.elements, changeJson.values.id);

      if (e.target.id == "container_element") {
        newElement = new Object({
          type: "container",
          id: `Container-${newCount}`,
          order: containers.children.length + 1,
          height: "100",
          width: "200",
          background_color: "",
          border: "",
          text: "text here",
          position: "relative",
          display: "default",
          margin_top: "0",
          margin_left: "0",
          margin_right: "0",
          margin_bottom: "0",
          padding_vertical: "30",
          padding_horizontal: "30",
          border_color: "black",
          border_style: "solid",
          border_size: "2",
          border_roundness: "0",
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
            image: {
              background_color: "white",
              background_url: "",
              gradient: [
                {
                  color: " rgba(135, 92, 161, 0.79)",
                  percentage: "21",
                  transparency: "0.79",
                },
                {
                  color: "rgba(66, 95, 199, 0.69)",
                  percentage: "68",
                  transparency: "0.69",
                },
                {
                  color: "rgba(0, 148, 255, 0.54)",
                  percentage: "100",
                  transparency: "0.54",
                },
              ],
            },
          },
          children: [
            {
              type: "container-column",
              id: `column-${columnsCount}`,
              isActive: false,
              isSpace: false,
              children: [],
            },
          ],
        });

        setColumnsCount(columnsCount + 1);
        addedElement = matchAndAdd(
          jsonValue.elements,
          changeJson.values.id && changeJson.values.type != "container"
            ? changeJson.values.id
            : "Page",
          newElement
        );
      }

      if (e.target.id == "text_element") {
        const containerValue = matchAndGet(
          jsonValue.elements,
          changeJson.values.id
        );
        const parentId =
          containerValue.type == "container"
            ? containerValue.children[0].id
            : containerValue.id;

        newElement = new Object({
          parent: parentId,
          type: "text",
          id: `text-${newCount}`,
          order: newCount,
          wordBreak: "",
          text_color: "",
          text_size: "15",
          text_fontfamily: "",
          text_value: "put your text here",
          text_align: "center",
          children: [],
        });

        addedElement = matchAndAdd(jsonValue.elements, parentId, newElement);
      }

      if (e.target.id == "img_element") {
        const containerValue = matchAndGet(
          jsonValue.elements,
          changeJson.values.id
        );

        const parentId =
          containerValue.type == "container"
            ? containerValue.children[0].id
            : containerValue.id;

        newElement = new Object({
          parent: parentId,
          type: "image",
          id: `image-${newCount}`,
          order: newCount,
          url: "",
          children: [],
        });

        addedElement = matchAndAdd(jsonValue.elements, parentId, newElement);
      }

      if (e.target.id == "button_element") {
        const containerValue = matchAndGet(
          jsonValue.elements,
          changeJson.values.id
        );

        const parentId =
          containerValue.type == "container"
            ? containerValue.children[0].id
            : containerValue.id;

        newElement = new Object({
          parent: parentId,
          type: "button-parent",
          id: `button-parent-${newCount}`,
          order: newCount,
          children: [
            {
              parent: parentId,
              type: "button",
              id: `button-${newCount}`,
              label: "Button",
              icon: "ArrowDown",
              order: newCount,
              children: [],
            },
          ],
        });

        addedElement = matchAndAdd(jsonValue.elements, parentId, newElement);
      }

      if (newElement !== null) {
        setJsonValue({ elements: addedElement });
        setNewCount(newCount + 1);
      }
    }
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

  const clickedElement = (e) => {
    if (jsonValue && jsonValue.elements) {
      const matchAndUpdate = (changeJson, children) => {
        return children.map((_child) => {
          if (changeJson.id === _child.id) {
            if (changeJson.isActive) {
              setChangeJson((old) => ({
                ...old,
                values: { ...old.values, isActive: false },
              }));
              return {
                ...changeJson,
                isActive: false,
                children:
                  _child.children && Array.isArray(_child.children)
                    ? matchAndUpdate(changeJson, _child.children)
                    : null,
              };
            }
            setChangeJson((old) => ({
              ...old,
              values: { ...old.values, isActive: true },
            }));
            return {
              ...changeJson,
              isActive: true,
              children:
                _child.children && Array.isArray(_child.children)
                  ? matchAndUpdate(changeJson, _child.children)
                  : null,
            };
          } else {
            return {
              ..._child,
              isActive: false,
              children:
                _child.children && Array.isArray(_child.children)
                  ? matchAndUpdate(changeJson, _child.children)
                  : null,
            };
          }
        });
      };

      const newState = matchAndUpdate(changeJson.values, jsonValue.elements);
      setJsonValue({ elements: newState });
    }
  };

  const matchAndGet = (obj, targetId) => {
    if (obj.id === targetId) {
      return obj;
    }

    if (typeof obj !== "object" || obj === null) {
      return null;
    }

    if (Array.isArray(obj)) {
      for (const item of obj) {
        const result = matchAndGet(item, targetId);
        if (result) {
          return result;
        }
      }
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const result = matchAndGet(obj[key], targetId);
          if (result) {
            return result;
          }
        }
      }
    }
    return null;
  };

  const updateElementParent = (newElementId, parentElementId) => {
    const newElementValues = matchAndGet(jsonValue.elements, newElementId);
    const parentElement = matchAndGet(jsonValue.elements, parentElementId);

    if (
      newElementValues &&
      newElementValues.type == "container" &&
      parentElement.type != "page"
    )
      return;

    if (
      newElementValues == null ||
      parentElement == newElementValues.id ||
      parentElement == "Background"
    )
      return;

    if (parentElement.type == "container") return;
    if (parentElement.type == newElementValues.type) return;

    newElementValues.parent = parentElementId;
    const deletedState = matchAndDelete(jsonValue.elements, newElementValues);
    const newState = matchAndAdd(
      jsonValue.elements,
      parentElement.id,
      newElementValues
    );
    setJsonValue({ elements: deletedState });
    setJsonValue({ elements: newState });
  };

  // Begin testing new thing
  function cloneObject(obj) {
    if (obj == null || typeof obj != "object") return obj;
    const copy = obj.constructor();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) copy[key] = obj[key];
    }
    return copy;
  }

  let dragValueTest = "";

  const handleDragStart = (e) => {
    if (e.target.className == "container-wrapper") {
      e.dataTransfer.setData("dragging_container", e.target.children[0].id);
      dragValueTest = e.target.children[0].id;
      return;
    }
    e.dataTransfer.setData("dragging_container", e.target.id);
  };

  const handleDragging = (e) => {
    const temp = e.target;
    temp.style.zIndex = "999";
    temp.style.background = "grey";
    temp.style.border = "5px solid #008080";
    temp.style.borderStyle = "dashed";
    temp.innerHTML = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (
      // changeJson.values.id == "Page" ||
      e.target.id == "Background"
    )
      return;

    const insertIntoArray = (dragValue, targetValue) => {
      const containers = matchAndGet(jsonValue.elements, "Page").children;
      const target = matchAndGet(jsonValue.elements, targetValue.id);

      const key = matchAndGet(jsonValue.elements, dragValue).order;
      const prev = target.order;
      const next = prev + 1;

      const newContainers = containers.map((value, index) => {
        const newValue = cloneObject(value);

        if (value.order == key && key < prev) {
          newValue.order = next - 1;
          return newValue;
        }
        if (value.order == next && key < prev) {
          return newValue;
        }
        if (value.order > key && value.order < next && key < prev) {
          newValue.order = value.order - 1;
          return newValue;
        }
        if (value.order <= key && key < prev) {
          return newValue;
        }
        if (value.order > next && key < prev) {
          return newValue;
        }

        // key > prev
        if (value.order == key && key > prev) {
          newValue.order = next;
          return newValue;
        }
        if (
          value.order >= next &&
          key > prev &&
          value.order < containers.length &&
          key != next &&
          value.order < key
        ) {
          if (value.order + 1 >= containers.length && key < containers.length) {
            return newValue;
          }
          newValue.order = value.order + 1;
          return newValue;
        }
        return newValue;
      });

      //  function hasDuplicates(array) {
      //    return new Set(array).size !== array.length;
      //  }

      //     console.log(
      //       "len =",
      //       containers.length,
      //       "key = ",
      //       key,
      //       "prev = ",
      //       prev,
      //       "next = ",
      //       next,
      //       newContainers.map((con) => con.order),
      //       hasDuplicates(newContainers.map((con) => con.order))
      //     );
      return newContainers;
    };

    if (
      e.target.className == "container-wrapper" &&
      e.target.children[0] &&
      dragValueTest != ""
    ) {
      const newChildren = insertIntoArray(dragValueTest, e.target.children[0]);
      const newState1 = matchAndUpdateChildren(
        jsonValue.elements,
        "Page",
        newChildren
      );
      setJsonValue({ elements: newState1 });
      return;
    }

    if (e.target.dataset.type == "container" && dragValueTest != "") {
      const newChildren = insertIntoArray(dragValueTest, e.target);
      const newState1 = matchAndUpdateChildren(
        jsonValue.elements,
        "Page",
        newChildren
      );
      setJsonValue({ elements: newState1 });
      return;
    }

    // Update Parent
    const hoverElement = matchAndGet(jsonValue.elements, e.target.id);

    if (e.target.getAttribute("dropdownzone")) return;
    if (hoverElement == null) return;
    if (hoverElement.type == "text" || hoverElement.type == "image") {
      const parentEle = matchAndGet(jsonValue.elements, hoverElement.parent);
      updateElementParent(
        e.dataTransfer.getData("dragging_container"),
        parentEle.id
      );
    }
    updateElementParent(
      e.dataTransfer.getData("dragging_container"),
      e.target.id
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnd = (e) => {
    setRefresh(!refresh);
  };

  const handleDeleteElement = () => {
    const deletedState = matchAndDelete(jsonValue.elements, changeJson.values);
    setJsonValue({ elements: deletedState });
    setChangeJson((old) => ({ ...old, values: {} }));
  };

  const updateBackGround = (e) => {
    if (e.target.id) {
      const matchAndUpdate = (values, changeJson, children) => {
        return children.map((_child) => {
          if (changeJson.id === _child.id) {
            if (_child.background_style_type == "color") {
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

              return {
                ...changeJson,
                background_style_types: {
                  ...changeJson.background_style_types,
                  [changeJson.background_style_type]: {
                    [e.target.id]: e.target.value,
                  },
                },
              };
            }

            if (_child.background_style_type == "image") {
              if (e.target.id == "background_url") {
                const img_url =
                  e.target.files !== undefined
                    ? `url(${URL.createObjectURL(e.target.files[0])})`
                    : "url()";

                setChangeJson((old) => ({
                  ...old,
                  values: {
                    ...old.values,
                    background_style_types: {
                      ...old.values.background_style_types,
                      [old.values.background_style_type]: {
                        ...old.values.background_style_types[
                          old.values.background_style_type
                        ],
                        [e.target.id]:
                          e.target.id == "background_url"
                            ? img_url
                            : e.target.value,
                      },
                    },
                  },
                }));

                return {
                  ...changeJson,
                  background_style_types: {
                    ...changeJson.background_style_types,
                    [changeJson.background_style_type]: {
                      ...changeJson.background_style_types[
                        changeJson.background_style_type
                      ],
                      [e.target.id]:
                        e.target.id == "background_url"
                          ? img_url
                          : e.target.value,
                    },
                  },
                };
              }
              const value_id = e.target.id.includes("color")
                ? "color"
                : e.target.id;

              if (value_id) {
                const updated_array = _child.background_style_types[
                  _child.background_style_type
                ].gradient.map((value, i) => {
                  if (i == e.target.dataset.indexvalue) {
                    return {
                      ...value,
                      [value_id]: e.target.value,
                    };
                  }
                  return { ...value };
                });

                setChangeJson((old) => ({
                  ...old,
                  values: {
                    ...old.values,
                    background_style_types: {
                      ...old.values.background_style_types,
                      [old.values.background_style_type]: {
                        ...old.values.background_style_types[
                          old.values.background_style_type
                        ],
                        gradient: updated_array,
                      },
                    },
                  },
                }));

                return {
                  ..._child,
                  background_style_types: {
                    ..._child.background_style_types,
                    [_child.background_style_type]: {
                      ..._child.background_style_types[
                        _child.background_style_type
                      ],
                      gradient: updated_array,
                    },
                  },
                };
              }
            }
            if (_child.background_style_type == "gradient") {
              const value_id = e.target.id.includes("color")
                ? "color"
                : e.target.id;

              const updated_array = _child.background_style_types[
                _child.background_style_type
              ].map((value, i) => {
                if (i == e.target.dataset.indexvalue) {
                  return {
                    ...value,
                    [value_id]: e.target.value,
                  };
                }
                return { ...value };
              });

              setChangeJson((old) => ({
                ...old,
                values: {
                  ...old.values,
                  background_style_types: {
                    ...old.values.background_style_types,
                    [old.values.background_style_type]: updated_array,
                  },
                },
              }));

              return {
                ..._child,
                background_style_types: {
                  ..._child.background_style_types,
                  [_child.background_style_type]: updated_array,
                },
              };
            }
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

      setJsonValue({ elements: newState });
    }
  };

  document.onmousedown = (e) => {
    if (e.target.id == inputColorPicker.id || e.target.id == "canvas") {
      return;
    }
    setInputColorPicker({});
  };

  const handleColorPickerInput = (e) => {
    if (e.target.id == "canvas" || e.target.id == inputColorPicker.id) {
      return;
    }
    setInputColorPicker({ name: e.target.dataset.name, id: e.target.id });
  };

  const handleUploadImage = () => {
    uploadImageRef.current.click();
  };

  const matchAndUpdateChildren = (obj, targetId, newChildren) => {
    if (Array.isArray(obj)) {
      return obj.map((value) => {
        if (value.id == targetId) {
          return {
            ...value,
            children: newChildren,
          };
        }

        return {
          ...value,
          children: Array.isArray(value.children)
            ? matchAndUpdateChildren(value.children, targetId, newChildren)
            : null,
        };
      });
    }
  };

  const updateColumn = (e) => {
    const selectedContainer = matchAndGet(
      jsonValue.elements,
      changeJson.values.id
    );

    if (e.target.id && e.target.value == "default") {
      const columnArr = selectedContainer.children;

      const isEmtpy = columnArr.some((column) => column.children.length > 0);
      if (isEmtpy) {
        setSavedColumns((old) => ({
          ...old,
          [changeJson.values.id]: [...columnArr],
        }));
      }
      const newState = matchAndUpdate(
        e.target,
        changeJson.values,
        jsonValue.elements
      );

      setChangeJson((old) => ({
        ...old,
        values: { ...old.values, [e.target.id]: e.target.value },
      }));

      const fistColumn = cloneObject(columnArr[0]);

      let testArr = [];
      for (const value of columnArr) {
        for (const ele of value.children) {
          testArr.push(ele);
        }
      }

      fistColumn.children = testArr;

      const defaultColumn = matchAndUpdateChildren(
        newState,
        changeJson.values.id,
        [fistColumn]
      );

      setJsonValue({ elements: defaultColumn });
      return;
    }

    if (e.target.id && e.target.value == "columns") {
      const newState = matchAndUpdate(
        e.target,
        changeJson.values,
        jsonValue.elements
      );

      setChangeJson((old) => ({
        ...old,
        values: { ...old.values, [e.target.id]: e.target.value },
      }));

      let newElement = null;
      let addedElement = null;

      if (savedColumns && !savedColumns[changeJson.values.id]) {
        if (e.target.name == "container-column") {
          newElement = new Object({
            type: "container-column",
            id: `column-${columnsCount}`,
            isSpace: false,
            isActive: false,
            children: [],
          });

          addedElement = matchAndAdd(
            newState,
            changeJson.values.id,
            newElement
          );
        }

        const newChangeJson = matchAndGet(addedElement, changeJson.values.id);
        setColumnsCount(columnsCount + 1);
        setJsonValue({ elements: addedElement });
        setChangeJson((old) => ({ ...old, values: newChangeJson }));
      } else {
        const newValues = matchAndUpdateChildren(
          jsonValue.elements,
          changeJson.values.id,
          savedColumns[changeJson.values.id]
        );

        const newState = matchAndUpdate(e.target, changeJson.values, newValues);
        const newChangeJson = matchAndGet(newState, changeJson.values.id);
        setJsonValue({ elements: newState });
        setChangeJson((old) => ({ ...old, values: newChangeJson }));
      }
    }
  };

  const updateColumnValues = (e, columnId) => {
    const newState = matchAndUpdate(
      e.target,
      { id: columnId },
      jsonValue.elements
    );

    const newChangeJson = matchAndGet(newState, changeJson.values.id);
    setJsonValue({ elements: newState });
    setChangeJson((old) => ({ ...old, values: newChangeJson }));
  };

  const updateImageValue = (e) => {
    const img_url = e.target.files
      ? URL.createObjectURL(e.target.files[0])
      : undefined;
    const target = new Object({
      target: {
        id: e.target.id,
        value: img_url,
      },
    });

    updateElementsValues(target);
  };

  const handleScroll = () => {
    if (document.querySelector("#Background")) {
      const bg = document.querySelector("#Background");
      setScrollValue(bg.scrollTop);
    }
  };

  document.addEventListener("keydown", (e) => {
    if (e.key == "Delete" && changeJson.values && changeJson.values.id) {
      if (
        changeJson.values.type == "page" ||
        changeJson.values.type == "background"
      )
        return;
      const deletedState = matchAndDelete(
        jsonValue.elements,
        changeJson.values
      );
      setJsonValue({ elements: deletedState });
      setChangeJson({
        name: undefined,
        values: {},
      });
    }

    if (e.key == "Control") setCtrlDown(true);
    if (ctrlDown && e.key == "v") {
      console.log("yes", e.key);
    }
  });

  const columnNames = new Object({
    0: "First",
    1: "Second",
    2: "Third",
    3: "Fourth",
    4: "Fifth",
  });

  const handleColumnDropDown = (e) => {
    if (
      columnDropDown.name == e.target.getAttribute("name") &&
      columnDropDown.isActive
    ) {
      setColumnDropDown({ name: "", isActive: false });
      return;
    }
    setColumnDropDown({
      name: e.target.getAttribute("name"),
      isActive: true,
    });
  };

  const handleButtonAdd = (e) =>{
    if (changeJson.values && changeJson.values.type == "button-parent") {
      const newEle = new Object({
        parent: changeJson.values.id,
        type: "button",
        id: `button-${newCount}`,
        label: "Button",
        icon: "ArrowDown",
        order: newCount,
        children: [],
      });
      setNewCount(newCount + 1);

      const newState = matchAndAdd(
        jsonValue.elements,
        changeJson.values.id,
        newEle
      );

      const newChange = matchAndGet(newState, changeJson.values.id)

      setJsonValue({ elements: newState });
      setChangeJson(old => ({...old, values: newChange}))
    }
  }

  const handleButtonDelete = (e) =>{
    if (changeJson.values && changeJson.values.type == "button-parent") {
      const deletedState = matchAndDelete(
        jsonValue.elements,
        {id: e.target.getAttribute("name")}
      );
      const newChange = matchAndGet(deletedState, changeJson.values.id);
      setJsonValue({ elements: deletedState });
      // setChangeJson((old) => ({ ...old, values: newChange }));
    }
  }

  const handleButtonDropDown = (e) => {
    if (e.target.getAttribute("type") == "delete") return

    if (
      buttonDropDown.name == e.target.getAttribute("name") &&
      buttonDropDown.isActive
    ) {
      setButtonDropDown({ name: "", isActive: false });
      return;
    }
    
    setButtonDropDown({
      name: e.target.getAttribute("name"),
      isActive: true,
    });
  };

  const udpateButtonValues = (e) =>{
    const newState = matchAndUpdate(
      e.target,
      {id: e.target.name},
      jsonValue.elements
    );

    const newChange = matchAndGet(newState, changeJson.values.id)

    setJsonValue({elements: newState})
    setChangeJson((old) => ({ ...old, values: newChange }));
  }

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
              id="addElementBox"
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
                   h-full text-black overflow-y-auto"
        onPointerUp={clickedElement}
      ></div>

      {/* Edit modal Begins here*/}

      {/* Container beginning */}
      {changeJson.values &&
      changeJson.values.isActive &&
      changeJson.values.type == "container" ? (
        <div
          className="fixed right-0 h-full w-[23em] bg-[rgba(53,54,66,.9825)]
                           z-50 overflow-y-auto"
        >
          <div className="text-white w-full">
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
            <div className="pt-5 px-10">
              Display
              <div className="pt-2">
                <select
                  id="display"
                  name="container-column"
                  className="bg-[rgba(71,73,88,.475)] rounded w-full p-2"
                  value={changeJson.values.display}
                  onChange={updateColumn}
                >
                  <option value="default" className="bg-[rgba(53,54,66,.9825)]">
                    Default
                  </option>
                  <option value="columns" className="bg-[rgba(53,54,66,.9825)]">
                    Columns
                  </option>
                </select>
              </div>
            </div>
            <div className="pt-5 px-10">
              {changeJson.values.display == "columns" ? (
                <div className="pb-5">
                  <div className="pb-3">Columns</div>
                  <div className="border-2 rounded-lg border-[rgba(255,255,255,.075)]">
                    {changeJson.values.children.map((column, index) => {
                      return (
                        <div
                          className="border-b-2 border-[rgba(255,255,255,.075)] 
                     "
                          key={column.id}
                        >
                          <div
                            className="p-2 hover:cursor-pointer 
                                          hover:bg-[rgba(71,73,88,.475)]"
                            name={column.id}
                            onClick={handleColumnDropDown}
                          >
                            {columnNames[index]}
                          </div>
                          <div
                            className={
                              columnDropDown.name == column.id &&
                              columnDropDown.isActive
                                ? "px-2"
                                : "hidden"
                            }
                          >
                            <div className="py-3 flex">
                              <input
                                type="checkbox"
                                className="mr-3"
                                checked={column.isSpace}
                                onChange={(e) =>
                                  updateColumnValues(
                                    {
                                      target: {
                                        id: "isSpace",
                                        value: e.target.checked,
                                      },
                                    },
                                    column.id
                                  )
                                }
                              />
                              <div>Use column as a placeholder</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className="mt-2 border-2 border-white p-2 rounded-lg text-center 
                                hover:bg-[rgba(255,255,255,.075)] hover:cursor-pointer"
                  >
                    Add
                  </div>
                </div>
              ) : null}

              <div className="pb-5">
                Background Type
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
                  </select>
                </div>
              </div>
              {changeJson.values.background_style_type == "color" ? (
                <div className="">
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
                  <div onClick={handleColorPickerInput}>
                    <input
                      data-name={changeJson.values.id}
                      id="background_color"
                      className="input_color_picker"
                      value={
                        changeJson.values.background_style_types[
                          changeJson.values.background_style_type
                        ].background_color
                      }
                      onChange={updateBackGround}
                    />
                    <div
                      className={
                        inputColorPicker.name == changeJson.values.id &&
                        inputColorPicker.id == "background_color"
                          ? "color_picker active"
                          : "color_picker"
                      }
                    >
                      <PickColor
                        setColorUpdate={setColorUpdate}
                        changeJson={changeJson}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {changeJson.values.background_style_type == "image" ? (
                <div className="h-full">
                  <div
                    className="h-[150px] w-full bg-black flex justify-center items-center rounded-lg"
                    onClick={handleUploadImage}
                  >
                    <div className="p-3 bg-[#33ada9] font-bold rounded-lg text-[15px] hover:cursor-pointer w-[50%] text-center">
                      Upload
                    </div>
                  </div>
                  <input
                    onChange={updateBackGround}
                    ref={uploadImageRef}
                    id="background_url"
                    type="file"
                    className="hidden"
                  />
                  {changeJson.values.background_style_types[
                    changeJson.values.background_style_type
                  ].gradient.map((value, i) => {
                    return (
                      <div key={i} className="pt-5 h-full">
                        <div className="pb-2 flex">
                          <div
                            className="w-[20px] h-[20px] mr-2 mt-1 border-2 border-black rounded-sm"
                            style={{
                              background: value.color,
                            }}
                          ></div>
                          <div className="">Color</div>
                        </div>
                        <div className="flex">
                          <div
                            onClick={handleColorPickerInput}
                            className="w-[115px]"
                          >
                            <input
                              data-indexvalue={i}
                              id={`color-${i}`}
                              className="input_color_picker"
                              value={value.color}
                              onChange={updateBackGround}
                            />
                            <div
                              className={
                                inputColorPicker.id == `color-${i}`
                                  ? "color_picker active"
                                  : "color_picker"
                              }
                            >
                              <PickColor
                                setColorUpdate={setColorUpdate}
                                changeJson={changeJson}
                                type={"color"}
                                idValue={i}
                              />
                            </div>
                          </div>
                          <input
                            data-indexvalue={i}
                            max={100}
                            id="percentage"
                            type="range"
                            className="ml-2 slider_style w-[100px]"
                            value={value.percentage}
                            onChange={updateBackGround}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="px-10 pt-3 absolute">
              {/* <div className="flex justify-between pt-3 pb-1">
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
              </div> */}
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
              <div className="pt-5 h-full pb-[100px]">
                <div className="pb-5">Margin Spacing</div>
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
                      // type="number"
                      type="range"
                      max={100}
                      className="margin_webkit"
                      value={changeJson.values.margin_top}
                      onChange={updateElementsValues}
                    />
                  </div>
                  <div className="col-start-1 col-end-1 text-center pt-[50%]">
                    <input
                      id="margin_left"
                      // type="number"
                      type="range"
                      orient="vertical"
                      className="margin_webkit vertical"
                      value={changeJson.values.margin_left}
                      onChange={updateElementsValues}
                    />
                  </div>
                  <div className="col-start-3 col-end-0 text-center pt-[50%]">
                    <input
                      id="margin_right"
                      // type="number"
                      type="range"
                      className="margin_webkit vertical"
                      value={changeJson.values.margin_right}
                      onChange={updateElementsValues}
                    />
                  </div>
                  <div className="col-start-3 col-end-2 text-center">
                    <input
                      id="margin_bottom"
                      // type="number"
                      type="range"
                      className="margin_webkit"
                      value={changeJson.values.margin_bottom}
                      onChange={updateElementsValues}
                    />
                  </div>
                </div>

                {/* Containers Paddings */}
                <div className="mt-5 text-lg">Paddings</div>
                <div className="flex justify-between">
                  <div className="w-[100px]">
                    <div className="flex justify-between pt-3 pb-1">
                      <div className="pr-3">Horizontal</div>
                      <input
                        id="padding_horizontal"
                        className="mr-5 rounded px-1 w-[50px] bg-transparent"
                        value={changeJson.values.padding_horizontal}
                        onChange={updateElementsValues}
                      />
                    </div>
                    <input
                      id="padding_horizontal"
                      type="range"
                      max={100}
                      className="slider_style w-[100px]"
                      value={changeJson.values.padding_horizontal}
                      onChange={updateElementsValues}
                    />
                  </div>
                  <div className="w-[100px]">
                    <div className="flex justify-between pt-3 pb-1">
                      <div className="pr-5">Vertical</div>
                      <input
                        id="padding_vertical"
                        className="mr-5 rounded px-1 w-[50px] bg-transparent"
                        value={changeJson.values.padding_vertical}
                        onChange={updateElementsValues}
                      />
                    </div>
                    <input
                      id="padding_vertical"
                      type="range"
                      max={100}
                      className="slider_style w-[100px]"
                      value={changeJson.values.padding_vertical}
                      onChange={updateElementsValues}
                    />
                  </div>
                </div>
                <div className="mt-5 py-3 flex">
                  <div
                    className="w-[20px] h-[20px] mr-2 mt-1 border-2 border-black rounded-sm"
                    style={{ background: changeJson.values.border_color }}
                  ></div>
                  <div className="">Border Color</div>
                </div>
                <div onClick={handleColorPickerInput}>
                  <input
                    data-name={changeJson.values.id}
                    id="border_color"
                    className="input_color_picker"
                    value={changeJson.values.border_color}
                    onChange={updateElementsValues}
                  />
                  <div
                    className={
                      inputColorPicker.name == changeJson.values.id &&
                      inputColorPicker.id == "border_color"
                        ? "color_picker active"
                        : "color_picker"
                    }
                  >
                    <PickColor
                      setColorUpdate={setColorUpdate}
                      changeJson={changeJson}
                      type="border_color"
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-3 pb-1">
                  <div>Border roundness</div>
                  <input
                    id="border_roundness"
                    className="mr-5 rounded px-1 w-[50px] bg-transparent"
                    value={changeJson.values.border_roundness}
                    onChange={updateElementsValues}
                  />
                </div>
                <input
                  id="border_roundness"
                  type="range"
                  max={100}
                  className="slider_style"
                  value={changeJson.values.border_roundness}
                  onChange={updateElementsValues}
                />
                <div className="pt-5 w-full">
                  Border Style
                  <div className="pt-2">
                    <select
                      id="border_style"
                      className="bg-[rgba(71,73,88,.475)] rounded w-full p-2"
                      value={changeJson.values.border_style}
                      onChange={updateElementsValues}
                    >
                      <option
                        value="right"
                        className="bg-[rgba(53,54,66,.9825)]"
                      >
                        dotted
                      </option>
                      <option
                        value="dashed"
                        className="bg-[rgba(53,54,66,.9825)]"
                      >
                        dashed
                      </option>
                      <option
                        value="solid"
                        className="bg-[rgba(53,54,66,.9825)]"
                      >
                        solid
                      </option>
                      <option
                        value="double"
                        className="bg-[rgba(53,54,66,.9825)]"
                      >
                        double
                      </option>
                      <option
                        value="groove"
                        className="bg-[rgba(53,54,66,.9825)]"
                      >
                        groove
                      </option>
                      <option
                        value="ridge"
                        className="bg-[rgba(53,54,66,.9825)]"
                      >
                        ridge
                      </option>
                      <option
                        value="inset"
                        className="bg-[rgba(53,54,66,.9825)]"
                      >
                        inset
                      </option>
                      <option
                        value="outset"
                        className="bg-[rgba(53,54,66,.9825)]"
                      >
                        outset
                      </option>
                      <option
                        value="none"
                        className="bg-[rgba(53,54,66,.9825)]"
                      >
                        none
                      </option>
                      <option
                        value="hidden"
                        className="bg-[rgba(53,54,66,.9825)]"
                      >
                        hidden
                      </option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between pt-3 pb-1">
                  <div>Border Size</div>
                  <input
                    id="border_size"
                    className="mr-5 rounded px-1 w-[50px] bg-transparent"
                    value={changeJson.values.border_size}
                    onChange={updateElementsValues}
                  />
                </div>
                <input
                  id="border_size"
                  type="range"
                  max={100}
                  className="slider_style"
                  value={changeJson.values.border_size}
                  onChange={updateElementsValues}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* Container Ending */}

      {/* Text Beginning */}
      {changeJson.values &&
      changeJson.values.isActive &&
      changeJson.values.type == "text" ? (
        <div className="fixed right-0 h-full w-[22em] bg-[rgba(53,54,66,.9825)] z-50 overflow-y-auto">
          <div className="text-white h-full">
            <h1 className="px-5 py-3 border-b-2 border-black text-lg">
              {changeJson.values.id}
            </h1>
            <div className="pt-5 px-10">
              <div className="pb-2">Text</div>
              <textarea
                contentEditable
                rows={1}
                suppressContentEditableWarning={true}
                id="text_value"
                className="bg-[rgba(71,73,88,.475)] p-2 rounded-lg inline-block w-full"
                value={changeJson.values.text_value}
                onChange={updateElementsValues}
              />
            </div>
            <div className="pt-5 px-10">
              <div className="pb-2">Align Text</div>
              <select
                id="text_align"
                className="bg-[rgba(71,73,88,.475)] rounded p-2 w-full"
                value={changeJson.values.text_align}
                onChange={updateElementsValues}
              >
                <option value="left" className="bg-[rgba(53,54,66,.9825)]">
                  Left
                </option>
                <option value="center" className="bg-[rgba(53,54,66,.9825)]">
                  Center
                </option>
                <option value="right" className="bg-[rgba(53,54,66,.9825)]">
                  Right
                </option>
              </select>
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
                className="input_color_picker"
                value={changeJson.values.text_color}
                onChange={updateElementsValues}
              />
              <PickColor
                setColorUpdate={setColorUpdate}
                changeJson={changeJson}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* Text Ending */}

      {/* Background container Beginning */}

      {changeJson.values &&
      changeJson.values.isActive &&
      changeJson.values.type == "background" ? (
        <div className="fixed right-0 h-full w-[22em] bg-[rgba(53,54,66,.9825)] z-50 overflow-y-auto">
          <div className="text-white pb-[100px]">
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
                <div onClick={handleColorPickerInput}>
                  <input
                    data-name={changeJson.values.id}
                    id="background_color"
                    className="input_color_picker"
                    value={
                      changeJson.values.background_style_types[
                        changeJson.values.background_style_type
                      ].background_color
                    }
                    onChange={updateBackGround}
                  />
                  <div
                    className={
                      inputColorPicker.name == changeJson.values.id &&
                      inputColorPicker.id == "background_color"
                        ? "color_picker active"
                        : "color_picker"
                    }
                  >
                    <PickColor
                      setColorUpdate={setColorUpdate}
                      changeJson={changeJson}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {changeJson.values.background_style_type == "gradient" ? (
              <div>
                {changeJson.values.background_style_types[
                  changeJson.values.background_style_type
                ].map((value, i) => {
                  return (
                    <div key={i} className="pt-5 px-10 h-full">
                      <div className="pb-2 flex">
                        <div
                          className="w-[20px] h-[20px] mr-2 mt-1 border-2 border-black rounded-sm"
                          style={{
                            background: value.color,
                          }}
                        ></div>
                        <div className="">Color</div>
                      </div>
                      <div className="flex">
                        <div
                          onClick={handleColorPickerInput}
                          className="w-[115px]"
                        >
                          <input
                            data-indexvalue={i}
                            id={`color-${i}`}
                            className="input_color_picker"
                            value={value.color}
                            onChange={updateBackGround}
                          />
                          <div
                            className={
                              inputColorPicker.id == `color-${i}`
                                ? "color_picker active"
                                : "color_picker"
                            }
                          >
                            <PickColor
                              setColorUpdate={setColorUpdate}
                              changeJson={changeJson}
                              type={"color"}
                              idValue={i}
                            />
                          </div>
                        </div>
                        <input
                          data-indexvalue={i}
                          max={100}
                          id="percentage"
                          type="range"
                          className="ml-2 slider_style w-[100px]"
                          value={value.percentage}
                          onChange={updateBackGround}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              ""
            )}
            {changeJson.values.background_style_type == "image" ? (
              <div>
                <div className="pt-5 px-10 h-full">
                  <div
                    className="h-[150px] w-full bg-black flex justify-center items-center rounded-lg"
                    onClick={handleUploadImage}
                  >
                    <div className="p-3 bg-[#33ada9] font-bold rounded-lg text-[15px] hover:cursor-pointer w-[50%] text-center">
                      Upload
                    </div>
                  </div>
                  <input
                    onChange={updateBackGround}
                    ref={uploadImageRef}
                    id="background_url"
                    type="file"
                    className="hidden"
                  />
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
                  {changeJson.values.background_style_types[
                    changeJson.values.background_style_type
                  ].gradient.map((value, i) => {
                    return (
                      <div key={i} className="pt-5 h-full">
                        <div className="pb-2 flex">
                          <div
                            className="w-[20px] h-[20px] mr-2 mt-1 border-2 border-black rounded-sm"
                            style={{
                              background: value.color,
                            }}
                          ></div>
                          <div className="">Color</div>
                        </div>
                        <div className="flex">
                          <div
                            onClick={handleColorPickerInput}
                            className="w-[115px]"
                          >
                            <input
                              data-indexvalue={i}
                              id={`color-${i}`}
                              className="input_color_picker"
                              value={value.color}
                              onChange={updateBackGround}
                            />

                            <div
                              className={
                                inputColorPicker.id == `color-${i}`
                                  ? "color_picker active"
                                  : "color_picker"
                              }
                            >
                              <PickColor
                                setColorUpdate={setColorUpdate}
                                changeJson={changeJson}
                                type={"color"}
                                idValue={i}
                              />
                            </div>
                          </div>
                          <input
                            data-indexvalue={i}
                            max={100}
                            id="percentage"
                            type="range"
                            className="ml-2 slider_style w-[100px]"
                            value={value.percentage}
                            onChange={updateBackGround}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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

      {changeJson.values &&
      changeJson.values.isActive &&
      changeJson.values.type == "page" ? (
        <div className="fixed right-0 h-full w-[22em] bg-[rgba(53,54,66,.9825)] z-50 overflow-y-auto">
          <div className="text-white">
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
            <div className="py-5 pb-[100px] px-10 h-full">
              <div className="pb-2 flex">
                <div
                  className="w-[20px] h-[20px] mr-2 mt-1 border-2 border-black rounded-sm"
                  style={{ background: changeJson.values.background_color }}
                ></div>
                <div className="">Color</div>
              </div>
              <div onClick={handleColorPickerInput}>
                <input
                  data-name={changeJson.values.id}
                  id="background_color"
                  className="input_color_picker"
                  value={changeJson.values.background_color}
                  onChange={updateElementsValues}
                />
                <div
                  className={
                    inputColorPicker.name == changeJson.values.id &&
                    inputColorPicker.id == "background_color"
                      ? "color_picker active"
                      : "color_picker"
                  }
                >
                  <PickColor
                    setColorUpdate={setColorUpdate}
                    changeJson={changeJson}
                  />
                </div>
              </div>
              {/* <div className="flex justify-between pt-3 pb-1">
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
              </div> */}
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
              <div className="mt-5 text-lg">Paddings</div>
              <div className="flex justify-between">
                <div className="w-[100px]">
                  <div className="flex justify-between pt-3 pb-1">
                    <div className="pr-3">Horizontal</div>
                    <input
                      id="padding_horizontal"
                      className="mr-5 rounded px-1 w-[50px] bg-transparent"
                      value={changeJson.values.padding_horizontal}
                      onChange={updateElementsValues}
                    />
                  </div>
                  <input
                    id="padding_horizontal"
                    type="range"
                    max={100}
                    className="slider_style w-[100px]"
                    value={changeJson.values.padding_horizontal}
                    onChange={updateElementsValues}
                  />
                </div>
                <div className="w-[100px]">
                  <div className="flex justify-between pt-3 pb-1">
                    <div className="pr-5">Vertical</div>
                    <input
                      id="padding_vertical"
                      className="mr-5 rounded px-1 w-[50px] bg-transparent"
                      value={changeJson.values.padding_vertical}
                      onChange={updateElementsValues}
                    />
                  </div>
                  <input
                    id="padding_vertical"
                    type="range"
                    max={100}
                    className="slider_style w-[100px]"
                    value={changeJson.values.padding_vertical}
                    onChange={updateElementsValues}
                  />
                </div>
              </div>
              <div className="flex justify-between pt-3 pb-1">
                <div>Border roundness</div>
                <input
                  id="border_roundness"
                  className="mr-5 rounded px-1 w-[50px] bg-transparent"
                  value={changeJson.values.border_roundness}
                  onChange={updateElementsValues}
                />
              </div>
              <input
                id="border_roundness"
                type="range"
                max={100}
                className="slider_style"
                value={changeJson.values.border_roundness}
                onChange={updateElementsValues}
              />
              <div className="pt-5 w-full">
                Border Style
                <div className="pt-2">
                  <select
                    id="border_style"
                    className="bg-[rgba(71,73,88,.475)] rounded w-full p-2"
                    value={changeJson.values.border_style}
                    onChange={updateElementsValues}
                  >
                    <option value="right" className="bg-[rgba(53,54,66,.9825)]">
                      dotted
                    </option>
                    <option
                      value="dashed"
                      className="bg-[rgba(53,54,66,.9825)]"
                    >
                      dashed
                    </option>
                    <option value="solid" className="bg-[rgba(53,54,66,.9825)]">
                      solid
                    </option>
                    <option
                      value="double"
                      className="bg-[rgba(53,54,66,.9825)]"
                    >
                      double
                    </option>
                    <option
                      value="groove"
                      className="bg-[rgba(53,54,66,.9825)]"
                    >
                      groove
                    </option>
                    <option value="ridge" className="bg-[rgba(53,54,66,.9825)]">
                      ridge
                    </option>
                    <option value="inset" className="bg-[rgba(53,54,66,.9825)]">
                      inset
                    </option>
                    <option
                      value="outset"
                      className="bg-[rgba(53,54,66,.9825)]"
                    >
                      outset
                    </option>
                    <option value="none" className="bg-[rgba(53,54,66,.9825)]">
                      none
                    </option>
                    <option
                      value="hidden"
                      className="bg-[rgba(53,54,66,.9825)]"
                    >
                      hidden
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between pt-3 pb-1">
                <div>Border Size</div>
                <input
                  id="border_size"
                  className="mr-5 rounded px-1 w-[50px] bg-transparent"
                  value={changeJson.values.border_size}
                  onChange={updateElementsValues}
                />
              </div>
              <input
                id="border_size"
                type="range"
                max={100}
                className="slider_style"
                value={changeJson.values.border_size}
                onChange={updateElementsValues}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* Page container Ending */}

      {/* Image Container Beggining */}
      {changeJson.values &&
      changeJson.values.isActive &&
      changeJson.values.type == "image" ? (
        <div className="fixed right-0 h-full w-[22em] bg-[rgba(53,54,66,.9825)] z-50 overflow-y-auto">
          <div className="text-white pb-[100px]">
            <h1 className="px-5 py-3 border-b-2 border-black text-lg">
              {changeJson.values.id}
            </h1>
            <div className="pt-5 px-10">
              <h1 className="pb-5">Image</h1>
              <div
                className="h-[150px] w-full bg-black flex justify-center items-center rounded-lg"
                onClick={handleUploadImage}
              >
                <div className="p-3 bg-[#33ada9] font-bold rounded-lg text-[15px] hover:cursor-pointer w-[50%] text-center">
                  Upload
                </div>
              </div>
              <input
                onChange={updateImageValue}
                ref={uploadImageRef}
                id="url"
                type="file"
                className="hidden"
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* Image Container Ending */}

      {/* Button Container Beggining */}
      {changeJson.values &&
      changeJson.values.isActive &&
      changeJson.values.type == "button-parent" ? (
        <div className="fixed right-0 h-full w-[22em] bg-[rgba(53,54,66,.9825)] z-50 overflow-y-auto">
          <div className="text-white pb-[100px]">
            <h1 className="px-5 py-3 border-b-2 border-black text-lg">
              {changeJson.values.id}
            </h1>
            <div className="pt-5 px-10">
              <div className="border-t-2 border-r-2 border-l-2 rounded-lg border-[rgba(255,255,255,.075)]">
                {changeJson.values.children.map((button) => {
                  return (
                    <div
                      className="border-[rgba(255,255,255,.075)]"
                      key={button.id}
                    >
                      <div
                        className="p-2 hover:cursor-pointer 
                                  hover:bg-[rgba(71,73,88,.475)] 
                                  border-b-2 border-[rgba(255,255,255,.075)] 
                                  rounded flex justify-between"
                        name={button.id}
                        onClick={handleButtonDropDown}
                      >
                        {button.label ? button.label : "No label!!"}
                        <div
                          type="delete"
                          className="hover:scale-[1.1] pt-1 h-full"
                          name={button.id}
                          onClick={handleButtonDelete}
                        >
                        {
                          changeJson.values.children.length > 1 ?
                          <BsTrashFill className="pointer-events-none" /> : null
                        }
                        </div>
                      </div>
                      <div
                        className={
                          buttonDropDown.name == button.id &&
                          buttonDropDown.isActive
                            ? "px-2 border-b-2 border-[rgba(255,255,255,.075)] rounded"
                            : "hidden"
                        }
                      >
                        <div className="p-2">
                          <h3 className="pb-2">Label</h3>
                          <input
                            className="input_color_picker"
                            id="label"
                            name={button.id}
                            value={button.label}
                            onChange={udpateButtonValues}
                          />
                        </div>
                        <div className="p-2">
                          <h3 className="pb-2">Icon</h3>
                          <select
                            id="icon"
                            className="bg-[rgba(71,73,88,.475)] rounded p-2 w-full"
                            name={button.id}
                            value={button.icon}
                            onChange={udpateButtonValues}
                          >
                            {iconItems.map((icon) => {
                              return (
                                <option
                                  key={icon}
                                  id="icon"
                                  value={icon}
                                  className="bg-[rgba(53,54,66,.9825)]"
                                >
                                  {icon}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                className="mt-2 border-2 border-white p-2 rounded-lg text-center 
                                hover:bg-[rgba(255,255,255,.075)] hover:cursor-pointer"
                onClick={handleButtonAdd}
              >
                Add
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* Button Container Ending */}

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
              id="text_element"
              onClick={addNewElement}
            >
              Text
            </div>
            <div
              className="design_new_elements"
              id="img_element"
              onClick={addNewElement}
            >
              Image
            </div>
            <div
              className="design_new_elements"
              id="button_element"
              onClick={addNewElement}
            >
              Buttons
            </div>
            <div className="design_new_elements">Icons</div>
          </div>
        </div>
      ) : null}
      {/* New element Ending here */}
    </div>
  );
};

export default Design;
