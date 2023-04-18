import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../index.css";

//top-[58px]

const List = () => {
  return (
    <div className="">
      <Navbar />
      <Sidebar />
      <div className="fixed h-full w-full bg-gray-200">
        <div className="pt-[58px] ml-[16em] h-full">
          <div className="bg-white p-5">New Edit Delete</div>
          <div className=" bg-gray-400 height_full w-full text-white overflow-auto">
            <div className="p-5 ">
              <div className="inline-block p-5 mr-5 bg-black rounded-lg">
                <div className="flex">
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">Header</div>
                  <div className="px-2">test</div>
                  <div className="px-2">test</div>
                  <div className="px-2">test</div>
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
