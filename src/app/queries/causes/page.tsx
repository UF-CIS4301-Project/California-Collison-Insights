"use client";

import React, { useState, Fragment } from "react";
import { Line } from 'react-chartjs-2';
import { registerables, Chart } from 'chart.js';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { ChangeEventHandler } from 'react';
import axios from 'axios';
import { RotatingLines } from 'react-loader-spinner';
import MonthInputFilter from '../../components/ui/MonthInputFilter';


export default function CausesVsBudgets() {
  Chart.register(...registerables)

  // Dropdown menu options for graph constraints
  const timeOptions = [
    { id: 1, period: 'Year' },
    { id: 2, period: 'Month' }
  ]

  const causes = [
    { id: 0, cause: 'All'},
    { id: 1, cause: 'common traffic violations' },
    { id: 2, cause: 'driving while impaired' },
    { id: 3, cause: 'failure to give right of way' },
    { id: 4, cause: 'fault of pedestrian' },
    { id: 5, cause: 'mechanical issues' }
  ]

  const raceOptions = [
    { id: 1, race: "White" },
    { id: 2, race: "Black" },
    { id: 3, race: "Asian" },
    { id: 4, race: "Latino" },
  ]

  const countyList = [
    { id: 0, county: "All"},
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

  const yearBegin: number = 2009;
  const yearEnd: number = 2020;
  const [currYearBegin, setYearBegin] = useState(yearBegin);
  const [currYearEnd, setYearEnd] = useState(yearEnd);
  const [selectedTime, setSelectedTime] = useState(timeOptions[0])
  const [selectedCause, setCause] = useState(causes[0])
  const [selectedCounty, setCounty] = useState(countyList[0]);
  const [loaded, setLoading] = useState(true);

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
        yAxisID: "left-y-axis",
        label: 'Dummy Dataset 2',
        data: [0,0,0,0,0,0],
        fill: false,
        borderColor: '#742774',
      },
    ],
  }

  const [data, setData] = useState(dummyData);

  const defaultMonth: number = 1;
  const [currMonthFilter, setMonthFilter] = useState(defaultMonth);

  const handleMonthFilterChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = parseInt(event.target.value, 10);
    if (!newValue)
      setMonthFilter(defaultMonth)
    else
      setMonthFilter(newValue);
  };

  let monthButton;
  if (selectedTime.period == 'Month') {
    monthButton = MonthInputFilter(handleMonthFilterChange);
  }

  const updateDataset = () => {
    setLoading(false);
    let yearString = `year_start=${currNumStartYear.year}&year_end=${currNumEndYear.year}`
    let monthFilter = selectedTime.period == 'Year' ? '' : `&month=${String(currMonthFilter).padStart(2, '0')}`
    let countyFilter = selectedCounty.county == 'All' ? '' : `&county=${selectedCounty.county}`;
    let causeFilter = selectedCause.cause == 'All' ? '' : `&accident_cause=${selectedCause.cause}`
    let queryString = `?${yearString}${monthFilter}${countyFilter}${causeFilter}`;
    console.log(queryString)
    axios.get(`http://localhost:5000/queries/causes${queryString}`)
      .then(response => {
        console.log(response.data);
        var new_labels = response.data.map((a) => { return a['YEAR'] });
        var new_data_points_1 = response.data.map((b) => { return b['ACCIDENTS_PER_1000_CAP'] });
        var new_data_points_2 = response.data.map((b) => { return b['BUDGET_PER_CAP'] });
        setData({
          labels: new_labels,
          datasets: [
            {
              yAxisID: "left-y-axis",
              label: 'Accidents per 1000 Capita',
              data: new_data_points_1,
              fill: true,
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
            },
            {
              yAxisID: "right-y-axis",
              label: 'Budget Per Capita',
              data: new_data_points_2,
              fill: false,
              borderColor: '#742774',
            }
          ]
        })
        setLoading(true);
      })
      .catch(error => {
        setLoading(true);
        console.error(error);
      });
  }

  return (
    <div className="">
      <span className="text-4xl">Possible Cause of Accident vs California Transportation Budget</span>

      {/* Graph component - currently just two lines with dummy data */}
      <div className="flex flex-row justify-center">
        <div className="flex flex-row justify-center" style={{ width: '80%', height: '60vh' }}>
          {loaded ?
            <Line data={data} options={options} className="bg-white" /> :
            <div className="bg-gray-200 rounded-lg flex-grow flex justify-around">
              <RotatingLines
                visible={true}
                width="96"
                strokeColor="rgba(75,192,192,0.9)"
                strokeWidth="5"
                animationDuration="0.75"
              />
            </div>}
        </div>
      </div>

      {/* Different input parameters such as time and gender constraints */}
      <div className="pt-8 pb-4 flex" id="input-parameters">
        {/* Age comparison selection  */}
        <div id="age-comparison" className="flex w-1/3 flex-row justify-center">
          <span className="pt-1.5 px-4">Accident Cause</span>
          <div id="listbox-wrapper" className="z-10 w-60">
            <Listbox value={selectedCause} onChange={setCause} >
              <div className="relative">
                <Listbox.Button className="text-center relative w-60 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedCause.cause}</span>
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
                  <Listbox.Options className="absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                  style={{ top: "0%" }}>
                    {causes.map((c) => (
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
                              {c.cause}
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

        <div id="" className="flex w-1/3 flex-row justify-center">
          <span className="pt-1.5 px-4">County</span>
          <div id="gender-wrapper" className="z-10">
            <Listbox value={selectedCounty} onChange={setCounty} >
              <div className="relative">
                <Listbox.Button className="relative w-40 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate text-center">{selectedCounty.county}</span>
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
                  <Listbox.Options className="absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                  style={{ top: "0%" }}>
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

        <div id="search-button" className="flex w-1/3 flex-row justify-center">
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
                        style={{ top: "-450%" }}>
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
                        style={{ top: "-450%" }}>
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
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate text-center">{selectedTime.period}</span>
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
                  <Listbox.Options className="absolute mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50"
                  style={{ top: "-140%" }}>
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
