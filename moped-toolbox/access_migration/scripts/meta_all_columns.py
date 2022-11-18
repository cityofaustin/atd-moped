""" Writes all columns in the db to 'columns.csv' """
import csv
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


meta = conn.jconn.getMetaData()

columns = []
resultSet = meta.getColumns(None, None, "%", None)
while resultSet.next():
    # https://docs.oracle.com/javase/8/docs/api/java/sql/DatabaseMetaData.html#getColumns-java.lang.String-java.lang.String-java.lang.String-java.lang.String-
    table_name = resultSet.getString(3)
    column_name = resultSet.getString(4)
    type_name = resultSet.getString(6)
    is_nullable = resultSet.getString(18)
    is_autoincrement = resultSet.getString(23)
    is_generatedcolumn = resultSet.getString(24)
    columns.append(
        {
            "table_name": table_name,
            "column_name": column_name,
            "type_name": type_name,
            "is_nullable": is_nullable,
            "is_autoincrement": is_autoincrement,
            "is_generatedcolumn": is_generatedcolumn,
        }
    )

# you can get foreign keys like this
# https://docs.oracle.com/javase/8/docs/api/java/sql/DatabaseMetaData.html#getColumns-java.lang.String-java.lang.String-java.lang.String-java.lang.String-
resultSet = meta.getImportedKeys(None, None, "projects")
breakpoint()
with open("columns.csv", "w") as fout:
    writer = csv.DictWriter(
        fout,
        fieldnames=[
            "table_name",
            "column_name",
            "type_name",
            "is_nullable",
            "is_autoincrement",
            "is_generatedcolumn",
        ],
    )
    writer.writeheader()
    writer.writerows(columns)
