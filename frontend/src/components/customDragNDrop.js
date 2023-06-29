  // const [isDragging, setIsDragging] = useState(false);
  // const [offset, setOffset] = useState({ x: 0, y: 0 });
  // const [movableDiv, setMovableDiv] = useState({});
  // const [placeholderDiv, setPlaceholderDiv] = useState({});
  // const [moved, setMoved] = useState(false);
  // const [columnValue, setcolumnValue] = useState("");


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







        // function takeScreenshot() {
        //   const screenshot = editContainerRef.current.cloneNode(true)
        //   screenshot.style.pointerEvents = 'none';
        //   screenshot.style.overflow = 'hidden';
        //   screenshot.style.webkitUserSelect = 'none';
        //   screenshot.style.mozUserSelect = 'none';
        //   screenshot.style.msUserSelect = 'none';
        //   screenshot.style.oUserSelect = 'none';
        //   screenshot.style.userSelect = 'none';
        //   screenshot.dataset.scrollX = window.scrollX;
        //   screenshot.dataset.scrollY = window.scrollY;
        //   var blob = new Blob([screenshot.outerHTML], {
        //     type: 'image/jpg'
        //   });

        //   var img = new Image()
        //   img.src = URL.createObjectURL(blob)
        //   testFile = new File([img], "screenshot01.jpg")
        //   console.log(testFile);
        //   imageData.push(testFile)
        // }

        // takeScreenshot()
        // function generate() {
        //   window.URL = window.URL || window.webkitURL;
        //   window.open(window.URL
        //     .createObjectURL());
        // }

        // sideElePickerRef.current.style.display = 'none'
        // generate()
        
        // createNewDesign(designTable, jsonValue.elements, value, valuecounts)
        // sideElePickerRef.current.style.display = "block"