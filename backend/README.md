## Backend setup instructions

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
### Query 1 (at-fault):

Query 1 API URL: 
- `http://localhost:5000/queries/at-fault`

Query 1 GET request parameters:
- `year_start` - optional, the lower bound of the year filter
  - any year from `2003` to `2020`, does not have to be smaller than `year_end`
- `year_end` - optional, the upper bound of the year filter
  - any year from `2003` to `2020`, does not have to be larger than `year_start`
- `month` - optional, the specific month to filter by
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
    },
]`