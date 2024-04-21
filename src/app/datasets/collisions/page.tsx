import Link from "next/link";
import React from "react";

const Collisions = () => {
  return (
    <main>
      <h1 className="font-bold text-3xl mb-2">Traffic Incident Dataset</h1>
      <br />
      <div className="p-10 text-justify rounded shadow-lg bg-white">
        <span>
          The main dataset utilized for this analysis is sourced from the
          California Traffic Collision Data, as provided by SWITRS. Covering
          incidents from 2009 to 2020, this dataset compiles comprehensive
          information regarding every traffic collision within the state. Each
          tuple in the dataset is keyed using case numbers from the police
          reports associated with each of these crashes.{" "}
        </span>
        <br />
        <br />
        <span>
          Information from this dataset is originally split into tables for case
          IDs, collisions, parties, and victims, describing a wealth of over 30
          attributes worth of information per incident, including demographic
          data on victims and responsible parties, as well as collision details
          such as the number of fatalities and the cause of the collision, as
          well as various conditions surrounding the crash, such as date, time
          of day, weather conditions, and the location of the incident by
          county.
        </span>
        <br />
        <br />
        <span>
          All queries to our database involve information from this dataset.
          Additionally, we've parsed down the original dataset into only the
          columns needed for these queries and split them into the smaller
          versions of the collisions, parties, and victims tables.
        </span>
      </div>
      <div className="text-center my-10 text-2xl">Link to dataset website:</div>
      <Link href="https://www.kaggle.com/datasets/alexgude/california-traffic-collision-data-from-switrs/data">
        <div className="w-full  text-2xl text-center bg-black  font-semibold text-white hover:underline py-4 px-6 hover:border-transparent rounded shadow-lg cursor-pointer">
          California Traffic Collision Data from SWITRS
        </div>
      </Link>
    </main>
  );
};

export default Collisions;
