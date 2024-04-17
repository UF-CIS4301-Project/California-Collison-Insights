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
import Card from 'react-bootstrap/Card';
import { Slider } from "@nextui-org/react";
import axios from 'axios';

import caMap from './data/caCountiesTopo.json';
import { scaleLinear } from "d3-scale";



export default function Geographic() {
  const timeOptions = [
    { id: 1, period: 'Year' },
    { id: 2, period: 'Month' }
  ]

  const timeOfDayOptions = [
    { id: 1, time: 'Morning' },
    { id: 2, time: 'Afternoon' },
    { id: 3, time: 'Evening' },
    { id: 4, time: 'Night' },
    { id: 5, time: 'All' }
  ]

  const weather = [
    { id: 1, condition: 'Sunny' },
    { id: 2, condition: 'Cloudy' },
    { id: 3, condition: 'Snowy' },
    { id: 4, condition: 'Raining' },
    { id: 5, condition: 'Misty' }
  ]

  let maxPerc: number = -1.00;
  let currYear: number = 2010;
  let currCounty: string = "Solano County";
  let accident_percentage_num = 1.0;
  let accident_percentage_str = accident_percentage_num.toFixed(2);
  let county_percentage_map = caMap.objects.subunits.geometries.reduce((accumulator, currentGeometry) => {
    const countyName = currentGeometry.properties['name'].toLowerCase();
    accumulator[countyName] = "1.00";
    return accumulator;
  }, {} as { [key: string]: string });
  const [loaded, setLoaded] = useState(false);


  const [year, setYear] = useState(currYear)
  const [percentage, setPercentage] = useState(accident_percentage_str);
  const [currentMapData, setMapData] = useState(county_percentage_map);
  const [selectedTime, setSelectedTime] = useState(timeOptions[0])
  const [selectedTimeOfDay, setTimeOfDay] = useState(timeOfDayOptions[0])
  const [selectedWeather, setWeather] = useState(weather[0])
  const [selectedCounty, setCounty] = useState(currCounty);
  const [currMaxPerc, setMaxPerc] = useState(maxPerc);

  const onValueChange = (newYear) => {
    setYear(newYear)
  }

  const colorScale = scaleLinear().domain([0, currMaxPerc]).range(['#ddd', "#06F"]);

  const updateDataset = () => {
    try {
    axios.get('http://localhost:5000/queries/geographic')
      .then(response => {
        const new_data = response.data.reduce((accumulator, currentValue) => {
          accumulator[currentValue['COUNTY']] = currentValue['ACCIDENT_PERCENTAGE'];
          return accumulator;
        }, {} as { [key: string]: string });

        setMapData(new_data);

        let maxPercentageValue = -Infinity;

        Object.entries<string>(new_data).forEach((value: [string, string]) => {
          const [county, per] = value;
          const percentageNumber = parseFloat(per);

          if (percentageNumber > maxPercentageValue) {
            maxPercentageValue = percentageNumber;
          }
        });

        setMaxPerc(maxPercentageValue);
        setLoaded(true);
      })
      .catch(error => {
        console.error(error);
      });
    }
    catch (e:any){
      console.log(e);
    }
  }

  return (
    <div className="">
      <span className="text-4xl">Geographic</span>

      <div id="map and input window" className="flex flex-col items-center h-[85vh]">
        {/* Map and information card - After hovering over a certain county, the county's information will be output to the card. Currently, only the county name shows */}
        <div className="flex justify-center pt-4">
          <div className="flex flex-row h-[50vh] w-1/3">
            {/* Map of california by county */}

            <div className="p-4 h-[75vh] w-full">
              <ComposableMap className="h-full w-full"
                projection="geoMercator"
                projectionConfig={{
                  scale: 3400,
                  center: [-120, 34.5]
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
                        // {loading ? <>Loading...</> : <>{selectedTuples.toLocaleString()}</>}
                        fill={loaded ? `${colorScale(currentMapData[geo.properties.name.toLowerCase()])}` : 'rgb(0,0,0)'}
                        style={{
                          hover: {
                            fill: "#F53"
                          }

                        }}
                        onMouseEnter={() => {
                          setCounty(`${geo.properties.fullName}`);
                          setPercentage(currentMapData[geo.properties.name.toLowerCase()])

                        }}


                      />
                    ))
                  }
                </Geographies>
              </ComposableMap>
            </div>
          </div>
          {/* County information box */}

          <Card style={{ width: '24rem' }} className="flex flex-col h-[10vh] outline-2 shadow-md hover:shadow-lg p-2 bg-white rounded-md  text-lg font-bold">
            <Card.Title className="pb-4">County: {selectedCounty}</Card.Title>
            <Card.Subtitle>Accident Percentage: {percentage}</Card.Subtitle>
          </Card>
        </div>
        <div className="py-6"></div>
        <div className="divide-y-2 divide-black" id="input-parameters">

          {/* Timeline range selector - currently only selects one year but can be changed to select a range of years */}
          <div className="flex flex-col py-4 items-center justify-center" id="time option selector">
            <div className="w-[90vh] py-4">
              <div className="flex justify-between">
                <span className="text-2xl pb-2">2000</span>
                <span className="">{year}</span>
                <span className="text-2xl pb-2">2020</span>
              </div>
              {/* Range slider to select the year */}
              <input id="steps-range" type="range" min="2000" max="2020" defaultValue="2010" step="1" onChange={(e) => onValueChange(e.target.value)} className="w-full flex flex-row h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>
          </div>

          <div className="flex h-1/2 flex-row items-center w-full pt-4">

            {/* Time of day dropdown menu */}
            <div className="flex flex-row items-center text-lg w-1/3 justify-center">
              <span className="pr-4">Time of day</span>
              <div className="py-2"> {/* Wrapper Div */}
                <Listbox value={selectedTimeOfDay} onChange={setTimeOfDay}>
                  <div className="">
                    <Listbox.Button className="relative w-80px cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">{selectedTimeOfDay.time}</span>
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
                      <Listbox.Options className="absolute mt-1 max-h-60 w-100px overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                        style={{ top: '80%' }}>
                        {timeOfDayOptions.map((time) => (
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
                                  {time.time}
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

            {/* Weather condition dropdown menu */}
            <div className="flex flex-rows items-center text-lg w-1/3 justify-center">
              <span className="pr-4">Weather Conditions</span>
              <div className="py-2 flex flex-col items-center">
                <Listbox value={selectedWeather} onChange={setWeather}>
                  <div className="">
                    <Listbox.Button className="relative w-80px cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">{selectedWeather.condition}</span>
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
                      <Listbox.Options className="absolute mt-1 max-h-60 w-100px overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                        style={{ top: '80%' }}
                      >
                        {weather.map((w) => (
                          <Listbox.Option
                            className={({ active }) =>
                              `relative cursor-default seelct-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
                              }`
                            }
                            key={w.id}
                            value={w}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                    }`}
                                >
                                  {w.condition}
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

            <div id="search-button" className="flex w-1/3 flex-row justify-center">
              <button className="flex bg-white shadow-lg hover:bg-black hover:text-bold text-gray-700 font-semibold hover:text-white py-2 px-4 border border-black-500 hover:border-transparent rounded"
              onClick={updateDataset}>
                Enter Query
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}
