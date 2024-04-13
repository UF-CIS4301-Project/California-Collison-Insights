from load_variables import *


def fetch_metadata():
    query = f"""
    
    WITH table_counts AS (
    SELECT 
        'collision' AS table_name,
        COUNT(*) AS num_tuples
    FROM 
        {collision_table}
    UNION ALL
    SELECT 
        'county' AS table_name,
        COUNT(*) AS num_tuples
    FROM 
        {county_table}
    UNION ALL
    SELECT 
        'party' AS table_name,
        COUNT(*) AS num_tuples
    FROM 
        {party_table}
    UNION ALL
    SELECT 
        'victim' AS table_name,
        COUNT(*) AS num_tuples
    FROM 
        {victim_table}
    ORDER BY 
        table_name DESC
    )

    SELECT 
        table_name,
        num_tuples
    FROM 
        table_counts
    UNION ALL
    SELECT 
        'total' AS table_name,
        SUM(num_tuples) AS total
    FROM 
        table_counts
    """

    return query
