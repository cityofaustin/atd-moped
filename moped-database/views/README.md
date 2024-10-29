# Automatically Generated Views

These view files are automatically generated based on the migrations in place. This is helpful for isolating the changes made to these views in the diffs generated through the PR process.

To change a view, please write an up migration to drop and create the view and any other dependent views. The down migrations should restore the previous version of the view definition. 
Upon opening a pull request, a GitHub Action workflow called **Export Moped Views to SQL** will apply the migration to a database and then read the new view definition from it to create a 
replacement file in this folder.

Note: The SQL code output by the workflow may differ from the code written by developers since we are reading the Postgres-parsed version of the view definition and not the literal code
used to create the view.
