"use client";
import React, { useState } from "react";
import Link from "next/link";
import { items } from "@/data/nav";

const Navigation = () => {
  const [selected, setSelected] = useState("");
  return (
    <div className="md:px-7 z-30 h-8 md:h-[8vh] bg-blue-200 w-full flex md:justify-between items-center md:text-lg 2xl:text-2xl pl-2">
      <Link
        onClick={() => {
          setSelected("");
        }}
        className="hover:underline w-1/5 2xl:w-1/4 text-3xl font-semibold font-mono"
        href="/"
      >
        <h1>SchedULAr</h1>
      </Link>
      <div className="md:pl-0 pl-3 flex items-center w-1/3 justify-between">
        {items.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            onClick={() => {
              setSelected(item.name);
            }}
            className={`hover:text-gray-500 ${
              selected === item.name
                ? "border-b-2 border-black text-black"
                : "text-black"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Navigation;
