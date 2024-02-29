import Link from 'next/link';


export default function SideNav() {
  return (
    <aside id="sidebar" className="bg-white fixed top-0 left-0 w-32 h-screen">
      <div className="flex flex-col justify-evenly h-full">
        <div className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          <Link href="" className="">Home</Link>
        </div>
        <div></div>
        <div className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          <Link href="" className="">Queries</Link>
        </div>
      </div>
    </aside>
  );
}

{/* <div className="flex flex-col h-full px-3 pb-4 overflow-y-auto bg-white dark:by-gray-800">
  <ul className="space-y-2 font-medium flex">
    <li>
      <Link href="#" className="flex items-center p-2] text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">Home</Link>
    </li>
    <li>
      <Link href="#" className="flex items-center p-2 text-gray-900 rounded-lg darK;text-white hover:by-gray-100 dark:hover:bg-gray-700 group">Queries</Link>
    </li>
  </ul>
</div> */}


