"use client";

import React, { useState, Fragment, ChangeEventHandler } from "react";
import { Line } from 'react-chartjs-2';
import { registerables, Chart } from 'chart.js';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { RotatingLines } from 'react-loader-spinner';
import MonthInputFilter from "@/app/components/ui/MonthInputFilter";
import axios from 'axios';


export default function VehicleType() {
  Chart.register(...registerables)

  // Dropdown menu options for graph constraints
  const timeOptions = [
    { id: 1, period: 'Year' },
    { id: 2, period: 'Month' }
  ]

  const vehicleType = [
    { id: 0, type: 'all'},
    { id: 1, type: 'motorcycle/moped/scooter' },
    { id: 2, type: 'passenger car' },
    { id: 3, type: 'pickup truck' },
    { id: 4, type: 'large vehicles' }
  ]

  const vehicleAge = [
    { id: 0, age: "all", age_value: "" },
    { id: 1, age: "new - 2017 to 2020", age_value: "new" },
    { id: 2, age: "middle - 2013 to 2016", age_value: "middle" },
    { id: 3, age: "old - 2008 to 2012", age_value: "old" },
    { id: 4, age: "very old - older than 2008", age_value: "very old" },
  ]


  const [selectedTime, setSelectedTime] = useState(timeOptions[0])
  const [selectedVehicleType, setVehicleType] = useState(vehicleType[0])
  const [selectedVehicleType2, setVehicleType2] = useState(vehicleType[0])
  const [selectedVehicleAge, setVehicleAge] = useState(vehicleAge[0])
  const [selectedVehicleAge2, setVehicleAge2] = useState(vehicleAge[0])
  const [loading, setLoading] = useState(false);

  const options = {
    maintainAspectRatio: false, // Set to false to allow custom size
    responsive: true,
    width: 900, // Width of the chart
    height: 500 // Height of the chart
  };

  // Graph data - currently holds dummy data
  const dummyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Dummy Dataset 1',
        data: [0,0,0,0,0,0],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
      {
        label: 'Dummy Dataset 2',
        data: [0,0,0,0,0,0],
        fill: false,
        borderColor: '#742774',
      },
    ],
  }

  const [selectedData, setData] = useState(dummyData)


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
  const defaultMonth: number = 1;
  const [currMonthFilter, setMonthFilter] = useState(defaultMonth);
  const [secondQueryChecked, setSecondQueryChecked] = useState(false);

  const handleMonthFilterChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = parseInt(event.target.value, 10);
    if (!newValue)
      setMonthFilter(defaultMonth)
    else
      setMonthFilter(newValue);
  };

  const handleSecondQueryChange = (e) => {
    setSecondQueryChecked(e.target.checked)
  }

  const updateDataset = () => {

    let yearQuery = `year_start=${currNumStartYear.year}&year_end=${currNumEndYear.year}`;
    let monthFilter = selectedTime.period == 'Year' ? '' : `&month=${String(currMonthFilter).padStart(2, '0')}`
    let vehicleTypeFilter = selectedVehicleType.type == 'all' ? '' : `&vehicle_type=${selectedVehicleType.type}`
    let vehicleAgeFilter = selectedVehicleAge.age == 'all' ? '' : `&vehicle_age=${selectedVehicleAge.age_value}`
    let queryString= `?${yearQuery}${monthFilter}${vehicleTypeFilter}${vehicleAgeFilter}`
    setLoading(true);
    console.log(queryString)
    axios.get(`http://localhost:5000/queries/vehicle-type${queryString}`)
      .then(response => {
        var new_labels = response.data.map((a) => { return a['YEAR'] });
        var new_data_points = response.data.map((b) => { return b['FATALITY_PERCENTAGE'] });
        setData({
          labels: new_labels,
          datasets: [
            {
              label: 'Vehicle Data',
              data: new_data_points,
              fill: true,
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
            },
          ]
        })
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }

  const updateDataset2 = () => {

    let yearQuery = `year_start=${currNumStartYear.year}&year_end=${currNumEndYear.year}`;
    let monthFilter = selectedTime.period == 'Year' ? '' : `&month=${String(currMonthFilter).padStart(2, '0')}`
    let vehicleTypeFilter = selectedVehicleType2.type == 'all' ? '' : `&vehicle_type=${selectedVehicleType2.type}`
    let vehicleAgeFilter = selectedVehicleAge2.age == 'all' ? '' : `&vehicle_age=${selectedVehicleAge2.age_value}`
    let queryString = `?${yearQuery}${monthFilter}${vehicleTypeFilter}${vehicleAgeFilter}`
    setLoading(true);
    console.log(queryString)
    axios.get(`http://localhost:5000/queries/vehicle-type${queryString}`)
      .then(response => {
        var new_labels = response.data.map((a) => { return a['YEAR'] });
        var new_data_points = response.data.map((b) => { return b['FATALITY_PERCENTAGE'] });
        setData({
          labels: new_labels,
          datasets: [
            {
              ...selectedData.datasets[0]
            },
            {
              label: 'Second Query Vehicle Data',
              data: new_data_points,
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
  if (selectedTime.period == 'Month') {
    monthButton = MonthInputFilter(handleMonthFilterChange)
  }

  return (
    <div className="">
      <span className="text-4xl">Effect of Vehicle Type and Age on Fatality Rates</span>

      {/* Graph component - currently just two lines with dummy data */}
      <div className="flex flex-row justify-center">
        <div className="flex flex-row justify-center" style={{ width: '80%', height: '60vh' }}>
          { !loading ?
            <Line data={selectedData} options={options} className="bg-white" /> :
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

      <div className="pt-8 pb-4 flex justify-evenly" id="input-parameters">

        <div id="age-comparison" className="flex flex-row justify-center">
          <span className="pt-1.5 px-4">Vehicle Type</span>
          <div id="age-wrapper" className="z-20">
            <Listbox value={selectedVehicleType} onChange={setVehicleType} >
              <div className="relative">
                <Listbox.Button className="relative w-60 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate text-center">{selectedVehicleType.type}</span>
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
                  <Listbox.Options className="z-20 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    style={{ top: '0%' }}
                    >
                    {vehicleType.map((t) => (
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default seelct-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
                          }`
                        }
                        key={t.id}
                        value={t}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block text-center truncate ${selected ? 'font-medium' : 'font-normal'
                                }`}
                            >
                              {t.type}
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

        <div id="race" className="flex flex-row justify-center">
          <span className="pt-1.5 px-4">Vehicle Age</span>
          <div id="race-wrapper" className="z-20">
            <Listbox value={selectedVehicleAge} onChange={setVehicleAge}>
              <div className="relative">
                <Listbox.Button className="relative w-60 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate text-center ">{selectedVehicleAge.age}</span>
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
                  <Listbox.Options className="z-20 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    style={{ top: '0%' }}
                    >
                    {vehicleAge.map((v) => (
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default seelct-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
                          }`
                        }
                        key={v.id}
                        value={v}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block text-center truncate ${selected ? 'font-medium' : 'font-normal'
                                }`}
                            >
                              {v.age}
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
          <button className="flex bg-white shadow-lg hover:bg-black hover:text-bold text-gray-700 font-semibold hover:text-white py-2 px-4 border border-black-500 hover:border-transparent rounded" onClick={secondQueryChecked ? updateDataset2 : updateDataset}>
            Enter Query
          </button>

        </div>
        <div className="flex items-center">
          <input
            id="checked-checkbox"
            type="checkbox"
            value=""
            onChange={handleSecondQueryChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label id="checked-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Second Query</label>
        </div>
      </div>

      {secondQueryChecked ?
        <div className="pt-8 pb-4 flex justify-between">
          <div id="age-comparison" className="flex flex-row justify-center pl-28">
            <span className="pt-1.5 px-4">Vehicle Type</span>
            <div id="age-wrapper" className="z-15">
              <Listbox value={selectedVehicleType2} onChange={setVehicleType2} >
                <div className="relative">
                  <Listbox.Button className="relative w-60 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate text-center">{selectedVehicleType2.type}</span>
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
                    <Listbox.Options className="z-20 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                      style={{ top: '0%' }}
                    >
                      {vehicleType.map((t) => (
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default seelct-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
                            }`
                          }
                          key={t.id}
                          value={t}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block text-center truncate ${selected ? 'font-medium' : 'font-normal'
                                  }`}
                              >
                                {t.type}
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

          <div id="race" className="flex flex-row justify-center pr-28">
            <span className="pt-1.5 px-4">Vehicle Age</span>
            <div id="race-wrapper" className="z-15">
              <Listbox value={selectedVehicleAge2} onChange={setVehicleAge2}>
                <div className="relative">
                  <Listbox.Button className="relative w-60 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate text-center ">{selectedVehicleAge2.age}</span>
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
                    <Listbox.Options className="z-20 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                      style={{ top: '0%' }}
                    >
                      {vehicleAge.map((v) => (
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default seelct-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
                            }`
                          }
                          key={v.id}
                          value={v}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block text-center truncate ${selected ? 'font-medium' : 'font-normal'
                                  }`}
                              >
                                {v.age}
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
          <div className="w-96"/>
        </div>
        : '' }



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
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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
                  <Listbox.Options className="z-20 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    style={{ top: '-140%' }}
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
            {monthButton}
          </div>
        </div>
      </div>
    </div>
  )
}
