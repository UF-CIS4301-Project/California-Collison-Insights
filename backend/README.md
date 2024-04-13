## Table of Contents
1. [Backend Setup](#setup)
2. [Query 1](#query1)
3. [Query 2](#query2)
4. [Query 3](#query3)
5. [Query 4](#query4)
6. [Query 5](#query5)

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


## Query API Documentation
### Query 1 (at-fault): <a id="query1"></a>
Query 1 API URL: 
- `http://localhost:5000/queries/at-fault`

Query 1 GET request parameters:
- `year_start` - optional, the lower bound of the year filter
  - any year from `2003` to `2020`, does not have to be smaller than `year_end`
- `year_end` - optional, the upper bound of the year filter
  - any year from `2003` to `2020`, does not have to be larger than `year_start`
- `month` - optional, the month to filter by
  - any month in `MM` format from `01` to `12`
- `age_range` - optional, the age ranges of the at-fault driver to filter results by, valid inputs are as follows:
  - `16-19`
  - `20-34`
  - `35-54`
  - `55-64`
  - `65plus`
- `race` optional, the race of the at-fault driver to filter results by, valid inputs are as follows:
  - `asian`
  - `black`
  - `hispanic`
  - `other`
  - `white`
- `gender` optional, the gender of the at-fault driver to filter results by, valid inputs are as follows:
  - `male`
  - `female`

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

### Query 2 (causes): <a id="query2"></a>
Query 2 API URL: 
- `http://localhost:5000/queries/causes`

Query 2 GET request parameters:



### Query 3 (geographic): <a id="query3"></a>
Query 3 API URL: 
- `http://localhost:5000/queries/geographic`

Query 3 GET request parameters:
- `year` - optional, the year to filter by
  - any year from `2003` to `2020`
- `month` - optional, the month to filter by
  - any month in `MM` format from `01` to `12`
- `day_of_week` - optional, the day of the week to filter by
  - any day from `1` to `7`
  - `1` is Sunday, `2` is Monday, `7` is Saturday, etc.
- `time_of_day` - optional, the time range of day
  - `02:00-05:59`
  - `06:00-09:59`
  - `10:00-13:59`
  - `14:00-17:59`
  - `18:00-21:59`
  - `22:00-01:59`
- `county` - optional, the name of the county to filter by
  - any of the names of the 57 counties in our database (CA has 58, but 1 is not in our source data)
  - case insensitive


### Query 4 (vehicle type): <a id="query4"></a>
Query 4 API URL: 
- `http://localhost:5000/queries/vehicle-type`

Query 4 GET request parameters:

### Query 5 (geographic): <a id="query3"></a>
Query 5 API URL: 
- `http://localhost:5000/queries/geographic`

Query 5 GET request parameters:
