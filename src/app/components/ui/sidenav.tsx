"use client";

import Link from 'next/link';


export default function SideNav() {
  return (
    <aside id="sidebar" className="bg-white fixed top-0 left-0 w-32 h-screen">
      <div className="flex flex-col justify-evenly h-full">
        <div className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          <Link href="/" className="hover:underline">Home</Link>
        </div>
        <div></div>
        <div className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          <a href="/queries" className="hover:underline">Queries</a>
        </div>
      </div>
    </aside>
  );
}
