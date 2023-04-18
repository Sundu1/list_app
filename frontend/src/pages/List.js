import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const List = () => {
  return (
    <div className="">
      <Navbar />
      <Sidebar />
      <div className="fixed left-[16em] top-[58px] h-full w-full bg-gray-200">
        <div className="bg-white p-5 overflow-y-scroll">New Edit Delete</div>
        <div className="block w-full h-full text-white overflow-x-scroll">
          <div className="p-5">
            <div className="p-5 bg-black rounded-lg">
              <div className="flex">
                <div className="px-2">Header</div>
                <div className="px-2">Header</div>
                <div className="px-2">Header</div>
                <div className="px-2">Header</div>
                <div className="px-2">Header</div>
                <div className="px-2">Header</div>
              </div>
              <div className="flex">
                <div className="px-2">column</div>
                <div className="px-2">column</div>
                <div className="px-2">column</div>
                <div className="px-2">column</div>
                <div className="px-2">column</div>
                <div className="px-2">column</div>
              </div>
              <div className="flex">
                <div className="px-2">column</div>
                <div className="px-2">column</div>
                <div className="px-2">column</div>
                <div className="px-2">column</div>
                <div className="px-2">column</div>
                <div className="px-2">column</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
