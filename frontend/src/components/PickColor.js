import React, { useEffect, useRef, useState } from "react";

const PickColor = ({ setColorUpdate, changeJson, type, idValue }) => {
  const canvasRef = useRef(null);
  const colorBlockRef = useRef(null)
  const colorStripRef = useRef(null)

  useEffect(() =>{
    const colorBlock = colorBlockRef.current
    const ctx1 = colorBlock.getContext('2d');
    const width1 = colorBlock.width;
    const height1 = colorBlock.height;

    const colorStrip = colorStripRef.current
    const ctx2 = colorStrip.getContext('2d');
    const width2 = colorStrip.width;
    const height2 = colorStrip.height;

    let x = 0;
    let y = 0;
    let drag = false;
    let rgbaColor = 'rgba(255,0,0,1)';

    ctx1.rect(0, 0, width1, height1);
    fillGradient();

    ctx2.rect(0, 0, width2, height2);
    const grd1 = ctx2.createLinearGradient(0, 0, 0, height1);
    grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
    grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
    ctx2.fillStyle = grd1;
    ctx2.fill();

    function click(e) {
      x = e.offsetX;
      y = e.offsetY
      const imageData = ctx2.getImageData(x, y, 1, 1).data;
      rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
      fillGradient();
    }

    function fillGradient() {
      ctx1.fillStyle = rgbaColor;
      ctx1.fillRect(0, 0, width1, height1);

      const grdWhite = ctx2.createLinearGradient(0, 0, width1, 0);
      grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
      grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
      ctx1.fillStyle = grdWhite;
      ctx1.fillRect(0, 0, width1, height1);

      const grdBlack = ctx2.createLinearGradient(0, 0, 0, height1);
      grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
      grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
      ctx1.fillStyle = grdBlack;
      ctx1.fillRect(0, 0, width1, height1);
    }

    function mousedown(e) {
      drag = true;
      changeColor(e);
    }

    function mousemove(e) {
      if (drag) {
        changeColor(e);
      }
    }

    function mouseup(e) {
      drag = false;
    }

    function changeColor(e) {
      x = e.offsetX;
      y = e.offsetY;
      const imageData = ctx1.getImageData(x, y, 1, 1).data;
      rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';

      const hex = valueToHex(imageData[0], imageData[1], imageData[2])
      let background_color_values;


      if (changeJson.values && changeJson.values.type == "container") {
        if ((type ||= "background_color")) {
          background_color_values = new Object({
            target: {
              id: "background_color",
              value: hex,
            },
          });
        }
        
        if (type == "border_color") {
          background_color_values = new Object({
            target: {
              id: "border_color",
              value: hex,
            },
          });
        }
        if (type == "color") {
          background_color_values = new Object({
            target: {
              id: "color",
              dataset: {
                indexvalue: idValue,
              },
              value: hex,
            },
          });
        }
      }
      
      if (changeJson.values && changeJson.values.type == "text") {
        background_color_values = new Object({
          target: {
            id: "text_color",
            value: hex,
          },
        });
      }
      if (changeJson.values && changeJson.values.type == "background") {
        if ((type ||= "background_color")) {
          background_color_values = new Object({
            target: {
              id: "background_color",
              value: hex,
            },
          });
        }
        if (type == "color") {
          background_color_values = new Object({
            target: {
              id: "color",
              dataset: {
                indexvalue: idValue,
              },
              value: hex,
            },
          });
        }
      }

      if (changeJson.values && changeJson.values.type == "page") {
        background_color_values = new Object({
          target: {
            id: "background_color",
            value: hex,
          },
        });
      }
      setColorUpdate(background_color_values);
    }

    colorStrip.addEventListener("click", click, false);
    colorBlock.addEventListener("mousedown", mousedown, false);
    colorBlock.addEventListener("mouseup", mouseup, false);
    colorBlock.addEventListener("mousemove", mousemove, false);
  }, [])

  function valueToHex(r, g, b) {
    const a = [r, g, b];
    const hex = a
      .map((x) => {
        x = parseInt(x).toString(16);
        return x.length == 1 ? "0" + x : x;
      })
      .join("");
    return "#" + hex;
  }

  return (
    <div className="flex cursor-crosshair">
      {/* <canvas
        id="canvas"
        ref={canvasRef}
        height="150"
        className="w-full rounded-b-[6px] border-2 border-t-0 border-[rgba(53,54,66,.9825)]"
      ></canvas> */}

      <canvas ref={colorStripRef} className="border-2 border-r-0 border-[rgba(53,54,66,.9825)]" id="color-strip" height="150" width="30"></canvas>
      <canvas ref={colorBlockRef} className="border-2 border-[rgba(53,54,66,.9825)]" id="color-block" height="150" width="220"></canvas>  
    </div>
  );
};

export default PickColor;
