from flask import Flask, request, jsonify
import oracledb

from load_variables import *

from query1_at_fault import fetch_query_at_fault
from query2_causes import fetch_query_causes
from query3_geographic import fetch_query_geographic
from query4_vehicle_type import fetch_query_vehicle_type
from query5_road import fetch_query_road
from query_custom import fetch_query_custom

app = Flask(__name__)


# Create database connection pool
connection_pool = oracledb.SessionPool(
    user=DB_USERNAME,
    password=DB_PASSWORD,
    dsn=f"{DB_HOST}:{DB_PORT}/{DB_SERVICE_SID}",
    min=1,
    max=5,
    increment=1,
    threaded=True
)


def run_query(query):
    connection = connection_pool.acquire()
    cursor = connection.cursor()
    cursor.execute(query)

    try:
        rows = cursor.fetchall()
        column_names = [col[0] for col in cursor.description]
        data = [dict(zip(column_names, row)) for row in rows]
    finally:
        cursor.close()
        connection_pool.release(connection)

    return jsonify(data)


# API endpoint - Query 1 (At-fault Party Demographics and Fatality Rates)
@app.route('/queries/at-fault', methods=['GET'])
def get_query_at_fault():
    # parameters to filter query by
    year_start = request.args.get('year_start')
    year_end = request.args.get('year_end')
    month = request.args.get('month')
    at_fault_age_range = request.args.get('age_range')
    at_fault_race = request.args.get('race')
    at_fault_gender = request.args.get('gender')

    query = fetch_query_at_fault(year_start, year_end, month, at_fault_age_range, at_fault_race, at_fault_gender)
    return run_query(query)


# API endpoint - Query 2 (Possible Cause of Accident)
@app.route('/queries/causes', methods=['GET'])
def get_query_causes():
    param1 = request.args.get('param1')
    param2 = request.args.get('param2')

    data = fetch_query_causes()
    return jsonify(data)


# API endpoint - Query 3 (Geographic Analysis)
@app.route('/queries/geographic', methods=['GET'])
def get_query_geographic():
    param1 = request.args.get('param1')
    param2 = request.args.get('param2')

    data = fetch_query_geographic()
    return jsonify(data)


# API endpoint - Query 4 (Effect of Vehicle Type and Age on Fatality Rates)
@app.route('/queries/vehicle-type', methods=['GET'])
def get_query_vehicle_type():
    param1 = request.args.get('param1')
    param2 = request.args.get('param2')

    data = fetch_query_vehicle_type()
    return jsonify(data)


# API endpoint - Query 5 (Effect of Road Conditions and Population Density on Traffic Collision Severity)
@app.route('/queries/road', methods=['GET'])
def get_query_road():
    param1 = request.args.get('param1')
    param2 = request.args.get('param2')

    data = fetch_query_road()
    return jsonify(data)


# API endpoint - Custom Query
@app.route('/queries/custom', methods=['GET'])
def get_query_custom():
    param1 = request.args.get('param1')
    param2 = request.args.get('param2')

    data = fetch_query_custom()
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)