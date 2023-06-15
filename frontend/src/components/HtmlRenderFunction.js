const HtmlRenderFunction = (
  htmlValue,
  setChangeJson,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragging,
  handleDragEnd
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

        newDiv.style.borderColor = element.border_color;
        newDiv.style.borderStyle = element.border_style;
        newDiv.style.borderWidth = element.border_size + "px";
        newDiv.style.borderRadius = element.border_roundness + "px";

        if (element.type == "container") {
          newDiv.setAttribute("data-type", "container");
          newDiv.removeAttribute("draggable");

          newDiv.style.position = element.position;
          newDiv.style.background = element.background_color;
          // newDiv.style.height = element.height + "px";
          newDiv.style.width = element.width + "px";
          newDiv.style.marginLeft = element.margin_left + "px";
          newDiv.style.marginRight = element.margin_right + "px";
          newDiv.style.marginTop = element.margin_top + "px";
          newDiv.style.marginBottom = element.margin_bottom + "px";

          newDiv.style.paddingTop = element.padding_vertical + "px";
          newDiv.style.paddingBottom = element.padding_vertical + "px";
          newDiv.style.paddingLeft = element.padding_horizontal + "px";
          newDiv.style.paddingRight = element.padding_horizontal + "px";

          newDiv.style.display = "flex";
          newDiv.style.justifyContent = "center";
          newDiv.style.alignItems = "center";

          const containerWrapperDiv = document.createElement("div");
          containerWrapperDiv.classList.add("container-wrapper");
          containerWrapperDiv.style.display = "flex";
          containerWrapperDiv.style.justifyContent = "center";
          containerWrapperDiv.style.alignItems = "center";

          containerWrapperDiv.setAttribute("draggable", true);
          containerWrapperDiv.addEventListener("dragstart", handleDragStart);
          containerWrapperDiv.addEventListener("dragstart", () => {
            containerWrapperDiv.style.height =
              document.querySelector(`#${element.id}`).getBoundingClientRect()
                .height + "px";
          });
          containerWrapperDiv.addEventListener("dragover", handleDragOver);
          containerWrapperDiv.addEventListener("drop", handleDrop);
          containerWrapperDiv.addEventListener("drag", handleDragging);
          containerWrapperDiv.addEventListener("dragend", handleDragEnd);

          containerWrapperDiv.onpointerdown = function (e) {
            if (
              e.target.id == element.id ||
              e.target.className == "container-wrapper"
            ) {
              setChangeJson({ values: element });
            }
          };

          if (element.isActive) {
            containerWrapperDiv.style.border = "solid 3px";
            containerWrapperDiv.style.borderColor = "#33ada9";
          }

          containerWrapperDiv.appendChild(newDiv);
          parent.appendChild(containerWrapperDiv);
          if (element.children == null || element.children.length == 0) return;
          traverse_dfs(element.children, element.id);
          return;
        }

        if (element.type == "container-column") {
          newDiv.style.padding = "10px"

          if (element.children.length == 0) {
            newDiv.removeAttribute("draggable");
            newDiv.style.background = "grey";
            newDiv.innerHTML = "Empty";
            newDiv.style.padding = "10px";
            newDiv.style.height = "50px";
            newDiv.style.width = "50px";
          }
        }

        if (element.type == "text") {
          newDiv.setAttribute("data-type", "text");
          newDiv.removeAttribute("draggable");

          newDiv.style.wordBreak = "break-word";
          newDiv.style.marginBottom = element.margin_bottom + "px";
          newDiv.style.color = element.text_color;
          newDiv.style.fontSize = element.text_size + "px";
          newDiv.style.fontFamily = element.text_fontfamily;
          newDiv.innerHTML = element.text_value;

          const containerWrapperDiv = document.createElement("div");
          containerWrapperDiv.id = element.id
          containerWrapperDiv.classList.add("text-wrapper");
          containerWrapperDiv.style.display = "flex";
          containerWrapperDiv.style.justifyContent = "center";
          containerWrapperDiv.style.alignItems = "center";
          containerWrapperDiv.style.padding = "10px";

          containerWrapperDiv.setAttribute("draggable", true);
          containerWrapperDiv.addEventListener(
            "dragstart",
            handleDragStart
          );
          containerWrapperDiv.addEventListener("dragstart", () => {
            containerWrapperDiv.style.height =
              document
                .querySelector(`#${element.id}`)
                .getBoundingClientRect().height + "px";
            containerWrapperDiv.style.width =
              document
                .querySelector(`#${element.id}`)
                .getBoundingClientRect().width + "px";
          });
          containerWrapperDiv.addEventListener(
            "dragover",
            handleDragOver
          );
          containerWrapperDiv.addEventListener("drop", handleDrop);
          containerWrapperDiv.addEventListener(
            "drag",
            handleDragging
          );
          containerWrapperDiv.addEventListener(
            "dragend",
            handleDragEnd
          );

          containerWrapperDiv.onpointerdown = function (e) {
            if (
              e.target.id == element.id ||
              e.target.className == "container-wrapper"
            ) {
              setChangeJson({ values: element });
            }
          };

          if (element.isActive) {
            containerWrapperDiv.style.border = "solid 3px";
            containerWrapperDiv.style.borderColor = "#33ada9";
          }

          containerWrapperDiv.appendChild(newDiv);
          parent.appendChild(containerWrapperDiv);
          if (
            element.children == null ||
            element.children.length == 0
          )
            return;
          traverse_dfs(element.children, element.id);
          return;
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

            let radial_gradient = "";
            element.background_style_types[background_type].gradient.forEach(
              (value) => {
                radial_gradient += `${hexToRgb(
                  value.color,
                  value.transparency
                )} ${value.percentage}%,`;
              }
            );

            function hexToRgb(hex, transparency) {
              var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
                hex
              );
              return result
                ? `rgb(${parseInt(result[1], 16)},${parseInt(
                    result[2],
                    16
                  )},${parseInt(result[3], 16)},${transparency})`
                : hex;
            }

            radial_gradient = radial_gradient.slice(0, -1);
            newDiv.style.backgroundSize = "cover";
            newDiv.style.backgroundPosition =
              "center center, 0% 0%, center center";
            newDiv.style.backgroundImage = `
               radial-gradient(79% 150% at 29% 100%, ${radial_gradient}),
               ${element.background_style_types[background_type].background_url}`;
          }
        }

        if (element.type == "page") {
          const wrapperDiv = document.createElement("div");
          wrapperDiv.classList.add("page-wrapper");
          wrapperDiv.removeAttribute("draggable");
          newDiv.removeAttribute("draggable");

          wrapperDiv.style.position = element.position_div;
          wrapperDiv.style.overflow = "hidden";
          wrapperDiv.style.background = element.background_color;

          wrapperDiv.style.width = element.width + "px";
          wrapperDiv.style.marginLeft = element.margin_left + "px";
          wrapperDiv.style.marginRight = element.margin_right + "px";
          wrapperDiv.style.marginTop = element.margin_top + "px";
          wrapperDiv.style.marginBottom = element.margin_bottom + "px";

          wrapperDiv.style.paddingTop = element.padding_vertical + "px";
          wrapperDiv.style.paddingBottom = element.padding_vertical + "px";
          wrapperDiv.style.paddingLeft = element.padding_horizontal + "px";
          wrapperDiv.style.paddingRight = element.padding_horizontal + "px";

          if (element.position == "center") {
            wrapperDiv.style.left = "50%";
            wrapperDiv.style.transform = "translateX(-50%)";
          }
          if (element.position == "left") {
            wrapperDiv.style.left = "0";
          }
          if (element.position == "right") {
            wrapperDiv.style.left = "100%";
            wrapperDiv.style.transform = "translateX(-100%)";
          }

          wrapperDiv.onpointerdown = function (e) {
            if (
              e.target.id == element.id ||
              e.target.className == "page-wrapper"
            ) {
              setChangeJson({ values: element });
            }
          };

          if (element.isActive) {
            wrapperDiv.style.border = "solid 3px";
            wrapperDiv.style.borderColor = "#33ada9";
          }
          wrapperDiv.appendChild(newDiv);
          parent.appendChild(wrapperDiv);
          if (element.children == null || element.children.length == 0) return;
          traverse_dfs(element.children, element.id);
          return;
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
