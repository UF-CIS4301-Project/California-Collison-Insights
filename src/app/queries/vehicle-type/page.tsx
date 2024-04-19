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
  const [selectedVehicleAge, setVehicleAge] = useState(vehicleAge[0])
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
        label: 'First dataset',
        data: [33, 53, 85, 41, 44, 65],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
      {
        label: 'Second dataset',
        data: [33, 25, 35, 51, 54, 76],
        fill: false,
        borderColor: '#742774',
      },
    ],
  }

  const [selectedData, setData] = useState(dummyData)


  const yearBegin: number = 2009;
  const yearEnd: number = 2020;
  const defaultMonth: number = 1;
  const [currYearBegin, setYearBegin] = useState(yearBegin);
  const [currYearEnd, setYearEnd] = useState(yearEnd);
  const [currMonthFilter, setMonthFilter] = useState(defaultMonth);

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

    let yearQuery = `year_start=${currYearBegin}&year_end=${currYearEnd}`;
    let monthFilter = selectedTime.period == 'Year' ? '' : `&month=${String(currMonthFilter).padStart(2, '0')}`
    let vehicleTypeFilter = selectedVehicleType.type == 'all' ? '' : `&vehicle_type=${selectedVehicleType.type}`
    let vehicleAgeFilter = selectedVehicleAge.age == 'all' ? '' : `$vehicle_age=${selectedVehicleAge.age}`
    let queryString= `?${yearQuery}${monthFilter}${vehicleTypeFilter}${vehicleAgeFilter}`
    setLoading(true);
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

  let monthButton;
  if (selectedTime.period == 'Month') {
    monthButton = MonthInputFilter(handleMonthFilterChange)
  }

  return (
    <div className="">
      <span className="text-4xl">Vehicle type</span>

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
          <div id="age-wrapper" className="z-10">
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
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
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
          <div id="race-wrapper" className="z-10">
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
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
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
              <div className="relative w-full min-w-[200px] h-10">
                <input className="peer shadow-lg w-full h-full bg-white text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                placeholder=""
                onChange={handleStartYearChange}/>
                <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">From - Default 2009
                </label>
              </div>
            </div>
            {/* to certain year input box */}
            <div className="flex w-60 py-4">
              <div className="relative w-full min-w-[200px] h-10">
                <input className="peer w-full h-full bg-white text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 shadow-lg disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                placeholder=" "
                onChange={handleEndYearChange}/><label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">To - Default 2020
                </label>
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
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    style={{ top: '-50%' }}
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
