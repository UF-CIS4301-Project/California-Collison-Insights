import csv
import sqlite3
import time


def export_to_csv(database_file, table_name, column_names, output_file):
    # Connect to the SQLite database
    conn = sqlite3.connect(database_file)
    cursor = conn.cursor()

    # Open the CSV file in write mode
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        csv_writer = csv.writer(csvfile)

        columns_str = ', '.join([f'{table_name}.{column}' for column in column_names])

        query = ""
        if table_name == "collisions":
            csv_writer.writerow(column_names)
            query = f"""
                SELECT {columns_str}
                FROM {table_name}
                WHERE SUBSTR({table_name}.collision_date, 1, 4) BETWEEN '2003' AND '2020';
            """

        elif table_name == "parties":
            csv_writer.writerow(column_names + ["collision_date"] + ["collision_time"])
            query = f"""
                SELECT {columns_str}, 
                        collisions.collision_date,
                        collisions.collision_time
                FROM collisions
                JOIN {table_name} ON collisions.case_id = {table_name}.case_id
                WHERE SUBSTR(collisions.collision_date, 1, 4) BETWEEN '2003' AND '2020';
            """

        elif table_name == "victims":
            csv_writer.writerow(column_names + ["collision_date"] + ["collision_time"] + ["victim_degree_of_injury"])
            query = f"""
                SELECT {columns_str},
                        collisions.collision_date,
                        collisions.collision_time,
                        CASE WHEN {table_name}.victim_degree_of_injury = 'killed' THEN 1 ELSE 0 END AS boolean_column
                FROM collisions
                JOIN {table_name} ON collisions.case_id = {table_name}.case_id
                WHERE SUBSTR(collisions.collision_date, 1, 4) BETWEEN '2003' AND '2020';
            """

        cursor.execute(query)

        # Specify the batch size for fetchmany
        batch_size = 10000  # Adjust as needed

        # Write rows to the CSV file in batches
        counter = 0
        while True:
        # while counter < 100000:
            print(f"Starting output at row {counter}")
            rows = cursor.fetchmany(batch_size)
            if not rows:
                break
            csv_writer.writerows(rows)
            counter += batch_size

    # Close the cursor and connection
    cursor.close()
    conn.close()


# main function of code
def main():
    database_file = "../input/california_traffic_collisions.sqlite"

    tables = {
        "collisions": ['case_id', 'collision_severity', 'pcf_violation_category', 'county_location', 'primary_road',
                       'statewide_vehicle_type_at_fault', 'collision_date', 'collision_time', 'weather_1', 'weather_2',
                       'road_surface', 'road_condition_1', 'road_condition_2', 'lighting'],
        "parties": ['id', 'case_id', 'party_number', 'vehicle_year', 'vehicle_make', 'party_age', 'party_race',
                    'party_sex'],
        "victims": ['id', 'case_id', 'party_number', 'victim_degree_of_injury']
    }

    total_start_time = time.time()

    for table_name in tables:
        output_file = f"../output/{table_name}.csv"  # Specify the output CSV file path

        print(f"{table_name}, {tables[table_name]}")

        start_time = time.time()
        export_to_csv(database_file, table_name, tables[table_name], output_file)
        end_time = time.time()

        execution_time = end_time - start_time
        print(f"Execution time for {table_name}:", execution_time, "seconds")

    total_end_time = time.time()
    total_execution_time = total_end_time - total_start_time
    print(f"Execution time for all tables:", total_execution_time, "seconds")


# this code is only meant to be executed from here, nowhere else
if __name__ == "__main__":
    main()
