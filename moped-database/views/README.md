# Updating a SQL view

1. Update the view in this directory
2. Paste into the Hasura console through the "Modify" option when exploring the SQL view through the Database tab
3. Run with the "This is a migration" option and provide a meaningful migration name
4. Create a down migration to go back to the previous state of the query
5. At the beginning of each new migration file, add `DROP VIEW <view name>;` because `CREATE OR REPLACE VIEW` has limitations described [here in the PostgreSQL CREATE VIEW documentation](https://www.postgresql.org/docs/9.3/sql-createview.html)