# docker run -it --rm -v /Users/john/Desktop/atd-moped/moped-tools:/app moped-migra /bin/bash
import json
import jaydebeapi


tables = [
    "BikewaysData",
    "CostEstimate_BidItem_Categories",
    "CostEstimate_Items_BidItems",
    "CostEstimate_Items_EstimateItems",
    "CostEstimates",
    # "CostEstimates_Estimate-DOGroups",
    "CostEstimates_Quantities",
    "CostEstimates_Quotes",
    "CostEstimates_Quotes_UnitCosts",
    "CostEstimates_Status",
    "DataRequests",
    "DataRequests_CountTypes",
    "DataRequests_Purposes",
    "Date_Milestones",
    "Date_Statuses",
    "Employees",
    "Entities",
    "Facility_Attributes",
    "Facility_AttributesTypes",
    "Facility_AttributeTypeApplicability",
    "Facility_PhysicalProtectionTypes",
    "FundingPrograms",
    "FundingSources",
    "ImplementionContract",
    "ImplementionGroups",
    "PedCrossingData",
    "Project_Dates",
    "Project_Facilities",
    "Project_FacilityTypes",
    "Project_Funding",
    "Project_Funding_Statuses",
    "Project_Personnel",
    "Project_Phases",
    "Project_ProjectGroups",
    "Project_StatusUpdate",
    "Project_Types",
    "ProjectGroups",
    "ProjectRoles",
    "Projects",
    "PublicProcessStatuses",
    "RainGardenApprovalStatuses",
    "RainGardenData",
    "Signals_InfrastructureData",
    "SRTS_InfrastructurePlan",
    "WorkAuthorizations",
]

def get_columns(cursor):
    return [d[0] for d in cursor.description]


def row_dict(columns, row):
    return dict(zip(columns, row))


db_path = "/app/database/database.mdb"
out_dir = "/app/data/raw"

def get_conn():
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
    return conn

def get_table(cursor, name):
    cursor.execute(f"select * from {name}")
    columns = get_columns(cursor)
    rows_raw = cursor.fetchall()
    return [row_dict(columns, row) for row in rows_raw]

def main():
    conn = get_conn()
    cursor = conn.cursor()
    for name in tables:
        print(name)
        data = get_table(cursor, name)
        fname = name.lower()
        with open(f"{out_dir}/{fname}.json", "w") as fout:
            json.dump(data, fout)

if __name__ == "__main__":
    main()
