from load_variables import *


# Query 1 (At-fault Party Demographics and Fatality Rates)
def fetch_query_at_fault(year_start, year_end, month, at_fault_age_range, at_fault_race,
                         at_fault_gender):

    at_fault_where_clause = ""
    time_range_where_clause = f" AND EXTRACT(YEAR FROM {party_table}.collision_datetime) "

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
            time_range_where_clause += f"BETWEEN 2003 AND {year_end}"
        else:
            time_range_where_clause += f"BETWEEN 2003 AND 2020"

    group_by_clause = f" EXTRACT(YEAR FROM {victim_table}.collision_datetime)"

    if month is not None:
        time_range_where_clause += f" AND EXTRACT(MONTH FROM {party_table}.collision_datetime) = '{month}'"
        group_by_clause += f", EXTRACT(MONTH FROM {victim_table}.collision_datetime)"

    match at_fault_age_range:
        case "":
            pass
        case "16-19":
            at_fault_where_clause += f" AND {party_table}.party_age BETWEEN 16 AND 19"
        case "20-34":
            at_fault_where_clause += f" AND {party_table}.party_age BETWEEN 20 AND 34"
        case "35-54":
            at_fault_where_clause += f" AND {party_table}.party_age BETWEEN 35 AND 54"
        case "55-64":
            at_fault_where_clause += f" AND {party_table}.party_age BETWEEN 55 AND 64"
        case "65plus":
            at_fault_where_clause += f" AND {party_table}.party_age >= 65"

    match at_fault_race:
        case "":
            pass
        case "asian":
            at_fault_where_clause += f" AND {party_table}.party_race = 'asian'"
        case "black":
            at_fault_where_clause += f" AND {party_table}.party_race = 'black'"
        case "hispanic":
            at_fault_where_clause += f" AND {party_table}.party_race = 'hispanic'"
        case "other":
            at_fault_where_clause += f" AND {party_table}.party_race = 'other'"
        case "white":
            at_fault_where_clause += f" AND {party_table}.party_race = 'white'"

    match at_fault_gender:
        case "":
            pass
        case "male":
            at_fault_where_clause += f" AND {party_table}.party_sex = 'male'"
        case "female":
            at_fault_where_clause += f" AND {party_table}.party_sex = 'female'"

    query = f"""
    WITH at_fault AS (
        SELECT
            {party_table}.case_id AS at_fault_case_id
        FROM
            {party_table}
        WHERE 1=1
            {time_range_where_clause}
            {at_fault_where_clause}
    )
    SELECT
        EXTRACT(YEAR FROM {victim_table}.collision_datetime) AS time, 
        ROUND(SUM(CASE WHEN {victim_table}.was_victim_killed = 1 THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) AS fatality_percentage
    FROM
        at_fault af
    JOIN 
        {party_table} ON af.at_fault_case_id = {party_table}.case_id
    JOIN 
        {victim_table} ON af.at_fault_case_id = {victim_table}.case_id
    WHERE 1=1 
        {time_range_where_clause}
    GROUP BY 
        {group_by_clause}
    ORDER BY
        {group_by_clause}
    """

    return query
