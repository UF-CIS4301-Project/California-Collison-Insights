## Backend setup instructions

### 1. Installing dependencies
- Option 1
  1. `pip install -r requirements.txt`
- Option 2
  1. `pip install cx_Oracle`
  2. `pip install python-dotenv`
  3. `pip install flask`

### 2. Connect to UF VPN
Cannot access the Oracle database without being connected to VPN!

### 3. Launch Flask Server
Three options to start Flask Server (which hosts the API endpoints)
  1. Run [flask_server.py](flask_server.py) from inside an IDE
  2. If on a Windows, click the [start_flask.bat](start_flask.bat) batch file
  3. CD to `California-Collison-Insights\backend` in CLI and run `python flask_server.py`