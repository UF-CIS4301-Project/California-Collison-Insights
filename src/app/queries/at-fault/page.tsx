"use client";

import React, { useState, Fragment } from "react";
import { Line } from 'react-chartjs-2';
import { registerables, Chart } from 'chart.js';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import { ChangeEventHandler } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import MonthInputFilter from "@/app/components/ui/MonthInputFilter";

export default function Home() {
  Chart.register(...registerables)

  // Dropdown menu options for graph constraints
  const timeOptions = [
    { id: 1, period: 'Year' },
    { id: 2, period: 'Month' }
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
  ]

  const ageRanges = [
    { id: 0, range: 'all' },
    { id: 1, range: '16-19' },
    { id: 2, range: '20-34' },
    { id: 3, range: '35-54' },
    { id: 4, range: '55-64' },
    { id: 5, range: '65plus' }

  ]

  const raceOptions = [
    { id: 0, race: "all" },
    { id: 1, race: "asian" },
    { id: 2, race: "black" },
    { id: 3, race: "hispanic" },
    { id: 4, race: "other" },
    { id: 5, race: "white" },
  ]

  const genderOptions = [
    { id: 0, gender: "Both" },
    { id: 1, gender: "Male" },
    { id: 2, gender: "Female" },
  ]

  const yearBegin: number = 2009;
  const yearEnd: number = 2020;
  const defaultMonth: number = 1;
  const [selectedTime, setSelectedTime] = useState(timeOptions[0])
  const [selectedAgeRange, setAgeRanges] = useState(ageRanges[0])
  const [selectedAgeRange2, setAgeRanges2] = useState(ageRanges[0])
  const [selectedRace, setRace] = useState(raceOptions[0])
  const [selectedRace2, setRace2] = useState(raceOptions[0])
  const [selectedGender, setGender] = useState(genderOptions[0])
  const [selectedGender2, setGender2] = useState(genderOptions[0])
  const [currMonthFilter, setMonthFilter] = useState(defaultMonth);
  const [loaded, setLoading] = useState(true);
  const [currNumStartYear, setNumStartYear] = useState(years[0]);
  const [currNumEndYear, setNumEndYear] = useState(years[11]);
  const [secondQueryChecked, setSecondQueryChecked] = useState(false);

  const options = {
    maintainAspectRatio: false, // Set to false to allow custom size
    responsive: true,
    width: 900, // Width of the chart
    height: 500 // Height of the chart
  };

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

  // Graph data - currently holds dummy data
  const [selectedData, setData] = useState(dummyData)

  const updateDataset = () => {
    let yStart = `year_start=${currNumStartYear.year}`;
    let yEnd = `year_end=${currNumEndYear.year}`;
    let aRange = selectedAgeRange.range == 'all' ? '' : `&age_range=${selectedAgeRange.range}`;
    let genderFilter = selectedGender.gender == 'Both' ? '' : `&gender=${selectedGender.gender.toLocaleLowerCase()}`;
    let raceFilter = selectedRace.race == 'all' ? '' : `&race=${selectedRace.race}`;
    let monthFilter = selectedTime.period == 'Year' ? '' : `&month=${String(currMonthFilter).padStart(2, '0')}`
    let queryString: string = `?${yStart}&${yEnd}${aRange}${genderFilter}${raceFilter}${monthFilter}`
    let requestUrl: string = `http://localhost:5000/queries/at-fault${queryString}`
    setLoading(false)
    axios.get(requestUrl)
      .then(response => {
        var new_labels = response.data.map((a) => { return a['TIME'] })
        var new_data_points = response.data.map((b) => { return b['FATALITY_PERCENTAGE'] })
        setData({
          labels: new_labels,
          datasets: [
            {
              label: 'At-Fault Percentages',
              data: new_data_points,
              fill: true,
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
            },
          ]
        })
        setLoading(true)
      })
      .catch(error => {
        setLoading(true)
        console.error(error);
      });
  }

  const updateDataset2 = () => {
    let yStart = `year_start=${currNumStartYear.year}`;
    let yEnd = `year_end=${currNumEndYear.year}`;
    let aRange = selectedAgeRange2.range == 'all' ? '' : `&age_range=${selectedAgeRange2.range}`;
    let genderFilter = selectedGender2.gender == 'Both' ? '' : `&gender=${selectedGender2.gender.toLocaleLowerCase()}`;
    let raceFilter = selectedRace2.race == 'all' ? '' : `&race=${selectedRace2.race}`;
    let monthFilter = selectedTime.period == 'Year' ? '' : `&month=${String(currMonthFilter).padStart(2, '0')}`
    let queryString: string = `?${yStart}&${yEnd}${aRange}${genderFilter}${raceFilter}${monthFilter}`
    let requestUrl: string = `http://localhost:5000/queries/at-fault${queryString}`
    setLoading(false)
    axios.get(requestUrl)
      .then(response => {
        var new_labels = response.data.map((a) => { return a['TIME'] })
        var new_data_points = response.data.map((b) => { return b['FATALITY_PERCENTAGE'] })
        setData({
          labels: new_labels,
          datasets: [
            {
              ...selectedData.datasets[0]
            },
            {
              label: 'At-Fault Percentages 2',
              data: new_data_points,
              fill: false,
              borderColor: '#742774',
            }
          ]
        })
        setLoading(true)
      })
      .catch(error => {
        setLoading(true)
        console.error(error);
      });
  }

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

  let monthButton;
  if (selectedTime.period == 'Month') {
    monthButton = MonthInputFilter(handleMonthFilterChange)
  }

  return (
    <div className="">
      <span className="text-4xl">At-fault Party Demographics and Fatality Rates</span>

      {/* Graph component - currently just two lines with dummy data */}
      <div className="flex flex-row justify-center">
        <div className="flex flex-row justify-center" style={{ width: '80%', height: '60vh' }}>
          {loaded ?
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

      {/* Different input parameters such as time and gender constraints */}
      <div className="pt-8 pb-4 flex" id="input-parameters">
        {/* Age comparison selection  */}
        <div id="age-comparison" className="flex w-1/4 flex-row justify-center">
          <span className="pt-1.5 px-4">Age</span>
          <div className="z-20">
            <Listbox value={selectedAgeRange} onChange={setAgeRanges} >
              <div className="relative">
                <Listbox.Button className="relative text-center w-24 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedAgeRange.range}</span>
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
                    style={{ top: '0%' }}>
                    {ageRanges.map((comp) => (
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default seelct-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
                          }`
                        }
                        key={comp.id}
                        value={comp}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate text-center ${selected ? 'font-medium' : 'font-normal'
                                }`}
                            >
                              {comp.range}
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
        <div id="race" className="flex w-1/4 flex-row justify-center">
          <span className="pt-1.5 px-4">Race</span>
          <div className="z-20">
            <Listbox value={selectedRace} onChange={setRace} >
              <div className="relative">
                <Listbox.Button className="relative text-center w-28 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedRace.race}</span>
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
                    style={{ top: '0%' }}>
                    {raceOptions.map((r) => (
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
                              {r.race}
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

        {/* Gender dropwdown selection */}
        <div id="gender" className="flex w-1/4 flex-row justify-center">
          <span className="pt-1.5 px-4">Gender</span>
          <div className="z-20">
            <Listbox value={selectedGender} onChange={setGender} >
              <div className="relative">
                <Listbox.Button className="relative text-center w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedGender.gender}</span>
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
                    style={{ top: '0%' }}>
                    {genderOptions.map((g) => (
                      <Listbox.Option

                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
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
                              {g.gender}
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

        <div id="search-button" className="flex w-1/4 flex-row justify-around">
          <button className="flex bg-white shadow-lg hover:bg-black hover:text-bold text-gray-700 font-semibold hover:text-white py-2 px-4 border border-black-500 hover:border-transparent rounded" onClick={function (event) { if (secondQueryChecked) updateDataset2(); else updateDataset(); }}>
            Enter Query
          </button>
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
      </div>
      {secondQueryChecked ?
        <div className="pt-8 pb-4 flex" id="input-parameters">
          {/* Age comparison selection  */}
          <div id="age-comparison" className="flex w-1/4 flex-row justify-center">
            <span className="pt-1.5 px-4">Age</span>
            <div className="z-10">
              <Listbox value={selectedAgeRange2} onChange={setAgeRanges2} >
                <div className="relative">
                  <Listbox.Button className="relative text-center w-24 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selectedAgeRange2.range}</span>
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
                      style={{ top: '0%' }}>
                      {ageRanges.map((comp) => (
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default seelct-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
                            }`
                          }
                          key={comp.id}
                          value={comp}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate text-center ${selected ? 'font-medium' : 'font-normal'
                                  }`}
                              >
                                {comp.range}
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
          <div id="race" className="flex w-1/4 flex-row justify-center">
            <span className="pt-1.5 px-4">Race</span>
            <div className="z-10">
              <Listbox value={selectedRace2} onChange={setRace2} >
                <div className="relative">
                  <Listbox.Button className="relative text-center w-28 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selectedRace2.race}</span>
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
                      style={{ top: '0%' }}>
                      {raceOptions.map((r) => (
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
                                {r.race}
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

          {/* Gender dropwdown selection */}
          <div id="gender" className="flex w-1/4 flex-row justify-center">
            <span className="pt-1.5 px-4">Gender</span>
            <div className="z-10">
              <Listbox value={selectedGender2} onChange={setGender2} >
                <div className="relative">
                  <Listbox.Button className="relative text-center w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selectedGender2.gender}</span>
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
                      style={{ top: '0%' }}>
                      {genderOptions.map((g) => (
                        <Listbox.Option

                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? 'bg-black text-white' : 'text-black'
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
                                {g.gender}
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
        : ''}


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
              <div className="z-10">
                <Listbox value={currNumStartYear} onChange={setNumStartYear} >
                  <div className="relative">
                    <Listbox.Button className="relative text-center w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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
                      <Listbox.Options className="absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                        style={{ top: '-450%' }}>
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

              <div className="relative w-full min-w-[200px] h-10">
                {/* <input className="peer shadow-lg w-full h-full bg-white text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                  placeholder=" "
                  onChange={handleStartYearChange} />
                <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">From - Default 2009
                </label> */}
              </div>
            </div>





            {/* to certain year input box */}
            <div className="flex w-60 py-4">
              <span className="pr-4 flex items-center">To</span>
              <div className="z-10">
                <Listbox value={currNumEndYear} onChange={setNumEndYear} >
                  <div className="relative">
                    <Listbox.Button className="relative text-center w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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
                      <Listbox.Options className="absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                        style={{ top: '-450%' }}>
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
              {/* <div className="relative w-full min-w-[200px] h-10">
                <input className="peer w-full h-full bg-white text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 shadow-lg disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                  placeholder=" "
                  onChange={handleEndYearChange} />
                <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">To - Default 2020
                </label>
              </div> */}
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
                  <Listbox.Options className="absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    style={{ top: '-140%' }}>
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
    </div >
  )
}
