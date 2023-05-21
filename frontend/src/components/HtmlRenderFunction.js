import React, { createElement } from "react";
import { LoginProvider } from "./LoginProvider";

const HtmlRenderFunction = (
  htmlValue,
  setChangeJson,
  handleDragStart,
  handleDragOver,
  handleDrop
) => {
  let newDiv;

  if (htmlValue && htmlValue.elements) {
    htmlValue.elements.forEach((element, i) => {
      const parent = document.getElementById(element.parent);
      const element_value = document.getElementById(element.id);
      if (element_value !== null) {
        element_value.remove();
      }

      newDiv = document.createElement("div");
      newDiv.id = element.id;
      newDiv.onpointerdown = function (e) {
        if (e.target.id == element.id)
          setChangeJson({ isChanged: true, name: element.id });
      };
      newDiv.setAttribute("draggable", true);
      newDiv.addEventListener("dragstart", handleDragStart);
      newDiv.addEventListener("dragover", handleDragOver);
      newDiv.addEventListener("drop", handleDrop);

      if (element.type == "container") {
        newDiv.style.display = element.display;
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
      if (parent !== null) {
        parent.appendChild(newDiv);
      } else {
        const test = htmlValue.elements.splice(i, 1)[0];
        console.log("test", test);
        htmlValue.elements.push(test);
      }
    });
  }
};

export default HtmlRenderFunction;
