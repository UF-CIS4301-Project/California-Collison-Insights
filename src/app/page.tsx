'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";


function IndexPage() {
  const datasets = [{ "key": "one", "value": "random" }, { "key": "two", "value": "random" }, { "key": "three", "value": "random" }, { "key": "four", "value": "random" },]

  let numTuples: number = 0
  const [selectedTuples, setSelectedTuples] = useState(numTuples)

  return (
    <div>
      <div className="w-full h-full flex flex-row justify-center items-center text-center">
        <div className="flex flex-col text-xl m-20 space-y-12">
          <div className="p-10 text-justify rounded shadow-lg bg-white">Welcome Spiel - Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus, et sint nulla beatae non eveniet accusantium ratione velit corrupti labore odio quam voluptatum recusandae culpa quae nesciunt corporis. Architecto, asperiores? Lorem ipsum dolor sit amet consectetur adipisicing elit.
          <br/>
          <br/>
          Click <button>here</button> for total number of tuples in database: {selectedTuples}
          </div>
          <div className="my-10 text-3xl">Feel free to explore the datasets we used</div>

        {/* Box components which describe and link to each of our datasets - currently just holds dummy data/text  */}
          <div className="flex flex-rows justify-evenly">
            {datasets.map((set => (
              <Link href="">
                <div className="max-w-sm rounded overflow-hidden shadow-lg hover:bg-gray-100 bg-white">
                    <img className="w-full" src="/favicon.ico" alt="tempPic"/>
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
                      <p className="text-gray-700 text-base">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
                      </p>
                    </div>
                </div>
              </Link>
            )))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
