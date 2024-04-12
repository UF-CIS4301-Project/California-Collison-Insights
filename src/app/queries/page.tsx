"use client";

import { useRouter } from "next/navigation";

function QueriesPage() {
  const router = useRouter();
  const queries = [
    {
      key: "at-fault",
      value: "At-fault Party Demographics and Fatality Rates",
    },
    {
      key: "causes",
      value: "Possible Causes of Accidents compared to Budgets",
    },
    {
      key: "geographic",
      value:
        "Geographic Analysis - What areas are more prone to accidents over time?",
    },
    {
      key: "vehicle-type",
      value: "Effect of Vehicle Type and Age of Fatality Rates",
    },
    {
      key: "road",
      value:
        "Effect of Road Conditions and Population Density on Collision Severity",
    },
    { key: "custom", value: "Create Custom Query" },
  ];

  return (
    <main className="">
      <h1 className="font-bold text-3xl mb-2">Queries</h1>
      <div className="flex flex-row justify-center">
        {/* Boxes which link to each query */}
        <ul className="text-xl flex-col space-y-12 p-6">
          {queries.map((queryName) => (
            <li
              className="group text-2xl text-center bg-white hover:bg-black text-black font-semibold hover:text-white py-4 px-4 hover:border-transparent rounded shadow-lg cursor-pointer"
              key={queryName.key}
              onClick={() => {
                router.push(`/queries/${queryName.key}`)
              }}
            >
              <span className="relative after:bg-white after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 group-hover:after:w-full after:transition-all after:duration-300">
                {queryName.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default QueriesPage;
