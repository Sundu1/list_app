import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const List = () => {
  return (
    <div className="">
      <Navbar />
      <Sidebar />
      <div className="fixed top-[58px] h-full w-full bg-gray-200">
        <div className="ml-[16em] h-full">
          <div className="bg-white p-5">New Edit Delete</div>
          <div className="w-full h-full text-white overflow-y-scroll">
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
    </div>
  );
};

export default List;
