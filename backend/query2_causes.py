from load_variables import *


# Query 2 (Possible Cause of Accident)
def fetch_query_causes(year_start, year_end, month, county, accident_cause):
    where_clause = f" AND EXTRACT(YEAR FROM {collision_table}.collision_datetime) "

    if year_start is not None and year_end is not None:
        if year_start < year_end:
            where_clause += f"BETWEEN {year_start} AND {year_end}"
        elif year_start > year_end:
            where_clause += f"BETWEEN {year_end} AND {year_start}"
        elif year_start == year_end:
            where_clause += f"= {year_start}"
    else:
        if year_start is not None:
            where_clause += f"BETWEEN {year_start} AND 2020"
        elif year_end is not None:
            where_clause += f"BETWEEN 2009 AND {year_end}"
        else:
            where_clause += f"BETWEEN 2009 AND 2020"

    if month is not None:
        where_clause += f" AND EXTRACT(MONTH FROM {collision_table}.collision_datetime) = {month}"

    if accident_cause is not None:
        match accident_cause:
            case "common traffic violations":
                where_clause += f"""
                AND ({collision_table}.pcf_violation_category = 'speeding'
                    OR {collision_table}.pcf_violation_category = 'improper turning'
                    OR {collision_table}.pcf_violation_category = 'improper passing'
                    OR {collision_table}.pcf_violation_category = 'following too closely'
                    OR {collision_table}.pcf_violation_category = 'other improper driving'
                    OR {collision_table}.pcf_violation_category = 'unsafe lane change'
                    OR {collision_table}.pcf_violation_category = 'other hazardous violation'
                    OR {collision_table}.pcf_violation_category = 'wrong side of road'
                    OR {collision_table}.pcf_violation_category = 'impeding traffic'
                    OR {collision_table}.pcf_violation_category = 'unsafe starting or backing'
                    OR {collision_table}.pcf_violation_category = 'hazardous parking')
                """
            case "driving while impaired":
                where_clause += f"""
                AND ({collision_table}.pcf_violation_category = 'dui' 
                    OR {collision_table}.pcf_violation_category = 'fell asleep')
                """
            case "failure to give right of way":
                where_clause += f"""
                AND ({collision_table}.pcf_violation_category = 'automobile right of way' 
                    OR {collision_table}.pcf_violation_category = 'pedestrian right of way')
                """
            case "fault of pedestrian":
                where_clause += f"""
                AND ({collision_table}.pcf_violation_category = 'pedestrian violation' 
                    OR {collision_table}.pcf_violation_category = 'pedestrian dui')
                """
            case "mechanical issues":
                where_clause += f"""
                AND ({collision_table}.pcf_violation_category = 'brakes' 
                    OR {collision_table}.pcf_violation_category = 'lights'
                    OR {collision_table}.pcf_violation_category = 'other equipment'
                    OR {collision_table}.pcf_violation_category = 'traffic signals and signs')
                """

    # if a county is selected, then transportation budget will be just for that county
    # if no county selected, then sum of transportation budgets for all counties
    if county is not None:
        query = f"""
        WITH county_stats AS (
            SELECT
                ROUND({county_table}.budget / {county_table}.population, 2) AS budget_per_cap,
                {county_table}.population AS county_pop,
                {county_table}.year AS county_year
            FROM
                {county_table}
            WHERE
                UPPER({county_table}.name) = UPPER('{county}')
            ORDER BY
                {county_table}.year
        ),
        accident_stats AS (
            SELECT 
                COUNT(*) AS total_accidents,
                EXTRACT(YEAR FROM {collision_table}.collision_datetime) AS total_accidents_year
            FROM
                {collision_table}
            WHERE
                UPPER({collision_table}.county_location) = UPPER('{county}')
                {where_clause}
            GROUP BY
                EXTRACT(YEAR FROM {collision_table}.collision_datetime)
            ORDER BY
                EXTRACT(YEAR FROM {collision_table}.collision_datetime)
        )
        SELECT
            budget_per_cap,
            ROUND(total_accidents / county_pop * 1000, 2) AS accidents_per_1000_cap,
            total_accidents_year AS year
        FROM
            county_stats
        JOIN
            accident_stats
                ON total_accidents_year = county_year
        """

    else:
        query = f"""
        WITH total_county_stats AS (
            SELECT
                ROUND(SUM({county_table}.budget) / SUM({county_table}.population), 2) AS total_budget_per_cap,
                SUM({county_table}.population) AS total_county_pop,
                {county_table}.year AS total_county_year
            FROM
                {county_table}
            GROUP BY
                {county_table}.year
            ORDER BY
                {county_table}.year
        ),
        total_accident_stats AS (
            SELECT 
                COUNT(*) AS total_accidents,
                EXTRACT(YEAR FROM {collision_table}.collision_datetime) AS total_accidents_year
            FROM
                {collision_table}
            WHERE
                1=1
                {where_clause}
            GROUP BY
                EXTRACT(YEAR FROM {collision_table}.collision_datetime)
            ORDER BY
                EXTRACT(YEAR FROM {collision_table}.collision_datetime)
        )
        SELECT
            total_budget_per_cap AS budget_per_cap,
            ROUND(total_accidents / total_county_pop * 1000, 2) AS accidents_per_1000_cap,
            total_accidents_year AS year
        FROM
            total_county_stats
        JOIN
            total_accident_stats
                ON total_accidents_year = total_county_year
        """

    return query

