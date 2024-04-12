from load_variables import *


# Query 1 (At-fault Party Demographics and Fatality Rates)
def fetch_query_at_fault(year_start, year_end, month, at_fault_age_range, at_fault_race,
                         at_fault_gender):
    select_clause = f"SELECT count(*)"
    from_clause = f"FROM {party_table}"
    join_clause = f"JOIN {victim_table} ON {party_table}.case_id = {victim_table}.case_id"
    where_clause = "WHERE 1=1"
    group_by_clause = "extract(year from {party_table}.collision_datetime)"

    if year_start is not None:
        where_clause += f" AND extract(year from {party_table}.collision_datetime) BETWEEN {year_start}"
    else:
        where_clause += f" AND extract(year from {party_table}.collision_datetime) BETWEEN 2003"
    if year_end is not None:
        where_clause += f" AND {year_end}"
    else:
        where_clause += f" AND 2020"

    if month is not None:
        where_clause += f" AND extract(month from {party_table}.collision_datetime) = '{month}"

    match at_fault_age_range:
        case "":
            pass
        case "16-19":
            where_clause += f" AND {party_table}.party_age BETWEEN 16 AND 19"
        case "20-34":
            where_clause += f" AND {party_table}.party_age BETWEEN 20 AND 34"
        case "35-54":
            where_clause += f" AND {party_table}.party_age BETWEEN 35 AND 54"
        case "55-64":
            where_clause += f" AND {party_table}.party_age BETWEEN 55 AND 64"
        case "65plus":
            where_clause += f" AND {party_table}.party_age >= 65"

    match at_fault_race:
        case "":
            pass
        case "asian":
            where_clause += f" AND {party_table}.party_race = 'asian'"
        case "black":
            where_clause += f" AND {party_table}.party_race = 'black'"
        case "hispanic":
            where_clause += f" AND {party_table}.party_race = 'hispanic'"
        case "other":
            where_clause += f" AND {party_table}.party_race = 'other'"
        case "white":
            where_clause += f" AND {party_table}.party_race = 'white'"

    match at_fault_gender:
        case "":
            pass
        case "male":
            where_clause += f" AND {party_table}.party_sex = 'male'"
        case "female":
            where_clause += f" AND {party_table}.party_sex = 'female'"

    query = f"{select_clause} {from_clause} {join_clause} {where_clause}"
    return query
