import React, { useState, useEffect, useContext, useRef, createElement} from "react";
import { json, useParams } from "react-router-dom";
import { LoginProvider, UserContext } from "../components/LoginProvider";
import Navbar from "../components/Navbar";
import { BsFillDatabaseFill, BsTrashFill } from "react-icons/bs";
import {GiHamburgerMenu} from "react-icons/gi";
import { FaArrowLeft, FaArrowRight, FaUnderline } from "react-icons/fa";
import HtmlRenderFunction from "../components/HtmlRenderFunction";
import PickColor from "../components/PickColor";
import { createNewDesign ,postImage} from "../model/Post";
import { udpateNewDesign} from "../model/Put";
import { getDesignSingle } from "../model/Get";

import * as htmlToImage from 'html-to-image';

const Design = () => {
  const { designTable } = useParams();
  const { value, setValue } = useContext(UserContext);

  const [changeJson, setChangeJson] = useState({
    name: undefined,
    values: {},
  });
  
  const [inputColorPicker, setInputColorPicker] = useState({name: "", id: ""});
  const [refresh, setRefresh] = useState(false);
  const [colorUpdate, setColorUpdate] = useState({});
  const [isAddElement, setIsAddElement] = useState(false);
  const [scrollValue, setScrollValue] = useState(0);
  // const [dragValue, setDragValue] = useState("");
  const [copiedObj, setCopiedObj] = useState("");
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
            width: "50",
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
  const [savedColumns, setSavedColumns] = useState([]);
  const [ctrlDown, setCtrlDown] = useState(false);
  const [columnDropDown, setColumnDropDown] = useState({
    name: "",
    isActive: false,
  });
  const [elementDropDown, setelementDropDown] = useState({
    name: "",
    isActive: false,
  });

  const[containerCount, setContainerCount] = useState(1)
  const[columnsCount, setColumnsCount] = useState(1);
  const[textCount, setTextCount] = useState(1)
  const[imageCount, setImageCount] = useState(1)
  const[iconParentCount, setIconParentCount] = useState(1)
  const[iconCount, setIconCount] = useState(1)
  const[buttonParentCount, setButtonParentCount] = useState(1)
  const[buttonCount, setButtonCount] = useState(1)
  const[orderObj, setOrderObj] = useState(1)

  const [valueCounts, setValueCounts] = useState({})

  const [imageData, setImageData] = useState([])
  const [singleDesign, setSingleDesign] = useState(null)

  const uploadImageRef = useRef(null);
  const refAddElement = useRef(null);
  const editContainerRef = useRef(null)
  const sideElePickerRef = useRef(null)

  // Icons
  const iconItems = [
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "Mail",
    "Phone",
    "SocialFacebook",
    "SocialInstagram",
    "SocialTiktok",
  ];

  useEffect(() => {
    const keyDown = (e) => {
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

      if (ctrlDown && e.key == "c") setCopiedObj(changeJson.values);

      if (ctrlDown && e.key == "v") {
        if(e.target.nodeName != "INPUT" && e.target.nodeName != "TEXTAREA"){
          const containerEle = (elements, values) => {
            let currentEle = values;
            while (currentEle.type != undefined) {
              currentEle = matchAndGet(elements, currentEle.parent);
              if (currentEle.type == "page") break;
              if (currentEle.type == "container") break;
            }
            return Array.isArray(currentEle) ? undefined : currentEle;
          };

          const parentId = containerEle(jsonValue.elements, changeJson.values);
          if (
            Object.keys(copiedObj).length < 1 ||
            (parentId && parentId.id == copiedObj.id) ||
            parentId == undefined
          )
            return;

          const replaceNumberTest = (string, replaceValue) => {
            const result = string.split("").map((value) => {
              if (/\d/g.test(value)) {
                return replaceValue;
              }
              return value;
            });
            return result.join("");
          };

          const updateEverySingleId = (obj) => {

            const countObject = new Object({
              container: containerCount,
              column: columnsCount,
              text: textCount,
              image: imageCount,
              iconParent: iconParentCount,
              icon: iconCount,
              buttonParent: buttonParentCount,
              button: buttonCount,
              orderObj: orderObj
            })

            const types = [
              {name : "container",        countName : "container"},
              {name : "container-column", countName : "column"},
              {name : "text",             countName : "text"},
              {name : "image",            countName : "image"},
              {name : "icon-parent",      countName : "iconParent"},
              {name : "icon",             countName : "icon"},
              {name : "button-parent",    countName : "buttonParent"},
              {name : "button",           countName : "button"}
            ]

            const mutateObj = (obj, countObject) => {
              if(typeof obj === "object" && obj != null && obj.id){
                for (const type of types){
                  if(obj.type == type.name){
                    obj.id = replaceNumberTest(obj.id, countObject[type.countName])
                    countObject[type.countName] = countObject[type.countName] + 1

                    if(obj.type == "container"){
                      obj.order = new Number(countObject.container) - 1
                    }
                    if(obj.type != "container" && obj.type != "container-column"){
                      obj.parent = replaceNumberTest(obj.parent, countObject.container - 1)
                      obj.order = countObject.orderObj
                      countObject.orderObj = countObject.orderObj + 1
                    }
                  }
                } 
            }

            if(obj.children && Array.isArray(obj.children)){
              for (const child of obj.children){
                mutateObj(child, countObject)
              }
            }
          }

          mutateObj(obj, countObject)
          setContainerCount(countObject.container)
          setColumnsCount(countObject.column)
          setTextCount(countObject.text)
          setImageCount(countObject.image)
          setIconParentCount(countObject.iconParent)
          setIconCount(countObject.icon)
          setButtonParentCount(countObject.buttonParent)
          setButtonCount(countObject.button)
          setOrderObj(countObject.orderObj)
          return obj
          };

          const updatedObj1 = updateEverySingleId(cloneObject(copiedObj))
          const newState = matchAndAdd(jsonValue.elements, parentId.id, updatedObj1);
          setJsonValue({elements: newState})
        }
      }

      if (ctrlDown && e.key == "s") {
        e.preventDefault();
        const valuecounts = new Object({
          containerCount,
          columnsCount,
          textCount,
          imageCount,
          iconParentCount,
          iconCount,
          buttonParentCount,
          buttonCount,
          orderObj,
        })

        let testFile

        htmlToImage.toJpeg(editContainerRef.current, {canvasHeight: 200, canvasWidth: 400}).then(function(dataUrl){
          testFile = dataURLtoFile(dataUrl, designTable + "Screenshot.jpg");
          imageData.push(testFile)
          postImage(imageData)

          if(value && value.Username){
            console.log(singleDesign);
            if(singleDesign){
              udpateNewDesign(designTable, jsonValue.elements, value, valuecounts, testFile.name)
            } else {
              createNewDesign(designTable, jsonValue.elements, value, valuecounts, testFile.name)
            }
          }
        })

        function dataURLtoFile(dataurl, filename) {
          var arr = dataurl.split(','),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[arr.length - 1]), 
              n = bstr.length, 
              u8arr = new Uint8Array(n);
          while(n--){
              u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], filename, {type:mime})
      }
        console.log("Save the jsonValue");
      }
    };

    const keyUp = (e) => {
      if (e.key == "Control") setCtrlDown(false);
    };

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    return () => (
      document.removeEventListener("keydown", keyDown),
      document.removeEventListener("keyup", keyUp)
    );
  });

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

  useEffect(() =>{
      if(Object.keys(value).length > 0){
        getDesignSingle(setSingleDesign, value, designTable)
      }
  },[value])

  useEffect(() =>{
    if(Object.keys(value).length > 0){
      if(singleDesign && singleDesign.jsonvalue){
        setContainerCount(containerCount + singleDesign.valuecounts.containerCount)
        setColumnsCount(columnsCount + singleDesign.valuecounts.columnsCount)
        setTextCount(textCount + singleDesign.valuecounts.textCount)
        setImageCount(imageCount + singleDesign.valuecounts.imageCount)
        setIconParentCount(iconParentCount + singleDesign.valuecounts.iconParentCount)
        setIconCount(iconCount + singleDesign.valuecounts.iconCount)
        setButtonParentCount(buttonParentCount + singleDesign.valuecounts.buttonParentCount)
        setButtonCount(buttonCount + singleDesign.valuecounts.buttonCount)
        setOrderObj(orderObj + singleDesign.valuecounts.orderObj)
        setJsonValue({elements : [singleDesign.jsonvalue]})
      }
    }
  }, [singleDesign])

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
      if (colorUpdate.target.type == "background") {
        updateBackGround(colorUpdate);
        return
      } 
      if(
        colorUpdate.target.type == "container" &&
        colorUpdate.target.id != "border_color"
      ){
        updateBackGround(colorUpdate);
        return
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

      if (e.target.id == "container_element") {
        newElement = new Object({
          type: "container",
          id: `Container-${containerCount}`,
          parent: changeJson.values.id ? changeJson.values.id : "Page",
          order: containerCount,
          height: "100",
          width: "100",
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
              parent: `Container-${containerCount}`,
              id: `column-${columnsCount}`,
              isActive: false,
              isSpace: false,
              children: [],
            },
          ],
        });

        addedElement = matchAndAdd(
          jsonValue.elements,
          changeJson.values.id && changeJson.values.type != "container"
          ? changeJson.values.id
          : "Page",
          newElement
          );

        setContainerCount(containerCount + 1)
        setColumnsCount(columnsCount + 1);
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
          id: `text-${textCount}`,
          order: orderObj,
          wordBreak: "",
          text_color: "",
          text_size: "15",
          text_fontfamily: "Arial",
          text_value: "put your text here",
          text_align: "center",
          children: [],
        });

        addedElement = matchAndAdd(jsonValue.elements, parentId, newElement);
        setTextCount(textCount + 1)
        setOrderObj(orderObj + 1)
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
          id: `image-${imageCount}`,
          order: orderObj,
          url: "",
          children: [],
        });

        addedElement = matchAndAdd(jsonValue.elements, parentId, newElement);
        setImageCount(imageCount + 1)
        setOrderObj(orderObj + 1)
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
          id: `button-parent-${buttonParentCount}`,
          order: orderObj,
          position: "center",
          button_background_color: "white",
          button_color: "black",
          button_size: "",
          button_rounded: "0",
          button_padding: "5",
          button_width: "0",
          children: [
            {
              parent: parentId,
              type: "button",
              id: `button-${buttonCount}`,
              label: "Button",
              icon: "ArrowDown",
              order: buttonCount,
              children: [],
            },
          ],
        });

        addedElement = matchAndAdd(jsonValue.elements, parentId, newElement);
        setButtonParentCount(buttonParentCount + 1)
        setButtonCount(buttonCount + 1)
        setOrderObj(orderObj + 1)
      }

      if (e.target.id == "icon_element") {
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
          type: "icon-parent",
          id: `icon-parent-${iconParentCount}`,
          order: orderObj,
          iconSize: "20",
          position: "center",
          icon_color: "black",
          icon_background: "",
          icon_rounded: "0",
          children: [
            {
              parent: parentId,
              type: "icon",
              id: `icon-${iconCount}`,
              icon: "ArrowDown",
              order: iconCount,
              children: [],
            },
          ],
        });

        addedElement = matchAndAdd(jsonValue.elements, parentId, newElement);
        setIconParentCount(iconParentCount + 1)
        setIconCount(iconCount + 1)
        setOrderObj(orderObj + 1)
      }

      if (newElement !== null) {
        setJsonValue({ elements: addedElement });
      }
    }
  };

  const css_font_family = [
    "Arial",
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

            // updating changeJson state
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

    if (e.target.id == "Background") return;

    const insertIntoArray = (dragValue, targetValue) => {
      const containers = matchAndGet(jsonValue.elements, "Page").children;
      const target = matchAndGet(jsonValue.elements, targetValue.id);

      const key = matchAndGet(jsonValue.elements, dragValue).order;
      const prev = target.order;
      const next = prev + 1;

      const newContainers = containers.map((value) => {
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
    const hoverElement = matchAndGet(jsonValue.elements,
                                     e.target.id.includes("wrapper") ? 
                                     e.target.id.replace("-wrapper","") :
                                     e.target.id );

    if (e.target.getAttribute("dropdownzone")) return;
    if (hoverElement !== null){
      if (hoverElement.type == "text" || 
          hoverElement.type == "image" || 
          hoverElement.type == "button-parent") {
        const parentEle = matchAndGet(jsonValue.elements, hoverElement.parent);
        updateElementParent(
          e.dataTransfer.getData("dragging_container").includes("wrapper") ? 
          e.dataTransfer.getData("dragging_container").replace("-wrapper","") :
          e.dataTransfer.getData("dragging_container"),
          parentEle.id
        );
      }
    };

    updateElementParent(
      e.dataTransfer.getData("dragging_container").includes("wrapper") ? 
      e.dataTransfer.getData("dragging_container").replace("-wrapper","") :
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
                const img_url = new Object({
                  name: e.target.files ? e.target.files[0].name : "",
                  url: URL.createObjectURL(e.target.files[0])
                })

                setImageData(old => [...old, e.target.files[0]])
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
            parent: changeJson.values.id,
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

    const img_url = new Object({
      name: e.target.files ? e.target.files[0].name : "",
      url: URL.createObjectURL(e.target.files[0])
    })

    const target = new Object({
      target: {
        id: e.target.id,
        value: img_url,
      },
    });

    setImageData(old => [...old, e.target.files[0]])
    updateElementsValues(target);
  };

  const handleScroll = () => {
    if (document.querySelector("#Background")) {
      const bg = document.querySelector("#Background");
      setScrollValue(bg.scrollTop);
    }
  };

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

  const handleMultiEleAdd = (e) => {
    if (changeJson.values && changeJson.values.type == "button-parent") {
      const newEle = new Object({
        parent: changeJson.values.id,
        type: "button",
        id: `button-${buttonCount}`,
        label: "Button",
        icon: "ArrowDown",
        order: buttonCount,
        children: [],
      });
      const newState = matchAndAdd(
        jsonValue.elements,
        changeJson.values.id,
        newEle
      );
      const newChange = matchAndGet(newState, changeJson.values.id);

      setButtonCount(buttonCount + 1)
      setJsonValue({ elements: newState });
      setChangeJson((old) => ({ ...old, values: newChange }));
    }

    if (changeJson.values && changeJson.values.type == "icon-parent") {
      const newEle = new Object({
        parent: changeJson.values.id,
        type: "icon",
        id: `icon-${iconCount}`,
        icon: "ArrowDown",
        order: iconCount,
        children: [],
      });
      const newState = matchAndAdd(
        jsonValue.elements,
        changeJson.values.id,
        newEle
      );
      const newChange = matchAndGet(newState, changeJson.values.id);

      setIconCount(iconCount + 1)
      setJsonValue({ elements: newState });
      setChangeJson((old) => ({ ...old, values: newChange }));
    }
  };

  const handleMultiEleDelete = (e) => {
    if (
      (changeJson.values && changeJson.values.type == "button-parent") ||
      changeJson.values.type == "icon-parent"
    ) {
      const deletedState = matchAndDelete(jsonValue.elements, {
        id: e.target.getAttribute("name"),
      });
      const newChange = matchAndGet(deletedState, changeJson.values.id);
      setJsonValue({ elements: deletedState });
      setChangeJson((old) => ({ ...old, values: newChange }));
    }
  };

  const handleDropDown = (e) => {
    if (e.target.getAttribute("type") == "delete") return;

    if (
      elementDropDown.name == e.target.getAttribute("name") &&
      elementDropDown.isActive
    ) {
      setelementDropDown({ name: "", isActive: false });
      return;
    }

    setelementDropDown({
      name: e.target.getAttribute("name"),
      isActive: true,
    });
  };

  const udpateMultiElementValues = (e) => {
    const newState = matchAndUpdate(
      e.target,
      { id: e.target.name },
      jsonValue.elements
    );

    const newChange = matchAndGet(newState, changeJson.values.id);

    setJsonValue({ elements: newState });
    setChangeJson((old) => ({ ...old, values: newChange }));
  };

  const handleColorPicker = (e) =>{
    if(e.currentTarget){
      setInputColorPicker({name: e.currentTarget.getAttribute("name"), id: e.currentTarget.id, idTest: e.target.id})
    }
  }

  useEffect(() =>{
    const colorPickerHide = (e) =>{
      if(e.target.id != inputColorPicker.idTest){
        setInputColorPicker({name: "", id: ""})
      }
    }
    document.addEventListener("click", colorPickerHide)
    return () => {document.removeEventListener("click", colorPickerHide)}
  }, [inputColorPicker])

  return (
    <div>
      {/* <Navbar /> */}
      <div
        ref={sideElePickerRef}
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
        className="fixed top-0 mt-0 flex justify-center bg-gray-300/50 w-full 
                   h-full text-black overflow-y-auto"
        onPointerUp={clickedElement}
        ref={editContainerRef}
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
                  <div
                    id="backgroundColor"
                    name={changeJson.values.id}
                    className=""
                    onClick={handleColorPicker}
                  >
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
                        inputColorPicker.id == "backgroundColor"
                          ? "color_picker active"
                          : "color_picker"
                      }
                    >
                      <PickColor
                        setColorUpdate={setColorUpdate}
                        changeJson={changeJson}
                        type="background_color"
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
                    name="file"
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
                        <div className="flex w-full">
                          <div 
                            className="w-[115px]"
                            name={changeJson.values.id}
                            id={`color-${i}`}
                            onClick={handleColorPicker}
                          >
                            <input
                              data-indexvalue={i}
                              id={`color-${i}`}
                              className="input_color_picker w-full"
                              value={value.color}
                              onChange={updateBackGround}
                            />
                            <div
                              className={
                                inputColorPicker.name == changeJson.values.id &&
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
                            className={
                              inputColorPicker.name == changeJson.values.id &&
                              inputColorPicker.id == `color-${i}`
                              ? "hidden"
                              : "ml-2 slider_style w-[100px]"
                            }
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
                max={100}
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
                    {/* <input
                      id="margin_bottom"
                      // type="number"
                      type="range"
                      className="margin_webkit"
                      value={changeJson.values.margin_bottom}
                      onChange={updateElementsValues}
                    /> */}

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
                <div
                  id="borderColor"
                  name={changeJson.values.id}
                  className=""
                  onClick={handleColorPicker}
                >
                  <input
                    name={changeJson.values.id}
                    id="border_color"
                    className="input_color_picker"
                    value={changeJson.values.border_color}
                    onChange={updateElementsValues}
                  />
                  <div
                    className={
                      inputColorPicker.name == changeJson.values.id && 
                      inputColorPicker.id == "borderColor"
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
                suppressContentEditableWarning={true}
                id="text_value"
                className="bg-[rgba(71,73,88,.475)] p-2 rounded-lg inline-block w-full box-border"
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
                <div
                  id="colorPicker"
                  name={changeJson.values.id}
                  className=""
                  onClick={handleColorPicker}
                >
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
                      inputColorPicker.id == "colorPicker"
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
                          className="w-[115px]"
                          name={changeJson.values.id}
                          id={`color-${i}`}
                          onClick={handleColorPicker}
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
                              inputColorPicker.name == changeJson.values.id &&
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
                          className={
                            inputColorPicker.name == changeJson.values.id &&
                            inputColorPicker.id == `color-${i}`
                              ? "hidden"
                              : "ml-2 slider_style w-[100px]"
                          }
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
                            className="w-[115px]"
                            name={changeJson.values.id}
                            id={`color-${i}`}
                            onClick={handleColorPicker}
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
                                inputColorPicker.name == changeJson.values.id &&
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
                            className={
                              inputColorPicker.name == changeJson.values.id &&
                              inputColorPicker.id == `color-${i}`
                                ? "hidden"
                                : "ml-2 slider_style w-[100px]"
                            }
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
              <div
                id="colorPicker"
                name={changeJson.values.id}
                className=""
                onClick={handleColorPicker}
              >
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
                    inputColorPicker.id == "colorPicker"
                      ? "color_picker active"
                      : "color_picker"
                  }
                >
                  <PickColor
                    setColorUpdate={setColorUpdate}
                    changeJson={changeJson}
                    type="background_color"
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
                max={100}
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
                        onClick={handleDropDown}
                      >
                        {button.label ? button.label : "No label!!"}
                        <div
                          type="delete"
                          className="hover:scale-[1.1] pt-1 h-full"
                          name={button.id}
                          onClick={handleMultiEleDelete}
                        >
                          {changeJson.values.children.length > 1 ? (
                            <BsTrashFill className="pointer-events-none" />
                          ) : null}
                        </div>
                      </div>
                      <div
                        className={
                          elementDropDown.name == button.id &&
                          elementDropDown.isActive
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
                            onChange={udpateMultiElementValues}
                          />
                        </div>
                        <div className="p-2">
                          <h3 className="pb-2">Icon</h3>
                          <select
                            id="icon"
                            className="bg-[rgba(71,73,88,.475)] rounded p-2 w-full"
                            name={button.id}
                            value={button.icon}
                            onChange={udpateMultiElementValues}
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
                onClick={handleMultiEleAdd}
              >
                Add
              </div>
              <h1 className="py-3">Color</h1>
              <div
                id="buttonColor"
                name={changeJson.values.id}
                className=""
                onClick={handleColorPicker}
              >
                <input
                  data-name={changeJson.values.id}
                  id="button_color"
                  className="input_color_picker"
                  value={changeJson.values.button_color}
                  onChange={updateElementsValues}
                />
                <div
                  className={
                    inputColorPicker.name == changeJson.values.id && 
                    inputColorPicker.id == "buttonColor"
                      ? "color_picker active"
                      : "color_picker"
                  }
                >
                  <PickColor
                    setColorUpdate={setColorUpdate}
                    changeJson={changeJson}
                    type="button_color"
                  />
                </div>
              </div>
              <h1 className="py-3">Background color</h1>
              <div
                id="backgroundColor"
                name={changeJson.values.id}
                className=""
                onClick={handleColorPicker}
              >
                <input
                  data-name={changeJson.values.id}
                  id="button_background_color"
                  className="input_color_picker"
                  value={changeJson.values.button_background_color}
                  onChange={updateElementsValues}
                />
                <div
                  className={
                    inputColorPicker.name == changeJson.values.id && 
                    inputColorPicker.id == "backgroundColor"
                      ? "color_picker active"
                      : "color_picker"
                  }
                >
                  <PickColor
                      setColorUpdate={setColorUpdate}
                      changeJson={changeJson}
                    type="button_background_color"
                  />
                </div>
              </div>
              <div className="p-2">
                <div className="flex justify-between">
                  <h3 className="pb-2">Width</h3>
                  <input
                    id="button_width"
                    className="mr-5 rounded px-1 w-[50px] bg-transparent"
                    value={changeJson.values.button_width == 0 ? "auto" : changeJson.values.button_width}
                    onChange={updateElementsValues}
                  />
                </div>
                <input
                  max={500}
                  min={0}
                  id="button_width"
                  type="range"
                  className="slider_style pr-5"
                  value={changeJson.values.button_width}
                  onChange={updateElementsValues}
                />
              </div>
              <div className="p-2">
                <div className="flex justify-between">
                  <h3 className="pb-2">Rounded</h3>
                  <input
                    id="button_rounded"
                    className="mr-5 rounded px-1 w-[50px] bg-transparent"
                    value={changeJson.values.button_rounded}
                    onChange={updateElementsValues}
                  />
                </div>
                <input
                  max={50}
                  min={0}
                  id="button_rounded"
                  type="range"
                  className="slider_style pr-5"
                  value={changeJson.values.button_rounded}
                  onChange={updateElementsValues}
                />
              </div>
              <div className="p-2">
                <div className="flex justify-between">
                  <h3 className="pb-2">Padding</h3>
                  <input
                    id="button_padding"
                    className="mr-5 rounded px-1 w-[50px] bg-transparent"
                    value={changeJson.values.button_padding}
                    onChange={updateElementsValues}
                  />
                </div>
                <input
                  max={50}
                  min={10}
                  id="button_padding"
                  type="range"
                  className="slider_style pr-5"
                  value={changeJson.values.button_padding}
                  onChange={updateElementsValues}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* Button Container Ending */}
      {/* Icon Container Beggining */}
      {changeJson.values &&
      changeJson.values.isActive &&
      changeJson.values.type == "icon-parent" ? (
        <div className="fixed right-0 h-full w-[22em] bg-[rgba(53,54,66,.9825)] z-50 overflow-y-auto">
          <div className="text-white pb-[100px]">
            <h1 className="px-5 py-3 border-b-2 border-black text-lg">
              {changeJson.values.id}
            </h1>
            <div className="pt-5 px-10">
              <div className="border-t-2 border-r-2 border-l-2 rounded-lg border-[rgba(255,255,255,.075)]">
                {changeJson.values.children.map((icon) => {
                  return (
                    <div
                      className="border-[rgba(255,255,255,.075)]"
                      key={icon.id}
                    >
                      <div
                        className="p-2 hover:cursor-pointer 
                                  hover:bg-[rgba(71,73,88,.475)] 
                                  border-b-2 border-[rgba(255,255,255,.075)] 
                                  rounded flex justify-between"
                        name={icon.id}
                        onClick={handleDropDown}
                      >
                        <div className="pointer-events-none"> {icon.icon} </div>
                        <div
                          type="delete"
                          className="hover:scale-[1.1] pt-1 h-full"
                          name={icon.id}
                          onClick={handleMultiEleDelete}
                        >
                          {changeJson.values.children.length > 1 ? (
                            <BsTrashFill className="pointer-events-none" />
                          ) : null}
                        </div>
                      </div>
                      <div
                        className={
                          elementDropDown.name == icon.id &&
                          elementDropDown.isActive
                            ? "px-2 border-b-2 border-[rgba(255,255,255,.075)] rounded"
                            : "hidden"
                        }
                      >
                        <div className="p-2">
                          <h3 className="pb-2">Icon</h3>
                          <select
                            id="icon"
                            className="bg-[rgba(71,73,88,.475)] rounded p-2 w-full"
                            name={icon.id}
                            value={icon.icon}
                            onChange={udpateMultiElementValues}
                          >
                            {iconItems.map((item) => {
                              return (
                                <option
                                  key={item}
                                  id="icon"
                                  value={item}
                                  className="bg-[rgba(53,54,66,.9825)]"
                                >
                                  {item}
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
                onClick={handleMultiEleAdd}
              >
                Add
              </div>
              <div className="p-2">
                <div className="flex justify-between">
                  <h3 className="pb-2">Size</h3>
                  <input
                    id="iconSize"
                    className="mr-5 rounded px-1 w-[50px] bg-transparent"
                    value={changeJson.values.iconSize}
                    onChange={updateElementsValues}
                  />
                </div>
                <input
                  max={100}
                  min={10}
                  id="iconSize"
                  type="range"
                  className="slider_style pr-5"
                  value={changeJson.values.iconSize}
                  onChange={updateElementsValues}
                />
              </div>
              <h1 className="py-3">Color</h1>
              <div
                id="backgroundColor"
                name={changeJson.values.id}
                className=""
                onClick={handleColorPicker}
                >
                <input
                  data-name={changeJson.values.id}
                  id="icon_color"
                  className="input_color_picker"
                  value={changeJson.values.icon_color}
                  onChange={updateElementsValues}
                />
                <div
                  className={
                    inputColorPicker.name == changeJson.values.id && 
                    inputColorPicker.id == "backgroundColor"
                      ? "color_picker active"
                      : "color_picker"
                  }
                >
                  <PickColor
                    setColorUpdate={setColorUpdate}
                    changeJson={changeJson}
                    type="icon_color"
                  />
                </div>
              </div>

              <h1 className="py-3">Background Color</h1>
              <div
                id="color"
                name={changeJson.values.id}
                className=""
                onClick={handleColorPicker}
                >
                <input
                  data-name={changeJson.values.id}
                  id="icon_background"
                  className="input_color_picker"
                  value={changeJson.values.icon_background}
                  onChange={updateElementsValues}
                />
                <div
                  className={
                    inputColorPicker.name == changeJson.values.id && 
                    inputColorPicker.id == "color"
                      ? "color_picker active"
                      : "color_picker"
                  }
                >
                  <PickColor
                    setColorUpdate={setColorUpdate}
                    changeJson={changeJson}
                    type="icon_background"
                  />
                </div>
              </div>
              <div>
              <h1 className="py-3">Position</h1>
              <select
                  id="position"
                  className="bg-[rgba(71,73,88,.475)] rounded w-full p-2"
                  value={changeJson.values.position}
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
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* Icon Container Ending */}

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
            <div
              className="design_new_elements"
              id="icon_element"
              onClick={addNewElement}
            >
              Icons
            </div>
          </div>
        </div>
      ) : null}
      {/* New element Ending here */}
    </div>
  );
};

export default Design;
