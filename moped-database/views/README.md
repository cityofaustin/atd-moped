# Database views

## Overview

### Automatically Generated Views and Version Control

These view files are automatically generated based on the migrations in place. This is helpful for isolating the changes made to these views in the diffs generated through the PR process.

To change a view, please write an up migration to drop and create the view and any other dependent views. The down migrations should restore the previous version of the view definition. 
Upon opening a pull request, a GitHub Action workflow called **Export Moped Views to SQL** will apply the migration to a database and then read the new view definition from it to create a 
replacement file in this folder.

Note: The SQL code output by the workflow may differ from the code written by developers since we are reading the Postgres-parsed version of the view definition and not the literal code
used to create the view.

## View Catalog

### project_list_view

#### Usage
React app, Power BI dataflow

#### Dependencies
current_phase_view

#### Summary
Lists projects with joined data needed to display the project list view in the Moped application.

### component_arcgis_online_view

#### Usage
ArcGIS Online ETL to populate feature service, Power BI

#### Dependencies
project_list_view

#### Summary
Lists project components with joined project data to populate the AGOL Moped components feature service.

### exploded_component_arcgis_online_view

#### Usage
AGOL ETL

#### Dependencies
project_list_view, component_arcgis_online_view

#### Summary
Lists project components with MultiPoint geometry and splits out the MultiPoints into individual point geometries. This is a workaround for AGOL not supporting
[labeling](https://pro.arcgis.com/en/pro-app/latest/help/mapping/text/labeling-basics.htm) on MultiPoint geometries. See https://github.com/cityofaustin/atd-data-tech/issues/17999.

### uniform_features

#### Usage
React app

#### Dependencies
None

#### Summary
Lists unioned project component features by component id as stored in feature_intersections, feature_street_segments, and other feature_ tables.

### project_geography

#### Usage
React app

#### Dependencies
uniform_features

#### Summary
Lists project component geographies from all feature tables where project component features are stored (feature_intersections, feature_street_segments, and other feature_ tables). Used in the React app to query all features by project id to show in components map.

### project_funding_view

#### Usage
Power BI

#### Dependencies
None

#### Summary
Lists project funding rows with joined data from funding program and source tables to make values human-readable.

### current_phase_view

#### Usage
Data Tracker sync ETL

#### Dependencies
None

#### Summary
Lists current phases of projects.

### combined_project_notes_view

#### Usage
React app

#### Dependencies
None

#### Summary
Lists Moped notes, status updates, and eCAPRIS subproject status updates to show a combined timeline in the project notes tab.

### council_district_project_distribution_analytics

#### Usage
Power BI

#### Dependencies
project_geography

#### Summary
Preliminary view to estimate project distribution across city council districts. This is used internally by ATSD along with project manager review to estimate bond funding distribution.