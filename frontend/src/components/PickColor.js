import React, { useEffect, useRef } from "react";

const PickColor = ({ updateElementsValues }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const height = 100;
    const width = 180;
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
    });
  }, []);

  function valueToHex(r, g, b) {
    const hex = "#" + r.toString(16) + g.toString(16) + b.toString(16);
    return hex;
  }

  return <canvas ref={canvasRef} height="100" width="180"></canvas>;
};

export default PickColor;
