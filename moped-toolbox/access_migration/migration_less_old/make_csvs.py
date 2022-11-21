import pdb
import csv
import json
import jaydebeapi

from graphql import run_query

# Import cleanup functions
from migration.moped_project import moped_project_process
from migration.moped_users import moped_user_process
from migration.moped_project_personnel import moped_project_personnel_process
from migration.moped_project_phases import moped_project_phases_process


def get_columns(cursor):
    return [d[0] for d in cursor.description]


def row_dict(row, columns):
    return dict(zip(columns, row))


# Maybe change this to be dynamic by accepting a command line parameter?
db_path = "/app/database/database.mdb"

# JDBC Database Drivers
ucanaccess_jars = [
    "/app/jdbc/ucanaccess-5.0.1.jar",
    "/app/jdbc/lib/commons-lang3-3.8.1.jar",
    "/app/jdbc/lib/commons-logging-1.2.jar",
    "/app/jdbc/lib/hsqldb-2.5.0.jar",
    "/app/jdbc/lib/jackcess-3.0.1.jar",
]


# Class path
classpath = ":".join(ucanaccess_jars)

print("Connecting to the database...")
# Establish connection object using drivers
conn = jaydebeapi.connect(
    "net.ucanaccess.jdbc.UcanaccessDriver",
    f"jdbc:ucanaccess://{db_path};newDatabaseVersion=V2010",
    ["", ""],
    classpath,
)
print("Database connection established")

print("Getting tables")
tables = []
meta = conn.jconn.getMetaData()
resultSet = meta.getTables(None, None, "%", None)
# see: https://stackoverflow.com/questions/2780284/how-to-get-all-table-names-from-a-database
# and: https://docs.oracle.com/javase/8/docs/api/java/sql/DatabaseMetaData.html#getTables-java.lang.String-java.lang.String-java.lang.String-java.lang.String:A-
while resultSet.next():
    tables.append(resultSet.getString(3))

all_columns = []

data = []
for table in tables:
    cursor = conn.cursor()
    print(table)
    try:
        cursor.execute(f"select * from {table}")
    except: 
        print("skipped that one")
        continue
    columns = get_columns(cursor)
    for col in columns:
        all_columns.append({"name": col, "table": table})

# cursor.execute("select * from PROJECTS limit 10")
# columns = get_columns(cursor)
# rows_raw = cursor.fetchall()
# rows = [row_dict(columns, row) for row in rows_raw]


breakpoint()
