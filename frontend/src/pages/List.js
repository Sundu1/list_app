import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../index.css";
import { RiLoginBoxFill } from "react-icons/ri";

//top-[58px]

const columns = [];
const rows = [];

for (let i = 0; i < 100; ++i) {
  columns.push(i);
}

for (let i = 0; i < 10; ++i) {
  rows.push(i);
}

const List = () => {
  return (
    <div className="">
      <Navbar />
      <Sidebar />
      <div className="relative h-full w-full bg-gray-400">
        <div className="h-full pt-[58px] ml-[16em] overflow-auto">
          <div className="absolute w-full bg-white p-5">New Edit Delete</div>
          <div className="pt-[60px] h-full w-full text-white ">
            <div className="h-full p-5">
              <div className="inline-block p-5 mr-5 bg-black rounded-lg min-w-full min-h-full">
                <div className="flex">
                  {columns.map((_) => {
                    return (
                      <div className="p-2">
                        {rows.map((_) => {
                          return <div>test</div>;
                        })}
                      </div>
                    );
                  })}
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
