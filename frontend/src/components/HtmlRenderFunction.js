import { logDOM } from "@testing-library/react";
import React, { createElement } from "react";

const HtmlRenderFunction = (
  htmlValue,
  setChangeJson,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragging,
  handleDragEnd,
  handleMouseDown,
  handleMouseMove
) => {
  let newDiv;

  const traverse_dfs = (jsonvalues, parentelement) => {
    if (typeof jsonvalues === "object") {
      jsonvalues.forEach((element) => {
        const parent = document.getElementById(parentelement);
        const element_value = document.getElementById(element.id);

        if (element_value !== null) {
          element_value.remove();
        }

        newDiv = document.createElement("div");
        newDiv.id = element.id;
        newDiv.onpointerdown = function (e) {
          if (e.target.id == element.id) {
            setChangeJson({ values: element });
          }
        };

        newDiv.setAttribute("draggable", true);
        newDiv.addEventListener("dragstart", handleDragStart);
        newDiv.addEventListener("dragover", handleDragOver);
        newDiv.addEventListener("drop", handleDrop);
        newDiv.addEventListener("drag", handleDragging);
        newDiv.addEventListener("dragend", handleDragEnd);
        // newDiv.addEventListener("mousedown", handleMouseDown);
        // newDiv.addEventListener("mousemove", handleMouseMove);

        // if (element.isActive) {
        //   console.log("dfsdfsdfsdf", element);
        //   newDiv.style.borderColor = "red";
        //   newDiv.style.borderStyle = "solid";
        //   newDiv.style.borderWidth = "2px";
        //   newDiv.style.borderRadius = "0";
        // }

        newDiv.style.borderColor = element.border_color;
        newDiv.style.borderStyle = element.border_style;
        newDiv.style.borderWidth = element.border_size + "px";
        newDiv.style.borderRadius = element.border_roundness + "px";

        if (element.type == "placeholder") {
          newDiv.style.background = "grey";
          newDiv.style.height = element.height + "px";
          newDiv.style.width = element.width + "px";

          newDiv.style.border = "3px solid #008080";
          newDiv.style.borderStyle = "dashed";
          newDiv.style.top = element.offsetTop + "px";
          newDiv.style.left = element.offsetLeft + "px";

          newDiv.style.marginLeft = element.margin_left + "px";
          newDiv.style.marginRight = element.margin_right + "px";
          newDiv.style.marginTop = element.margin_top + "px";
          newDiv.style.marginBottom = element.margin_bottom + "px";
        }

        if (element.type == "container") {
          newDiv.setAttribute("data-type", "container");
          newDiv.style.display = element.display;
          newDiv.style.justifyContent = "space-between";
          newDiv.style.background = element.background_color;
          newDiv.style.height = element.height + "px";
          newDiv.style.width = element.width + "px";
          newDiv.style.marginLeft = element.margin_left + "px";
          newDiv.style.marginRight = element.margin_right + "px";
          newDiv.style.marginTop = element.margin_top + "px";
          newDiv.style.marginBottom = element.margin_bottom + "px";

          newDiv.style.paddingTop = element.padding_vertical + "px";
          newDiv.style.paddingBottom = element.padding_vertical + "px";
          newDiv.style.paddingLeft = element.padding_horizontal + "px";
          newDiv.style.paddingRight = element.padding_horizontal + "px";
        }

        if (element.type == "text") {
          newDiv.style.wordBreak = "break-word";
          newDiv.style.marginBottom = element.margin_bottom + "px";
          newDiv.style.color = element.text_color;
          newDiv.style.fontSize = element.text_size + "px";
          newDiv.style.fontFamily = element.text_fontfamily;
          newDiv.innerHTML = element.text_value;
        }

        if (element.type == "background") {
          newDiv.removeAttribute("draggable");
          newDiv.style.position = element.position;
          newDiv.style.height = element.height;
          newDiv.style.width = element.width;

          if (element.background_style_type == "color") {
            const background_type = element.background_style_type;
            newDiv.style.background =
              element.background_style_types[background_type].background_color;
          }
          if (element.background_style_type == "gradient") {
            const gradient_value = element.background_style_types[
              element.background_style_type
            ]
              .map((value) => {
                return `${value.color} ${value.percentage}%`;
              })
              .join(",");

            newDiv.style.background = `linear-gradient(90deg, ${gradient_value})`;
          }
          if (element.background_style_type == "image") {
            const background_type = element.background_style_type;

            // newDiv.style.background =
            //   element.background_style_types[background_type].background_color;

            newDiv.style.backgroundSize = "cover";
            newDiv.style.backgroundPosition =
              "center center, 0% 0%, center center";
            newDiv.style.backgroundImage = `
               radial-gradient(79% 150% at 29% 100%, rgba(135, 92, 161, 0.79) 0%, rgba(66, 95, 199, 0.69) 68%, rgba(0, 148, 255, 0.54) 100%),
               ${element.background_style_types[background_type].background_url}`;
          }
        }

        if (element.type == "page") {
          newDiv.removeAttribute("draggable");
          newDiv.style.overflow = "hidden";
          newDiv.style.position = element.position_div;
          newDiv.style.justifyContent = "space-between";
          newDiv.style.background = element.background_color;
          newDiv.style.height = element.height + "px";
          newDiv.style.width = element.width + "px";
          newDiv.style.marginLeft = element.margin_left + "px";
          newDiv.style.marginRight = element.margin_right + "px";
          newDiv.style.marginTop = element.margin_top + "px";
          newDiv.style.marginBottom = element.margin_bottom + "px";

          newDiv.style.paddingTop = element.padding_vertical + "px";
          newDiv.style.paddingBottom = element.padding_vertical + "px";
          newDiv.style.paddingLeft = element.padding_horizontal + "px";
          newDiv.style.paddingRight = element.padding_horizontal + "px";

          if (element.position == "center") {
            newDiv.style.left = "50%";
            newDiv.style.transform = "translateX(-50%)";
          }
          if (element.position == "left") {
            newDiv.style.left = "0";
          }
          if (element.position == "right") {
            newDiv.style.left = "100%";
            newDiv.style.transform = "translateX(-100%)";
          }
        }

        parent.appendChild(newDiv);
        if (element.children == null || element.children.length == 0) return;
        traverse_dfs(element.children, element.id);
      });
    }
  };

  if (htmlValue && htmlValue.elements) {
    traverse_dfs(htmlValue.elements, "EditContainer");
  }
};

export default HtmlRenderFunction;
