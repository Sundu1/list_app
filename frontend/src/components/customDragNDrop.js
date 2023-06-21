
// const clickedElement = (e) => {
// if (placeholderDiv.id) {
//   const deleteState = matchAndDelete(jsonValue.elements, placeholderDiv);
//   setJsonValue({ elements: deleteState });
// }
// if (moved) {
//   setMoved(false);
//   setIsDragging(false);
//   setRefresh(!refresh);
//   // if (placeholderDiv.id) {
//   //   const deleteState = matchAndDelete(jsonValue.elements, placeholderDiv);
//   //   setJsonValue({ elements: deleteState });
//   // }
//   return;
// }

// setIsDragging(false);


// second paragraph
//   const currentDiv = document.querySelector(`#${e.target.id}`);
//   const x_value = e.clientX - currentDiv.offsetLeft;
//   const y_value = e.clientY - currentDiv.offsetTop;

//   setOffset({ x: x_value, y: y_value });

//   const matchedValue = matchAndGet(jsonValue.elements, e.target.id);
//   const test = matchAndGetIndex(jsonValue.elements, e.target.id);

//   if (
//     matchedValue == undefined ||
//     matchedValue.type == "background" ||
//     matchedValue.type == "page"
//   )
//     return;

//   // setRefresh(!refresh);
//   setIsDragging(true);
//   setMovableDiv(matchedValue);
//   setRefresh(!refresh);

//   // placeholder div
//   const placeholderDiv = cloneObject(matchedValue);

//   placeholderDiv.type = "placeholder";
//   placeholderDiv.id = "placeholder";
//   placeholderDiv.offsetLeft = currentDiv.offsetLeft;
//   placeholderDiv.offsetTop = currentDiv.offsetTop;

//   const parentDiv = currentDiv.parentElement.id;
//   const newState = matchAndAdd(jsonValue.elements, parentDiv, placeholderDiv);

//   setPlaceholderDiv(placeholderDiv);
//   setRefresh(!refresh);
//   setJsonValue({ elements: newState });
// };

// const handleMouseMove = (e) => {
//   if (!isDragging) return;
//   const currentDiv = document.querySelector(`#${movableDiv.id}`);

//   currentDiv.style.position = "absolute";
//   currentDiv.style.zIndex = "999";
//   currentDiv.style.left = e.clientX - offset.x + "px";
//   currentDiv.style.top = e.clientY - offset.y + "px";
//   setMoved(true);

//   const allContainer = document.querySelectorAll("[data-type='container']");
// };
