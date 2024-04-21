"use client";
import { useRouter } from "next/navigation";
import React from "react";

const DataSets = () => {
  const router = useRouter();
  const dataSources = [
    {
      key: "collisions",
      value: "California Traffic Incident Data",
    },
    {
      key: "budgets",
      value: "County Budget Data",
    },
    {
      key: "sizes",
      value: "County Size Data",
    },
    {
      key: "census",
      value: "US Census Data",
    },
  ];
  return (
    <main>
      <h1 className="font-bold text-3xl mb-2">Datasets</h1>

      <div className="flex flex-row justify-center">
        {/* Boxes which link to each query */}
        <ul className="text-xl flex-col space-y-12 p-6">
          {dataSources.map((set) => (
            <li
              className="w-full  text-2xl text-center bg-white hover:bg-black text-black font-semibold hover:text-white py-4 px-60 hover:border-transparent rounded shadow-lg cursor-pointer"
              key={set.key}
              onClick={() => {
                router.push(`/datasets/${set.key}`);
              }}
            >
              <span className="relative after:bg-white after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 group-hover:after:w-full after:transition-all after:duration-300">
                {set.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default DataSets;
