"use client";

import React, { useState, Fragment, ChangeEventHandler } from "react";
import { Line } from 'react-chartjs-2';
import { registerables, Chart } from 'chart.js';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { RotatingLines } from 'react-loader-spinner';
import MonthInputFilter from "@/app/components/ui/MonthInputFilter";
import axios from 'axios';


export default function Road() {
  Chart.register(...registerables)

  // Dropdown menu options for graph constraints
  const timeOptions = [
    { id: 1, period: 'Year' },
    { id: 2, period: 'Month' }
  ]

  const countyList = [
    { id: 0, county: "All" },
    { id: 1, county: "Alameda" },
    { id: 2, county: "Alpine" },
    { id: 3, county: "Amador" },
    { id: 4, county: "Butte" },
    { id: 5, county: "Calaveras" },
    { id: 6, county: "Colusa" },
    { id: 7, county: "Contra Costa" },
    { id: 8, county: "Del Norte" },
    { id: 9, county: "El Dorado" },
    { id: 10, county: "Fresno" },
    { id: 11, county: "Glenn" },
    { id: 12, county: "Humboldt" },
    { id: 13, county: "Imperial" },
    { id: 14, county: "Inyo" },
    { id: 15, county: "Kern" },
    { id: 16, county: "Kings" },
    { id: 17, county: "Lake" },
    { id: 18, county: "Lassen" },
    { id: 19, county: "Los Angeles" },
    { id: 20, county: "Madera" },
    { id: 21, county: "Marin" },
    { id: 22, county: "Mariposa" },
    { id: 23, county: "Mendocino" },
    { id: 24, county: "Merced" },
    { id: 25, county: "Modoc" },
    { id: 26, county: "Mono" },
    { id: 27, county: "Monterey" },
    { id: 28, county: "Napa" },
    { id: 29, county: "Nevada" },
    { id: 30, county: "Orange" },
    { id: 31, county: "Placer" },
    { id: 32, county: "Plumas" },
    { id: 33, county: "Riverside" },
    { id: 34, county: "Sacramento" },
    { id: 35, county: "San Benito" },
    { id: 36, county: "San Bernardino" },
    { id: 37, county: "San Diego" },
    { id: 38, county: "San Joaquin" },
    { id: 39, county: "San Luis Obispo" },
    { id: 40, county: "San Mateo" },
    { id: 41, county: "Santa Barbara" },
    { id: 42, county: "Santa Clara" },
    { id: 43, county: "Santa Cruz" },
    { id: 44, county: "Shasta" },
    { id: 45, county: "Sierra" },
    { id: 46, county: "Siskiyou" },
    { id: 47, county: "Solano" },
    { id: 48, county: "Sonoma" },
    { id: 49, county: "Stanislaus" },
    { id: 50, county: "Sutter" },
    { id: 51, county: "Tehama" },
    { id: 52, county: "Trinity" },
    { id: 53, county: "Tulare" },
    { id: 54, county: "Tuolumne" },
    { id: 55, county: "Ventura" },
    { id: 56, county: "Yolo" },
    { id: 57, county: "Yuba" }
  ];

  const roadConditionOptions = [
    { id: 0, condition: "all" },
    { id: 1, condition: "normal" },
    { id: 2, condition: "flooded" },
    { id: 3, condition: "obstruction" },
    { id: 4, condition: "construction" },
    { id: 5, condition: "loose material" },
    { id: 6, condition: "reduced width" },
    { id: 7, condition: "holes" },
    { id: 8, condition: "other" }
  ]

  const lightingOptions = [
    { id: 0, lighting: "all" },
    { id: 1, lighting: "dark with street lights not functioning" },
    { id: 2, lighting: "dark with no street lights" },
    { id: 3, lighting: "dusk or dawn" },
    { id: 4, lighting: "dark with street lights" },
    { id: 5, lighting: "daylight" },
  ]


  const years = [
    { id: 1, year: 2009 },
    { id: 2, year: 2010 },
    { id: 3, year: 2011 },
    { id: 4, year: 2012 },
    { id: 5, year: 2013 },
    { id: 6, year: 2014 },
    { id: 7, year: 2015 },
    { id: 8, year: 2016 },
    { id: 9, year: 2017 },
    { id: 10, year: 2018 },
    { id: 11, year: 2019 },
    { id: 12, year: 2020 }
  ];

  const [currNumStartYear, setNumStartYear] = useState(years[0]);
  const [currNumEndYear, setNumEndYear] = useState(years[11]);

  let yearBegin = 2009;
  let yearEnd = 2020;
  let defaultMonth = 1;
  const [currYearBegin, setYearBegin] = useState(yearBegin);
  const [currYearEnd, setYearEnd] = useState(yearEnd);
  const [selectedTime, setSelectedTime] = useState(timeOptions[0])
  const [selectedRoadCondition, setRoadCondition] = useState(roadConditionOptions[0])
  const [selectedLighting, setLighting] = useState(lightingOptions[0])
  const [loading, setLoading] = useState(false);
  const [selectedCounty, setCounty] = useState(countyList[0]);
  const [currMonthFilter, setMonthFilter] = useState(defaultMonth);

  const options = {
    maintainAspectRatio: false, // Set to false to allow custom size
    responsive: true,
    width: 900, // Width of the chart
    height: 500, // Height of the chart
    "left-y-axis": {
      type: "linear",
      position: "left",
      grid: {
        display: false
      },
    },
    "right-y-axis": {
      type: "linear",
      position: "right",
      grid: {
        display: false
      },
    }
  };

  // Graph data - currently holds dummy data
  const dummyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        yAxisID: "left-y-axis",
        label: 'Dummy Dataset 1',
        data: [0,0,0,0,0,0],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
      {
        yAxisID: "right-y-axis",
        label: 'Dummy Dataset 2',
        data: [0,0,0,0,0,0],
        fill: false,
        borderColor: '#742774',
      },
    ],
  }

  const [data, setData] = useState(dummyData)

  const handleStartYearChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = parseInt(event.target.value, 10);
    if (!newValue)
      setYearBegin(yearBegin)
    else
      setYearBegin(newValue);
  };

  const handleEndYearChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = parseInt(event.target.value, 10);
    if (!newValue)
      setYearEnd(yearEnd)
    else
      setYearEnd(newValue);
  };

  const handleMonthFilterChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = parseInt(event.target.value, 10);
    if (!newValue)
      setMonthFilter(defaultMonth)
    else
      setMonthFilter(newValue);
  };

  const updateDataset = () => {
    let lightingConditionFilter = selectedLighting.lighting == "all" ? '' : `&lighting_condition=${selectedLighting.lighting}`
    let roadConditionFilter = selectedRoadCondition.condition == "all" ? '' : `&road_condition=${selectedRoadCondition.condition}`
    let countyFilter = selectedCounty.county == "All" ? '' : `&county=${selectedCounty.county}`
    let yearString = `?year_start=${currNumStartYear.year}&year_end=${currNumEndYear.year}`;
    let monthFilter = selectedTime.period == 'Year' ? '' : `&month=${String(currMonthFilter).padStart(2, '0')}`
    let queryString = `?${yearString}${monthFilter}${countyFilter}${roadConditionFilter}${lightingConditionFilter}`
    setLoading(true);
    console.log(queryString);
    axios.get(`http://localhost:5000/queries/road${queryString}`)
      .then(response => {
        console.log(response.data);
        var new_labels = response.data.map((a) => { return a['YEAR'] });
        var new_data_points = response.data.map((b) => { return b['AVERAGE_SEVERITY'] });
        var new_data_points_2 = response.data.map((c) => { return c['AVERAGE_POPULATION_DENSITY'] })
        setData({
          labels: new_labels,
          datasets: [
            {
              yAxisID: "left-y-axis",
              label: 'Average Severity',
              data: new_data_points,
              fill: true,
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
            },
            {
              yAxisID: "right-y-axis",
              label: 'Average Population Density',
              data: new_data_points_2,
              fill: false,
              borderColor: '#742774',
            }
          ]
        })
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }

  let monthButton;
  if (selectedTime.period == "Month") {
    monthButton = MonthInputFilter(handleMonthFilterChange);
  }

  return (
    <div className="">
      <span className="text-4xl">Effect of Road Conditions and Population Density on Traffic Collision Severity</span>
      <div className="flex flex-row justify-center">
        <div className="flex flex-row justify-center" style={{ width: '80%', height: '60vh' }}>
          {loading ? <div className="bg-gray-200 rounded-lg flex-grow flex justify-around">
            <RotatingLines
              visible={true}
              width="96"
              strokeColor="rgba(75,192,192,0.9)"
              strokeWidth="5"
              animationDuration="0.75"
            />
          </div> :
            <Line data={data} options={options} className="bg-white" />
          }

        </div>
      </div>

      {/* Different input parameters such as time and gender constraints */}
      <div className="pt-8 pb-4 flex justify-evenly" id="input-parameters">
        {/* Age comparison selection  */}
        <div id="age-comparison" className="flex flex-row justify-center">
          <span className="pt-1.5 px-4">County</span>
          <div id="selected-age-wrapper" className="">
            <Listbox value={selectedCounty} onChange={setCounty}>
              <div className="relative">
                <Listbox.Button className="relative text-center w-40 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedCounty.county}</span>
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
                  <Listbox.Options className="z-20 absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    style={{ top: "0%" }}
                  >
                    {countyList.map((c) => (
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default seelct-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
                          }`
                        }
                        key={c.id}
                        value={c}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate text-center ${selected ? 'font-medium' : 'font-normal'
                                }`}
                            >
                              {c.county}
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

        {/* Race dropdown selection */}
        <div id="race" className="flex flex-row justify-center">
          <span className="pt-1.5 px-4">Road Conditions</span>
          <div id="race-wrapper" className="">
            <Listbox value={selectedRoadCondition} onChange={setRoadCondition}>
              <div className="relative">
                <Listbox.Button className="relative text-center w-32 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedRoadCondition.condition}</span>
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
                  <Listbox.Options className="z-20 absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    style={{ top: "0%" }}
                  >
                    {roadConditionOptions.map((r) => (
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default seelct-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
                          }`
                        }
                        key={r.id}
                        value={r}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate text-center ${selected ? 'font-medium' : 'font-normal'
                                }`}
                            >
                              {r.condition}
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

        <div id="gender" className="flex flex-row justify-center">
          <span className="pt-1.5 px-4">Lighting</span>
          <div id="gender-wrapper" className="">
            <Listbox value={selectedLighting} onChange={setLighting} >
              <div className="relative">
                <Listbox.Button className="relative w-72 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm text-center">
                  <span className="block truncate">{selectedLighting.lighting}</span>
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
                  <Listbox.Options className="z-20 absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    style={{ top: "0%" }}
                    >
                    {lightingOptions.map((g) => (
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default seelct-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
                          }`
                        }
                        key={g.id}
                        value={g}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate text-center ${selected ? 'font-medium' : 'font-normal'
                                }`}
                            >
                              {g.lighting}
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

        <div id="search-button" className="flex flex-row justify-center">
          <button className="flex bg-white shadow-lg hover:bg-black hover:text-bold text-gray-700 font-semibold hover:text-white py-2 px-4 border border-black-500 hover:border-transparent rounded" onClick={updateDataset}>
            Enter Query
          </button>
        </div>
      </div>


      {/* Timeline selection */}
      <div id="horizontal-bar" className="py-4">
        <hr className="opacity-10"
          style={{
            color: 'black',
            backgroundColor: 'black',
            height: 5
          }}
        />
        {/* From certain year input box */}
        <div id="date-selector" className="flex justify-evenly py-4">
          <div className="flex flex-grow justify-evenly">
            <div className="flex w-60 py-4">
              <span className="pr-4 flex items-center">From</span>
              <div id="listbox-wrapper" className="">
                <Listbox value={currNumStartYear} onChange={setNumStartYear} >
                  <div className="relative">
                    <Listbox.Button className="text-center relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">{currNumStartYear.year}</span>
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
                      <Listbox.Options className="z-20 absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                        style={{ top: "-350%" }}>
                        {years.map((y) => (
                          <Listbox.Option
                            className={({ active }) =>
                              `relative cursor-default seelct-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
                              }`
                            }
                            key={y.id}
                            value={y}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate text-center ${selected ? 'font-medium' : 'font-normal'
                                    }`}
                                >
                                  {y.year}
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
            {/* to certain year input box */}
            <div className="flex w-60 py-4">
              <span className="pr-4 flex items-center">To</span>
              <div id="listbox-wrapper" className="">
                <Listbox value={currNumEndYear} onChange={setNumEndYear} >
                  <div className="relative">
                    <Listbox.Button className="text-center relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">{currNumEndYear.year}</span>
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
                      <Listbox.Options className="z-20 absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                        style={{ top: "-350%" }}>
                        {years.map((y) => (
                          <Listbox.Option
                            className={({ active }) =>
                              `relative cursor-default seelct-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
                              }`
                            }
                            key={y.id}
                            value={y}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate text-center ${selected ? 'font-medium' : 'font-normal'
                                    }`}
                                >
                                  {y.year}
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
          <div className="w-1/4 flex flex-row  items-center">
            {/* Time selection (by month/year) dropdown menu */}
            <span className="pr-4">By</span>
            <Listbox value={selectedTime} onChange={setSelectedTime}>
              <div className="relative">
                <Listbox.Button className="relative text-center w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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
                  <Listbox.Options className="z-20 absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    style={{ top: "-120%" }}
                    >
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
                              className={`block truncate text-center ${selected ? 'font-medium' : 'font-normal'
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
            {monthButton}
          </div>
        </div>
      </div>
    </div>
  )
}
