import React, { createElement } from "react";

const HtmlRenderFunction = (htmlValue, setChangeJson) => {
  let newDiv;

  if (htmlValue && htmlValue.elements) {
    htmlValue.elements.forEach((element) => {
      const parent = document.getElementById(element.parent);
      const element_value = document.getElementById(element.name);
      if (element_value !== null) {
        element_value.remove();
      }
      newDiv = document.createElement(element.type);
      newDiv.id = element.name;
      newDiv.classList.add(element.name);
      newDiv.onclick = function (e) {
        if (e.target.id == element.name)
          setChangeJson({ isChanged: true, name: element.name });
      };
      newDiv.setAttribute("draggable", true);
      newDiv.style.background = element.background_color;
      newDiv.style.height = element.height + "px";
      newDiv.style.width = element.width + "px";
      newDiv.style.border = element.border;
      newDiv.style.marginLeft = element.margin_left + "px";
      newDiv.style.marginRight = element.margin_right + "px";
      newDiv.style.marginTop = element.margin_top + "px";
      newDiv.style.marginBottom = element.margin_bottom + "px";
      parent.appendChild(newDiv);
    });
  }
};

export default HtmlRenderFunction;
