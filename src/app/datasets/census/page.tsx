import Link from "next/link";
import React from "react";

const Census = () => {
  return (
    <main>
      <h1 className="font-bold text-3xl mb-2">US Census Dataset</h1>
      <br />
      <div className="p-10 text-justify rounded shadow-lg bg-white">
        <span>
          To supplement the California traffic collision dataset with population
          data, we've incorporated Census information from 2009-2020 into our
          project provided by the United States Census Bureau.
        </span>
        <br />
        <br />
        <span>
          For each year, the census dataset has tables to view data by state,
          county, or on the national level. At the county level, we have access
          to all kinds of statistics about population, population densities,
          immigration and emmigration, death and birth rates, and much more.
        </span>
        <br />
        <br />
        <span>
          For the purpose of providing information missing from the collisions
          dataset, the census dataset is used for the population and population
          density attributes to form part of the "county" table used in our
          database.
        </span>
      </div>
      <div className="text-center my-10 text-2xl">Link to dataset website:</div>
      <Link href="https://www2.census.gov/programs-surveys/popest/datasets/">
        <div className="w-full  text-2xl text-center bg-black  font-semibold text-white hover:underline py-4 px-6 hover:border-transparent rounded shadow-lg cursor-pointer">
          Population Data from the US Census Bureau
        </div>
      </Link>
    </main>
  );
};

export default Census;
