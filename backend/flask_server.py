from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import oracledb

from load_variables import *

from query1_at_fault import fetch_query_at_fault
from query2_causes import fetch_query_causes
from query3_geographic import fetch_query_geographic
from query4_vehicle_type import fetch_query_vehicle_type
from query5_road import fetch_query_road
from query_custom import fetch_query_custom
from query_metadata import fetch_metadata


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Access-Control-Allow-Origin'


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


# API endpoint - metadata for tables
@app.route('/api/metadata', methods=['GET'])
def get_metadata():
    return run_query(fetch_metadata())


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
    # parameters to filter query by
    year_start = request.args.get('year_start')
    year_end = request.args.get('year_end')
    month = request.args.get('month')
    county = request.args.get('county')
    accident_cause = request.args.get('accident_cause')

    query = fetch_query_causes(year_start, year_end, month, county, accident_cause)
    return run_query(query)


# API endpoint - Query 3 (Geographic Analysis)
@app.route('/queries/geographic', methods=['GET'])
def get_query_geographic():
    year = request.args.get('year')
    month = request.args.get('month')
    day_of_week = request.args.get('day_of_week')
    time_of_day = request.args.get('time_of_day')
    county = request.args.get('county')

    query = fetch_query_geographic(year, month, day_of_week, time_of_day, county)
    return run_query(query)


# API endpoint - Query 4 (Effect of Vehicle Type and Age on Fatality Rates)
@app.route('/queries/vehicle-type', methods=['GET'])
def get_query_vehicle_type():
    year_start = request.args.get('year_start')
    year_end = request.args.get('year_end')
    month = request.args.get('month')
    vehicle_type = request.args.get('vehicle_type')
    vehicle_age = request.args.get('vehicle_age')

    query = fetch_query_vehicle_type(year_start, year_end, month, vehicle_type, vehicle_age)
    return run_query(query)


# API endpoint - Query 5 (Effect of Road Conditions and Population Density on Traffic Collision Severity)
@app.route('/queries/road', methods=['GET'])
def get_query_road():
    year_start = request.args.get('year_start')
    year_end = request.args.get('year_end')
    month = request.args.get('month')

    query = fetch_query_road(year_start, year_end, month)
    return run_query(query)


# API endpoint - Custom Query
@app.route('/queries/custom', methods=['GET'])
def get_query_custom():
    year_start = request.args.get('year_start')
    year_end = request.args.get('year_end')
    month = request.args.get('month')

    query = fetch_query_custom(year_start, year_end, month)
    return run_query(query)


if __name__ == '__main__':
    app.run(debug=True)
