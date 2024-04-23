"use client";

import Link from "next/link";
import { useState } from "react";
import DataSetButton from "./components/ui/DataSetButton";
import axios from "axios";

function IndexPage() {
  const datasets = [
    {
      key: "collisions",
      title: "California Traffic Collision Data",
      image: "/car-crash.svg",
      description:
        "Primary data set containing information about traffic conditions, parties involved, and more",
    },
    {
      key: "budgets",
      title: "County Budget Data",
      image: "/money-48.svg",
      description:
        "Supplementary data set containing budget data for different counties in california",
    },
    {
      key: "sizes",
      title: "County Size Data",
      image: "/ruler.svg",
      description:
        "Supplementary data set containing area data for different counties in california",
    },
    {
      key: "census",
      title: "US Census Data",
      image: "/family-7.svg",
      description:
        "Supplementary data set containing census data such as populations for each county",
    },
  ];

  let numTuples: number = 0;
  const [selectedTuples, setSelectedTuples] = useState(numTuples);
  const [loading, setLoading] = useState(false);

  return (
    <main>
      {/* homepage content */}
      <br />
      <div className="p-6 text-justify rounded shadow-lg bg-white">
        <span className="font-bold">Welcome to California Collision Insights!</span>
        <br/>
        <br/>
        At CCI, we're dedicated to bringing you awareness about trends occuring on the roads of California. Whether you're here to find patterns between accident rates and budget expenditures to use in your next legislative meeting, or simply to explore and discover something new, we're thrilled to have you join us on this journey.
        <br />
        <br />
        Click
        <button
          className="cursor hover:uppercase"
          onClick={() => {
            setLoading(true);
            axios
              .get("http://localhost:5000/api/metadata")
              .then((response) => {
                setSelectedTuples(response.data[4]["NUM_TUPLES"]);
                setLoading(false);
              })
              .catch((error) => {
                setLoading(false);
                console.error(error);
              });
          }}
        >
          &nbsp;<u>here</u>&nbsp;
        </button>
        for total number of datapoints in our database:{" "}
        {loading ? <>Loading...</> : <>{selectedTuples.toLocaleString()}</>}
      </div>
      <div className="text-center my-10 text-3xl">
        Feel free to explore the datasets we used
      </div>
      {/* Box components which describe and link to each of our datasets - currently just holds dummy data/text  */}
      <div className="flex flex-rows justify-evenly">
        {datasets.map((set) => (
          <Link href={`/datasets/${set.key}`} key={set.key}>
            <DataSetButton
              title={set.title}
              body={set.description}
              imageSource={set.image}
            />
          </Link>
        ))}
      </div>
    </main>
  );
}

export default IndexPage;
