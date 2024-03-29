import cx_Oracle  # pip install cx_Oracle
import json

from dotenv import load_dotenv  # pip install python-dotenv
import os


# Load environment variables from .env file
load_dotenv()

# Connection details
username = os.getenv("DB_USERNAME")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
service_name_or_SID = os.getenv("DB_SERVICE_NAME_OR_SID")

# Establish connection
connection = cx_Oracle.connect(
    user=username,
    password=password,
    dsn=f"{host}:{port}/{service_name_or_SID}"
)

# Create cursor
cursor = connection.cursor()

try:
    # Execute SQL command
    cursor.execute("SELECT * FROM test_connection_county")

    # Fetch data
    rows = cursor.fetchall()

    # Convert rows to dictionary
    column_names = [col[0] for col in cursor.description]
    data = [dict(zip(column_names, row)) for row in rows]

    # Convert to JSON
    json_data = json.dumps(data, indent=4)

    # Print JSON
    print(json_data)

finally:
    # Close cursor and connection
    cursor.close()
    connection.close()
