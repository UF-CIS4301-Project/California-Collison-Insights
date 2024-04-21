import Link from "next/link";
import React from "react";

const Budgets = () => {
  return (
    <main>
      <h1 className="font-bold text-3xl mb-2">US Census Dataset</h1>
      <br />
      <div className="p-10 text-justify rounded shadow-lg bg-white">
        <span>
          Financial and geographical data come from county budget data provided
          by the California State Controller's office. We've incorporated data
          from 2009-2020 into our database to analyze financial factors
          affecting traffic collision trends over these years.
        </span>
        <br />
        <br />
        <span>
          The dataset includes revenue sources and expenditures reported by
          cities, counties, special districts, transportation planning agencies,
          and transit operators for fiscal years 2002 to 2022. The categories of
          expenditures are split into most basic governmental services, such as
          administration and public safety.
        </span>
        <br />
        <br />
        <span>
          Within our database, we store each counties transportation budget.
          This is combined with data from the other sources in a "counties"
          table.
        </span>
      </div>
      <div className="text-center my-10 text-2xl">Link to dataset website:</div>
      <Link href="https://counties.bythenumbers.sco.ca.gov/#!/year/default">
        <div className="w-full  text-2xl text-center bg-black  font-semibold text-white hover:underline py-4 px-6 hover:border-transparent rounded shadow-lg cursor-pointer">
          Financial Data from the California State Controller's Office
        </div>
      </Link>
    </main>
  );
};

export default Budgets;
