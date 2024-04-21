import Image from "next/image";
import React from "react";

const DataSetButton = (props) => {
  return (
    <div className="flex h-full mx-1 flex-col rounded overflow-hidden shadow-lg hover:bg-gray-100 bg-white">
      <div className="flex justify-center my-4">
        <img className="w-1/2" src={props.imageSource} alt="tempPic" />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl text-center mb-2">{props.title}</div>
        <p className="text-gray-700 text-base text-center">{props.body}</p>
      </div>
    </div>
  );
};

export default DataSetButton;
