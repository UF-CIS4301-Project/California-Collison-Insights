from load_variables import *


# Query 4 (Effect of Vehicle Type and Age on Fatality Rates)
def fetch_query_vehicle_type(year_start, year_end, month, vehicle_type, vehicle_age):
    select_clause = f" EXTRACT(YEAR FROM {party_table}.collision_datetime) AS year"
    where_clause = f" EXTRACT(YEAR FROM {party_table}.collision_datetime) "
    group_by_clause = f" EXTRACT(YEAR FROM {party_table}.collision_datetime) "

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
        where_clause += f" AND EXTRACT(MONTH FROM {party_table}.collision_datetime) = '{month}'"
        group_by_clause += f", EXTRACT(MONTH FROM {party_table}.collision_datetime)"

    match vehicle_type:
        case "":
            pass
        case "motorcycle/moped/scooter":
            where_clause += f"""
            AND ({party_table}.vehicle_type = 'moped' 
                OR {party_table}.vehicle_type = 'motorcycle or scooter')
            """
        case "passenger car":
            where_clause += f"""
            AND ({party_table}.vehicle_type = 'passenger car'
                OR {party_table}.vehicle_type = 'passenger car with trailer')
            """
        case "pickup truck":
            where_clause += f"""
            AND ({party_table}.vehicle_type = 'pickup or panel truck'
                OR {party_table}.vehicle_type = 'pickup or panel truck with trailer')
            """
        case "large vehicles":
            where_clause += f"""
            AND ({party_table}.vehicle_type = 'truck or truck tractor'
                OR {party_table}.vehicle_type = 'truck or truck tractor with trailer'
                OR {party_table}.vehicle_type = 'schoolbus'
                OR {party_table}.vehicle_type = 'other bus')
            """

    match vehicle_age:
        case "":
            pass
        case "new":
            where_clause += f" AND {party_table}.vehicle_year BETWEEN '2017' AND '2020'"
        case "middle":
            where_clause += f" AND {party_table}.vehicle_year BETWEEN '2013' AND '2016'"
        case "old":
            where_clause += f" AND {party_table}.vehicle_year BETWEEN '2008' AND '2012'"
        case "very old":
            where_clause += f" AND {party_table}.vehicle_year < '2008'"

    query = f"""
    SELECT 
        ROUND(AVG({victim_table}.was_victim_killed) * 100, 2) AS fatality_percentage,
        {select_clause}
    FROM 
        {party_table} 
    JOIN 
        {victim_table} 
        ON {party_table}.case_id = {victim_table}.case_id
    WHERE
        {where_clause}
    GROUP BY
        {group_by_clause}
    ORDER BY
        EXTRACT(YEAR FROM {party_table}.collision_datetime)
    """

    return query
