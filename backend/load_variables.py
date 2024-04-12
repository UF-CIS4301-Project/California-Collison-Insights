import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Connection details
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_SERVICE_SID = os.getenv("DB_SERVICE_SID")

# Tables from database
collision_table = f'"{os.getenv("DB_COLLISION_TABLE_USERNAME")}"."COLLISION"'
county_table = f'"{os.getenv("DB_COUNTY_TABLE_USERNAME")}"."COUNTY"'
party_table = f'"{os.getenv("DB_PARTY_TABLE_USERNAME")}"."PARTY"'
victim_table = f'"{os.getenv("DB_VICTIM_TABLE_USERNAME")}"."VICTIM"'
