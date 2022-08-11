import tasks.ecs as ecs
import tasks.api as api
import tasks.database as db
import tasks.netlify as netlify
import tasks.activity_log as activity_log

from prefect import Flow, task, Parameter



with Flow(
    "Moped Test Database Commission",
    run_config=UniversalRun(labels=["moped", hostname]),
) as database_commission:

    basename = Parameter("basename")
    stage = Parameter("stage")

    create_database = db.create_database(basename=basename)
    populate_database_command = db.populate_database_with_data_command(
        basename=basename, stage=stage, upstream_tasks=[create_database]
    )
    populate_database = db.populate_database_with_data_task(
        command=populate_database_command
    )