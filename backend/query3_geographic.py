from load_variables import *


def fetch_query_geographic(year, month, day_of_week, time_of_day, county):
    where_clause = ""
    if year is not None:
        where_clause += f" AND EXTRACT(YEAR FROM {collision_table}.collision_datetime) = {year}"
    else:
        where_clause += f" AND EXTRACT(YEAR FROM {collision_table}.collision_datetime) = 2020"

    if month is not None:
        where_clause += f" AND EXTRACT(MONTH FROM {collision_table}.collision_datetime) = {month}"

    """
        The day-of-week number is in the range 1-7, but the value depends on the NLS_territory
        USA considers Sunday to be the start of week, so Monday is day 2"
        https://livesql.oracle.com/apex/livesql/file/content_GCEY1DN2CN5HZCUQFHVUYQD3G.html
    """
    if day_of_week is not None:
        where_clause += f" AND TO_CHAR({collision_table}.collision_datetime, 'D') = {day_of_week}"

    match time_of_day:
        case "":
            pass
        case "02:00-05:59":
            # Early Morning
            where_clause += f" AND EXTRACT(HOUR FROM {collision_table}.collision_datetime) BETWEEN 2 and 5"
        case "06:00-09:59":
            # Morning
            where_clause += f" AND EXTRACT(HOUR FROM {collision_table}.collision_datetime) BETWEEN 6 and 9"
        case "10:00-13:59":
            # Noon
            where_clause += f" AND EXTRACT(HOUR FROM {collision_table}.collision_datetime) BETWEEN 10 and 13"
        case "14:00-17:59":
            # Afternoon
            where_clause += f" AND EXTRACT(HOUR FROM {collision_table}.collision_datetime) BETWEEN 14 and 17"
        case "18:00-21:59":
            # Evening
            where_clause += f" AND EXTRACT(HOUR FROM {collision_table}.collision_datetime) BETWEEN 18 and 21"
        case "22:00-01:59":
            # Midnight
            where_clause += f" AND EXTRACT(HOUR FROM {collision_table}.collision_datetime) BETWEEN 22 and 23"
            where_clause += f" AND EXTRACT(HOUR FROM {collision_table}.collision_datetime) BETWEEN 0 and 1"

    if county is not None:
        where_clause += f" AND UPPER({collision_table}.county_location) = UPPER('{county}')"

    query = f"""
    WITH accident_count AS (
        SELECT DISTINCT
            {collision_table}.county_location AS county,
            COUNT(DISTINCT {collision_table}.case_id) AS county_accidents,
            EXTRACT(YEAR FROM {collision_table}.collision_datetime) AS year
        FROM 
            {collision_table} 
        JOIN 
            {county_table} ON UPPER({collision_table}.county_location) = UPPER({county_table}.name)
        WHERE 1=1 
            {where_clause} 
        GROUP BY
            {collision_table}.county_location,
            EXTRACT(YEAR FROM {collision_table}.collision_datetime)
    )
    SELECT
        ac.county,
        ROUND(ac.county_accidents / {county_table}.population * 100, 2) AS accident_percentage,
        ac.year
    FROM 
        accident_count ac
    JOIN
        {county_table} 
            ON UPPER(ac.county) = UPPER({county_table}.name)
            AND ac.year = {county_table}.year
    ORDER BY
        ac.county,
        ac.year
    """

    return query
