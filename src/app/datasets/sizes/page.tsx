import Link from "next/link";
import React from "react";

const Sizes = () => {
  return (
    <main>
      <h1 className="font-bold text-3xl mb-2">County Size Dataset</h1>
      <br />
      <div className="p-10 text-justify rounded shadow-lg bg-white">
        <span>
          The National Association of Counties' dataset for california counties
          provides the database with geographic information about each county.
          We use data from 2009-2020 to consider the effect of different county
          sizes on traffic collision trends.
        </span>
        <br />
        <br />
        <span>
          Tuples in this dataset all have a county name, NACo membership status,
          population in the year 2000, area in square miles, county set, and
          year of founding. county.
        </span>
        <br />
        <br />
        <span>
          In our database, we use the datasets area values to contribute to the
          "county" table.
        </span>
      </div>
      <div className="text-center my-10 text-2xl">Link to dataset website:</div>
      <Link href="https://web.archive.org/web/20080314140241/http://www.naco.org/Template.cfm?Section=Find_a_County&Template=/cffiles/counties/state.cfm&state.cfm&statecode=CA">
        <div className="w-full  text-2xl text-center bg-black  font-semibold text-white hover:underline py-4 px-6 hover:border-transparent rounded shadow-lg cursor-pointer">
          California County Size Data from the National Association of Counties
        </div>
      </Link>
    </main>
  );
};

export default Sizes;
