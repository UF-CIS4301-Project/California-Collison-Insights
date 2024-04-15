from load_variables import *


def fetch_query_road(year_start, year_end, month, county, road_condition, lighting_condition):
    where_clause = ""

    time_range_where_clause = f" AND EXTRACT(YEAR FROM {collision_table}.collision_datetime) "

    if year_start is not None and year_end is not None:
        if year_start < year_end:
            time_range_where_clause += f"BETWEEN {year_start} AND {year_end}"
        elif year_start > year_end:
            time_range_where_clause += f"BETWEEN {year_end} AND {year_start}"
        elif year_start == year_end:
            time_range_where_clause += f"= {year_start}"
    else:
        if year_start is not None:
            time_range_where_clause += f"BETWEEN {year_start} AND 2020"
        elif year_end is not None:
            time_range_where_clause += f"BETWEEN 2009 AND {year_end}"
        else:
            time_range_where_clause += f"BETWEEN 2009 AND 2020"

    group_by_clause = f" EXTRACT(YEAR FROM {victim_table}.collision_datetime)"

    if month is not None:
        time_range_where_clause += f" AND EXTRACT(MONTH FROM {collision_table}.collision_datetime) = '{month}'"
        group_by_clause += f", EXTRACT(MONTH FROM {collision_table}.collision_datetime)"

    if county is not None:
        where_clause += f" AND UPPER({collision_table}.county_location) = UPPER('{county}')"

    if road_condition is not None:
        where_clause += f"""
            AND ({collision_table}.road_condition_1 = '{road_condition}'
                OR {collision_table}.road_condition_2 = '{road_condition}')
        """

    if lighting_condition is not None:
        where_clause += f" AND {collision_table}.lighting = '{lighting_condition}'"

    query = f"""
    WITH RelevantCollisions AS (
        SELECT
            UPPER({collision_table}.county_location) AS county_location,
            EXTRACT(YEAR FROM {collision_table}.collision_datetime) AS year,
            EXTRACT(MONTH FROM {collision_table}.collision_datetime) AS month,
            {county_table}.population_density,
            {collision_table}.collision_severity
        FROM
            {collision_table}
        JOIN
            {county_table} ON UPPER({collision_table}.county_location) = UPPER({county_table}.name)
        WHERE 1=1
            {where_clause}
            {time_range_where_clause}
    ),
    SeverityMetrics AS (
        SELECT
            county_location AS county_name,
            year,
            AVG(population_density) AS average_population_density,
            AVG(CASE 
                    WHEN collision_severity = 'fatal' THEN 1.0
                    WHEN collision_severity = 'severe injury' THEN 0.75
                    WHEN collision_severity = 'other injury' THEN 0.5
                    WHEN collision_severity = 'pain' THEN 0.25
                    WHEN collision_severity = 'property damage only' THEN 0
                    ELSE NULL
                END) AS average_severity
        FROM
            RelevantCollisions
        GROUP BY
            county_location,
            year
    )
    SELECT
        county_name,
        year,
        ROUND(average_population_density, 2),
        ROUND(average_severity, 2)
    FROM
        SeverityMetrics
    ORDER BY
        year
    """

    return query
