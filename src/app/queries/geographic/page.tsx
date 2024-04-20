'use client';

import React, { memo, useState, Fragment, ChangeEventHandler } from "react";
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
import MonthInputFilter from "@/app/components/ui/MonthInputFilter";
import caMap from './data/caCountiesTopo.json';
import { scaleLinear } from "d3-scale";
import { RotatingLines } from 'react-loader-spinner';



export default function Geographic() {

  const timeOfDayOptions = [
    { id: 0, time: 'All', value: '' },
    { id: 1, time: '2:00 - 5:59', value: "02:00-05:59" },
    { id: 2, time: '6:00 - 9:59', value: "06:00-09:59" },
    { id: 3, time: '10:00 - 13:59', value: "10:00-13:59" },
    { id: 4, time: '14:00 - 17:59', value: "14:00-17:59" },
    { id: 5, time: '18:00 - 21:59', value: "18:00-21:59" },
    { id: 6, time: '22:00 - 01:59', value: "22:00-01:59" }
  ]

  const dayOfWeek = [
    { id: 0, day: "All" },
    { id: 1, day: "Sunday" },
    { id: 2, day: "Monday" },
    { id: 3, day: "Tuesday" },
    { id: 4, day: "Wednesday" },
    { id: 5, day: "Thursday" },
    { id: 6, day: "Friday" },
    { id: 7, day: "Saturday" }
  ]

  let maxPerc: number = -1.00;
  let currYear: number = 2015;
  let currCounty: string = "Solano County";
  let accident_percentage_num = 1.0;
  let defaultMonth = 0;
  let accident_percentage_str = accident_percentage_num.toFixed(2);
  let county_percentage_map = caMap.objects.subunits.geometries.reduce((accumulator, currentGeometry) => {
    const countyName = currentGeometry.properties['name'].toLowerCase();
    accumulator[countyName] = "1.00";
    return accumulator;
  }, {} as { [key: string]: string });
  const [loaded, setLoaded] = useState(false);
  const [loadingData, setLoadingData] = useState(false);


  const [year, setYear] = useState(currYear)
  const [percentage, setPercentage] = useState(accident_percentage_str);
  const [currentMapData, setMapData] = useState(county_percentage_map);
  const [selectedTimeOfDay, setTimeOfDay] = useState(timeOfDayOptions[0])
  const [selectedDay, setDay] = useState(dayOfWeek[0])
  const [selectedCounty, setCounty] = useState(currCounty);
  const [currMaxPerc, setMaxPerc] = useState(maxPerc);
  const [currMonth, setMonthFilter] = useState(defaultMonth);

  const onValueChange = (newYear) => {
    setYear(newYear)
  }

  const colorScale = scaleLinear().domain([0, currMaxPerc]).range(['#ddd', "#06F"]);

  const handleMonthFilterChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = parseInt(event.target.value, 10);
    if (!newValue)
      setMonthFilter(defaultMonth)
    else
      setMonthFilter(newValue);
  };

  const updateDataset = () => {
    try {
      let dayString = selectedDay.day == "All" ? '' : `&day_of_week=${selectedDay.id}`;
      let timeOfDayString = selectedTimeOfDay.time == "All" ? '' : `&time_of_day=${selectedTimeOfDay.value}`
      let yearString = `year=${year}`
      let monthFilter = currMonth == defaultMonth ? '' : `&month=${String(currMonth).padStart(2, '0')}`
      let queryString = `?${yearString}${monthFilter}${timeOfDayString}${dayString}`
      setLoadingData(true);
      axios.get(`http://localhost:5000/queries/geographic${queryString}`)
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
          setLoadingData(false);
        })
        .catch(error => {
          console.error(error);
          setLoadingData(false);
        });
    }
    catch (e: any) {
      console.log(e);
    }
  }

  let monthButton = (
    <div className="w-1/3">
      <div className="relative min-w-[50px] h-10">
        <input className="peer shadow-lg w-40 h-full bg-white text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
          placeholder=""
          onChange={handleMonthFilterChange} />
        <label className="flex w-40 h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">Month - Default All
        </label>
      </div>
    </div>)
  return (
    <div className="">
      {/* <span className="text-4xl">Geographic</span> */}

      <div id="map and input window" className="flex flex-col items-center h-[85vh]">
        {/* Map and information card - After hovering over a certain county, the county's information will be output to the card. Currently, only the county name shows */}
        <div className="flex justify-center pt-4">
          <div className="flex flex-row h-[50vh] w-1/3">
            {/* Map of california by county */}

            <div className="p-4 h-[75vh] w-full flex">
              {loadingData ?
                <div className="flex flex-grow pb-10 w-[100vh] justify-around">
                  <RotatingLines
                    visible={true}
                    width="96"
                    strokeColor="rgba(75,192,192,0.9)"
                    strokeWidth="5"
                    animationDuration="0.75"
                  />
                </div> :
                <ComposableMap className="h-full w-full"
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 3400,
                    center: [-120, 36.5]
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
              }
            </div>
          </div>
          {/* County information box */}

          <Card style={{ width: '24rem' }} className="absolute flex flex-col h-[10vh] outline-2 shadow-md hover:shadow-lg p-2 bg-white rounded-md  text-lg font-bold">
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
                <span className="text-2xl pb-2">2009</span>
                <span className="">{year}</span>
                <span className="text-2xl pb-2">2020</span>
              </div>
              {/* Range slider to select the year */}
              <input id="steps-range" type="range" min="2009" max="2020" defaultValue="2015" step="1" onChange={(e) => onValueChange(e.target.value)} className="w-full flex flex-row h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>
          </div>

          <div className="flex h-1/2 flex-row items-center w-full pt-4">
            <div className="w-1/5">{monthButton}</div>

            {/* Time of day dropdown menu */}
            <div className="flex flex-row items-center text-lg w-1/2 justify-center">
              <span className="pr-4">Time of day</span>
              <div className="py-2"> {/* Wrapper Div */}
                <Listbox value={selectedTimeOfDay} onChange={setTimeOfDay}>
                  <div className="">
                    <Listbox.Button className="relative text-center w-30 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate text-center">{selectedTimeOfDay.time}</span>
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
                      <Listbox.Options className="absolute mt-1 max-h-40 w-30 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                        style={{ top: '81.5%' }}>
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
                                  className={`block text-center truncate ${selected ? 'font-medium' : 'font-normal'
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

            <div className="flex flex-rows items-center text-lg w-1/2 justify-center">
              <span className="pr-4">Day of Week</span>
              <div className="py-2 flex flex-col items-center">
                <Listbox value={selectedDay} onChange={setDay}>
                  <div className="">
                    <Listbox.Button className="relative w-36 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate text-center">{selectedDay.day}</span>
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
                      <Listbox.Options className="absolute mt-1 max-h-40 w-36 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                        style={{ top: '81.5%' }}
                      >
                        {dayOfWeek.map((d) => (
                          <Listbox.Option
                            className={({ active }) =>
                              `relative cursor-default seelct-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
                              }`
                            }
                            key={d.id}
                            value={d}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate text-center ${selected ? 'font-medium' : 'font-normal'
                                    }`}
                                >
                                  {d.day}
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

            <div id="search-button" className="flex w-1/4 flex-row justify-center">
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
