import React, { createElement } from "react";

const HtmlRenderFunction = (
  htmlValue,
  setChangeJson,
  handleDragStart,
  handleDragOver,
  handleDrop
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
          if (e.target.id == element.id)
            setChangeJson({ isChanged: true, values: element });
        };
        newDiv.setAttribute("draggable", true);
        newDiv.addEventListener("dragstart", handleDragStart);
        newDiv.addEventListener("dragover", handleDragOver);
        newDiv.addEventListener("drop", handleDrop);

        if (element.type == "container") {
          newDiv.style.display = element.display;
          newDiv.style.justifyContent = "space-between";
          newDiv.style.background = element.background_color;
          newDiv.style.height = element.height + "px";
          newDiv.style.width = element.width + "px";
          newDiv.style.border = element.border;
          newDiv.style.marginLeft = element.margin_left + "px";
          newDiv.style.marginRight = element.margin_right + "px";
          newDiv.style.marginTop = element.margin_top + "px";
          newDiv.style.marginBottom = element.margin_bottom + "px";
        }
        if (element.type == "text") {
          newDiv.style.wordBreak = "break-word";
          newDiv.style.marginBottom = element.margin_bottom + "px";
          newDiv.style.color = element.text_color;
          newDiv.style.fontSize = element.text_size + "px";
          newDiv.style.fontFamily = element.text_fontfamily;
          newDiv.innerHTML = element.text_value;
          newDiv.style.border = element.border;
        }
        if (element.type == "background") {
          console.log(jsonvalues);

          newDiv.removeAttribute("draggable");
          newDiv.style.position = element.position;
          newDiv.style.height = element.height;
          newDiv.style.width = element.width;
          newDiv.style.border = element.border;

          const background_type = element.background_style_type;
          newDiv.style.background =
            element.background_style_types[background_type].background_color;
        }
        if (element.type == "page") {
          newDiv.removeAttribute("draggable");
          newDiv.style.overflow = "hidden";
          newDiv.style.position = element.position_div;
          newDiv.style.display = element.display;
          newDiv.style.justifyContent = "space-between";
          newDiv.style.background = element.background_color;
          newDiv.style.height = element.height + "px";
          newDiv.style.width = element.width + "px";
          newDiv.style.border = element.border;
          newDiv.style.marginLeft = element.margin_left + "px";
          newDiv.style.marginRight = element.margin_right + "px";
          newDiv.style.marginTop = element.margin_top + "px";
          newDiv.style.marginBottom = element.margin_bottom + "px";

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
