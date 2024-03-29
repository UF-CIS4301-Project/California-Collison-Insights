from flask import Flask, jsonify
import cx_Oracle
import json
from dotenv import load_dotenv
import os

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

# Connection details
username = os.getenv("DB_USERNAME")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
service_name_or_SID = os.getenv("DB_SERVICE_NAME_OR_SID")

# Create database connection pool
connection_pool = cx_Oracle.SessionPool(
    user=username,
    password=password,
    dsn=f"{host}:{port}/{service_name_or_SID}",
    min=1,
    max=5,
    increment=1,
    threaded=True
)


# Function to fetch data from Oracle
def fetch_data_from_oracle():
    connection = connection_pool.acquire()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT * FROM test_connection_county")
        rows = cursor.fetchall()
        column_names = [col[0] for col in cursor.description]
        data = [dict(zip(column_names, row)) for row in rows]
        return data

    finally:
        cursor.close()
        connection_pool.release(connection)


# API endpoint to fetch data
@app.route('/api/oracle-data', methods=['GET'])
def get_oracle_data():
    data = fetch_data_from_oracle()
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
