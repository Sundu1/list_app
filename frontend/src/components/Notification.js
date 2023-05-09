import React from "react";

const Notification = ({ prop }) => {
  return (
    <div className="fixed top-0 left-0 h-full w-full z-50 bg-gray-500/50 flex justify-center">
      <div
        className="bg-white w-[25em] h-[6em] mt-[100px] rounded-lg flex justify-center p-4 slide-down border-2 border-red-500 
                        font-bold"
      >
        {prop}
      </div>
    </div>
  );
};

export { Notification };
