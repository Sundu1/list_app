import React, { useEffect, useRef } from "react";

const PickColor = ({ setColorUpdate, test, type, idValue }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const height = canvas.height;
    const width = canvas.width;
    const gradientH = context.createLinearGradient(0, 0, width, 0);
    gradientH.addColorStop(0, "rgb(255, 0, 0)"); // red
    gradientH.addColorStop(1 / 6, "rgb(255, 255, 0)"); // yellow
    gradientH.addColorStop(2 / 6, "rgb(0, 255, 0)"); // green
    gradientH.addColorStop(3 / 6, "rgb(0, 255, 255)");
    gradientH.addColorStop(4 / 6, "rgb(0, 0, 255)"); // blue
    gradientH.addColorStop(5 / 6, "rgb(255, 0, 255)");
    gradientH.addColorStop(1, "rgb(255, 0, 0)"); // red
    context.fillStyle = gradientH;
    context.fillRect(0, 0, width, height);
    const gradientV = context.createLinearGradient(0, 0, 0, height);
    gradientV.addColorStop(0, "rgba(255, 255, 255, 1)"); // white
    gradientV.addColorStop(0.8, "rgba(255, 255, 255, 0)");
    gradientV.addColorStop(0.8, "rgba(0, 0, 0, 0)"); // transparent
    gradientV.addColorStop(1, "rgba(0, 0, 0, 1)"); // black
    context.fillStyle = gradientV;
    context.fillRect(0, 0, width, height);

    canvas.addEventListener("click", (event) => {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const context = canvas.getContext("2d");
      const imgData = context.getImageData(x, y, 1, 1);
      const [r, g, b] = imgData.data;

      const hex = valueToHex(r, g, b);
      let background_color_values;

      if (test.values && test.values.type == "container") {
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
      }

      if (test.values && test.values.type == "text") {
        background_color_values = new Object({
          target: {
            id: "text_color",
            value: hex,
          },
        });
      }
      if (test.values && test.values.type == "background") {
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

      if (test.values && test.values.type == "page") {
        background_color_values = new Object({
          target: {
            id: "background_color",
            value: hex,
          },
        });
      }

      setColorUpdate(background_color_values);
    });
  }, []);

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
    <div>
      <canvas
        id="canvas"
        ref={canvasRef}
        height="150"
        className="w-full rounded-b-[6px] border-2 border-t-0 border-[rgba(53,54,66,.9825)]"
      ></canvas>
    </div>
  );
};

export default PickColor;
