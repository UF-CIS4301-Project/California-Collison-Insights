'use client';

import React, { memo, useState, Fragment } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Slider } from "@nextui-org/react";

import caMap from './data/caCountiesTopo.json';

export default function Geographic() {
  const timeOptions = [
    { id: 1, period: 'Year' },
    { id: 2, period: 'Month' }
  ]

  const [selectedTime, setSelectedTime] = useState(timeOptions[0])
  return (
    <div>
      <span className="text-4xl">Geographic</span>
      <div id="map and input window" className=" flex flex-row">

        <div className="h-[80vh] w-2/3 divide-y-2 divide-black" id="input-parameters">

          <div className="h-1/2 flex flex-col py-2 bg-green-100 items-center justify-center" id="time option selector">
            <div className="bg-red-100 w-full">
              <div className="flex justify-between">
                <span className="text-2xl">2000</span>
                <span className="text-2xl">2020</span>
              </div>
              <input id="steps-range" type="range" min="2000" max="2020" defaultValue="2010" step="1" className="flex flex-row w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
              <div>
                <Listbox value={selectedTime} onChange={setSelectedTime} className="py-2">
                  <div className="flex">
                    <Listbox.Button className="relative w-80px cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">{selectedTime.period}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-100px overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm" >
                        {timeOptions.map((time) => (
                          <Listbox.Option
                            className={({ active }) =>
                              `relative cursor-default seelct-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
                              }`
                            }
                            key={time.id}
                            value={time}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                    }`}
                                >
                                  {time.period}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>
          </div>
          <div className="h-1/2">world</div>
        </div>
        <div className="w-1/6"></div>
        <div className="flex flex-row items-center justify-items-end h-[80vh] w-1/3">
          <div className="p-4 h-[75vh] w-full">

            <ComposableMap className="h-full w-full"
              projection="geoMercator"
              projectionConfig={{
                scale: 3400,
                center: [-120, 37.5]
              }}
              width={1000}
              height={300}
            >
              <Geographies geography={caMap}>
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      stroke="#FFFFFF"
                      style={{
                        hover: {
                          fill: "#F53"
                        }
                      }}


                    />
                  ))
                }
              </Geographies>
            </ComposableMap>
          </div>
        </div>
      </div>
    </div>
  )
}
