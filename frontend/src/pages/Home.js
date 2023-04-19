import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { RiFileList3Line } from "react-icons/ri";
import Login from "./Login";

const Home = () => {
  const testLists = [
    { id: 1, name: "Санал гомдлын бүртгэл" },
    { id: 2, name: "Тэжээлийн бүртгэл" },
    { id: 3, name: "Салбарын дэмжлэг" },
    { id: 4, name: "Дэгдээхэй бойжуулах" },
    { id: 5, name: "Жор" },
    { id: 6, name: "Илүү цаг & гадуур ажиллах хүсэлт" },
    { id: 7, name: "Чөлөөлийн хүсэлт" },
    { id: 8, name: "Тоног төхөөрөмжийн хүсэлт" },
    { id: 9, name: "test9" },
    { id: 10, name: "test9" },
    { id: 11, name: "test9" },
    { id: 12, name: "test9" },
    { id: 13, name: "test9" },
    { id: 14, name: "test9" },
    { id: 15, name: "test9" },
  ];

  return (
    <div className="relative">
      <Navbar />
      <Sidebar />
      <div className="fixed h-full w-full overflow-y-scroll">
        <div className="p-4 sm:ml-[13em] flex justify-center">
          <div className="ml-[100px] p-4 rounded-lg dark:border-gray-700 mt-14 w-[65em]">
            <div className="grid grid-cols-5 gap-[30px] w-[900px]">
              {testLists.map((value) => {
                return (
                  <div
                    key={value.id}
                    className="bg-gray-100 hover:bg-gray-300 h-[180px] w-[151px] rounded transition ease-in-out cursor-pointer"
                  >
                    <div className="p-5 flex justify-center content-between text-[80px]">
                      <RiFileList3Line />
                    </div>
                    <p className="p-2 text-center text-[12px] font-san">
                      {value.name.length > 18
                        ? value.name.substring(0, 18) + "..."
                        : value.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
