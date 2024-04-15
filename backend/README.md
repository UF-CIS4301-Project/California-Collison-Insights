## Table of Contents <a id="table-of-contents"></a>
1. [Backend Setup](#setup) 
2. API Documentation:
   - [Metadata](#metadata)
   - [Query 1](#query1)
   - [Query 2](#query2)
   - [Query 3](#query3)
   - [Query 4](#query4)
   - [Query 5](#query5)
   - [JSON of CA County Names in Database](#countynames)

## Backend setup instructions <a id="setup"></a>

### 1. Installing dependencies
- Option 1
  1. `pip install -r requirements.txt`
- Option 2
  1. `pip install oracledb`
  2. `pip install python-dotenv`
  3. `pip install flask`

### 2. Connect to UF VPN
Cannot access the Oracle database without being connected to VPN!

### 3. Launch Flask Server
Three options to start Flask Server (which hosts the API endpoints)
  1. Run [flask_server.py](flask_server.py) from inside an IDE
  2. If on a Windows, click the [start_flask.bat](start_flask.bat) batch file
  3. CD to `California-Collison-Insights\backend` in CLI and run `python flask_server.py`

[Back to Table of Contents](#table-of-contents)

## Query API Documentation
### Table Metadata: <a id="metadata"></a>
Table Metadata API URL: 
- `http://localhost:5000/api/metadata`

Table Metadata GET request parameters:
- None

Example Table Metadata API response:
```json
  [
      {
          "NUM_TUPLES": 6330628,
          "TABLE_NAME": "collision"
      },
      {
          "NUM_TUPLES": 1026,
          "TABLE_NAME": "county"
      },
      {
          "NUM_TUPLES": 457600,
          "TABLE_NAME": "party"
      },
      {
          "NUM_TUPLES": 4991159,
          "TABLE_NAME": "victim"
      },
      {
          "NUM_TUPLES": 11780413,
          "TABLE_NAME": "total"
      }
  ]
```

[Back to Table of Contents](#table-of-contents)


### Query 1 (at-fault): <a id="query1"></a>
Query 1 API URL: 
- `http://localhost:5000/queries/at-fault`

Query 1 GET request parameters:
- `year_start` - optional, the lower bound of the year filter
  - any year from `2009` to `2020`, does not have to be smaller than `year_end`
- `year_end` - optional, the upper bound of the year filter
  - any year from `2009` to `2020`, does not have to be larger than `year_start`
- `month` - optional, the month to filter by
  - any month in `MM` format from `01` to `12`
- `age_range` - optional, the age ranges of the at-fault driver to filter results by, valid inputs are as follows:
  ```json
    [
        "16-19",
        "20-34",
        "35-54",
        "55-64",
        "65plus"
    ]
  ```
- `race` optional, the race of the at-fault driver to filter results by, valid inputs are as follows:
  ```json
    [
        "asian",
        "black",
        "hispanic",
        "other",
        "white"
    ]
  ```
- `gender` optional, the gender of the at-fault driver to filter results by, valid inputs are as follows:
  ```json
    [
        "male",
        "female"
    ]
  ```

Example Query 1 API response, filtering by month returns the same format:
```json
  [
      {
          "FATALITY_PERCENTAGE": 0.46,
          "TIME": 2009
      },
      {
          "FATALITY_PERCENTAGE": 0.42,
          "TIME": 2010
      },
      {
          "FATALITY_PERCENTAGE": 0.39,
          "TIME": 2011
      },
      {
          "FATALITY_PERCENTAGE": 0.45,
          "TIME": 2012
      }
  ]
```
[Back to Table of Contents](#table-of-contents)



### Query 2 (causes): <a id="query2"></a>
Query 2 API URL: 
- `http://localhost:5000/queries/causes`

Query 2 GET request parameters:

[Back to Table of Contents](#table-of-contents)


### Query 3 (geographic): <a id="query3"></a>
Query 3 API URL: 
- `http://localhost:5000/queries/geographic`

Query 3 GET request parameters:
- `year` - optional, the year to filter by
  - any year from `2009` to `2020`
- `month` - optional, the month to filter by
  - any month in `MM` format from `01` to `12`
- `day_of_week` - optional, the day of the week to filter by
  - any day from `1` to `7`
  - `1` is Sunday, `2` is Monday, `7` is Saturday, etc.
- `time_of_day` - optional, the time range of day
  ```json
    [
        "02:00-05:59",
        "06:00-09:59",
        "10:00-13:59",
        "14:00-17:59",
        "18:00-21:59",
        "22:00-01:59"
    ]
  ```
- `county` - optional, the name of the county to filter by
  - any of the names of the [counties](#countyname) in our database
  - name is case-insensitive
Example Query 3 API response:
```json
  [
      {
          "ACCIDENT_PERCENTAGE": 0.8,
          "COUNTY": "alameda",
          "YEAR": 2020
      },
      {
          "ACCIDENT_PERCENTAGE": 4.65,
          "COUNTY": "alpine",
          "YEAR": 2020
      },
      {
          "ACCIDENT_PERCENTAGE": 1.12,
          "COUNTY": "amador",
          "YEAR": 2020
      },
      {
          "ACCIDENT_PERCENTAGE": 0.68,
          "COUNTY": "butte",
          "YEAR": 2020
      }
  ]
```
[Back to Table of Contents](#table-of-contents)


### Query 4 (vehicle type): <a id="query4"></a>
Query 4 API URL: 
- `http://localhost:5000/queries/vehicle-type`

Query 4 GET request parameters:
- `year_start` - optional, the lower bound of the year filter
  - any year from `2009` to `2020`, does not have to be smaller than `year_end`
- `year_end` - optional, the upper bound of the year filter
  - any year from `2009` to `2020`, does not have to be larger than `year_start`
- `month` - optional, the month to filter by
  - any month in `MM` format from `01` to `12`
- `vehicle_type` - optional, vehicle type to filter by
  ```json
  [
      "motorcycle/moped/scooter",
      "passenger car",
      "pickup truck",
      "large vehicles"
  ]
  ```
- `vehicle_age` - optional vehicle age range to filter by
  ```json
  [
      "new",
      "middle",
      "old",
      "very old"
  ]
  ``` 
  - `new` - 2017 to 2020
  - `middle` - 2013 to 2016
  - `old` - 2008 to 2012
  - `very old` - older than 2008

Example Query 4 API response:
```json
[
    {
        "FATALITY_PERCENTAGE": 0.51,
        "YEAR": 2009
    },
    {
        "FATALITY_PERCENTAGE": 0.52,
        "YEAR": 2010
    },
    {
        "FATALITY_PERCENTAGE": 0.47,
        "YEAR": 2011
    },
    {
        "FATALITY_PERCENTAGE": 0.47,
        "YEAR": 2012
    },
    {
        "FATALITY_PERCENTAGE": 0.59,
        "YEAR": 2013
    },
    {
        "FATALITY_PERCENTAGE": 0.54,
        "YEAR": 2014
    }
]
```
[Back to Table of Contents](#table-of-contents)


### Query 5 (geographic): <a id="query5"></a>
Query 5 API URL: 
- `http://localhost:5000/queries/geographic`

Query 5 GET request parameters:
- `year_start` - optional, the lower bound of the year filter
  - any year from `2009` to `2020`, does not have to be smaller than `year_end`
- `year_end` - optional, the upper bound of the year filter
  - any year from `2009` to `2020`, does not have to be larger than `year_start`
- `month` - optional, the month to filter by
  - any month in `MM` format from `01` to `12`
- `county` - optional, the name of the county to filter by
  - any of the names of the [counties](#countyname) in our database
  - name is case-insensitive
- `road_condition` - optional, road condition to filter by
  ```json
    [
        "normal",
        "flooded",
        "obstruction",
        "construction",
        "loose material",
        "reduced width",
        "other",
        "holes"
    ]
  ```
- `lighting_condition` - optional, lighting condition to filter by
  ```json
    [
        "dark with street lights not functioning",
        "dark with no street lights",
        "dusk or dawn",
        "dark with street lights",
        "daylight"
    ]
  ```



Example Query 5 response:
  ```json
  [
      {
          "COUNTY_NAME": "ALAMEDA",
          "ROUND(AVERAGE_POPULATION_DENSITY,2)": 2103.41,
          "ROUND(AVERAGE_SEVERITY,2)": 0.13,
          "YEAR": 2015
      },
      {
          "COUNTY_NAME": "ALPINE",
          "ROUND(AVERAGE_POPULATION_DENSITY,2)": 1.57,
          "ROUND(AVERAGE_SEVERITY,2)": 0.19,
          "YEAR": 2015
      },
      {
          "COUNTY_NAME": "AMADOR",
          "ROUND(AVERAGE_POPULATION_DENSITY,2)": 64.11,
          "ROUND(AVERAGE_SEVERITY,2)": 0.2,
          "YEAR": 2015
      },
      {
          "COUNTY_NAME": "BUTTE",
          "ROUND(AVERAGE_POPULATION_DENSITY,2)": 134.14,
          "ROUND(AVERAGE_SEVERITY,2)": 0.19,
          "YEAR": 2015
      }
  ]
  ```

[Back to Table of Contents](#table-of-contents)


### JSON of the CA Counties in Database: <a id="countynames"></a>
  ```json
    [
        "Alameda",
        "Alpine",
        "Amador",
        "Butte",
        "Calaveras",
        "Colusa",
        "Contra Costa",
        "Del Norte",
        "El Dorado",
        "Fresno",
        "Glenn",
        "Humboldt",
        "Imperial",
        "Inyo",
        "Kern",
        "Kings",
        "Lake",
        "Lassen",
        "Los Angeles",
        "Madera",
        "Marin",
        "Mariposa",
        "Mendocino",
        "Merced",
        "Modoc",
        "Mono",
        "Monterey",
        "Napa",
        "Nevada",
        "Orange",
        "Placer",
        "Plumas",
        "Riverside",
        "Sacramento",
        "San Benito",
        "San Bernardino",
        "San Diego",
        "San Joaquin",
        "San Luis Obispo",
        "San Mateo",
        "Santa Barbara",
        "Santa Clara",
        "Santa Cruz",
        "Shasta",
        "Sierra",
        "Siskiyou",
        "Solano",
        "Sonoma",
        "Stanislaus",
        "Sutter",
        "Tehama",
        "Trinity",
        "Tulare",
        "Tuolumne",
        "Ventura",
        "Yolo",
        "Yuba"
    ]
  ```

[Back to Table of Contents](#table-of-contents)
