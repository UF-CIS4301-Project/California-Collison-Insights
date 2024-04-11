"use client";

import Link from "next/link";
import Router, { useRouter } from "next/navigation";

export default function SideNav() {
  const router = useRouter();
  return (
    <div
      id="screenHeight"
      className="flex flex-col justify-evenly text-center bg-gray-300 w-[25vh]"
    >
      <button
        className="flex items-center justify-center flex-grow p-10 w-full text-xl font-semibold hover:bg-gray-200"
        onClick={() => {
          router.push("/");
        }}
      >
        Home
      </button>
      <hr className="border-t-2 border-gray-100" />
      <button
        className="flex items-center justify-center flex-grow p-10 w-full text-xl font-semibold hover:bg-gray-200"
        onClick={() => {
          router.push("/queries");
        }}
      >
        Queries
      </button>
      <hr className="border-t-2 border-gray-100" />
      <button
        className="flex items-center justify-center flex-grow p-10 w-full text-xl font-semibold hover:bg-gray-200"
        onClick={() => {
          router.push("/queries");
        }}
      >
        Datasets
      </button>
    </div>
  );
}
