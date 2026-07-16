/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: boolean | null | undefined;
  _gt?: boolean | null | undefined;
  _gte?: boolean | null | undefined;
  _in?: Array<boolean> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: boolean | null | undefined;
  _lte?: boolean | null | undefined;
  _neq?: boolean | null | undefined;
  _nin?: Array<boolean> | null | undefined;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Array_Comparison_Exp = {
  /** is the array contained in the given array value */
  _contained_in?: Array<number> | null | undefined;
  /** does the array contain the given value */
  _contains?: Array<number> | null | undefined;
  _eq?: Array<number> | null | undefined;
  _gt?: Array<number> | null | undefined;
  _gte?: Array<number> | null | undefined;
  _in?: Array<Array<number>> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: Array<number> | null | undefined;
  _lte?: Array<number> | null | undefined;
  _neq?: Array<number> | null | undefined;
  _nin?: Array<Array<number>> | null | undefined;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: number | null | undefined;
  _gt?: number | null | undefined;
  _gte?: number | null | undefined;
  _in?: Array<number> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: number | null | undefined;
  _lte?: number | null | undefined;
  _neq?: number | null | undefined;
  _nin?: Array<number> | null | undefined;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: string | null | undefined;
  _gt?: string | null | undefined;
  _gte?: string | null | undefined;
  /** does the column match the given case-insensitive pattern */
  _ilike?: string | null | undefined;
  _in?: Array<string> | null | undefined;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: string | null | undefined;
  _is_null?: boolean | null | undefined;
  /** does the column match the given pattern */
  _like?: string | null | undefined;
  _lt?: string | null | undefined;
  _lte?: string | null | undefined;
  _neq?: string | null | undefined;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: string | null | undefined;
  _nin?: Array<string> | null | undefined;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: string | null | undefined;
  /** does the column NOT match the given pattern */
  _nlike?: string | null | undefined;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: string | null | undefined;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: string | null | undefined;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: string | null | undefined;
  /** does the column match the given SQL regular expression */
  _similar?: string | null | undefined;
};

/** Boolean expression to compare columns of type "citext". All fields are combined with logical 'AND'. */
export type Citext_Comparison_Exp = {
  _eq?: unknown;
  _gt?: unknown;
  _gte?: unknown;
  /** does the column match the given case-insensitive pattern */
  _ilike?: unknown;
  _in?: Array<unknown> | null | undefined;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: unknown;
  _is_null?: boolean | null | undefined;
  /** does the column match the given pattern */
  _like?: unknown;
  _lt?: unknown;
  _lte?: unknown;
  _neq?: unknown;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: unknown;
  _nin?: Array<unknown> | null | undefined;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: unknown;
  /** does the column NOT match the given pattern */
  _nlike?: unknown;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: unknown;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: unknown;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: unknown;
  /** does the column match the given SQL regular expression */
  _similar?: unknown;
};

/** Boolean expression to filter rows from the table "current_phase_view". All fields are combined with a logical 'AND'. */
export type Current_Phase_View_Bool_Exp = {
  _and?: Array<Current_Phase_View_Bool_Exp> | null | undefined;
  _not?: Current_Phase_View_Bool_Exp | null | undefined;
  _or?: Array<Current_Phase_View_Bool_Exp> | null | undefined;
  moped_phase?: Moped_Phases_Bool_Exp | null | undefined;
  moped_proj_phase?: Moped_Proj_Phases_Bool_Exp | null | undefined;
  phase_id?: Int_Comparison_Exp | null | undefined;
  phase_key?: String_Comparison_Exp | null | undefined;
  phase_name?: String_Comparison_Exp | null | undefined;
  phase_name_simple?: String_Comparison_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  project_phase_id?: Int_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "current_phase_view" */
export type Current_Phase_View_Insert_Input = {
  moped_phase?: Moped_Phases_Obj_Rel_Insert_Input | null | undefined;
  moped_proj_phase?: Moped_Proj_Phases_Obj_Rel_Insert_Input | null | undefined;
  phase_id?: number | null | undefined;
  phase_key?: string | null | undefined;
  phase_name?: string | null | undefined;
  phase_name_simple?: string | null | undefined;
  project_id?: number | null | undefined;
  project_phase_id?: number | null | undefined;
};

/** input type for inserting object relation for remote table "current_phase_view" */
export type Current_Phase_View_Obj_Rel_Insert_Input = {
  data: Current_Phase_View_Insert_Input;
};

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: unknown;
  _gt?: unknown;
  _gte?: unknown;
  _in?: Array<unknown> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: unknown;
  _lte?: unknown;
  _neq?: unknown;
  _nin?: Array<unknown> | null | undefined;
};

export type Deprecated_Moped_Project_Types_Aggregate_Bool_Exp = {
  bool_and?:
    | Deprecated_Moped_Project_Types_Aggregate_Bool_Exp_Bool_And
    | null
    | undefined;
  bool_or?:
    | Deprecated_Moped_Project_Types_Aggregate_Bool_Exp_Bool_Or
    | null
    | undefined;
  count?:
    Deprecated_Moped_Project_Types_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Deprecated_Moped_Project_Types_Aggregate_Bool_Exp_Bool_And = {
  arguments: Deprecated_Moped_Project_Types_Select_Column_Deprecated_Moped_Project_Types_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Deprecated_Moped_Project_Types_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Deprecated_Moped_Project_Types_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Deprecated_Moped_Project_Types_Select_Column_Deprecated_Moped_Project_Types_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Deprecated_Moped_Project_Types_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Deprecated_Moped_Project_Types_Aggregate_Bool_Exp_Count = {
  arguments?:
    Array<Deprecated_Moped_Project_Types_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Deprecated_Moped_Project_Types_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "deprecated.moped_project_types" */
export type Deprecated_Moped_Project_Types_Arr_Rel_Insert_Input = {
  data: Array<Deprecated_Moped_Project_Types_Insert_Input>;
  /** upsert condition */
  on_conflict?: Deprecated_Moped_Project_Types_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "deprecated.moped_project_types". All fields are combined with a logical 'AND'. */
export type Deprecated_Moped_Project_Types_Bool_Exp = {
  _and?: Array<Deprecated_Moped_Project_Types_Bool_Exp> | null | undefined;
  _not?: Deprecated_Moped_Project_Types_Bool_Exp | null | undefined;
  _or?: Array<Deprecated_Moped_Project_Types_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_type?: Deprecated_Moped_Types_Bool_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  project_type_id?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "deprecated.moped_project_types" */
export type Deprecated_Moped_Project_Types_Constraint =
  /** unique or primary key constraint on columns "id" */
  | "moped_project_types_id_key"
  /** unique or primary key constraint on columns "id" */
  | "moped_project_types_pkey";

/** input type for inserting data into table "deprecated.moped_project_types" */
export type Deprecated_Moped_Project_Types_Insert_Input = {
  /** Timestamp when the record was created */
  created_at?: unknown;
  /** ID of the user who created the record */
  created_by_user_id?: number | null | undefined;
  id?: number | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  moped_type?: Deprecated_Moped_Types_Obj_Rel_Insert_Input | null | undefined;
  project_id?: number | null | undefined;
  project_type_id?: number | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
};

/** on_conflict condition type for table "deprecated.moped_project_types" */
export type Deprecated_Moped_Project_Types_On_Conflict = {
  constraint: Deprecated_Moped_Project_Types_Constraint;
  update_columns?: Array<Deprecated_Moped_Project_Types_Update_Column>;
  where?: Deprecated_Moped_Project_Types_Bool_Exp | null | undefined;
};

/** select columns of table "deprecated.moped_project_types" */
export type Deprecated_Moped_Project_Types_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_id"
  /** column name */
  | "project_type_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "deprecated_moped_project_types_aggregate_bool_exp_bool_and_arguments_columns" columns of table "deprecated.moped_project_types" */
export type Deprecated_Moped_Project_Types_Select_Column_Deprecated_Moped_Project_Types_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "deprecated_moped_project_types_aggregate_bool_exp_bool_or_arguments_columns" columns of table "deprecated.moped_project_types" */
export type Deprecated_Moped_Project_Types_Select_Column_Deprecated_Moped_Project_Types_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** update columns of table "deprecated.moped_project_types" */
export type Deprecated_Moped_Project_Types_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_id"
  /** column name */
  | "project_type_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** Boolean expression to filter rows from the table "deprecated.moped_types". All fields are combined with a logical 'AND'. */
export type Deprecated_Moped_Types_Bool_Exp = {
  _and?: Array<Deprecated_Moped_Types_Bool_Exp> | null | undefined;
  _not?: Deprecated_Moped_Types_Bool_Exp | null | undefined;
  _or?: Array<Deprecated_Moped_Types_Bool_Exp> | null | undefined;
  active_type?: Boolean_Comparison_Exp | null | undefined;
  date_added?: Timestamptz_Comparison_Exp | null | undefined;
  on_street?: Boolean_Comparison_Exp | null | undefined;
  sensitivity?: Boolean_Comparison_Exp | null | undefined;
  type_id?: Int_Comparison_Exp | null | undefined;
  type_name?: String_Comparison_Exp | null | undefined;
  type_order?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "deprecated.moped_types" */
export type Deprecated_Moped_Types_Constraint =
  /** unique or primary key constraint on columns "type_id" */
  | "moped_types_pkey"
  /** unique or primary key constraint on columns "type_name" */
  | "moped_types_type_name_key";

/** input type for inserting data into table "deprecated.moped_types" */
export type Deprecated_Moped_Types_Insert_Input = {
  active_type?: boolean | null | undefined;
  date_added?: unknown;
  on_street?: boolean | null | undefined;
  sensitivity?: boolean | null | undefined;
  type_id?: number | null | undefined;
  type_name?: string | null | undefined;
  type_order?: number | null | undefined;
};

/** input type for inserting object relation for remote table "deprecated.moped_types" */
export type Deprecated_Moped_Types_Obj_Rel_Insert_Input = {
  data: Deprecated_Moped_Types_Insert_Input;
  /** upsert condition */
  on_conflict?: Deprecated_Moped_Types_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "deprecated.moped_types" */
export type Deprecated_Moped_Types_On_Conflict = {
  constraint: Deprecated_Moped_Types_Constraint;
  update_columns?: Array<Deprecated_Moped_Types_Update_Column>;
  where?: Deprecated_Moped_Types_Bool_Exp | null | undefined;
};

/** update columns of table "deprecated.moped_types" */
export type Deprecated_Moped_Types_Update_Column =
  /** column name */
  | "active_type"
  /** column name */
  | "date_added"
  /** column name */
  | "on_street"
  /** column name */
  | "sensitivity"
  /** column name */
  | "type_id"
  /** column name */
  | "type_name"
  /** column name */
  | "type_order";

export type Feature_Drawn_Lines_Aggregate_Bool_Exp = {
  bool_and?: Feature_Drawn_Lines_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Feature_Drawn_Lines_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Feature_Drawn_Lines_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Feature_Drawn_Lines_Aggregate_Bool_Exp_Bool_And = {
  arguments: Feature_Drawn_Lines_Select_Column_Feature_Drawn_Lines_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Feature_Drawn_Lines_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Feature_Drawn_Lines_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Feature_Drawn_Lines_Select_Column_Feature_Drawn_Lines_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Feature_Drawn_Lines_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Feature_Drawn_Lines_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Feature_Drawn_Lines_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Feature_Drawn_Lines_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "feature_drawn_lines" */
export type Feature_Drawn_Lines_Arr_Rel_Insert_Input = {
  data: Array<Feature_Drawn_Lines_Insert_Input>;
};

/** Boolean expression to filter rows from the table "feature_drawn_lines". All fields are combined with a logical 'AND'. */
export type Feature_Drawn_Lines_Bool_Exp = {
  _and?: Array<Feature_Drawn_Lines_Bool_Exp> | null | undefined;
  _not?: Feature_Drawn_Lines_Bool_Exp | null | undefined;
  _or?: Array<Feature_Drawn_Lines_Bool_Exp> | null | undefined;
  component_id?: Int_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  geography?: Geography_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  length_feet?: Int_Comparison_Exp | null | undefined;
  project_extent_id?: String_Comparison_Exp | null | undefined;
  source_layer?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** input type for incrementing numeric columns in table "feature_drawn_lines" */
export type Feature_Drawn_Lines_Inc_Input = {
  component_id?: number | null | undefined;
  /** User ID of the creator of the line feature */
  created_by_user_id?: number | null | undefined;
  id?: number | null | undefined;
  /** User ID of the last updater of the line feature */
  updated_by_user_id?: number | null | undefined;
};

/** input type for inserting data into table "feature_drawn_lines" */
export type Feature_Drawn_Lines_Insert_Input = {
  component_id?: number | null | undefined;
  /** Timestamp of when the line feature was created */
  created_at?: unknown;
  /** User ID of the creator of the line feature */
  created_by_user_id?: number | null | undefined;
  geography?: unknown;
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  project_extent_id?: string | null | undefined;
  source_layer?: string | null | undefined;
  /** Timestamp of the last update of the line feature */
  updated_at?: unknown;
  /** User ID of the last updater of the line feature */
  updated_by_user_id?: number | null | undefined;
};

/** select columns of table "feature_drawn_lines" */
export type Feature_Drawn_Lines_Select_Column =
  /** column name */
  | "component_id"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "geography"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "length_feet"
  /** column name */
  | "project_extent_id"
  /** column name */
  | "source_layer"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "feature_drawn_lines_aggregate_bool_exp_bool_and_arguments_columns" columns of table "feature_drawn_lines" */
export type Feature_Drawn_Lines_Select_Column_Feature_Drawn_Lines_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "feature_drawn_lines_aggregate_bool_exp_bool_or_arguments_columns" columns of table "feature_drawn_lines" */
export type Feature_Drawn_Lines_Select_Column_Feature_Drawn_Lines_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** input type for updating data in table "feature_drawn_lines" */
export type Feature_Drawn_Lines_Set_Input = {
  component_id?: number | null | undefined;
  /** Timestamp of when the line feature was created */
  created_at?: unknown;
  /** User ID of the creator of the line feature */
  created_by_user_id?: number | null | undefined;
  geography?: unknown;
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  project_extent_id?: string | null | undefined;
  source_layer?: string | null | undefined;
  /** Timestamp of the last update of the line feature */
  updated_at?: unknown;
  /** User ID of the last updater of the line feature */
  updated_by_user_id?: number | null | undefined;
};

export type Feature_Drawn_Lines_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: Feature_Drawn_Lines_Inc_Input | null | undefined;
  /** sets the columns of the filtered rows to the given values */
  _set?: Feature_Drawn_Lines_Set_Input | null | undefined;
  /** filter the rows which have to be updated */
  where: Feature_Drawn_Lines_Bool_Exp;
};

export type Feature_Drawn_Points_Aggregate_Bool_Exp = {
  bool_and?:
    Feature_Drawn_Points_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Feature_Drawn_Points_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Feature_Drawn_Points_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Feature_Drawn_Points_Aggregate_Bool_Exp_Bool_And = {
  arguments: Feature_Drawn_Points_Select_Column_Feature_Drawn_Points_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Feature_Drawn_Points_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Feature_Drawn_Points_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Feature_Drawn_Points_Select_Column_Feature_Drawn_Points_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Feature_Drawn_Points_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Feature_Drawn_Points_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Feature_Drawn_Points_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Feature_Drawn_Points_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "feature_drawn_points" */
export type Feature_Drawn_Points_Arr_Rel_Insert_Input = {
  data: Array<Feature_Drawn_Points_Insert_Input>;
};

/** Boolean expression to filter rows from the table "feature_drawn_points". All fields are combined with a logical 'AND'. */
export type Feature_Drawn_Points_Bool_Exp = {
  _and?: Array<Feature_Drawn_Points_Bool_Exp> | null | undefined;
  _not?: Feature_Drawn_Points_Bool_Exp | null | undefined;
  _or?: Array<Feature_Drawn_Points_Bool_Exp> | null | undefined;
  component_id?: Int_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  geography?: Geography_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  project_extent_id?: String_Comparison_Exp | null | undefined;
  source_layer?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** input type for incrementing numeric columns in table "feature_drawn_points" */
export type Feature_Drawn_Points_Inc_Input = {
  component_id?: number | null | undefined;
  /** User ID of the creator of the point feature */
  created_by_user_id?: number | null | undefined;
  id?: number | null | undefined;
  /** User ID of the last updater of the point feature */
  updated_by_user_id?: number | null | undefined;
};

/** input type for inserting data into table "feature_drawn_points" */
export type Feature_Drawn_Points_Insert_Input = {
  component_id?: number | null | undefined;
  /** Timestamp of when the point feature was created */
  created_at?: unknown;
  /** User ID of the creator of the point feature */
  created_by_user_id?: number | null | undefined;
  geography?: unknown;
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  project_extent_id?: string | null | undefined;
  source_layer?: string | null | undefined;
  /** Timestamp of the last update of the point feature */
  updated_at?: unknown;
  /** User ID of the last updater of the point feature */
  updated_by_user_id?: number | null | undefined;
};

/** select columns of table "feature_drawn_points" */
export type Feature_Drawn_Points_Select_Column =
  /** column name */
  | "component_id"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "geography"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_extent_id"
  /** column name */
  | "source_layer"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "feature_drawn_points_aggregate_bool_exp_bool_and_arguments_columns" columns of table "feature_drawn_points" */
export type Feature_Drawn_Points_Select_Column_Feature_Drawn_Points_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "feature_drawn_points_aggregate_bool_exp_bool_or_arguments_columns" columns of table "feature_drawn_points" */
export type Feature_Drawn_Points_Select_Column_Feature_Drawn_Points_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** input type for updating data in table "feature_drawn_points" */
export type Feature_Drawn_Points_Set_Input = {
  component_id?: number | null | undefined;
  /** Timestamp of when the point feature was created */
  created_at?: unknown;
  /** User ID of the creator of the point feature */
  created_by_user_id?: number | null | undefined;
  geography?: unknown;
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  project_extent_id?: string | null | undefined;
  source_layer?: string | null | undefined;
  /** Timestamp of the last update of the point feature */
  updated_at?: unknown;
  /** User ID of the last updater of the point feature */
  updated_by_user_id?: number | null | undefined;
};

export type Feature_Drawn_Points_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: Feature_Drawn_Points_Inc_Input | null | undefined;
  /** sets the columns of the filtered rows to the given values */
  _set?: Feature_Drawn_Points_Set_Input | null | undefined;
  /** filter the rows which have to be updated */
  where: Feature_Drawn_Points_Bool_Exp;
};

export type Feature_Intersections_Aggregate_Bool_Exp = {
  bool_and?:
    Feature_Intersections_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Feature_Intersections_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Feature_Intersections_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Feature_Intersections_Aggregate_Bool_Exp_Bool_And = {
  arguments: Feature_Intersections_Select_Column_Feature_Intersections_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Feature_Intersections_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Feature_Intersections_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Feature_Intersections_Select_Column_Feature_Intersections_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Feature_Intersections_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Feature_Intersections_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Feature_Intersections_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Feature_Intersections_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "feature_intersections" */
export type Feature_Intersections_Arr_Rel_Insert_Input = {
  data: Array<Feature_Intersections_Insert_Input>;
};

/** Boolean expression to filter rows from the table "feature_intersections". All fields are combined with a logical 'AND'. */
export type Feature_Intersections_Bool_Exp = {
  _and?: Array<Feature_Intersections_Bool_Exp> | null | undefined;
  _not?: Feature_Intersections_Bool_Exp | null | undefined;
  _or?: Array<Feature_Intersections_Bool_Exp> | null | undefined;
  component_id?: Int_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  geography?: Geography_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  intersection_id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  source_layer?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "feature_intersections" */
export type Feature_Intersections_Insert_Input = {
  component_id?: number | null | undefined;
  /** Timestamp of when the intersection feature was created */
  created_at?: unknown;
  /** User ID of the creator of the intersection feature */
  created_by_user_id?: number | null | undefined;
  geography?: unknown;
  id?: number | null | undefined;
  intersection_id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  source_layer?: string | null | undefined;
  /** Timestamp of the last update of the intersection feature */
  updated_at?: unknown;
  /** User ID of the last updater of the intersection feature */
  updated_by_user_id?: number | null | undefined;
};

/** select columns of table "feature_intersections" */
export type Feature_Intersections_Select_Column =
  /** column name */
  | "component_id"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "geography"
  /** column name */
  | "id"
  /** column name */
  | "intersection_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "source_layer"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "feature_intersections_aggregate_bool_exp_bool_and_arguments_columns" columns of table "feature_intersections" */
export type Feature_Intersections_Select_Column_Feature_Intersections_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "feature_intersections_aggregate_bool_exp_bool_or_arguments_columns" columns of table "feature_intersections" */
export type Feature_Intersections_Select_Column_Feature_Intersections_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** Boolean expression to filter rows from the table "feature_layers". All fields are combined with a logical 'AND'. */
export type Feature_Layers_Bool_Exp = {
  _and?: Array<Feature_Layers_Bool_Exp> | null | undefined;
  _not?: Feature_Layers_Bool_Exp | null | undefined;
  _or?: Array<Feature_Layers_Bool_Exp> | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  internal_table?: String_Comparison_Exp | null | undefined;
  reference_layer_primary_key_column?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "feature_layers" */
export type Feature_Layers_Constraint =
  /** unique or primary key constraint on columns "id" */
  "feature_layers_pkey";

/** input type for inserting data into table "feature_layers" */
export type Feature_Layers_Insert_Input = {
  id?: number | null | undefined;
  internal_table?: string | null | undefined;
  reference_layer_primary_key_column?: string | null | undefined;
};

/** input type for inserting object relation for remote table "feature_layers" */
export type Feature_Layers_Obj_Rel_Insert_Input = {
  data: Feature_Layers_Insert_Input;
  /** upsert condition */
  on_conflict?: Feature_Layers_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "feature_layers" */
export type Feature_Layers_On_Conflict = {
  constraint: Feature_Layers_Constraint;
  update_columns?: Array<Feature_Layers_Update_Column>;
  where?: Feature_Layers_Bool_Exp | null | undefined;
};

/** update columns of table "feature_layers" */
export type Feature_Layers_Update_Column =
  /** column name */
  | "id"
  /** column name */
  | "internal_table"
  /** column name */
  | "reference_layer_primary_key_column";

export type Feature_School_Beacons_Aggregate_Bool_Exp = {
  bool_and?:
    Feature_School_Beacons_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?:
    Feature_School_Beacons_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Feature_School_Beacons_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Feature_School_Beacons_Aggregate_Bool_Exp_Bool_And = {
  arguments: Feature_School_Beacons_Select_Column_Feature_School_Beacons_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Feature_School_Beacons_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Feature_School_Beacons_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Feature_School_Beacons_Select_Column_Feature_School_Beacons_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Feature_School_Beacons_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Feature_School_Beacons_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Feature_School_Beacons_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Feature_School_Beacons_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "feature_school_beacons" */
export type Feature_School_Beacons_Arr_Rel_Insert_Input = {
  data: Array<Feature_School_Beacons_Insert_Input>;
};

/** Boolean expression to filter rows from the table "feature_school_beacons". All fields are combined with a logical 'AND'. */
export type Feature_School_Beacons_Bool_Exp = {
  _and?: Array<Feature_School_Beacons_Bool_Exp> | null | undefined;
  _not?: Feature_School_Beacons_Bool_Exp | null | undefined;
  _or?: Array<Feature_School_Beacons_Bool_Exp> | null | undefined;
  beacon_id?: String_Comparison_Exp | null | undefined;
  beacon_name?: String_Comparison_Exp | null | undefined;
  component_id?: Int_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  geography?: Geography_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  knack_id?: String_Comparison_Exp | null | undefined;
  location_name?: String_Comparison_Exp | null | undefined;
  school_zone_beacon_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
  zone_name?: String_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "feature_school_beacons" */
export type Feature_School_Beacons_Insert_Input = {
  beacon_id?: string | null | undefined;
  beacon_name?: string | null | undefined;
  component_id?: number | null | undefined;
  /** Timestamp of when the school beacon feature was created */
  created_at?: unknown;
  /** User ID of the creator of the school beacon feature */
  created_by_user_id?: number | null | undefined;
  geography?: unknown;
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  knack_id?: string | null | undefined;
  location_name?: string | null | undefined;
  school_zone_beacon_id?: string | null | undefined;
  /** Timestamp of the last update of the school beacon feature */
  updated_at?: unknown;
  /** User ID of the last updater of the school beacon feature */
  updated_by_user_id?: number | null | undefined;
  zone_name?: string | null | undefined;
};

/** select columns of table "feature_school_beacons" */
export type Feature_School_Beacons_Select_Column =
  /** column name */
  | "beacon_id"
  /** column name */
  | "beacon_name"
  /** column name */
  | "component_id"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "geography"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "knack_id"
  /** column name */
  | "location_name"
  /** column name */
  | "school_zone_beacon_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id"
  /** column name */
  | "zone_name";

/** select "feature_school_beacons_aggregate_bool_exp_bool_and_arguments_columns" columns of table "feature_school_beacons" */
export type Feature_School_Beacons_Select_Column_Feature_School_Beacons_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "feature_school_beacons_aggregate_bool_exp_bool_or_arguments_columns" columns of table "feature_school_beacons" */
export type Feature_School_Beacons_Select_Column_Feature_School_Beacons_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

export type Feature_Signals_Aggregate_Bool_Exp = {
  bool_and?: Feature_Signals_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Feature_Signals_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Feature_Signals_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Feature_Signals_Aggregate_Bool_Exp_Bool_And = {
  arguments: Feature_Signals_Select_Column_Feature_Signals_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Feature_Signals_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Feature_Signals_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Feature_Signals_Select_Column_Feature_Signals_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Feature_Signals_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Feature_Signals_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Feature_Signals_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Feature_Signals_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "feature_signals" */
export type Feature_Signals_Arr_Rel_Insert_Input = {
  data: Array<Feature_Signals_Insert_Input>;
};

/** Boolean expression to filter rows from the table "feature_signals". All fields are combined with a logical 'AND'. */
export type Feature_Signals_Bool_Exp = {
  _and?: Array<Feature_Signals_Bool_Exp> | null | undefined;
  _not?: Feature_Signals_Bool_Exp | null | undefined;
  _or?: Array<Feature_Signals_Bool_Exp> | null | undefined;
  component_id?: Int_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  geography?: Geography_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  knack_id?: String_Comparison_Exp | null | undefined;
  location_name?: String_Comparison_Exp | null | undefined;
  signal_id?: Int_Comparison_Exp | null | undefined;
  signal_type?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "feature_signals" */
export type Feature_Signals_Insert_Input = {
  component_id?: number | null | undefined;
  /** Timestamp of when the signal feature was created */
  created_at?: unknown;
  /** User ID of the creator of the signal feature */
  created_by_user_id?: number | null | undefined;
  geography?: unknown;
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  knack_id?: string | null | undefined;
  location_name?: string | null | undefined;
  signal_id?: number | null | undefined;
  signal_type?: string | null | undefined;
  /** Timestamp of the last update of the signal feature */
  updated_at?: unknown;
  /** User ID of the last updater of the signal feature */
  updated_by_user_id?: number | null | undefined;
};

/** select columns of table "feature_signals" */
export type Feature_Signals_Select_Column =
  /** column name */
  | "component_id"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "geography"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "knack_id"
  /** column name */
  | "location_name"
  /** column name */
  | "signal_id"
  /** column name */
  | "signal_type"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "feature_signals_aggregate_bool_exp_bool_and_arguments_columns" columns of table "feature_signals" */
export type Feature_Signals_Select_Column_Feature_Signals_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "feature_signals_aggregate_bool_exp_bool_or_arguments_columns" columns of table "feature_signals" */
export type Feature_Signals_Select_Column_Feature_Signals_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

export type Feature_Street_Segments_Aggregate_Bool_Exp = {
  bool_and?:
    Feature_Street_Segments_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?:
    Feature_Street_Segments_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Feature_Street_Segments_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Feature_Street_Segments_Aggregate_Bool_Exp_Bool_And = {
  arguments: Feature_Street_Segments_Select_Column_Feature_Street_Segments_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Feature_Street_Segments_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Feature_Street_Segments_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Feature_Street_Segments_Select_Column_Feature_Street_Segments_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Feature_Street_Segments_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Feature_Street_Segments_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Feature_Street_Segments_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Feature_Street_Segments_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "feature_street_segments" */
export type Feature_Street_Segments_Arr_Rel_Insert_Input = {
  data: Array<Feature_Street_Segments_Insert_Input>;
};

/** Boolean expression to filter rows from the table "feature_street_segments". All fields are combined with a logical 'AND'. */
export type Feature_Street_Segments_Bool_Exp = {
  _and?: Array<Feature_Street_Segments_Bool_Exp> | null | undefined;
  _not?: Feature_Street_Segments_Bool_Exp | null | undefined;
  _or?: Array<Feature_Street_Segments_Bool_Exp> | null | undefined;
  component_id?: Int_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  ctn_segment_id?: Int_Comparison_Exp | null | undefined;
  from_address_min?: Int_Comparison_Exp | null | undefined;
  full_street_name?: String_Comparison_Exp | null | undefined;
  geography?: Geography_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  length_feet?: Int_Comparison_Exp | null | undefined;
  line_type?: String_Comparison_Exp | null | undefined;
  source_layer?: String_Comparison_Exp | null | undefined;
  symbol?: Int_Comparison_Exp | null | undefined;
  to_address_max?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "feature_street_segments" */
export type Feature_Street_Segments_Insert_Input = {
  component_id?: number | null | undefined;
  /** Timestamp of when the street segment feature was created */
  created_at?: unknown;
  /** User ID of the creator of the street segment feature */
  created_by_user_id?: number | null | undefined;
  ctn_segment_id?: number | null | undefined;
  from_address_min?: number | null | undefined;
  full_street_name?: string | null | undefined;
  geography?: unknown;
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  line_type?: string | null | undefined;
  source_layer?: string | null | undefined;
  symbol?: number | null | undefined;
  to_address_max?: number | null | undefined;
  /** Timestamp of the last update of the street segment feature */
  updated_at?: unknown;
  /** User ID of the last updater of the street segment feature */
  updated_by_user_id?: number | null | undefined;
};

/** select columns of table "feature_street_segments" */
export type Feature_Street_Segments_Select_Column =
  /** column name */
  | "component_id"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "ctn_segment_id"
  /** column name */
  | "from_address_min"
  /** column name */
  | "full_street_name"
  /** column name */
  | "geography"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "length_feet"
  /** column name */
  | "line_type"
  /** column name */
  | "source_layer"
  /** column name */
  | "symbol"
  /** column name */
  | "to_address_max"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "feature_street_segments_aggregate_bool_exp_bool_and_arguments_columns" columns of table "feature_street_segments" */
export type Feature_Street_Segments_Select_Column_Feature_Street_Segments_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "feature_street_segments_aggregate_bool_exp_bool_or_arguments_columns" columns of table "feature_street_segments" */
export type Feature_Street_Segments_Select_Column_Feature_Street_Segments_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** Boolean expression to filter rows from the table "features". All fields are combined with a logical 'AND'. */
export type Features_Bool_Exp = {
  _and?: Array<Features_Bool_Exp> | null | undefined;
  _not?: Features_Bool_Exp | null | undefined;
  _or?: Array<Features_Bool_Exp> | null | undefined;
  component_id?: Int_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
};

/** input type for incrementing numeric columns in table "features" */
export type Features_Inc_Input = {
  component_id?: number | null | undefined;
  id?: number | null | undefined;
};

/** input type for updating data in table "features" */
export type Features_Set_Input = {
  component_id?: number | null | undefined;
  id?: number | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
};

export type Features_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: Features_Inc_Input | null | undefined;
  /** sets the columns of the filtered rows to the given values */
  _set?: Features_Set_Input | null | undefined;
  /** filter the rows which have to be updated */
  where: Features_Bool_Exp;
};

export type Files_Ecapris_Funding_Aggregate_Bool_Exp = {
  bool_and?:
    Files_Ecapris_Funding_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Files_Ecapris_Funding_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Files_Ecapris_Funding_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Files_Ecapris_Funding_Aggregate_Bool_Exp_Bool_And = {
  arguments: Files_Ecapris_Funding_Select_Column_Files_Ecapris_Funding_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Files_Ecapris_Funding_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Files_Ecapris_Funding_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Files_Ecapris_Funding_Select_Column_Files_Ecapris_Funding_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Files_Ecapris_Funding_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Files_Ecapris_Funding_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Files_Ecapris_Funding_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Files_Ecapris_Funding_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "files_ecapris_funding" */
export type Files_Ecapris_Funding_Arr_Rel_Insert_Input = {
  data: Array<Files_Ecapris_Funding_Insert_Input>;
  /** upsert condition */
  on_conflict?: Files_Ecapris_Funding_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "files_ecapris_funding". All fields are combined with a logical 'AND'. */
export type Files_Ecapris_Funding_Bool_Exp = {
  _and?: Array<Files_Ecapris_Funding_Bool_Exp> | null | undefined;
  _not?: Files_Ecapris_Funding_Bool_Exp | null | undefined;
  _or?: Array<Files_Ecapris_Funding_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  entity_id?: Int_Comparison_Exp | null | undefined;
  file_id?: Int_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_project_file?: Moped_Project_Files_Bool_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "files_ecapris_funding" */
export type Files_Ecapris_Funding_Constraint =
  /** unique or primary key constraint on columns "id" */
  | "files_ecapris_funding_pkey"
  /** unique or primary key constraint on columns "project_id", "file_id", "entity_id" */
  | "files_ecapris_funding_project_id_entity_id_file_id_key";

/** input type for inserting data into table "files_ecapris_funding" */
export type Files_Ecapris_Funding_Insert_Input = {
  /** Timestamp for when the record was created. */
  created_at?: unknown;
  /** References the user who created the file attachment record. */
  created_by_user_id?: number | null | undefined;
  /** References the ecapris_subproject_funding primary key to which the file attachment belongs. */
  entity_id?: number | null | undefined;
  /** References the file that is attached to the eCAPRIS funding row. */
  file_id?: number | null | undefined;
  id?: number | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  moped_project_file?:
    Moped_Project_Files_Obj_Rel_Insert_Input | null | undefined;
  /** References the Moped project to which the file attachment belongs. */
  project_id?: number | null | undefined;
  /** Timestamp for when the record was last updated. */
  updated_at?: unknown;
  /** References the user who last updated the file attachment record. */
  updated_by_user_id?: number | null | undefined;
};

/** on_conflict condition type for table "files_ecapris_funding" */
export type Files_Ecapris_Funding_On_Conflict = {
  constraint: Files_Ecapris_Funding_Constraint;
  update_columns?: Array<Files_Ecapris_Funding_Update_Column>;
  where?: Files_Ecapris_Funding_Bool_Exp | null | undefined;
};

/** select columns of table "files_ecapris_funding" */
export type Files_Ecapris_Funding_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "entity_id"
  /** column name */
  | "file_id"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "files_ecapris_funding_aggregate_bool_exp_bool_and_arguments_columns" columns of table "files_ecapris_funding" */
export type Files_Ecapris_Funding_Select_Column_Files_Ecapris_Funding_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "files_ecapris_funding_aggregate_bool_exp_bool_or_arguments_columns" columns of table "files_ecapris_funding" */
export type Files_Ecapris_Funding_Select_Column_Files_Ecapris_Funding_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** update columns of table "files_ecapris_funding" */
export type Files_Ecapris_Funding_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "entity_id"
  /** column name */
  | "file_id"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

export type Files_Project_Funding_Aggregate_Bool_Exp = {
  bool_and?:
    Files_Project_Funding_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Files_Project_Funding_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Files_Project_Funding_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Files_Project_Funding_Aggregate_Bool_Exp_Bool_And = {
  arguments: Files_Project_Funding_Select_Column_Files_Project_Funding_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Files_Project_Funding_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Files_Project_Funding_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Files_Project_Funding_Select_Column_Files_Project_Funding_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Files_Project_Funding_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Files_Project_Funding_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Files_Project_Funding_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Files_Project_Funding_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "files_project_funding" */
export type Files_Project_Funding_Arr_Rel_Insert_Input = {
  data: Array<Files_Project_Funding_Insert_Input>;
  /** upsert condition */
  on_conflict?: Files_Project_Funding_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "files_project_funding". All fields are combined with a logical 'AND'. */
export type Files_Project_Funding_Bool_Exp = {
  _and?: Array<Files_Project_Funding_Bool_Exp> | null | undefined;
  _not?: Files_Project_Funding_Bool_Exp | null | undefined;
  _or?: Array<Files_Project_Funding_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  entity_id?: Int_Comparison_Exp | null | undefined;
  file_id?: Int_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_project_file?: Moped_Project_Files_Bool_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "files_project_funding" */
export type Files_Project_Funding_Constraint =
  /** unique or primary key constraint on columns "file_id", "entity_id" */
  | "files_project_funding_entity_id_file_id_key"
  /** unique or primary key constraint on columns "id" */
  | "files_project_funding_pkey";

/** input type for inserting data into table "files_project_funding" */
export type Files_Project_Funding_Insert_Input = {
  /** Timestamp for when the record was created. */
  created_at?: unknown;
  /** References the user who created the file attachment record. */
  created_by_user_id?: number | null | undefined;
  /** References the Moped project funding record to which the file attachment belongs. */
  entity_id?: number | null | undefined;
  /** References the file that is attached to the moped funding row. */
  file_id?: number | null | undefined;
  id?: number | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  moped_project_file?:
    Moped_Project_Files_Obj_Rel_Insert_Input | null | undefined;
  /** Timestamp for when the record was last updated. */
  updated_at?: unknown;
  /** References the user who last updated the file attachment record. */
  updated_by_user_id?: number | null | undefined;
};

/** on_conflict condition type for table "files_project_funding" */
export type Files_Project_Funding_On_Conflict = {
  constraint: Files_Project_Funding_Constraint;
  update_columns?: Array<Files_Project_Funding_Update_Column>;
  where?: Files_Project_Funding_Bool_Exp | null | undefined;
};

/** select columns of table "files_project_funding" */
export type Files_Project_Funding_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "entity_id"
  /** column name */
  | "file_id"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "files_project_funding_aggregate_bool_exp_bool_and_arguments_columns" columns of table "files_project_funding" */
export type Files_Project_Funding_Select_Column_Files_Project_Funding_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "files_project_funding_aggregate_bool_exp_bool_or_arguments_columns" columns of table "files_project_funding" */
export type Files_Project_Funding_Select_Column_Files_Project_Funding_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** update columns of table "files_project_funding" */
export type Files_Project_Funding_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "entity_id"
  /** column name */
  | "file_id"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

export type Geography_Cast_Exp = {
  geometry?: Geometry_Comparison_Exp | null | undefined;
};

/** Boolean expression to compare columns of type "geography". All fields are combined with logical 'AND'. */
export type Geography_Comparison_Exp = {
  _cast?: Geography_Cast_Exp | null | undefined;
  _eq?: unknown;
  _gt?: unknown;
  _gte?: unknown;
  _in?: Array<unknown> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: unknown;
  _lte?: unknown;
  _neq?: unknown;
  _nin?: Array<unknown> | null | undefined;
  /** is the column within a given distance from the given geography value */
  _st_d_within?: St_D_Within_Geography_Input | null | undefined;
  /** does the column spatially intersect the given geography value */
  _st_intersects?: unknown;
};

export type Geometry_Cast_Exp = {
  geography?: Geography_Comparison_Exp | null | undefined;
};

/** Boolean expression to compare columns of type "geometry". All fields are combined with logical 'AND'. */
export type Geometry_Comparison_Exp = {
  _cast?: Geometry_Cast_Exp | null | undefined;
  _eq?: unknown;
  _gt?: unknown;
  _gte?: unknown;
  _in?: Array<unknown> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: unknown;
  _lte?: unknown;
  _neq?: unknown;
  _nin?: Array<unknown> | null | undefined;
  /** is the column within a given 3D distance from the given geometry value */
  _st_3d_d_within?: St_D_Within_Input | null | undefined;
  /** does the column spatially intersect the given geometry value in 3D */
  _st_3d_intersects?: unknown;
  /** does the column contain the given geometry value */
  _st_contains?: unknown;
  /** does the column cross the given geometry value */
  _st_crosses?: unknown;
  /** is the column within a given distance from the given geometry value */
  _st_d_within?: St_D_Within_Input | null | undefined;
  /** is the column equal to given geometry value (directionality is ignored) */
  _st_equals?: unknown;
  /** does the column spatially intersect the given geometry value */
  _st_intersects?: unknown;
  /** does the column 'spatially overlap' (intersect but not completely contain) the given geometry value */
  _st_overlaps?: unknown;
  /** does the column have atleast one point in common with the given geometry value */
  _st_touches?: unknown;
  /** is the column contained in the given geometry value */
  _st_within?: unknown;
};

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: unknown;
  _gt?: unknown;
  _gte?: unknown;
  _in?: Array<unknown> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: unknown;
  _lte?: unknown;
  _neq?: unknown;
  _nin?: Array<unknown> | null | undefined;
};

export type Jsonb_Cast_Exp = {
  String?: String_Comparison_Exp | null | undefined;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: Jsonb_Cast_Exp | null | undefined;
  /** is the column contained in the given json value */
  _contained_in?: unknown;
  /** does the column contain the given json value at the top level */
  _contains?: unknown;
  _eq?: unknown;
  _gt?: unknown;
  _gte?: unknown;
  /** does the string exist as a top-level key in the column */
  _has_key?: string | null | undefined;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: Array<string> | null | undefined;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: Array<string> | null | undefined;
  _in?: Array<unknown> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: unknown;
  _lte?: unknown;
  _neq?: unknown;
  _nin?: Array<unknown> | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_component_tags". All fields are combined with a logical 'AND'. */
export type Moped_Component_Tags_Bool_Exp = {
  _and?: Array<Moped_Component_Tags_Bool_Exp> | null | undefined;
  _not?: Moped_Component_Tags_Bool_Exp | null | undefined;
  _or?: Array<Moped_Component_Tags_Bool_Exp> | null | undefined;
  full_name?: String_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_proj_component_tags?:
    Moped_Proj_Component_Tags_Bool_Exp | null | undefined;
  moped_proj_component_tags_aggregate?:
    Moped_Proj_Component_Tags_Aggregate_Bool_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  slug?: String_Comparison_Exp | null | undefined;
  type?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_component_tags" */
export type Moped_Component_Tags_Constraint =
  /** unique or primary key constraint on columns "type", "name" */
  | "moped_component_tags_name_key"
  /** unique or primary key constraint on columns "id" */
  | "moped_component_tags_pkey"
  /** unique or primary key constraint on columns "slug" */
  | "moped_component_tags_slug_key";

/** input type for inserting data into table "moped_component_tags" */
export type Moped_Component_Tags_Insert_Input = {
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  moped_proj_component_tags?:
    Moped_Proj_Component_Tags_Arr_Rel_Insert_Input | null | undefined;
  name?: string | null | undefined;
  slug?: string | null | undefined;
  type?: string | null | undefined;
};

/** input type for inserting object relation for remote table "moped_component_tags" */
export type Moped_Component_Tags_Obj_Rel_Insert_Input = {
  data: Moped_Component_Tags_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Component_Tags_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_component_tags" */
export type Moped_Component_Tags_On_Conflict = {
  constraint: Moped_Component_Tags_Constraint;
  update_columns?: Array<Moped_Component_Tags_Update_Column>;
  where?: Moped_Component_Tags_Bool_Exp | null | undefined;
};

/** update columns of table "moped_component_tags" */
export type Moped_Component_Tags_Update_Column =
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "name"
  /** column name */
  | "slug"
  /** column name */
  | "type";

export type Moped_Component_Work_Types_Aggregate_Bool_Exp = {
  count?:
    Moped_Component_Work_Types_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Component_Work_Types_Aggregate_Bool_Exp_Count = {
  arguments?:
    Array<Moped_Component_Work_Types_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Component_Work_Types_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_component_work_types" */
export type Moped_Component_Work_Types_Arr_Rel_Insert_Input = {
  data: Array<Moped_Component_Work_Types_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Component_Work_Types_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_component_work_types". All fields are combined with a logical 'AND'. */
export type Moped_Component_Work_Types_Bool_Exp = {
  _and?: Array<Moped_Component_Work_Types_Bool_Exp> | null | undefined;
  _not?: Moped_Component_Work_Types_Bool_Exp | null | undefined;
  _or?: Array<Moped_Component_Work_Types_Bool_Exp> | null | undefined;
  component_id?: Int_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  moped_component?: Moped_Components_Bool_Exp | null | undefined;
  moped_work_type?: Moped_Work_Types_Bool_Exp | null | undefined;
  work_type_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_component_work_types" */
export type Moped_Component_Work_Types_Constraint =
  /** unique or primary key constraint on columns "id" */
  | "moped_component_work_types_pkey"
  /** unique or primary key constraint on columns "component_id", "work_type_id" */
  | "unique_work_type_component";

/** input type for inserting data into table "moped_component_work_types" */
export type Moped_Component_Work_Types_Insert_Input = {
  component_id?: number | null | undefined;
  id?: number | null | undefined;
  moped_component?: Moped_Components_Obj_Rel_Insert_Input | null | undefined;
  moped_work_type?: Moped_Work_Types_Obj_Rel_Insert_Input | null | undefined;
  work_type_id?: number | null | undefined;
};

/** on_conflict condition type for table "moped_component_work_types" */
export type Moped_Component_Work_Types_On_Conflict = {
  constraint: Moped_Component_Work_Types_Constraint;
  update_columns?: Array<Moped_Component_Work_Types_Update_Column>;
  where?: Moped_Component_Work_Types_Bool_Exp | null | undefined;
};

/** select columns of table "moped_component_work_types" */
export type Moped_Component_Work_Types_Select_Column =
  /** column name */
  | "component_id"
  /** column name */
  | "id"
  /** column name */
  | "work_type_id";

/** update columns of table "moped_component_work_types" */
export type Moped_Component_Work_Types_Update_Column =
  /** column name */
  | "component_id"
  /** column name */
  | "id"
  /** column name */
  | "work_type_id";

/** Boolean expression to filter rows from the table "moped_components". All fields are combined with a logical 'AND'. */
export type Moped_Components_Bool_Exp = {
  _and?: Array<Moped_Components_Bool_Exp> | null | undefined;
  _not?: Moped_Components_Bool_Exp | null | undefined;
  _or?: Array<Moped_Components_Bool_Exp> | null | undefined;
  asset_feature_layer?: Feature_Layers_Bool_Exp | null | undefined;
  asset_feature_layer_id?: Int_Comparison_Exp | null | undefined;
  component_id?: Int_Comparison_Exp | null | undefined;
  component_name?: String_Comparison_Exp | null | undefined;
  component_name_full?: String_Comparison_Exp | null | undefined;
  component_subtype?: String_Comparison_Exp | null | undefined;
  feature_layer?: Feature_Layers_Bool_Exp | null | undefined;
  feature_layer_id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  line_representation?: Boolean_Comparison_Exp | null | undefined;
  moped_component_work_types?:
    Moped_Component_Work_Types_Bool_Exp | null | undefined;
  moped_component_work_types_aggregate?:
    Moped_Component_Work_Types_Aggregate_Bool_Exp | null | undefined;
  moped_components_subcomponents?:
    Moped_Components_Subcomponents_Bool_Exp | null | undefined;
  moped_components_subcomponents_aggregate?:
    Moped_Components_Subcomponents_Aggregate_Bool_Exp | null | undefined;
  moped_proj_components?: Moped_Proj_Components_Bool_Exp | null | undefined;
  moped_proj_components_aggregate?:
    Moped_Proj_Components_Aggregate_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_components" */
export type Moped_Components_Constraint =
  /** unique or primary key constraint on columns "component_id" */
  "moped_components_pkey";

/** input type for inserting data into table "moped_components" */
export type Moped_Components_Insert_Input = {
  asset_feature_layer?: Feature_Layers_Obj_Rel_Insert_Input | null | undefined;
  /** Foreign key which indicates if the component supports storing data from a reference asset layer, and in which layer that data should be stored */
  asset_feature_layer_id?: number | null | undefined;
  component_id?: number | null | undefined;
  component_name?: string | null | undefined;
  component_subtype?: string | null | undefined;
  feature_layer?: Feature_Layers_Obj_Rel_Insert_Input | null | undefined;
  feature_layer_id?: number | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  line_representation?: boolean | null | undefined;
  moped_component_work_types?:
    Moped_Component_Work_Types_Arr_Rel_Insert_Input | null | undefined;
  moped_components_subcomponents?:
    Moped_Components_Subcomponents_Arr_Rel_Insert_Input | null | undefined;
  moped_proj_components?:
    Moped_Proj_Components_Arr_Rel_Insert_Input | null | undefined;
};

/** input type for inserting object relation for remote table "moped_components" */
export type Moped_Components_Obj_Rel_Insert_Input = {
  data: Moped_Components_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Components_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_components" */
export type Moped_Components_On_Conflict = {
  constraint: Moped_Components_Constraint;
  update_columns?: Array<Moped_Components_Update_Column>;
  where?: Moped_Components_Bool_Exp | null | undefined;
};

export type Moped_Components_Subcomponents_Aggregate_Bool_Exp = {
  count?:
    Moped_Components_Subcomponents_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Components_Subcomponents_Aggregate_Bool_Exp_Count = {
  arguments?:
    Array<Moped_Components_Subcomponents_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Components_Subcomponents_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_components_subcomponents" */
export type Moped_Components_Subcomponents_Arr_Rel_Insert_Input = {
  data: Array<Moped_Components_Subcomponents_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Components_Subcomponents_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_components_subcomponents". All fields are combined with a logical 'AND'. */
export type Moped_Components_Subcomponents_Bool_Exp = {
  _and?: Array<Moped_Components_Subcomponents_Bool_Exp> | null | undefined;
  _not?: Moped_Components_Subcomponents_Bool_Exp | null | undefined;
  _or?: Array<Moped_Components_Subcomponents_Bool_Exp> | null | undefined;
  component_id?: Int_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  moped_component?: Moped_Components_Bool_Exp | null | undefined;
  moped_subcomponent?: Moped_Subcomponents_Bool_Exp | null | undefined;
  subcomponent_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_components_subcomponents" */
export type Moped_Components_Subcomponents_Constraint =
  /** unique or primary key constraint on columns "id" */
  | "moped_components_subcomponents_pkey"
  /** unique or primary key constraint on columns "component_id", "subcomponent_id" */
  | "unique_component_subcomponents";

/** input type for inserting data into table "moped_components_subcomponents" */
export type Moped_Components_Subcomponents_Insert_Input = {
  component_id?: number | null | undefined;
  id?: number | null | undefined;
  moped_component?: Moped_Components_Obj_Rel_Insert_Input | null | undefined;
  moped_subcomponent?:
    Moped_Subcomponents_Obj_Rel_Insert_Input | null | undefined;
  subcomponent_id?: number | null | undefined;
};

/** on_conflict condition type for table "moped_components_subcomponents" */
export type Moped_Components_Subcomponents_On_Conflict = {
  constraint: Moped_Components_Subcomponents_Constraint;
  update_columns?: Array<Moped_Components_Subcomponents_Update_Column>;
  where?: Moped_Components_Subcomponents_Bool_Exp | null | undefined;
};

/** select columns of table "moped_components_subcomponents" */
export type Moped_Components_Subcomponents_Select_Column =
  /** column name */
  | "component_id"
  /** column name */
  | "id"
  /** column name */
  | "subcomponent_id";

/** update columns of table "moped_components_subcomponents" */
export type Moped_Components_Subcomponents_Update_Column =
  /** column name */
  | "component_id"
  /** column name */
  | "id"
  /** column name */
  | "subcomponent_id";

/** update columns of table "moped_components" */
export type Moped_Components_Update_Column =
  /** column name */
  | "asset_feature_layer_id"
  /** column name */
  | "component_id"
  /** column name */
  | "component_name"
  /** column name */
  | "component_subtype"
  /** column name */
  | "feature_layer_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "line_representation";

export type Moped_Department_Aggregate_Bool_Exp = {
  bool_and?: Moped_Department_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Moped_Department_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Moped_Department_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Department_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Department_Select_Column_Moped_Department_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Department_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Department_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Department_Select_Column_Moped_Department_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Department_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Department_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Department_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Department_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_department" */
export type Moped_Department_Arr_Rel_Insert_Input = {
  data: Array<Moped_Department_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Department_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_department". All fields are combined with a logical 'AND'. */
export type Moped_Department_Bool_Exp = {
  _and?: Array<Moped_Department_Bool_Exp> | null | undefined;
  _not?: Moped_Department_Bool_Exp | null | undefined;
  _or?: Array<Moped_Department_Bool_Exp> | null | undefined;
  date_added?: Timestamp_Comparison_Exp | null | undefined;
  department_abbreviation?: String_Comparison_Exp | null | undefined;
  department_id?: Int_Comparison_Exp | null | undefined;
  department_name?: String_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  organization_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_department" */
export type Moped_Department_Constraint =
  /** unique or primary key constraint on columns "department_id" */
  "moped_department_pkey";

/** input type for inserting data into table "moped_department" */
export type Moped_Department_Insert_Input = {
  date_added?: unknown;
  department_abbreviation?: string | null | undefined;
  department_id?: number | null | undefined;
  department_name?: string | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  organization_id?: number | null | undefined;
};

/** input type for inserting object relation for remote table "moped_department" */
export type Moped_Department_Obj_Rel_Insert_Input = {
  data: Moped_Department_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Department_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_department" */
export type Moped_Department_On_Conflict = {
  constraint: Moped_Department_Constraint;
  update_columns?: Array<Moped_Department_Update_Column>;
  where?: Moped_Department_Bool_Exp | null | undefined;
};

/** select columns of table "moped_department" */
export type Moped_Department_Select_Column =
  /** column name */
  | "date_added"
  /** column name */
  | "department_abbreviation"
  /** column name */
  | "department_id"
  /** column name */
  | "department_name"
  /** column name */
  | "is_deleted"
  /** column name */
  | "organization_id";

/** select "moped_department_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_department" */
export type Moped_Department_Select_Column_Moped_Department_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "moped_department_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_department" */
export type Moped_Department_Select_Column_Moped_Department_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** update columns of table "moped_department" */
export type Moped_Department_Update_Column =
  /** column name */
  | "date_added"
  /** column name */
  | "department_abbreviation"
  /** column name */
  | "department_id"
  /** column name */
  | "department_name"
  /** column name */
  | "is_deleted"
  /** column name */
  | "organization_id";

/** Boolean expression to filter rows from the table "moped_entity". All fields are combined with a logical 'AND'. */
export type Moped_Entity_Bool_Exp = {
  _and?: Array<Moped_Entity_Bool_Exp> | null | undefined;
  _not?: Moped_Entity_Bool_Exp | null | undefined;
  _or?: Array<Moped_Entity_Bool_Exp> | null | undefined;
  date_added?: Timestamptz_Comparison_Exp | null | undefined;
  department_id?: Int_Comparison_Exp | null | undefined;
  entity_department?: Moped_Department_Bool_Exp | null | undefined;
  entity_department_aggregate?:
    Moped_Department_Aggregate_Bool_Exp | null | undefined;
  entity_id?: Int_Comparison_Exp | null | undefined;
  entity_name?: String_Comparison_Exp | null | undefined;
  entity_organization?: Moped_Organization_Bool_Exp | null | undefined;
  entity_organization_aggregate?:
    Moped_Organization_Aggregate_Bool_Exp | null | undefined;
  entity_uuid?: Uuid_Comparison_Exp | null | undefined;
  entity_workgroup?: Moped_Workgroup_Bool_Exp | null | undefined;
  entity_workgroup_aggregate?:
    Moped_Workgroup_Aggregate_Bool_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  mopedProjectsByProjectSponsor?: Moped_Project_Bool_Exp | null | undefined;
  mopedProjectsByProjectSponsor_aggregate?:
    Moped_Project_Aggregate_Bool_Exp | null | undefined;
  moped_proj_partners?: Moped_Proj_Partners_Bool_Exp | null | undefined;
  moped_proj_partners_aggregate?:
    Moped_Proj_Partners_Aggregate_Bool_Exp | null | undefined;
  moped_projects?: Moped_Project_Bool_Exp | null | undefined;
  moped_projects_aggregate?:
    Moped_Project_Aggregate_Bool_Exp | null | undefined;
  organization_id?: Int_Comparison_Exp | null | undefined;
  workgroup_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_entity" */
export type Moped_Entity_Constraint =
  /** unique or primary key constraint on columns "entity_id" */
  | "moped_entities_entity_id_key"
  /** unique or primary key constraint on columns "entity_id" */
  | "moped_entity_pkey";

/** input type for inserting data into table "moped_entity" */
export type Moped_Entity_Insert_Input = {
  date_added?: unknown;
  department_id?: number | null | undefined;
  entity_department?: Moped_Department_Arr_Rel_Insert_Input | null | undefined;
  entity_id?: number | null | undefined;
  entity_name?: string | null | undefined;
  entity_organization?:
    Moped_Organization_Arr_Rel_Insert_Input | null | undefined;
  entity_uuid?: unknown;
  entity_workgroup?: Moped_Workgroup_Arr_Rel_Insert_Input | null | undefined;
  is_deleted?: boolean | null | undefined;
  mopedProjectsByProjectSponsor?:
    Moped_Project_Arr_Rel_Insert_Input | null | undefined;
  moped_proj_partners?:
    Moped_Proj_Partners_Arr_Rel_Insert_Input | null | undefined;
  moped_projects?: Moped_Project_Arr_Rel_Insert_Input | null | undefined;
  organization_id?: number | null | undefined;
  workgroup_id?: number | null | undefined;
};

/** input type for inserting object relation for remote table "moped_entity" */
export type Moped_Entity_Obj_Rel_Insert_Input = {
  data: Moped_Entity_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Entity_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_entity" */
export type Moped_Entity_On_Conflict = {
  constraint: Moped_Entity_Constraint;
  update_columns?: Array<Moped_Entity_Update_Column>;
  where?: Moped_Entity_Bool_Exp | null | undefined;
};

/** update columns of table "moped_entity" */
export type Moped_Entity_Update_Column =
  /** column name */
  | "date_added"
  /** column name */
  | "department_id"
  /** column name */
  | "entity_id"
  /** column name */
  | "entity_name"
  /** column name */
  | "entity_uuid"
  /** column name */
  | "is_deleted"
  /** column name */
  | "organization_id"
  /** column name */
  | "workgroup_id";

/** Boolean expression to filter rows from the table "moped_fund_programs". All fields are combined with a logical 'AND'. */
export type Moped_Fund_Programs_Bool_Exp = {
  _and?: Array<Moped_Fund_Programs_Bool_Exp> | null | undefined;
  _not?: Moped_Fund_Programs_Bool_Exp | null | undefined;
  _or?: Array<Moped_Fund_Programs_Bool_Exp> | null | undefined;
  funding_program_id?: Int_Comparison_Exp | null | undefined;
  funding_program_name?: String_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_fund_programs" */
export type Moped_Fund_Programs_Constraint =
  /** unique or primary key constraint on columns "funding_program_id" */
  | "moped_fund_programs_pkey"
  /** unique or primary key constraint on columns "funding_program_id" */
  | "moped_fund_source_cat_funding_source_category_id_key"
  /** unique or primary key constraint on columns "funding_program_name" */
  | "moped_fund_source_cat_funding_source_category_name_key";

/** input type for inserting data into table "moped_fund_programs" */
export type Moped_Fund_Programs_Insert_Input = {
  funding_program_id?: number | null | undefined;
  funding_program_name?: string | null | undefined;
  is_deleted?: boolean | null | undefined;
};

/** input type for inserting object relation for remote table "moped_fund_programs" */
export type Moped_Fund_Programs_Obj_Rel_Insert_Input = {
  data: Moped_Fund_Programs_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Fund_Programs_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_fund_programs" */
export type Moped_Fund_Programs_On_Conflict = {
  constraint: Moped_Fund_Programs_Constraint;
  update_columns?: Array<Moped_Fund_Programs_Update_Column>;
  where?: Moped_Fund_Programs_Bool_Exp | null | undefined;
};

/** update columns of table "moped_fund_programs" */
export type Moped_Fund_Programs_Update_Column =
  /** column name */
  | "funding_program_id"
  /** column name */
  | "funding_program_name"
  /** column name */
  | "is_deleted";

/** Boolean expression to filter rows from the table "moped_fund_sources". All fields are combined with a logical 'AND'. */
export type Moped_Fund_Sources_Bool_Exp = {
  _and?: Array<Moped_Fund_Sources_Bool_Exp> | null | undefined;
  _not?: Moped_Fund_Sources_Bool_Exp | null | undefined;
  _or?: Array<Moped_Fund_Sources_Bool_Exp> | null | undefined;
  funding_source_id?: Int_Comparison_Exp | null | undefined;
  funding_source_name?: String_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_fund_sources" */
export type Moped_Fund_Sources_Constraint =
  /** unique or primary key constraint on columns "funding_source_id" */
  | "moped_fund_sources_funding_source_id_key"
  /** unique or primary key constraint on columns "funding_source_name" */
  | "moped_fund_sources_funding_source_name_key"
  /** unique or primary key constraint on columns "funding_source_id" */
  | "moped_fund_sources_pkey";

/** input type for inserting data into table "moped_fund_sources" */
export type Moped_Fund_Sources_Insert_Input = {
  funding_source_id?: number | null | undefined;
  funding_source_name?: string | null | undefined;
  is_deleted?: boolean | null | undefined;
};

/** input type for inserting object relation for remote table "moped_fund_sources" */
export type Moped_Fund_Sources_Obj_Rel_Insert_Input = {
  data: Moped_Fund_Sources_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Fund_Sources_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_fund_sources" */
export type Moped_Fund_Sources_On_Conflict = {
  constraint: Moped_Fund_Sources_Constraint;
  update_columns?: Array<Moped_Fund_Sources_Update_Column>;
  where?: Moped_Fund_Sources_Bool_Exp | null | undefined;
};

/** update columns of table "moped_fund_sources" */
export type Moped_Fund_Sources_Update_Column =
  /** column name */
  | "funding_source_id"
  /** column name */
  | "funding_source_name"
  /** column name */
  | "is_deleted";

/** Boolean expression to filter rows from the table "moped_milestones". All fields are combined with a logical 'AND'. */
export type Moped_Milestones_Bool_Exp = {
  _and?: Array<Moped_Milestones_Bool_Exp> | null | undefined;
  _not?: Moped_Milestones_Bool_Exp | null | undefined;
  _or?: Array<Moped_Milestones_Bool_Exp> | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  milestone_description?: String_Comparison_Exp | null | undefined;
  milestone_id?: Int_Comparison_Exp | null | undefined;
  milestone_name?: String_Comparison_Exp | null | undefined;
  moped_phase?: Moped_Phases_Bool_Exp | null | undefined;
  moped_proj_milestones?: Moped_Proj_Milestones_Bool_Exp | null | undefined;
  moped_proj_milestones_aggregate?:
    Moped_Proj_Milestones_Aggregate_Bool_Exp | null | undefined;
  related_phase_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_milestones" */
export type Moped_Milestones_Constraint =
  /** unique or primary key constraint on columns "milestone_id" */
  | "moped_milestones_milestone_id_pkey"
  /** unique or primary key constraint on columns "milestone_name" */
  | "moped_milestones_milestone_name_key";

/** input type for inserting data into table "moped_milestones" */
export type Moped_Milestones_Insert_Input = {
  is_deleted?: boolean | null | undefined;
  milestone_description?: string | null | undefined;
  milestone_id?: number | null | undefined;
  milestone_name?: string | null | undefined;
  moped_phase?: Moped_Phases_Obj_Rel_Insert_Input | null | undefined;
  moped_proj_milestones?:
    Moped_Proj_Milestones_Arr_Rel_Insert_Input | null | undefined;
  related_phase_id?: number | null | undefined;
};

/** input type for inserting object relation for remote table "moped_milestones" */
export type Moped_Milestones_Obj_Rel_Insert_Input = {
  data: Moped_Milestones_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Milestones_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_milestones" */
export type Moped_Milestones_On_Conflict = {
  constraint: Moped_Milestones_Constraint;
  update_columns?: Array<Moped_Milestones_Update_Column>;
  where?: Moped_Milestones_Bool_Exp | null | undefined;
};

/** update columns of table "moped_milestones" */
export type Moped_Milestones_Update_Column =
  /** column name */
  | "is_deleted"
  /** column name */
  | "milestone_description"
  /** column name */
  | "milestone_id"
  /** column name */
  | "milestone_name"
  /** column name */
  | "related_phase_id";

/** Boolean expression to filter rows from the table "moped_note_types". All fields are combined with a logical 'AND'. */
export type Moped_Note_Types_Bool_Exp = {
  _and?: Array<Moped_Note_Types_Bool_Exp> | null | undefined;
  _not?: Moped_Note_Types_Bool_Exp | null | undefined;
  _or?: Array<Moped_Note_Types_Bool_Exp> | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  slug?: String_Comparison_Exp | null | undefined;
  source?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_note_types" */
export type Moped_Note_Types_Constraint =
  /** unique or primary key constraint on columns "name" */
  | "moped_note_types_name_key"
  /** unique or primary key constraint on columns "id" */
  | "moped_note_types_pkey"
  /** unique or primary key constraint on columns "slug" */
  | "moped_note_types_slug_key";

/** input type for inserting data into table "moped_note_types" */
export type Moped_Note_Types_Insert_Input = {
  id?: number | null | undefined;
  name?: string | null | undefined;
  slug?: string | null | undefined;
  /** Source of the note type, e.g., Moped or eCapris applications */
  source?: string | null | undefined;
};

/** input type for inserting object relation for remote table "moped_note_types" */
export type Moped_Note_Types_Obj_Rel_Insert_Input = {
  data: Moped_Note_Types_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Note_Types_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_note_types" */
export type Moped_Note_Types_On_Conflict = {
  constraint: Moped_Note_Types_Constraint;
  update_columns?: Array<Moped_Note_Types_Update_Column>;
  where?: Moped_Note_Types_Bool_Exp | null | undefined;
};

/** update columns of table "moped_note_types" */
export type Moped_Note_Types_Update_Column =
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "slug"
  /** column name */
  | "source";

export type Moped_Organization_Aggregate_Bool_Exp = {
  count?: Moped_Organization_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Organization_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Organization_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Organization_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_organization" */
export type Moped_Organization_Arr_Rel_Insert_Input = {
  data: Array<Moped_Organization_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Organization_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_organization". All fields are combined with a logical 'AND'. */
export type Moped_Organization_Bool_Exp = {
  _and?: Array<Moped_Organization_Bool_Exp> | null | undefined;
  _not?: Moped_Organization_Bool_Exp | null | undefined;
  _or?: Array<Moped_Organization_Bool_Exp> | null | undefined;
  organization_abbreviation?: String_Comparison_Exp | null | undefined;
  organization_id?: Int_Comparison_Exp | null | undefined;
  organization_name?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_organization" */
export type Moped_Organization_Constraint =
  /** unique or primary key constraint on columns "organization_id" */
  "moped_organization_pkey";

/** input type for inserting data into table "moped_organization" */
export type Moped_Organization_Insert_Input = {
  organization_abbreviation?: string | null | undefined;
  organization_id?: number | null | undefined;
  organization_name?: string | null | undefined;
};

/** on_conflict condition type for table "moped_organization" */
export type Moped_Organization_On_Conflict = {
  constraint: Moped_Organization_Constraint;
  update_columns?: Array<Moped_Organization_Update_Column>;
  where?: Moped_Organization_Bool_Exp | null | undefined;
};

/** select columns of table "moped_organization" */
export type Moped_Organization_Select_Column =
  /** column name */
  | "organization_abbreviation"
  /** column name */
  | "organization_id"
  /** column name */
  | "organization_name";

/** update columns of table "moped_organization" */
export type Moped_Organization_Update_Column =
  /** column name */
  | "organization_abbreviation"
  /** column name */
  | "organization_id"
  /** column name */
  | "organization_name";

/** Boolean expression to filter rows from the table "moped_phases". All fields are combined with a logical 'AND'. */
export type Moped_Phases_Bool_Exp = {
  _and?: Array<Moped_Phases_Bool_Exp> | null | undefined;
  _not?: Moped_Phases_Bool_Exp | null | undefined;
  _or?: Array<Moped_Phases_Bool_Exp> | null | undefined;
  moped_subphases?: Moped_Subphases_Bool_Exp | null | undefined;
  moped_subphases_aggregate?:
    Moped_Subphases_Aggregate_Bool_Exp | null | undefined;
  phase_average_length?: Int_Comparison_Exp | null | undefined;
  phase_description?: String_Comparison_Exp | null | undefined;
  phase_id?: Int_Comparison_Exp | null | undefined;
  phase_key?: String_Comparison_Exp | null | undefined;
  phase_name?: String_Comparison_Exp | null | undefined;
  phase_name_simple?: String_Comparison_Exp | null | undefined;
  phase_order?: Int_Comparison_Exp | null | undefined;
  required_phase?: Boolean_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_phases" */
export type Moped_Phases_Constraint =
  /** unique or primary key constraint on columns "phase_key" */
  | "moped_phases_phase_key_key"
  /** unique or primary key constraint on columns "phase_name" */
  | "moped_phases_phase_name_key"
  /** unique or primary key constraint on columns "phase_id" */
  | "moped_phases_pkey";

/** input type for inserting data into table "moped_phases" */
export type Moped_Phases_Insert_Input = {
  moped_subphases?: Moped_Subphases_Arr_Rel_Insert_Input | null | undefined;
  phase_average_length?: number | null | undefined;
  phase_description?: string | null | undefined;
  phase_id?: number | null | undefined;
  /** Unique machine-readable phase name */
  phase_key?: string | null | undefined;
  phase_name?: string | null | undefined;
  phase_name_simple?: string | null | undefined;
  phase_order?: number | null | undefined;
  required_phase?: boolean | null | undefined;
};

/** input type for inserting object relation for remote table "moped_phases" */
export type Moped_Phases_Obj_Rel_Insert_Input = {
  data: Moped_Phases_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Phases_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_phases" */
export type Moped_Phases_On_Conflict = {
  constraint: Moped_Phases_Constraint;
  update_columns?: Array<Moped_Phases_Update_Column>;
  where?: Moped_Phases_Bool_Exp | null | undefined;
};

/** update columns of table "moped_phases" */
export type Moped_Phases_Update_Column =
  /** column name */
  | "phase_average_length"
  /** column name */
  | "phase_description"
  /** column name */
  | "phase_id"
  /** column name */
  | "phase_key"
  /** column name */
  | "phase_name"
  /** column name */
  | "phase_name_simple"
  /** column name */
  | "phase_order"
  /** column name */
  | "required_phase";

export type Moped_Proj_Component_Tags_Aggregate_Bool_Exp = {
  bool_and?:
    Moped_Proj_Component_Tags_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?:
    Moped_Proj_Component_Tags_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Moped_Proj_Component_Tags_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Proj_Component_Tags_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Proj_Component_Tags_Select_Column_Moped_Proj_Component_Tags_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Component_Tags_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Component_Tags_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Proj_Component_Tags_Select_Column_Moped_Proj_Component_Tags_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Component_Tags_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Component_Tags_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Proj_Component_Tags_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Component_Tags_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_proj_component_tags" */
export type Moped_Proj_Component_Tags_Arr_Rel_Insert_Input = {
  data: Array<Moped_Proj_Component_Tags_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Proj_Component_Tags_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_proj_component_tags". All fields are combined with a logical 'AND'. */
export type Moped_Proj_Component_Tags_Bool_Exp = {
  _and?: Array<Moped_Proj_Component_Tags_Bool_Exp> | null | undefined;
  _not?: Moped_Proj_Component_Tags_Bool_Exp | null | undefined;
  _or?: Array<Moped_Proj_Component_Tags_Bool_Exp> | null | undefined;
  component_tag_id?: Int_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_component_tag?: Moped_Component_Tags_Bool_Exp | null | undefined;
  moped_proj_component?: Moped_Proj_Components_Bool_Exp | null | undefined;
  project_component_id?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_proj_component_tags" */
export type Moped_Proj_Component_Tags_Constraint =
  /** unique or primary key constraint on columns "id" */
  | "moped_proj_component_tags_pkey"
  /** unique or primary key constraint on columns "component_tag_id", "project_component_id" */
  | "unique_component_and_tag";

/** input type for inserting data into table "moped_proj_component_tags" */
export type Moped_Proj_Component_Tags_Insert_Input = {
  component_tag_id?: number | null | undefined;
  /** Timestamp when the record was created */
  created_at?: unknown;
  /** ID of the user who created the record */
  created_by_user_id?: number | null | undefined;
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  moped_component_tag?:
    Moped_Component_Tags_Obj_Rel_Insert_Input | null | undefined;
  moped_proj_component?:
    Moped_Proj_Components_Obj_Rel_Insert_Input | null | undefined;
  project_component_id?: number | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
};

/** on_conflict condition type for table "moped_proj_component_tags" */
export type Moped_Proj_Component_Tags_On_Conflict = {
  constraint: Moped_Proj_Component_Tags_Constraint;
  update_columns?: Array<Moped_Proj_Component_Tags_Update_Column>;
  where?: Moped_Proj_Component_Tags_Bool_Exp | null | undefined;
};

/** select columns of table "moped_proj_component_tags" */
export type Moped_Proj_Component_Tags_Select_Column =
  /** column name */
  | "component_tag_id"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_component_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "moped_proj_component_tags_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_proj_component_tags" */
export type Moped_Proj_Component_Tags_Select_Column_Moped_Proj_Component_Tags_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "moped_proj_component_tags_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_proj_component_tags" */
export type Moped_Proj_Component_Tags_Select_Column_Moped_Proj_Component_Tags_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** update columns of table "moped_proj_component_tags" */
export type Moped_Proj_Component_Tags_Update_Column =
  /** column name */
  | "component_tag_id"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_component_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

export type Moped_Proj_Component_Work_Types_Aggregate_Bool_Exp = {
  bool_and?:
    | Moped_Proj_Component_Work_Types_Aggregate_Bool_Exp_Bool_And
    | null
    | undefined;
  bool_or?:
    | Moped_Proj_Component_Work_Types_Aggregate_Bool_Exp_Bool_Or
    | null
    | undefined;
  count?:
    Moped_Proj_Component_Work_Types_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Proj_Component_Work_Types_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Proj_Component_Work_Types_Select_Column_Moped_Proj_Component_Work_Types_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Component_Work_Types_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Component_Work_Types_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Proj_Component_Work_Types_Select_Column_Moped_Proj_Component_Work_Types_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Component_Work_Types_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Component_Work_Types_Aggregate_Bool_Exp_Count = {
  arguments?:
    Array<Moped_Proj_Component_Work_Types_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Component_Work_Types_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_proj_component_work_types" */
export type Moped_Proj_Component_Work_Types_Arr_Rel_Insert_Input = {
  data: Array<Moped_Proj_Component_Work_Types_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Proj_Component_Work_Types_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_proj_component_work_types". All fields are combined with a logical 'AND'. */
export type Moped_Proj_Component_Work_Types_Bool_Exp = {
  _and?: Array<Moped_Proj_Component_Work_Types_Bool_Exp> | null | undefined;
  _not?: Moped_Proj_Component_Work_Types_Bool_Exp | null | undefined;
  _or?: Array<Moped_Proj_Component_Work_Types_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_proj_component?: Moped_Proj_Components_Bool_Exp | null | undefined;
  moped_work_type?: Moped_Work_Types_Bool_Exp | null | undefined;
  project_component_id?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
  work_type_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_proj_component_work_types" */
export type Moped_Proj_Component_Work_Types_Constraint =
  /** unique or primary key constraint on columns "id" */
  | "moped_proj_component_work_types_pkey"
  /** unique or primary key constraint on columns "work_type_id", "project_component_id" */
  | "moped_proj_component_work_types_project_component_id_work_type_";

/** input type for inserting data into table "moped_proj_component_work_types" */
export type Moped_Proj_Component_Work_Types_Insert_Input = {
  /** Timestamp when the record was created */
  created_at?: unknown;
  /** ID of the user who created the record */
  created_by_user_id?: number | null | undefined;
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  moped_proj_component?:
    Moped_Proj_Components_Obj_Rel_Insert_Input | null | undefined;
  moped_work_type?: Moped_Work_Types_Obj_Rel_Insert_Input | null | undefined;
  project_component_id?: number | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
  work_type_id?: number | null | undefined;
};

/** on_conflict condition type for table "moped_proj_component_work_types" */
export type Moped_Proj_Component_Work_Types_On_Conflict = {
  constraint: Moped_Proj_Component_Work_Types_Constraint;
  update_columns?: Array<Moped_Proj_Component_Work_Types_Update_Column>;
  where?: Moped_Proj_Component_Work_Types_Bool_Exp | null | undefined;
};

/** select columns of table "moped_proj_component_work_types" */
export type Moped_Proj_Component_Work_Types_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_component_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id"
  /** column name */
  | "work_type_id";

/** select "moped_proj_component_work_types_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_proj_component_work_types" */
export type Moped_Proj_Component_Work_Types_Select_Column_Moped_Proj_Component_Work_Types_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "moped_proj_component_work_types_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_proj_component_work_types" */
export type Moped_Proj_Component_Work_Types_Select_Column_Moped_Proj_Component_Work_Types_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** update columns of table "moped_proj_component_work_types" */
export type Moped_Proj_Component_Work_Types_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_component_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id"
  /** column name */
  | "work_type_id";

export type Moped_Proj_Components_Aggregate_Bool_Exp = {
  bool_and?:
    Moped_Proj_Components_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Moped_Proj_Components_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Moped_Proj_Components_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Proj_Components_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Proj_Components_Select_Column_Moped_Proj_Components_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Components_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Components_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Proj_Components_Select_Column_Moped_Proj_Components_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Components_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Components_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Proj_Components_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Components_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_proj_components" */
export type Moped_Proj_Components_Arr_Rel_Insert_Input = {
  data: Array<Moped_Proj_Components_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Proj_Components_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_proj_components". All fields are combined with a logical 'AND'. */
export type Moped_Proj_Components_Bool_Exp = {
  _and?: Array<Moped_Proj_Components_Bool_Exp> | null | undefined;
  _not?: Moped_Proj_Components_Bool_Exp | null | undefined;
  _or?: Array<Moped_Proj_Components_Bool_Exp> | null | undefined;
  completion_date?: Timestamptz_Comparison_Exp | null | undefined;
  component_id?: Int_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  feature_drawn_lines?: Feature_Drawn_Lines_Bool_Exp | null | undefined;
  feature_drawn_lines_aggregate?:
    Feature_Drawn_Lines_Aggregate_Bool_Exp | null | undefined;
  feature_drawn_points?: Feature_Drawn_Points_Bool_Exp | null | undefined;
  feature_drawn_points_aggregate?:
    Feature_Drawn_Points_Aggregate_Bool_Exp | null | undefined;
  feature_intersections?: Feature_Intersections_Bool_Exp | null | undefined;
  feature_intersections_aggregate?:
    Feature_Intersections_Aggregate_Bool_Exp | null | undefined;
  feature_school_beacons?: Feature_School_Beacons_Bool_Exp | null | undefined;
  feature_school_beacons_aggregate?:
    Feature_School_Beacons_Aggregate_Bool_Exp | null | undefined;
  feature_signals?: Feature_Signals_Bool_Exp | null | undefined;
  feature_signals_aggregate?:
    Feature_Signals_Aggregate_Bool_Exp | null | undefined;
  feature_street_segments?: Feature_Street_Segments_Bool_Exp | null | undefined;
  feature_street_segments_aggregate?:
    Feature_Street_Segments_Aggregate_Bool_Exp | null | undefined;
  interim_project_component_id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  location_description?: String_Comparison_Exp | null | undefined;
  moped_components?: Moped_Components_Bool_Exp | null | undefined;
  moped_phase?: Moped_Phases_Bool_Exp | null | undefined;
  moped_proj_component_tags?:
    Moped_Proj_Component_Tags_Bool_Exp | null | undefined;
  moped_proj_component_tags_aggregate?:
    Moped_Proj_Component_Tags_Aggregate_Bool_Exp | null | undefined;
  moped_proj_component_work_types?:
    Moped_Proj_Component_Work_Types_Bool_Exp | null | undefined;
  moped_proj_component_work_types_aggregate?:
    Moped_Proj_Component_Work_Types_Aggregate_Bool_Exp | null | undefined;
  moped_proj_components_subcomponents?:
    Moped_Proj_Components_Subcomponents_Bool_Exp | null | undefined;
  moped_proj_components_subcomponents_aggregate?:
    Moped_Proj_Components_Subcomponents_Aggregate_Bool_Exp | null | undefined;
  moped_project?: Moped_Project_Bool_Exp | null | undefined;
  moped_subphase?: Moped_Subphases_Bool_Exp | null | undefined;
  phase_id?: Int_Comparison_Exp | null | undefined;
  project_component_id?: Int_Comparison_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  srts_id?: String_Comparison_Exp | null | undefined;
  subphase_id?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_proj_components" */
export type Moped_Proj_Components_Constraint =
  /** unique or primary key constraint on columns "project_component_id" */
  "moped_proj_components_pkey";

/** input type for inserting data into table "moped_proj_components" */
export type Moped_Proj_Components_Insert_Input = {
  completion_date?: unknown;
  component_id?: number | null | undefined;
  created_at?: unknown;
  created_by_user_id?: number | null | undefined;
  description?: string | null | undefined;
  feature_drawn_lines?:
    Feature_Drawn_Lines_Arr_Rel_Insert_Input | null | undefined;
  feature_drawn_points?:
    Feature_Drawn_Points_Arr_Rel_Insert_Input | null | undefined;
  feature_intersections?:
    Feature_Intersections_Arr_Rel_Insert_Input | null | undefined;
  feature_school_beacons?:
    Feature_School_Beacons_Arr_Rel_Insert_Input | null | undefined;
  feature_signals?: Feature_Signals_Arr_Rel_Insert_Input | null | undefined;
  feature_street_segments?:
    Feature_Street_Segments_Arr_Rel_Insert_Input | null | undefined;
  interim_project_component_id?: number | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  location_description?: string | null | undefined;
  moped_components?: Moped_Components_Obj_Rel_Insert_Input | null | undefined;
  moped_phase?: Moped_Phases_Obj_Rel_Insert_Input | null | undefined;
  moped_proj_component_tags?:
    Moped_Proj_Component_Tags_Arr_Rel_Insert_Input | null | undefined;
  moped_proj_component_work_types?:
    Moped_Proj_Component_Work_Types_Arr_Rel_Insert_Input | null | undefined;
  moped_proj_components_subcomponents?:
    Moped_Proj_Components_Subcomponents_Arr_Rel_Insert_Input | null | undefined;
  moped_project?: Moped_Project_Obj_Rel_Insert_Input | null | undefined;
  moped_subphase?: Moped_Subphases_Obj_Rel_Insert_Input | null | undefined;
  phase_id?: number | null | undefined;
  project_component_id?: number | null | undefined;
  project_id?: number | null | undefined;
  /** The Safe Routes to School infrastructure plan record identifier */
  srts_id?: string | null | undefined;
  subphase_id?: number | null | undefined;
  updated_at?: unknown;
  updated_by_user_id?: number | null | undefined;
};

/** input type for inserting object relation for remote table "moped_proj_components" */
export type Moped_Proj_Components_Obj_Rel_Insert_Input = {
  data: Moped_Proj_Components_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Proj_Components_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_proj_components" */
export type Moped_Proj_Components_On_Conflict = {
  constraint: Moped_Proj_Components_Constraint;
  update_columns?: Array<Moped_Proj_Components_Update_Column>;
  where?: Moped_Proj_Components_Bool_Exp | null | undefined;
};

/** select columns of table "moped_proj_components" */
export type Moped_Proj_Components_Select_Column =
  /** column name */
  | "completion_date"
  /** column name */
  | "component_id"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "description"
  /** column name */
  | "interim_project_component_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "location_description"
  /** column name */
  | "phase_id"
  /** column name */
  | "project_component_id"
  /** column name */
  | "project_id"
  /** column name */
  | "srts_id"
  /** column name */
  | "subphase_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "moped_proj_components_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_proj_components" */
export type Moped_Proj_Components_Select_Column_Moped_Proj_Components_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "moped_proj_components_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_proj_components" */
export type Moped_Proj_Components_Select_Column_Moped_Proj_Components_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

export type Moped_Proj_Components_Subcomponents_Aggregate_Bool_Exp = {
  bool_and?:
    | Moped_Proj_Components_Subcomponents_Aggregate_Bool_Exp_Bool_And
    | null
    | undefined;
  bool_or?:
    | Moped_Proj_Components_Subcomponents_Aggregate_Bool_Exp_Bool_Or
    | null
    | undefined;
  count?:
    | Moped_Proj_Components_Subcomponents_Aggregate_Bool_Exp_Count
    | null
    | undefined;
};

export type Moped_Proj_Components_Subcomponents_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Proj_Components_Subcomponents_Select_Column_Moped_Proj_Components_Subcomponents_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Components_Subcomponents_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Components_Subcomponents_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Proj_Components_Subcomponents_Select_Column_Moped_Proj_Components_Subcomponents_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Components_Subcomponents_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Components_Subcomponents_Aggregate_Bool_Exp_Count = {
  arguments?:
    Array<Moped_Proj_Components_Subcomponents_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Components_Subcomponents_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_proj_components_subcomponents" */
export type Moped_Proj_Components_Subcomponents_Arr_Rel_Insert_Input = {
  data: Array<Moped_Proj_Components_Subcomponents_Insert_Input>;
  /** upsert condition */
  on_conflict?:
    Moped_Proj_Components_Subcomponents_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_proj_components_subcomponents". All fields are combined with a logical 'AND'. */
export type Moped_Proj_Components_Subcomponents_Bool_Exp = {
  _and?: Array<Moped_Proj_Components_Subcomponents_Bool_Exp> | null | undefined;
  _not?: Moped_Proj_Components_Subcomponents_Bool_Exp | null | undefined;
  _or?: Array<Moped_Proj_Components_Subcomponents_Bool_Exp> | null | undefined;
  component_subcomponent_id?: Int_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_subcomponent?: Moped_Subcomponents_Bool_Exp | null | undefined;
  project_component_id?: Int_Comparison_Exp | null | undefined;
  subcomponent_id?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_proj_components_subcomponents" */
export type Moped_Proj_Components_Subcomponents_Constraint =
  /** unique or primary key constraint on columns "component_subcomponent_id" */
  | "moped_proj_components_subcomponents_pkey"
  /** unique or primary key constraint on columns "subcomponent_id", "project_component_id" */
  | "unique_component_and_subcomponent";

/** input type for inserting data into table "moped_proj_components_subcomponents" */
export type Moped_Proj_Components_Subcomponents_Insert_Input = {
  component_subcomponent_id?: number | null | undefined;
  /** Timestamp when the record was created */
  created_at?: unknown;
  /** ID of the user who created the record */
  created_by_user_id?: number | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  moped_subcomponent?:
    Moped_Subcomponents_Obj_Rel_Insert_Input | null | undefined;
  project_component_id?: number | null | undefined;
  subcomponent_id?: number | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
};

/** on_conflict condition type for table "moped_proj_components_subcomponents" */
export type Moped_Proj_Components_Subcomponents_On_Conflict = {
  constraint: Moped_Proj_Components_Subcomponents_Constraint;
  update_columns?: Array<Moped_Proj_Components_Subcomponents_Update_Column>;
  where?: Moped_Proj_Components_Subcomponents_Bool_Exp | null | undefined;
};

/** select columns of table "moped_proj_components_subcomponents" */
export type Moped_Proj_Components_Subcomponents_Select_Column =
  /** column name */
  | "component_subcomponent_id"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_component_id"
  /** column name */
  | "subcomponent_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "moped_proj_components_subcomponents_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_proj_components_subcomponents" */
export type Moped_Proj_Components_Subcomponents_Select_Column_Moped_Proj_Components_Subcomponents_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "moped_proj_components_subcomponents_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_proj_components_subcomponents" */
export type Moped_Proj_Components_Subcomponents_Select_Column_Moped_Proj_Components_Subcomponents_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** update columns of table "moped_proj_components_subcomponents" */
export type Moped_Proj_Components_Subcomponents_Update_Column =
  /** column name */
  | "component_subcomponent_id"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_component_id"
  /** column name */
  | "subcomponent_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** update columns of table "moped_proj_components" */
export type Moped_Proj_Components_Update_Column =
  /** column name */
  | "completion_date"
  /** column name */
  | "component_id"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "description"
  /** column name */
  | "interim_project_component_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "location_description"
  /** column name */
  | "phase_id"
  /** column name */
  | "project_component_id"
  /** column name */
  | "project_id"
  /** column name */
  | "srts_id"
  /** column name */
  | "subphase_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

export type Moped_Proj_Funding_Aggregate_Bool_Exp = {
  bool_and?: Moped_Proj_Funding_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Moped_Proj_Funding_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Moped_Proj_Funding_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Proj_Funding_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Proj_Funding_Select_Column_Moped_Proj_Funding_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Funding_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Funding_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Proj_Funding_Select_Column_Moped_Proj_Funding_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Funding_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Funding_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Proj_Funding_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Funding_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_proj_funding" */
export type Moped_Proj_Funding_Arr_Rel_Insert_Input = {
  data: Array<Moped_Proj_Funding_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Proj_Funding_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_proj_funding". All fields are combined with a logical 'AND'. */
export type Moped_Proj_Funding_Bool_Exp = {
  _and?: Array<Moped_Proj_Funding_Bool_Exp> | null | undefined;
  _not?: Moped_Proj_Funding_Bool_Exp | null | undefined;
  _or?: Array<Moped_Proj_Funding_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  dept_unit?: Jsonb_Comparison_Exp | null | undefined;
  ecapris_funding_id?: Int_Comparison_Exp | null | undefined;
  ecapris_subproject_id?: String_Comparison_Exp | null | undefined;
  fdu?: String_Comparison_Exp | null | undefined;
  files_project_fundings?: Files_Project_Funding_Bool_Exp | null | undefined;
  files_project_fundings_aggregate?:
    Files_Project_Funding_Aggregate_Bool_Exp | null | undefined;
  fund?: Jsonb_Comparison_Exp | null | undefined;
  funding_amount?: Int_Comparison_Exp | null | undefined;
  funding_description?: String_Comparison_Exp | null | undefined;
  funding_program_id?: Int_Comparison_Exp | null | undefined;
  funding_source_id?: Int_Comparison_Exp | null | undefined;
  funding_status_id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  is_legacy_funding_record?: Boolean_Comparison_Exp | null | undefined;
  is_manual?: Boolean_Comparison_Exp | null | undefined;
  moped_fund_program?: Moped_Fund_Programs_Bool_Exp | null | undefined;
  moped_fund_source?: Moped_Fund_Sources_Bool_Exp | null | undefined;
  proj_funding_id?: Int_Comparison_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  should_use_ecapris_amount?: Boolean_Comparison_Exp | null | undefined;
  unit_long_name?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_proj_funding" */
export type Moped_Proj_Funding_Constraint =
  /** unique or primary key constraint on columns "proj_funding_id" */
  "moped_proj_fund_source_pkey";

/** input type for inserting data into table "moped_proj_funding" */
export type Moped_Proj_Funding_Insert_Input = {
  /** Timestamp when the record was last created */
  created_at?: unknown;
  /** ID of the user who last created the record */
  created_by_user_id?: number | null | undefined;
  /** Legacy JSONB object containing additional department/unit details from eCAPRIS (Socrata bgrt-2m2z) */
  dept_unit?: unknown;
  /** References the eCAPRIS FDU unique fao_id of imported eCAPRIS funding records */
  ecapris_funding_id?: number | null | undefined;
  /** eCapris subproject ID number associated with imported or synced eCAPRIS FDU */
  ecapris_subproject_id?: string | null | undefined;
  /** The FDU (Fund-Dept-Unit) code associated with this funding record from eCAPRIS */
  fdu?: string | null | undefined;
  files_project_fundings?:
    Files_Project_Funding_Arr_Rel_Insert_Input | null | undefined;
  /** Legacy JSONB object containing additional fund details from eCAPRIS (Socrata jega-nqf6) */
  fund?: unknown;
  /** The amount of funding allocated from this funding source */
  funding_amount?: number | null | undefined;
  /** A description of the funding source */
  funding_description?: string | null | undefined;
  /** References the funding program for this funding record */
  funding_program_id?: number | null | undefined;
  /** References the funding source for this funding record */
  funding_source_id?: number | null | undefined;
  /** References the current status of this funding record */
  funding_status_id?: number | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  /** Indicates if the funding record was created before eCAPRIS sync integration (Jan 2026) */
  is_legacy_funding_record?: boolean | null | undefined;
  moped_fund_program?:
    Moped_Fund_Programs_Obj_Rel_Insert_Input | null | undefined;
  moped_fund_source?:
    Moped_Fund_Sources_Obj_Rel_Insert_Input | null | undefined;
  /** Primary key for the project funding record */
  proj_funding_id?: number | null | undefined;
  /** References the project this funding record is associated with */
  project_id?: number | null | undefined;
  /** Indicates whether the funding record should use values from eCapris in combined view */
  should_use_ecapris_amount?: boolean | null | undefined;
  /** The long name of the unit associated with this funding record from eCAPRIS */
  unit_long_name?: string | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
};

/** on_conflict condition type for table "moped_proj_funding" */
export type Moped_Proj_Funding_On_Conflict = {
  constraint: Moped_Proj_Funding_Constraint;
  update_columns?: Array<Moped_Proj_Funding_Update_Column>;
  where?: Moped_Proj_Funding_Bool_Exp | null | undefined;
};

/** select columns of table "moped_proj_funding" */
export type Moped_Proj_Funding_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "dept_unit"
  /** column name */
  | "ecapris_funding_id"
  /** column name */
  | "ecapris_subproject_id"
  /** column name */
  | "fdu"
  /** column name */
  | "fund"
  /** column name */
  | "funding_amount"
  /** column name */
  | "funding_description"
  /** column name */
  | "funding_program_id"
  /** column name */
  | "funding_source_id"
  /** column name */
  | "funding_status_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "is_legacy_funding_record"
  /** column name */
  | "is_manual"
  /** column name */
  | "proj_funding_id"
  /** column name */
  | "project_id"
  /** column name */
  | "should_use_ecapris_amount"
  /** column name */
  | "unit_long_name"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "moped_proj_funding_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_proj_funding" */
export type Moped_Proj_Funding_Select_Column_Moped_Proj_Funding_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  | "is_deleted"
  /** column name */
  | "is_legacy_funding_record"
  /** column name */
  | "is_manual"
  /** column name */
  | "should_use_ecapris_amount";

/** select "moped_proj_funding_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_proj_funding" */
export type Moped_Proj_Funding_Select_Column_Moped_Proj_Funding_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  | "is_deleted"
  /** column name */
  | "is_legacy_funding_record"
  /** column name */
  | "is_manual"
  /** column name */
  | "should_use_ecapris_amount";

/** update columns of table "moped_proj_funding" */
export type Moped_Proj_Funding_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "dept_unit"
  /** column name */
  | "ecapris_funding_id"
  /** column name */
  | "ecapris_subproject_id"
  /** column name */
  | "fdu"
  /** column name */
  | "fund"
  /** column name */
  | "funding_amount"
  /** column name */
  | "funding_description"
  /** column name */
  | "funding_program_id"
  /** column name */
  | "funding_source_id"
  /** column name */
  | "funding_status_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "is_legacy_funding_record"
  /** column name */
  | "proj_funding_id"
  /** column name */
  | "project_id"
  /** column name */
  | "should_use_ecapris_amount"
  /** column name */
  | "unit_long_name"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

export type Moped_Proj_Milestones_Aggregate_Bool_Exp = {
  bool_and?:
    Moped_Proj_Milestones_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Moped_Proj_Milestones_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Moped_Proj_Milestones_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Proj_Milestones_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Proj_Milestones_Select_Column_Moped_Proj_Milestones_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Milestones_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Milestones_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Proj_Milestones_Select_Column_Moped_Proj_Milestones_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Milestones_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Milestones_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Proj_Milestones_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Milestones_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_proj_milestones" */
export type Moped_Proj_Milestones_Arr_Rel_Insert_Input = {
  data: Array<Moped_Proj_Milestones_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Proj_Milestones_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_proj_milestones". All fields are combined with a logical 'AND'. */
export type Moped_Proj_Milestones_Bool_Exp = {
  _and?: Array<Moped_Proj_Milestones_Bool_Exp> | null | undefined;
  _not?: Moped_Proj_Milestones_Bool_Exp | null | undefined;
  _or?: Array<Moped_Proj_Milestones_Bool_Exp> | null | undefined;
  completed?: Boolean_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  date_actual?: Date_Comparison_Exp | null | undefined;
  date_estimate?: Date_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  milestone_id?: Int_Comparison_Exp | null | undefined;
  milestone_order?: Int_Comparison_Exp | null | undefined;
  moped_milestone?: Moped_Milestones_Bool_Exp | null | undefined;
  moped_project?: Moped_Project_Bool_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  project_milestone_id?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_proj_milestones" */
export type Moped_Proj_Milestones_Constraint =
  /** unique or primary key constraint on columns "project_milestone_id" */
  "moped_project_milestone_id_pkey";

/** input type for inserting data into table "moped_proj_milestones" */
export type Moped_Proj_Milestones_Insert_Input = {
  completed?: boolean | null | undefined;
  created_at?: unknown;
  created_by_user_id?: number | null | undefined;
  date_actual?: unknown;
  date_estimate?: unknown;
  description?: string | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  milestone_id?: number | null | undefined;
  milestone_order?: number | null | undefined;
  moped_milestone?: Moped_Milestones_Obj_Rel_Insert_Input | null | undefined;
  moped_project?: Moped_Project_Obj_Rel_Insert_Input | null | undefined;
  project_id?: number | null | undefined;
  project_milestone_id?: number | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
};

/** on_conflict condition type for table "moped_proj_milestones" */
export type Moped_Proj_Milestones_On_Conflict = {
  constraint: Moped_Proj_Milestones_Constraint;
  update_columns?: Array<Moped_Proj_Milestones_Update_Column>;
  where?: Moped_Proj_Milestones_Bool_Exp | null | undefined;
};

/** select columns of table "moped_proj_milestones" */
export type Moped_Proj_Milestones_Select_Column =
  /** column name */
  | "completed"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "date_actual"
  /** column name */
  | "date_estimate"
  /** column name */
  | "description"
  /** column name */
  | "is_deleted"
  /** column name */
  | "milestone_id"
  /** column name */
  | "milestone_order"
  /** column name */
  | "project_id"
  /** column name */
  | "project_milestone_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "moped_proj_milestones_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_proj_milestones" */
export type Moped_Proj_Milestones_Select_Column_Moped_Proj_Milestones_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  | "completed"
  /** column name */
  | "is_deleted";

/** select "moped_proj_milestones_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_proj_milestones" */
export type Moped_Proj_Milestones_Select_Column_Moped_Proj_Milestones_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  | "completed"
  /** column name */
  | "is_deleted";

/** update columns of table "moped_proj_milestones" */
export type Moped_Proj_Milestones_Update_Column =
  /** column name */
  | "completed"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "date_actual"
  /** column name */
  | "date_estimate"
  /** column name */
  | "description"
  /** column name */
  | "is_deleted"
  /** column name */
  | "milestone_id"
  /** column name */
  | "milestone_order"
  /** column name */
  | "project_id"
  /** column name */
  | "project_milestone_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

export type Moped_Proj_Notes_Aggregate_Bool_Exp = {
  bool_and?: Moped_Proj_Notes_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Moped_Proj_Notes_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Moped_Proj_Notes_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Proj_Notes_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Proj_Notes_Select_Column_Moped_Proj_Notes_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Notes_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Notes_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Proj_Notes_Select_Column_Moped_Proj_Notes_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Notes_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Notes_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Proj_Notes_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Notes_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_proj_notes" */
export type Moped_Proj_Notes_Arr_Rel_Insert_Input = {
  data: Array<Moped_Proj_Notes_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Proj_Notes_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_proj_notes". All fields are combined with a logical 'AND'. */
export type Moped_Proj_Notes_Bool_Exp = {
  _and?: Array<Moped_Proj_Notes_Bool_Exp> | null | undefined;
  _not?: Moped_Proj_Notes_Bool_Exp | null | undefined;
  _or?: Array<Moped_Proj_Notes_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_note_type?: Moped_Note_Types_Bool_Exp | null | undefined;
  moped_phase?: Moped_Phases_Bool_Exp | null | undefined;
  moped_project?: Moped_Project_Bool_Exp | null | undefined;
  moped_user?: Moped_Users_Bool_Exp | null | undefined;
  phase_id?: Int_Comparison_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  project_note?: String_Comparison_Exp | null | undefined;
  project_note_id?: Int_Comparison_Exp | null | undefined;
  project_note_type?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_proj_notes" */
export type Moped_Proj_Notes_Constraint =
  /** unique or primary key constraint on columns "project_note_id" */
  | "moped_proj_notes_pkey"
  /** unique or primary key constraint on columns "project_note_id" */
  | "moped_proj_notes_project_note_id_key";

/** input type for inserting data into table "moped_proj_notes" */
export type Moped_Proj_Notes_Insert_Input = {
  created_at?: unknown;
  created_by_user_id?: number | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  moped_note_type?: Moped_Note_Types_Obj_Rel_Insert_Input | null | undefined;
  moped_phase?: Moped_Phases_Obj_Rel_Insert_Input | null | undefined;
  moped_project?: Moped_Project_Obj_Rel_Insert_Input | null | undefined;
  moped_user?: Moped_Users_Obj_Rel_Insert_Input | null | undefined;
  phase_id?: number | null | undefined;
  project_id?: number | null | undefined;
  project_note?: string | null | undefined;
  project_note_id?: number | null | undefined;
  project_note_type?: number | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
};

/** on_conflict condition type for table "moped_proj_notes" */
export type Moped_Proj_Notes_On_Conflict = {
  constraint: Moped_Proj_Notes_Constraint;
  update_columns?: Array<Moped_Proj_Notes_Update_Column>;
  where?: Moped_Proj_Notes_Bool_Exp | null | undefined;
};

/** select columns of table "moped_proj_notes" */
export type Moped_Proj_Notes_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "phase_id"
  /** column name */
  | "project_id"
  /** column name */
  | "project_note"
  /** column name */
  | "project_note_id"
  /** column name */
  | "project_note_type"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "moped_proj_notes_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_proj_notes" */
export type Moped_Proj_Notes_Select_Column_Moped_Proj_Notes_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "moped_proj_notes_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_proj_notes" */
export type Moped_Proj_Notes_Select_Column_Moped_Proj_Notes_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** update columns of table "moped_proj_notes" */
export type Moped_Proj_Notes_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "phase_id"
  /** column name */
  | "project_id"
  /** column name */
  | "project_note"
  /** column name */
  | "project_note_id"
  /** column name */
  | "project_note_type"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

export type Moped_Proj_Partners_Aggregate_Bool_Exp = {
  bool_and?: Moped_Proj_Partners_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Moped_Proj_Partners_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Moped_Proj_Partners_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Proj_Partners_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Proj_Partners_Select_Column_Moped_Proj_Partners_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Partners_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Partners_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Proj_Partners_Select_Column_Moped_Proj_Partners_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Partners_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Partners_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Proj_Partners_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Partners_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_proj_partners" */
export type Moped_Proj_Partners_Arr_Rel_Insert_Input = {
  data: Array<Moped_Proj_Partners_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Proj_Partners_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_proj_partners". All fields are combined with a logical 'AND'. */
export type Moped_Proj_Partners_Bool_Exp = {
  _and?: Array<Moped_Proj_Partners_Bool_Exp> | null | undefined;
  _not?: Moped_Proj_Partners_Bool_Exp | null | undefined;
  _or?: Array<Moped_Proj_Partners_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  entity_id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_entity?: Moped_Entity_Bool_Exp | null | undefined;
  proj_partner_id?: Int_Comparison_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_proj_partners" */
export type Moped_Proj_Partners_Constraint =
  /** unique or primary key constraint on columns "proj_partner_id" */
  | "moped_proj_partners_pkey"
  /** unique or primary key constraint on columns "proj_partner_id" */
  | "moped_proj_partners_proj_partner_id_key";

/** input type for inserting data into table "moped_proj_partners" */
export type Moped_Proj_Partners_Insert_Input = {
  /** Timestamp when the record was created */
  created_at?: unknown;
  /** ID of the user who created the record */
  created_by_user_id?: number | null | undefined;
  entity_id?: number | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  moped_entity?: Moped_Entity_Obj_Rel_Insert_Input | null | undefined;
  proj_partner_id?: number | null | undefined;
  project_id?: number | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
};

/** on_conflict condition type for table "moped_proj_partners" */
export type Moped_Proj_Partners_On_Conflict = {
  constraint: Moped_Proj_Partners_Constraint;
  update_columns?: Array<Moped_Proj_Partners_Update_Column>;
  where?: Moped_Proj_Partners_Bool_Exp | null | undefined;
};

/** select columns of table "moped_proj_partners" */
export type Moped_Proj_Partners_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "entity_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "proj_partner_id"
  /** column name */
  | "project_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "moped_proj_partners_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_proj_partners" */
export type Moped_Proj_Partners_Select_Column_Moped_Proj_Partners_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "moped_proj_partners_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_proj_partners" */
export type Moped_Proj_Partners_Select_Column_Moped_Proj_Partners_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** update columns of table "moped_proj_partners" */
export type Moped_Proj_Partners_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "entity_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "proj_partner_id"
  /** column name */
  | "project_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

export type Moped_Proj_Personnel_Aggregate_Bool_Exp = {
  bool_and?:
    Moped_Proj_Personnel_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Moped_Proj_Personnel_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Moped_Proj_Personnel_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Proj_Personnel_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Proj_Personnel_Select_Column_Moped_Proj_Personnel_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Personnel_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Personnel_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Proj_Personnel_Select_Column_Moped_Proj_Personnel_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Personnel_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Personnel_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Proj_Personnel_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Personnel_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_proj_personnel" */
export type Moped_Proj_Personnel_Arr_Rel_Insert_Input = {
  data: Array<Moped_Proj_Personnel_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Proj_Personnel_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_proj_personnel". All fields are combined with a logical 'AND'. */
export type Moped_Proj_Personnel_Bool_Exp = {
  _and?: Array<Moped_Proj_Personnel_Bool_Exp> | null | undefined;
  _not?: Moped_Proj_Personnel_Bool_Exp | null | undefined;
  _or?: Array<Moped_Proj_Personnel_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_proj_personnel_roles?:
    Moped_Proj_Personnel_Roles_Bool_Exp | null | undefined;
  moped_proj_personnel_roles_aggregate?:
    Moped_Proj_Personnel_Roles_Aggregate_Bool_Exp | null | undefined;
  moped_user?: Moped_Users_Bool_Exp | null | undefined;
  notes?: String_Comparison_Exp | null | undefined;
  project?: Moped_Project_Bool_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  project_personnel_id?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
  user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_proj_personnel" */
export type Moped_Proj_Personnel_Constraint =
  /** unique or primary key constraint on columns "project_personnel_id" */
  | "moped_proj_personnel_pkey"
  /** unique or primary key constraint on columns "user_id", "project_id" */
  | "moped_proj_personnel_project_id_user_id_key"
  /** unique or primary key constraint on columns "project_personnel_id" */
  | "moped_proj_personnel_project_personnel_id_key";

/** input type for inserting data into table "moped_proj_personnel" */
export type Moped_Proj_Personnel_Insert_Input = {
  /** Timestamp when the record was created */
  created_at?: unknown;
  /** ID of the user who created the record */
  created_by_user_id?: number | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  moped_proj_personnel_roles?:
    Moped_Proj_Personnel_Roles_Arr_Rel_Insert_Input | null | undefined;
  moped_user?: Moped_Users_Obj_Rel_Insert_Input | null | undefined;
  notes?: string | null | undefined;
  project?: Moped_Project_Obj_Rel_Insert_Input | null | undefined;
  project_id?: number | null | undefined;
  project_personnel_id?: number | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
  user_id?: number | null | undefined;
};

/** input type for inserting object relation for remote table "moped_proj_personnel" */
export type Moped_Proj_Personnel_Obj_Rel_Insert_Input = {
  data: Moped_Proj_Personnel_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Proj_Personnel_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_proj_personnel" */
export type Moped_Proj_Personnel_On_Conflict = {
  constraint: Moped_Proj_Personnel_Constraint;
  update_columns?: Array<Moped_Proj_Personnel_Update_Column>;
  where?: Moped_Proj_Personnel_Bool_Exp | null | undefined;
};

export type Moped_Proj_Personnel_Roles_Aggregate_Bool_Exp = {
  bool_and?:
    Moped_Proj_Personnel_Roles_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?:
    Moped_Proj_Personnel_Roles_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?:
    Moped_Proj_Personnel_Roles_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Proj_Personnel_Roles_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Proj_Personnel_Roles_Select_Column_Moped_Proj_Personnel_Roles_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Personnel_Roles_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Personnel_Roles_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Proj_Personnel_Roles_Select_Column_Moped_Proj_Personnel_Roles_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Personnel_Roles_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Personnel_Roles_Aggregate_Bool_Exp_Count = {
  arguments?:
    Array<Moped_Proj_Personnel_Roles_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Personnel_Roles_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_proj_personnel_roles" */
export type Moped_Proj_Personnel_Roles_Arr_Rel_Insert_Input = {
  data: Array<Moped_Proj_Personnel_Roles_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Proj_Personnel_Roles_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_proj_personnel_roles". All fields are combined with a logical 'AND'. */
export type Moped_Proj_Personnel_Roles_Bool_Exp = {
  _and?: Array<Moped_Proj_Personnel_Roles_Bool_Exp> | null | undefined;
  _not?: Moped_Proj_Personnel_Roles_Bool_Exp | null | undefined;
  _or?: Array<Moped_Proj_Personnel_Roles_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_proj_personnel?: Moped_Proj_Personnel_Bool_Exp | null | undefined;
  moped_project_role?: Moped_Project_Roles_Bool_Exp | null | undefined;
  project_personnel_id?: Int_Comparison_Exp | null | undefined;
  project_role_id?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_proj_personnel_roles" */
export type Moped_Proj_Personnel_Roles_Constraint =
  /** unique or primary key constraint on columns "id" */
  "moped_proj_personnel_roles_pkey";

/** input type for inserting data into table "moped_proj_personnel_roles" */
export type Moped_Proj_Personnel_Roles_Insert_Input = {
  /** Timestamp when the record was created */
  created_at?: unknown;
  /** ID of the user who created the record */
  created_by_user_id?: number | null | undefined;
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  moped_proj_personnel?:
    Moped_Proj_Personnel_Obj_Rel_Insert_Input | null | undefined;
  moped_project_role?:
    Moped_Project_Roles_Obj_Rel_Insert_Input | null | undefined;
  project_personnel_id?: number | null | undefined;
  project_role_id?: number | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
};

/** on_conflict condition type for table "moped_proj_personnel_roles" */
export type Moped_Proj_Personnel_Roles_On_Conflict = {
  constraint: Moped_Proj_Personnel_Roles_Constraint;
  update_columns?: Array<Moped_Proj_Personnel_Roles_Update_Column>;
  where?: Moped_Proj_Personnel_Roles_Bool_Exp | null | undefined;
};

/** select columns of table "moped_proj_personnel_roles" */
export type Moped_Proj_Personnel_Roles_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_personnel_id"
  /** column name */
  | "project_role_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "moped_proj_personnel_roles_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_proj_personnel_roles" */
export type Moped_Proj_Personnel_Roles_Select_Column_Moped_Proj_Personnel_Roles_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "moped_proj_personnel_roles_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_proj_personnel_roles" */
export type Moped_Proj_Personnel_Roles_Select_Column_Moped_Proj_Personnel_Roles_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** update columns of table "moped_proj_personnel_roles" */
export type Moped_Proj_Personnel_Roles_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_personnel_id"
  /** column name */
  | "project_role_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select columns of table "moped_proj_personnel" */
export type Moped_Proj_Personnel_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "notes"
  /** column name */
  | "project_id"
  /** column name */
  | "project_personnel_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id"
  /** column name */
  | "user_id";

/** select "moped_proj_personnel_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_proj_personnel" */
export type Moped_Proj_Personnel_Select_Column_Moped_Proj_Personnel_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "moped_proj_personnel_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_proj_personnel" */
export type Moped_Proj_Personnel_Select_Column_Moped_Proj_Personnel_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** input type for updating data in table "moped_proj_personnel" */
export type Moped_Proj_Personnel_Set_Input = {
  /** Timestamp when the record was created */
  created_at?: unknown;
  /** ID of the user who created the record */
  created_by_user_id?: number | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  notes?: string | null | undefined;
  project_id?: number | null | undefined;
  project_personnel_id?: number | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
  user_id?: number | null | undefined;
};

/** update columns of table "moped_proj_personnel" */
export type Moped_Proj_Personnel_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "notes"
  /** column name */
  | "project_id"
  /** column name */
  | "project_personnel_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id"
  /** column name */
  | "user_id";

export type Moped_Proj_Phases_Aggregate_Bool_Exp = {
  bool_and?: Moped_Proj_Phases_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Moped_Proj_Phases_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Moped_Proj_Phases_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Proj_Phases_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Proj_Phases_Select_Column_Moped_Proj_Phases_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Phases_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Phases_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Proj_Phases_Select_Column_Moped_Proj_Phases_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Phases_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Phases_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Proj_Phases_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Phases_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_proj_phases" */
export type Moped_Proj_Phases_Arr_Rel_Insert_Input = {
  data: Array<Moped_Proj_Phases_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Proj_Phases_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_proj_phases". All fields are combined with a logical 'AND'. */
export type Moped_Proj_Phases_Bool_Exp = {
  _and?: Array<Moped_Proj_Phases_Bool_Exp> | null | undefined;
  _not?: Moped_Proj_Phases_Bool_Exp | null | undefined;
  _or?: Array<Moped_Proj_Phases_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  is_current_phase?: Boolean_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  is_phase_end_confirmed?: Boolean_Comparison_Exp | null | undefined;
  is_phase_start_confirmed?: Boolean_Comparison_Exp | null | undefined;
  moped_phase?: Moped_Phases_Bool_Exp | null | undefined;
  moped_subphase?: Moped_Subphases_Bool_Exp | null | undefined;
  phase_description?: String_Comparison_Exp | null | undefined;
  phase_end?: Timestamptz_Comparison_Exp | null | undefined;
  phase_id?: Int_Comparison_Exp | null | undefined;
  phase_start?: Timestamptz_Comparison_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  project_phase_id?: Int_Comparison_Exp | null | undefined;
  subphase_id?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_proj_phases" */
export type Moped_Proj_Phases_Constraint =
  /** unique or primary key constraint on columns "project_id" */
  | "moped_proj_phases_partial_constraint"
  /** unique or primary key constraint on columns "project_phase_id" */
  | "moped_proj_phases_pkey";

/** input type for inserting data into table "moped_proj_phases" */
export type Moped_Proj_Phases_Insert_Input = {
  created_at?: unknown;
  created_by_user_id?: number | null | undefined;
  is_current_phase?: boolean | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  is_phase_end_confirmed?: boolean | null | undefined;
  is_phase_start_confirmed?: boolean | null | undefined;
  moped_phase?: Moped_Phases_Obj_Rel_Insert_Input | null | undefined;
  moped_subphase?: Moped_Subphases_Obj_Rel_Insert_Input | null | undefined;
  phase_description?: string | null | undefined;
  phase_end?: unknown;
  phase_id?: number | null | undefined;
  phase_start?: unknown;
  project_id?: number | null | undefined;
  project_phase_id?: number | null | undefined;
  subphase_id?: number | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
};

/** input type for inserting object relation for remote table "moped_proj_phases" */
export type Moped_Proj_Phases_Obj_Rel_Insert_Input = {
  data: Moped_Proj_Phases_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Proj_Phases_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_proj_phases" */
export type Moped_Proj_Phases_On_Conflict = {
  constraint: Moped_Proj_Phases_Constraint;
  update_columns?: Array<Moped_Proj_Phases_Update_Column>;
  where?: Moped_Proj_Phases_Bool_Exp | null | undefined;
};

/** select columns of table "moped_proj_phases" */
export type Moped_Proj_Phases_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "is_current_phase"
  /** column name */
  | "is_deleted"
  /** column name */
  | "is_phase_end_confirmed"
  /** column name */
  | "is_phase_start_confirmed"
  /** column name */
  | "phase_description"
  /** column name */
  | "phase_end"
  /** column name */
  | "phase_id"
  /** column name */
  | "phase_start"
  /** column name */
  | "project_id"
  /** column name */
  | "project_phase_id"
  /** column name */
  | "subphase_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "moped_proj_phases_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_proj_phases" */
export type Moped_Proj_Phases_Select_Column_Moped_Proj_Phases_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  | "is_current_phase"
  /** column name */
  | "is_deleted"
  /** column name */
  | "is_phase_end_confirmed"
  /** column name */
  | "is_phase_start_confirmed";

/** select "moped_proj_phases_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_proj_phases" */
export type Moped_Proj_Phases_Select_Column_Moped_Proj_Phases_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  | "is_current_phase"
  /** column name */
  | "is_deleted"
  /** column name */
  | "is_phase_end_confirmed"
  /** column name */
  | "is_phase_start_confirmed";

/** input type for updating data in table "moped_proj_phases" */
export type Moped_Proj_Phases_Set_Input = {
  created_at?: unknown;
  created_by_user_id?: number | null | undefined;
  is_current_phase?: boolean | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  is_phase_end_confirmed?: boolean | null | undefined;
  is_phase_start_confirmed?: boolean | null | undefined;
  phase_description?: string | null | undefined;
  phase_end?: unknown;
  phase_id?: number | null | undefined;
  phase_start?: unknown;
  project_id?: number | null | undefined;
  project_phase_id?: number | null | undefined;
  subphase_id?: number | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
};

/** update columns of table "moped_proj_phases" */
export type Moped_Proj_Phases_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "is_current_phase"
  /** column name */
  | "is_deleted"
  /** column name */
  | "is_phase_end_confirmed"
  /** column name */
  | "is_phase_start_confirmed"
  /** column name */
  | "phase_description"
  /** column name */
  | "phase_end"
  /** column name */
  | "phase_id"
  /** column name */
  | "phase_start"
  /** column name */
  | "project_id"
  /** column name */
  | "project_phase_id"
  /** column name */
  | "subphase_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

export type Moped_Proj_Tags_Aggregate_Bool_Exp = {
  bool_and?: Moped_Proj_Tags_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Moped_Proj_Tags_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Moped_Proj_Tags_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Proj_Tags_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Proj_Tags_Select_Column_Moped_Proj_Tags_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Tags_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Tags_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Proj_Tags_Select_Column_Moped_Proj_Tags_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Tags_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Tags_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Proj_Tags_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Tags_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_proj_tags" */
export type Moped_Proj_Tags_Arr_Rel_Insert_Input = {
  data: Array<Moped_Proj_Tags_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Proj_Tags_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_proj_tags". All fields are combined with a logical 'AND'. */
export type Moped_Proj_Tags_Bool_Exp = {
  _and?: Array<Moped_Proj_Tags_Bool_Exp> | null | undefined;
  _not?: Moped_Proj_Tags_Bool_Exp | null | undefined;
  _or?: Array<Moped_Proj_Tags_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_project?: Moped_Project_Bool_Exp | null | undefined;
  moped_tag?: Moped_Tags_Bool_Exp | null | undefined;
  moped_user_created_by?: Moped_Users_Bool_Exp | null | undefined;
  moped_user_updated_by?: Moped_Users_Bool_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  tag_id?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_proj_tags" */
export type Moped_Proj_Tags_Constraint =
  /** unique or primary key constraint on columns "id" */
  "moped_proj_tags_pkey";

/** input type for inserting data into table "moped_proj_tags" */
export type Moped_Proj_Tags_Insert_Input = {
  /** Timestamp when the record was created */
  created_at?: unknown;
  /** ID of the user who created the record */
  created_by_user_id?: number | null | undefined;
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  moped_project?: Moped_Project_Obj_Rel_Insert_Input | null | undefined;
  moped_tag?: Moped_Tags_Obj_Rel_Insert_Input | null | undefined;
  moped_user_created_by?: Moped_Users_Obj_Rel_Insert_Input | null | undefined;
  moped_user_updated_by?: Moped_Users_Obj_Rel_Insert_Input | null | undefined;
  project_id?: number | null | undefined;
  tag_id?: number | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
};

/** on_conflict condition type for table "moped_proj_tags" */
export type Moped_Proj_Tags_On_Conflict = {
  constraint: Moped_Proj_Tags_Constraint;
  update_columns?: Array<Moped_Proj_Tags_Update_Column>;
  where?: Moped_Proj_Tags_Bool_Exp | null | undefined;
};

/** select columns of table "moped_proj_tags" */
export type Moped_Proj_Tags_Select_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_id"
  /** column name */
  | "tag_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "moped_proj_tags_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_proj_tags" */
export type Moped_Proj_Tags_Select_Column_Moped_Proj_Tags_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "moped_proj_tags_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_proj_tags" */
export type Moped_Proj_Tags_Select_Column_Moped_Proj_Tags_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** update columns of table "moped_proj_tags" */
export type Moped_Proj_Tags_Update_Column =
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_id"
  /** column name */
  | "tag_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

export type Moped_Proj_Work_Activity_Aggregate_Bool_Exp = {
  bool_and?:
    Moped_Proj_Work_Activity_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?:
    Moped_Proj_Work_Activity_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Moped_Proj_Work_Activity_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Proj_Work_Activity_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Proj_Work_Activity_Select_Column_Moped_Proj_Work_Activity_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Work_Activity_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Work_Activity_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Proj_Work_Activity_Select_Column_Moped_Proj_Work_Activity_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Work_Activity_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Proj_Work_Activity_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Proj_Work_Activity_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Proj_Work_Activity_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_proj_work_activity" */
export type Moped_Proj_Work_Activity_Arr_Rel_Insert_Input = {
  data: Array<Moped_Proj_Work_Activity_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Proj_Work_Activity_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_proj_work_activity". All fields are combined with a logical 'AND'. */
export type Moped_Proj_Work_Activity_Bool_Exp = {
  _and?: Array<Moped_Proj_Work_Activity_Bool_Exp> | null | undefined;
  _not?: Moped_Proj_Work_Activity_Bool_Exp | null | undefined;
  _or?: Array<Moped_Proj_Work_Activity_Bool_Exp> | null | undefined;
  contract_amount?: Int_Comparison_Exp | null | undefined;
  contract_number?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user?: Moped_Users_Bool_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  interim_work_activity_id?: String_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_project?: Moped_Project_Bool_Exp | null | undefined;
  moped_work_activity_status?:
    Moped_Proj_Work_Activity_Status_Bool_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  reference_id?: String_Comparison_Exp | null | undefined;
  status_id?: Int_Comparison_Exp | null | undefined;
  status_note?: String_Comparison_Exp | null | undefined;
  task_orders?: Jsonb_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user?: Moped_Users_Bool_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
  work_assignment_id?: String_Comparison_Exp | null | undefined;
  work_order_url?: String_Comparison_Exp | null | undefined;
  workgroup_contractor?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_proj_work_activity" */
export type Moped_Proj_Work_Activity_Constraint =
  /** unique or primary key constraint on columns "id" */
  "moped_purchase_order_pkey";

/** input type for inserting data into table "moped_proj_work_activity" */
export type Moped_Proj_Work_Activity_Insert_Input = {
  contract_amount?: number | null | undefined;
  contract_number?: string | null | undefined;
  created_at?: unknown;
  created_by_user?: Moped_Users_Obj_Rel_Insert_Input | null | undefined;
  created_by_user_id?: number | null | undefined;
  description?: string | null | undefined;
  id?: number | null | undefined;
  interim_work_activity_id?: string | null | undefined;
  is_deleted?: boolean | null | undefined;
  moped_project?: Moped_Project_Obj_Rel_Insert_Input | null | undefined;
  moped_work_activity_status?:
    Moped_Proj_Work_Activity_Status_Obj_Rel_Insert_Input | null | undefined;
  project_id?: number | null | undefined;
  status_id?: number | null | undefined;
  status_note?: string | null | undefined;
  task_orders?: unknown;
  updated_at?: unknown;
  updated_by_user?: Moped_Users_Obj_Rel_Insert_Input | null | undefined;
  updated_by_user_id?: number | null | undefined;
  work_assignment_id?: string | null | undefined;
  /** External link to a related work order. E.g., to the Knack Data Tracker */
  work_order_url?: string | null | undefined;
  workgroup_contractor?: string | null | undefined;
};

/** on_conflict condition type for table "moped_proj_work_activity" */
export type Moped_Proj_Work_Activity_On_Conflict = {
  constraint: Moped_Proj_Work_Activity_Constraint;
  update_columns?: Array<Moped_Proj_Work_Activity_Update_Column>;
  where?: Moped_Proj_Work_Activity_Bool_Exp | null | undefined;
};

/** select columns of table "moped_proj_work_activity" */
export type Moped_Proj_Work_Activity_Select_Column =
  /** column name */
  | "contract_amount"
  /** column name */
  | "contract_number"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "description"
  /** column name */
  | "id"
  /** column name */
  | "interim_work_activity_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_id"
  /** column name */
  | "reference_id"
  /** column name */
  | "status_id"
  /** column name */
  | "status_note"
  /** column name */
  | "task_orders"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id"
  /** column name */
  | "work_assignment_id"
  /** column name */
  | "work_order_url"
  /** column name */
  | "workgroup_contractor";

/** select "moped_proj_work_activity_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_proj_work_activity" */
export type Moped_Proj_Work_Activity_Select_Column_Moped_Proj_Work_Activity_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "moped_proj_work_activity_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_proj_work_activity" */
export type Moped_Proj_Work_Activity_Select_Column_Moped_Proj_Work_Activity_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** Boolean expression to filter rows from the table "moped_proj_work_activity_status". All fields are combined with a logical 'AND'. */
export type Moped_Proj_Work_Activity_Status_Bool_Exp = {
  _and?: Array<Moped_Proj_Work_Activity_Status_Bool_Exp> | null | undefined;
  _not?: Moped_Proj_Work_Activity_Status_Bool_Exp | null | undefined;
  _or?: Array<Moped_Proj_Work_Activity_Status_Bool_Exp> | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  key?: String_Comparison_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_proj_work_activity_status" */
export type Moped_Proj_Work_Activity_Status_Constraint =
  /** unique or primary key constraint on columns "key" */
  | "moped_proj_work_activity_status_key_key"
  /** unique or primary key constraint on columns "id" */
  | "moped_proj_work_activity_status_pkey";

/** input type for inserting data into table "moped_proj_work_activity_status" */
export type Moped_Proj_Work_Activity_Status_Insert_Input = {
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  key?: string | null | undefined;
  name?: string | null | undefined;
};

/** input type for inserting object relation for remote table "moped_proj_work_activity_status" */
export type Moped_Proj_Work_Activity_Status_Obj_Rel_Insert_Input = {
  data: Moped_Proj_Work_Activity_Status_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Proj_Work_Activity_Status_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_proj_work_activity_status" */
export type Moped_Proj_Work_Activity_Status_On_Conflict = {
  constraint: Moped_Proj_Work_Activity_Status_Constraint;
  update_columns?: Array<Moped_Proj_Work_Activity_Status_Update_Column>;
  where?: Moped_Proj_Work_Activity_Status_Bool_Exp | null | undefined;
};

/** update columns of table "moped_proj_work_activity_status" */
export type Moped_Proj_Work_Activity_Status_Update_Column =
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "key"
  /** column name */
  | "name";

/** update columns of table "moped_proj_work_activity" */
export type Moped_Proj_Work_Activity_Update_Column =
  /** column name */
  | "contract_amount"
  /** column name */
  | "contract_number"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "description"
  /** column name */
  | "id"
  /** column name */
  | "interim_work_activity_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "project_id"
  /** column name */
  | "status_id"
  /** column name */
  | "status_note"
  /** column name */
  | "task_orders"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id"
  /** column name */
  | "work_assignment_id"
  /** column name */
  | "work_order_url"
  /** column name */
  | "workgroup_contractor";

export type Moped_Project_Aggregate_Bool_Exp = {
  bool_and?: Moped_Project_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Moped_Project_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Moped_Project_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Project_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Project_Select_Column_Moped_Project_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Project_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Project_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Project_Select_Column_Moped_Project_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Project_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Project_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Project_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Project_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_project" */
export type Moped_Project_Arr_Rel_Insert_Input = {
  data: Array<Moped_Project_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Project_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_project". All fields are combined with a logical 'AND'. */
export type Moped_Project_Bool_Exp = {
  _and?: Array<Moped_Project_Bool_Exp> | null | undefined;
  _not?: Moped_Project_Bool_Exp | null | undefined;
  _or?: Array<Moped_Project_Bool_Exp> | null | undefined;
  added_by?: Int_Comparison_Exp | null | undefined;
  current_phase_view?: Current_Phase_View_Bool_Exp | null | undefined;
  date_added?: Timestamptz_Comparison_Exp | null | undefined;
  ecapris_subproject_id?: String_Comparison_Exp | null | undefined;
  geography?: Project_Geography_Bool_Exp | null | undefined;
  geography_aggregate?: Project_Geography_Aggregate_Bool_Exp | null | undefined;
  interim_project_id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  is_migrated_from_access_db?: Boolean_Comparison_Exp | null | undefined;
  knack_project_id?: String_Comparison_Exp | null | undefined;
  moped_entity?: Moped_Entity_Bool_Exp | null | undefined;
  moped_proj_components?: Moped_Proj_Components_Bool_Exp | null | undefined;
  moped_proj_components_aggregate?:
    Moped_Proj_Components_Aggregate_Bool_Exp | null | undefined;
  moped_proj_funding?: Moped_Proj_Funding_Bool_Exp | null | undefined;
  moped_proj_funding_aggregate?:
    Moped_Proj_Funding_Aggregate_Bool_Exp | null | undefined;
  moped_proj_milestones?: Moped_Proj_Milestones_Bool_Exp | null | undefined;
  moped_proj_milestones_aggregate?:
    Moped_Proj_Milestones_Aggregate_Bool_Exp | null | undefined;
  moped_proj_notes?: Moped_Proj_Notes_Bool_Exp | null | undefined;
  moped_proj_notes_aggregate?:
    Moped_Proj_Notes_Aggregate_Bool_Exp | null | undefined;
  moped_proj_partners?: Moped_Proj_Partners_Bool_Exp | null | undefined;
  moped_proj_partners_aggregate?:
    Moped_Proj_Partners_Aggregate_Bool_Exp | null | undefined;
  moped_proj_personnel?: Moped_Proj_Personnel_Bool_Exp | null | undefined;
  moped_proj_personnel_aggregate?:
    Moped_Proj_Personnel_Aggregate_Bool_Exp | null | undefined;
  moped_proj_phases?: Moped_Proj_Phases_Bool_Exp | null | undefined;
  moped_proj_phases_aggregate?:
    Moped_Proj_Phases_Aggregate_Bool_Exp | null | undefined;
  moped_proj_tags?: Moped_Proj_Tags_Bool_Exp | null | undefined;
  moped_proj_tags_aggregate?:
    Moped_Proj_Tags_Aggregate_Bool_Exp | null | undefined;
  moped_proj_work_activities?:
    Moped_Proj_Work_Activity_Bool_Exp | null | undefined;
  moped_proj_work_activities_aggregate?:
    Moped_Proj_Work_Activity_Aggregate_Bool_Exp | null | undefined;
  moped_project?: Moped_Project_Bool_Exp | null | undefined;
  moped_project_lead?: Moped_Entity_Bool_Exp | null | undefined;
  moped_project_types?:
    Deprecated_Moped_Project_Types_Bool_Exp | null | undefined;
  moped_project_types_aggregate?:
    Deprecated_Moped_Project_Types_Aggregate_Bool_Exp | null | undefined;
  moped_projects?: Moped_Project_Bool_Exp | null | undefined;
  moped_projects_aggregate?:
    Moped_Project_Aggregate_Bool_Exp | null | undefined;
  moped_public_process_statuses?:
    Moped_Public_Process_Statuses_Bool_Exp | null | undefined;
  moped_user?: Moped_Users_Bool_Exp | null | undefined;
  parent_project_id?: Int_Comparison_Exp | null | undefined;
  project_description?: String_Comparison_Exp | null | undefined;
  project_geography?: Project_Geography_Bool_Exp | null | undefined;
  project_geography_aggregate?:
    Project_Geography_Aggregate_Bool_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  project_lead_id?: Int_Comparison_Exp | null | undefined;
  project_list_view?: Project_List_View_Bool_Exp | null | undefined;
  project_name?: String_Comparison_Exp | null | undefined;
  project_name_full?: String_Comparison_Exp | null | undefined;
  project_name_secondary?: String_Comparison_Exp | null | undefined;
  project_sponsor?: Int_Comparison_Exp | null | undefined;
  project_website?: String_Comparison_Exp | null | undefined;
  public_process_status_id?: Int_Comparison_Exp | null | undefined;
  should_sync_ecapris_funding?: Boolean_Comparison_Exp | null | undefined;
  should_sync_ecapris_statuses?: Boolean_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_project" */
export type Moped_Project_Constraint =
  /** unique or primary key constraint on columns "project_id" */
  | "moped_project_pkey"
  /** unique or primary key constraint on columns "project_id" */
  | "moped_project_project_id_simple_key";

/** Boolean expression to filter rows from the table "moped_project_files". All fields are combined with a logical 'AND'. */
export type Moped_Project_Files_Bool_Exp = {
  _and?: Array<Moped_Project_Files_Bool_Exp> | null | undefined;
  _not?: Moped_Project_Files_Bool_Exp | null | undefined;
  _or?: Array<Moped_Project_Files_Bool_Exp> | null | undefined;
  api_response?: Jsonb_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_by_user_id?: Int_Comparison_Exp | null | undefined;
  file_description?: String_Comparison_Exp | null | undefined;
  file_key?: String_Comparison_Exp | null | undefined;
  file_metadata?: Jsonb_Comparison_Exp | null | undefined;
  file_name?: String_Comparison_Exp | null | undefined;
  file_permissions?: Jsonb_Comparison_Exp | null | undefined;
  file_size?: Int_Comparison_Exp | null | undefined;
  file_type?: Int_Comparison_Exp | null | undefined;
  file_url?: String_Comparison_Exp | null | undefined;
  files_ecapris_fundings?: Files_Ecapris_Funding_Bool_Exp | null | undefined;
  files_ecapris_fundings_aggregate?:
    Files_Ecapris_Funding_Aggregate_Bool_Exp | null | undefined;
  files_project_fundings?: Files_Project_Funding_Bool_Exp | null | undefined;
  files_project_fundings_aggregate?:
    Files_Project_Funding_Aggregate_Bool_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  is_scanned?: Boolean_Comparison_Exp | null | undefined;
  moped_project?: Moped_Project_Bool_Exp | null | undefined;
  moped_user?: Moped_Users_Bool_Exp | null | undefined;
  project_file_id?: Int_Comparison_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  updated_by_user_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_project_files" */
export type Moped_Project_Files_Constraint =
  /** unique or primary key constraint on columns "project_file_id" */
  "moped_project_files_pkey";

/** input type for inserting data into table "moped_project_files" */
export type Moped_Project_Files_Insert_Input = {
  api_response?: unknown;
  created_at?: unknown;
  created_by_user_id?: number | null | undefined;
  file_description?: string | null | undefined;
  file_key?: string | null | undefined;
  file_metadata?: unknown;
  file_name?: string | null | undefined;
  file_permissions?: unknown;
  file_size?: number | null | undefined;
  file_type?: number | null | undefined;
  file_url?: string | null | undefined;
  files_ecapris_fundings?:
    Files_Ecapris_Funding_Arr_Rel_Insert_Input | null | undefined;
  files_project_fundings?:
    Files_Project_Funding_Arr_Rel_Insert_Input | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  is_scanned?: boolean | null | undefined;
  moped_project?: Moped_Project_Obj_Rel_Insert_Input | null | undefined;
  moped_user?: Moped_Users_Obj_Rel_Insert_Input | null | undefined;
  project_file_id?: number | null | undefined;
  project_id?: number | null | undefined;
  /** Timestamp when the record was last updated */
  updated_at?: unknown;
  /** ID of the user who last updated the record */
  updated_by_user_id?: number | null | undefined;
};

/** input type for inserting object relation for remote table "moped_project_files" */
export type Moped_Project_Files_Obj_Rel_Insert_Input = {
  data: Moped_Project_Files_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Project_Files_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_project_files" */
export type Moped_Project_Files_On_Conflict = {
  constraint: Moped_Project_Files_Constraint;
  update_columns?: Array<Moped_Project_Files_Update_Column>;
  where?: Moped_Project_Files_Bool_Exp | null | undefined;
};

/** update columns of table "moped_project_files" */
export type Moped_Project_Files_Update_Column =
  /** column name */
  | "api_response"
  /** column name */
  | "created_at"
  /** column name */
  | "created_by_user_id"
  /** column name */
  | "file_description"
  /** column name */
  | "file_key"
  /** column name */
  | "file_metadata"
  /** column name */
  | "file_name"
  /** column name */
  | "file_permissions"
  /** column name */
  | "file_size"
  /** column name */
  | "file_type"
  /** column name */
  | "file_url"
  /** column name */
  | "is_deleted"
  /** column name */
  | "is_scanned"
  /** column name */
  | "project_file_id"
  /** column name */
  | "project_id"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** input type for inserting data into table "moped_project" */
export type Moped_Project_Insert_Input = {
  added_by?: number | null | undefined;
  current_phase_view?:
    Current_Phase_View_Obj_Rel_Insert_Input | null | undefined;
  date_added?: unknown;
  ecapris_subproject_id?: string | null | undefined;
  geography?: Project_Geography_Arr_Rel_Insert_Input | null | undefined;
  interim_project_id?: number | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  is_migrated_from_access_db?: boolean | null | undefined;
  knack_project_id?: string | null | undefined;
  moped_entity?: Moped_Entity_Obj_Rel_Insert_Input | null | undefined;
  moped_proj_components?:
    Moped_Proj_Components_Arr_Rel_Insert_Input | null | undefined;
  moped_proj_funding?:
    Moped_Proj_Funding_Arr_Rel_Insert_Input | null | undefined;
  moped_proj_milestones?:
    Moped_Proj_Milestones_Arr_Rel_Insert_Input | null | undefined;
  moped_proj_notes?: Moped_Proj_Notes_Arr_Rel_Insert_Input | null | undefined;
  moped_proj_partners?:
    Moped_Proj_Partners_Arr_Rel_Insert_Input | null | undefined;
  moped_proj_personnel?:
    Moped_Proj_Personnel_Arr_Rel_Insert_Input | null | undefined;
  moped_proj_phases?: Moped_Proj_Phases_Arr_Rel_Insert_Input | null | undefined;
  moped_proj_tags?: Moped_Proj_Tags_Arr_Rel_Insert_Input | null | undefined;
  moped_proj_work_activities?:
    Moped_Proj_Work_Activity_Arr_Rel_Insert_Input | null | undefined;
  moped_project?: Moped_Project_Obj_Rel_Insert_Input | null | undefined;
  moped_project_lead?: Moped_Entity_Obj_Rel_Insert_Input | null | undefined;
  moped_project_types?:
    Deprecated_Moped_Project_Types_Arr_Rel_Insert_Input | null | undefined;
  moped_projects?: Moped_Project_Arr_Rel_Insert_Input | null | undefined;
  moped_public_process_statuses?:
    Moped_Public_Process_Statuses_Obj_Rel_Insert_Input | null | undefined;
  moped_user?: Moped_Users_Obj_Rel_Insert_Input | null | undefined;
  parent_project_id?: number | null | undefined;
  project_description?: string | null | undefined;
  project_geography?: Project_Geography_Arr_Rel_Insert_Input | null | undefined;
  project_id?: number | null | undefined;
  project_lead_id?: number | null | undefined;
  project_list_view?: Project_List_View_Obj_Rel_Insert_Input | null | undefined;
  project_name?: string | null | undefined;
  project_name_secondary?: string | null | undefined;
  project_sponsor?: number | null | undefined;
  project_website?: string | null | undefined;
  public_process_status_id?: number | null | undefined;
  /** Indicates if project funding should be synced from eCAPRIS */
  should_sync_ecapris_funding?: boolean | null | undefined;
  /** Indicates if project statuses should be synced from eCAPRIS */
  should_sync_ecapris_statuses?: boolean | null | undefined;
  updated_at?: unknown;
  /** User ID of the person who last updated the project */
  updated_by_user_id?: number | null | undefined;
};

/** input type for inserting object relation for remote table "moped_project" */
export type Moped_Project_Obj_Rel_Insert_Input = {
  data: Moped_Project_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Project_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_project" */
export type Moped_Project_On_Conflict = {
  constraint: Moped_Project_Constraint;
  update_columns?: Array<Moped_Project_Update_Column>;
  where?: Moped_Project_Bool_Exp | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_project_roles". All fields are combined with a logical 'AND'. */
export type Moped_Project_Roles_Bool_Exp = {
  _and?: Array<Moped_Project_Roles_Bool_Exp> | null | undefined;
  _not?: Moped_Project_Roles_Bool_Exp | null | undefined;
  _or?: Array<Moped_Project_Roles_Bool_Exp> | null | undefined;
  active_role?: Boolean_Comparison_Exp | null | undefined;
  date_added?: Timestamptz_Comparison_Exp | null | undefined;
  moped_proj_personnel_roles?:
    Moped_Proj_Personnel_Roles_Bool_Exp | null | undefined;
  moped_proj_personnel_roles_aggregate?:
    Moped_Proj_Personnel_Roles_Aggregate_Bool_Exp | null | undefined;
  project_role_description?: String_Comparison_Exp | null | undefined;
  project_role_id?: Int_Comparison_Exp | null | undefined;
  project_role_name?: String_Comparison_Exp | null | undefined;
  role_order?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_project_roles" */
export type Moped_Project_Roles_Constraint =
  /** unique or primary key constraint on columns "project_role_id" */
  | "moped_project_roles_pkey"
  /** unique or primary key constraint on columns "project_role_name" */
  | "moped_project_roles_project_role_name_key";

/** input type for inserting data into table "moped_project_roles" */
export type Moped_Project_Roles_Insert_Input = {
  active_role?: boolean | null | undefined;
  date_added?: unknown;
  moped_proj_personnel_roles?:
    Moped_Proj_Personnel_Roles_Arr_Rel_Insert_Input | null | undefined;
  project_role_description?: string | null | undefined;
  project_role_id?: number | null | undefined;
  project_role_name?: string | null | undefined;
  role_order?: number | null | undefined;
};

/** input type for inserting object relation for remote table "moped_project_roles" */
export type Moped_Project_Roles_Obj_Rel_Insert_Input = {
  data: Moped_Project_Roles_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Project_Roles_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_project_roles" */
export type Moped_Project_Roles_On_Conflict = {
  constraint: Moped_Project_Roles_Constraint;
  update_columns?: Array<Moped_Project_Roles_Update_Column>;
  where?: Moped_Project_Roles_Bool_Exp | null | undefined;
};

/** update columns of table "moped_project_roles" */
export type Moped_Project_Roles_Update_Column =
  /** column name */
  | "active_role"
  /** column name */
  | "date_added"
  /** column name */
  | "project_role_description"
  /** column name */
  | "project_role_id"
  /** column name */
  | "project_role_name"
  /** column name */
  | "role_order";

/** select columns of table "moped_project" */
export type Moped_Project_Select_Column =
  /** column name */
  | "added_by"
  /** column name */
  | "date_added"
  /** column name */
  | "ecapris_subproject_id"
  /** column name */
  | "interim_project_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "is_migrated_from_access_db"
  /** column name */
  | "knack_project_id"
  /** column name */
  | "parent_project_id"
  /** column name */
  | "project_description"
  /** column name */
  | "project_id"
  /** column name */
  | "project_lead_id"
  /** column name */
  | "project_name"
  /** column name */
  | "project_name_full"
  /** column name */
  | "project_name_secondary"
  /** column name */
  | "project_sponsor"
  /** column name */
  | "project_website"
  /** column name */
  | "public_process_status_id"
  /** column name */
  | "should_sync_ecapris_funding"
  /** column name */
  | "should_sync_ecapris_statuses"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** select "moped_project_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_project" */
export type Moped_Project_Select_Column_Moped_Project_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  | "is_deleted"
  /** column name */
  | "is_migrated_from_access_db"
  /** column name */
  | "should_sync_ecapris_funding"
  /** column name */
  | "should_sync_ecapris_statuses";

/** select "moped_project_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_project" */
export type Moped_Project_Select_Column_Moped_Project_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  | "is_deleted"
  /** column name */
  | "is_migrated_from_access_db"
  /** column name */
  | "should_sync_ecapris_funding"
  /** column name */
  | "should_sync_ecapris_statuses";

/** update columns of table "moped_project" */
export type Moped_Project_Update_Column =
  /** column name */
  | "added_by"
  /** column name */
  | "date_added"
  /** column name */
  | "ecapris_subproject_id"
  /** column name */
  | "interim_project_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "is_migrated_from_access_db"
  /** column name */
  | "knack_project_id"
  /** column name */
  | "parent_project_id"
  /** column name */
  | "project_description"
  /** column name */
  | "project_id"
  /** column name */
  | "project_lead_id"
  /** column name */
  | "project_name"
  /** column name */
  | "project_name_secondary"
  /** column name */
  | "project_sponsor"
  /** column name */
  | "project_website"
  /** column name */
  | "public_process_status_id"
  /** column name */
  | "should_sync_ecapris_funding"
  /** column name */
  | "should_sync_ecapris_statuses"
  /** column name */
  | "updated_at"
  /** column name */
  | "updated_by_user_id";

/** Boolean expression to filter rows from the table "moped_public_process_statuses". All fields are combined with a logical 'AND'. */
export type Moped_Public_Process_Statuses_Bool_Exp = {
  _and?: Array<Moped_Public_Process_Statuses_Bool_Exp> | null | undefined;
  _not?: Moped_Public_Process_Statuses_Bool_Exp | null | undefined;
  _or?: Array<Moped_Public_Process_Statuses_Bool_Exp> | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  slug?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_public_process_statuses" */
export type Moped_Public_Process_Statuses_Constraint =
  /** unique or primary key constraint on columns "name" */
  | "moped_public_process_statuses_name_key"
  /** unique or primary key constraint on columns "id" */
  | "moped_public_process_statuses_pkey"
  /** unique or primary key constraint on columns "slug" */
  | "moped_public_process_statuses_slug_key";

/** input type for inserting data into table "moped_public_process_statuses" */
export type Moped_Public_Process_Statuses_Insert_Input = {
  id?: number | null | undefined;
  name?: string | null | undefined;
  slug?: string | null | undefined;
};

/** input type for inserting object relation for remote table "moped_public_process_statuses" */
export type Moped_Public_Process_Statuses_Obj_Rel_Insert_Input = {
  data: Moped_Public_Process_Statuses_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Public_Process_Statuses_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_public_process_statuses" */
export type Moped_Public_Process_Statuses_On_Conflict = {
  constraint: Moped_Public_Process_Statuses_Constraint;
  update_columns?: Array<Moped_Public_Process_Statuses_Update_Column>;
  where?: Moped_Public_Process_Statuses_Bool_Exp | null | undefined;
};

/** update columns of table "moped_public_process_statuses" */
export type Moped_Public_Process_Statuses_Update_Column =
  /** column name */
  | "id"
  /** column name */
  | "name"
  /** column name */
  | "slug";

/** Boolean expression to filter rows from the table "moped_subcomponents". All fields are combined with a logical 'AND'. */
export type Moped_Subcomponents_Bool_Exp = {
  _and?: Array<Moped_Subcomponents_Bool_Exp> | null | undefined;
  _not?: Moped_Subcomponents_Bool_Exp | null | undefined;
  _or?: Array<Moped_Subcomponents_Bool_Exp> | null | undefined;
  subcomponent_id?: Int_Comparison_Exp | null | undefined;
  subcomponent_name?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_subcomponents" */
export type Moped_Subcomponents_Constraint =
  /** unique or primary key constraint on columns "subcomponent_id" */
  | "moped_subcomponents_pkey"
  /** unique or primary key constraint on columns "subcomponent_name" */
  | "subcomponent_name_unique";

/** input type for inserting data into table "moped_subcomponents" */
export type Moped_Subcomponents_Insert_Input = {
  subcomponent_id?: number | null | undefined;
  subcomponent_name?: string | null | undefined;
};

/** input type for inserting object relation for remote table "moped_subcomponents" */
export type Moped_Subcomponents_Obj_Rel_Insert_Input = {
  data: Moped_Subcomponents_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Subcomponents_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_subcomponents" */
export type Moped_Subcomponents_On_Conflict = {
  constraint: Moped_Subcomponents_Constraint;
  update_columns?: Array<Moped_Subcomponents_Update_Column>;
  where?: Moped_Subcomponents_Bool_Exp | null | undefined;
};

/** update columns of table "moped_subcomponents" */
export type Moped_Subcomponents_Update_Column =
  /** column name */
  | "subcomponent_id"
  /** column name */
  | "subcomponent_name";

export type Moped_Subphases_Aggregate_Bool_Exp = {
  count?: Moped_Subphases_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Subphases_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Subphases_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Subphases_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_subphases" */
export type Moped_Subphases_Arr_Rel_Insert_Input = {
  data: Array<Moped_Subphases_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Subphases_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_subphases". All fields are combined with a logical 'AND'. */
export type Moped_Subphases_Bool_Exp = {
  _and?: Array<Moped_Subphases_Bool_Exp> | null | undefined;
  _not?: Moped_Subphases_Bool_Exp | null | undefined;
  _or?: Array<Moped_Subphases_Bool_Exp> | null | undefined;
  moped_phase?: Moped_Phases_Bool_Exp | null | undefined;
  related_phase_id?: Int_Comparison_Exp | null | undefined;
  subphase_description?: String_Comparison_Exp | null | undefined;
  subphase_id?: Int_Comparison_Exp | null | undefined;
  subphase_name?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_subphases" */
export type Moped_Subphases_Constraint =
  /** unique or primary key constraint on columns "subphase_id" */
  | "moped_subphases_subphase_id_pkey"
  /** unique or primary key constraint on columns "related_phase_id", "subphase_name" */
  | "moped_subphases_subphase_name_related_phase_id_key";

/** input type for inserting data into table "moped_subphases" */
export type Moped_Subphases_Insert_Input = {
  moped_phase?: Moped_Phases_Obj_Rel_Insert_Input | null | undefined;
  related_phase_id?: number | null | undefined;
  subphase_description?: string | null | undefined;
  subphase_id?: number | null | undefined;
  subphase_name?: string | null | undefined;
};

/** input type for inserting object relation for remote table "moped_subphases" */
export type Moped_Subphases_Obj_Rel_Insert_Input = {
  data: Moped_Subphases_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Subphases_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_subphases" */
export type Moped_Subphases_On_Conflict = {
  constraint: Moped_Subphases_Constraint;
  update_columns?: Array<Moped_Subphases_Update_Column>;
  where?: Moped_Subphases_Bool_Exp | null | undefined;
};

/** select columns of table "moped_subphases" */
export type Moped_Subphases_Select_Column =
  /** column name */
  | "related_phase_id"
  /** column name */
  | "subphase_description"
  /** column name */
  | "subphase_id"
  /** column name */
  | "subphase_name";

/** update columns of table "moped_subphases" */
export type Moped_Subphases_Update_Column =
  /** column name */
  | "related_phase_id"
  /** column name */
  | "subphase_description"
  /** column name */
  | "subphase_id"
  /** column name */
  | "subphase_name";

/** Boolean expression to filter rows from the table "moped_tags". All fields are combined with a logical 'AND'. */
export type Moped_Tags_Bool_Exp = {
  _and?: Array<Moped_Tags_Bool_Exp> | null | undefined;
  _not?: Moped_Tags_Bool_Exp | null | undefined;
  _or?: Array<Moped_Tags_Bool_Exp> | null | undefined;
  full_name?: String_Comparison_Exp | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_proj_tags?: Moped_Proj_Tags_Bool_Exp | null | undefined;
  moped_proj_tags_aggregate?:
    Moped_Proj_Tags_Aggregate_Bool_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  slug?: String_Comparison_Exp | null | undefined;
  type?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_tags" */
export type Moped_Tags_Constraint =
  /** unique or primary key constraint on columns "name" */
  | "moped_tags_name_key"
  /** unique or primary key constraint on columns "id" */
  | "moped_tags_pkey"
  /** unique or primary key constraint on columns "slug" */
  | "moped_tags_slug_key";

/** input type for inserting data into table "moped_tags" */
export type Moped_Tags_Insert_Input = {
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  moped_proj_tags?: Moped_Proj_Tags_Arr_Rel_Insert_Input | null | undefined;
  name?: string | null | undefined;
  slug?: string | null | undefined;
  type?: string | null | undefined;
};

/** input type for inserting object relation for remote table "moped_tags" */
export type Moped_Tags_Obj_Rel_Insert_Input = {
  data: Moped_Tags_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Tags_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_tags" */
export type Moped_Tags_On_Conflict = {
  constraint: Moped_Tags_Constraint;
  update_columns?: Array<Moped_Tags_Update_Column>;
  where?: Moped_Tags_Bool_Exp | null | undefined;
};

/** update columns of table "moped_tags" */
export type Moped_Tags_Update_Column =
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "name"
  /** column name */
  | "slug"
  /** column name */
  | "type";

/** input type for inserting data into table "moped_user_followed_projects" */
export type Moped_User_Followed_Projects_Insert_Input = {
  created_at?: unknown;
  id?: number | null | undefined;
  project?: Moped_Project_Obj_Rel_Insert_Input | null | undefined;
  project_id?: number | null | undefined;
  user_id?: number | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_users". All fields are combined with a logical 'AND'. */
export type Moped_Users_Bool_Exp = {
  _and?: Array<Moped_Users_Bool_Exp> | null | undefined;
  _not?: Moped_Users_Bool_Exp | null | undefined;
  _or?: Array<Moped_Users_Bool_Exp> | null | undefined;
  cognito_user_id?: Uuid_Comparison_Exp | null | undefined;
  date_added?: Timestamptz_Comparison_Exp | null | undefined;
  email?: Citext_Comparison_Exp | null | undefined;
  first_name?: String_Comparison_Exp | null | undefined;
  is_coa_staff?: Boolean_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  is_user_group_member?: Boolean_Comparison_Exp | null | undefined;
  last_name?: String_Comparison_Exp | null | undefined;
  last_seen_date?: Timestamptz_Comparison_Exp | null | undefined;
  moped_workgroup?: Moped_Workgroup_Bool_Exp | null | undefined;
  note?: String_Comparison_Exp | null | undefined;
  picture?: String_Comparison_Exp | null | undefined;
  roles?: Jsonb_Comparison_Exp | null | undefined;
  title?: String_Comparison_Exp | null | undefined;
  user_id?: Int_Comparison_Exp | null | undefined;
  workgroup_id?: Int_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_users" */
export type Moped_Users_Constraint =
  /** unique or primary key constraint on columns "cognito_user_id" */
  | "moped_users_cognito_user_id_key"
  /** unique or primary key constraint on columns "email" */
  | "moped_users_email_key"
  /** unique or primary key constraint on columns "user_id" */
  | "moped_users_pkey"
  /** unique or primary key constraint on columns "email" */
  | "moped_users_unique_email_idx"
  /** unique or primary key constraint on columns "user_id" */
  | "moped_users_user_id_key";

/** input type for inserting data into table "moped_users" */
export type Moped_Users_Insert_Input = {
  /** Identifier for the user in AWS Cognito */
  cognito_user_id?: unknown;
  date_added?: unknown;
  email?: unknown;
  first_name?: string | null | undefined;
  /** Indicates if the user is a COA staff member or not */
  is_coa_staff?: boolean | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  /** Tracks if the user is a member of the Moped User Group, aka the MUG. */
  is_user_group_member?: boolean | null | undefined;
  last_name?: string | null | undefined;
  /** Tracks the last time a user loaded the Moped app in their browser. This value is set by the set_last_seen_date function. This value is not 100% reliable because it is updated by an API call that can be blocked by the client. */
  last_seen_date?: unknown;
  moped_workgroup?: Moped_Workgroup_Obj_Rel_Insert_Input | null | undefined;
  /** A place to add any notes about this user, e.g. why they were deactivated. */
  note?: string | null | undefined;
  /** Deprecated column to store the S3 path to uploaded profile image file */
  picture?: string | null | undefined;
  /** Roles assigned to the user to determine platform access (Hasura) */
  roles?: unknown;
  title?: string | null | undefined;
  user_id?: number | null | undefined;
  workgroup_id?: number | null | undefined;
};

/** input type for inserting object relation for remote table "moped_users" */
export type Moped_Users_Obj_Rel_Insert_Input = {
  data: Moped_Users_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Users_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_users" */
export type Moped_Users_On_Conflict = {
  constraint: Moped_Users_Constraint;
  update_columns?: Array<Moped_Users_Update_Column>;
  where?: Moped_Users_Bool_Exp | null | undefined;
};

/** update columns of table "moped_users" */
export type Moped_Users_Update_Column =
  /** column name */
  | "cognito_user_id"
  /** column name */
  | "date_added"
  /** column name */
  | "email"
  /** column name */
  | "first_name"
  /** column name */
  | "is_coa_staff"
  /** column name */
  | "is_deleted"
  /** column name */
  | "is_user_group_member"
  /** column name */
  | "last_name"
  /** column name */
  | "last_seen_date"
  /** column name */
  | "note"
  /** column name */
  | "picture"
  /** column name */
  | "roles"
  /** column name */
  | "title"
  /** column name */
  | "user_id"
  /** column name */
  | "workgroup_id";

/** Boolean expression to filter rows from the table "moped_work_types". All fields are combined with a logical 'AND'. */
export type Moped_Work_Types_Bool_Exp = {
  _and?: Array<Moped_Work_Types_Bool_Exp> | null | undefined;
  _not?: Moped_Work_Types_Bool_Exp | null | undefined;
  _or?: Array<Moped_Work_Types_Bool_Exp> | null | undefined;
  id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  key?: String_Comparison_Exp | null | undefined;
  moped_component_work_types?:
    Moped_Component_Work_Types_Bool_Exp | null | undefined;
  moped_component_work_types_aggregate?:
    Moped_Component_Work_Types_Aggregate_Bool_Exp | null | undefined;
  moped_proj_component_work_types?:
    Moped_Proj_Component_Work_Types_Bool_Exp | null | undefined;
  moped_proj_component_work_types_aggregate?:
    Moped_Proj_Component_Work_Types_Aggregate_Bool_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_work_types" */
export type Moped_Work_Types_Constraint =
  /** unique or primary key constraint on columns "key" */
  | "moped_work_types_key_key"
  /** unique or primary key constraint on columns "id" */
  | "moped_work_types_pkey";

/** input type for inserting data into table "moped_work_types" */
export type Moped_Work_Types_Insert_Input = {
  id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  key?: string | null | undefined;
  moped_component_work_types?:
    Moped_Component_Work_Types_Arr_Rel_Insert_Input | null | undefined;
  moped_proj_component_work_types?:
    Moped_Proj_Component_Work_Types_Arr_Rel_Insert_Input | null | undefined;
  name?: string | null | undefined;
};

/** input type for inserting object relation for remote table "moped_work_types" */
export type Moped_Work_Types_Obj_Rel_Insert_Input = {
  data: Moped_Work_Types_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Work_Types_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_work_types" */
export type Moped_Work_Types_On_Conflict = {
  constraint: Moped_Work_Types_Constraint;
  update_columns?: Array<Moped_Work_Types_Update_Column>;
  where?: Moped_Work_Types_Bool_Exp | null | undefined;
};

/** update columns of table "moped_work_types" */
export type Moped_Work_Types_Update_Column =
  /** column name */
  | "id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "key"
  /** column name */
  | "name";

export type Moped_Workgroup_Aggregate_Bool_Exp = {
  bool_and?: Moped_Workgroup_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Moped_Workgroup_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Moped_Workgroup_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Moped_Workgroup_Aggregate_Bool_Exp_Bool_And = {
  arguments: Moped_Workgroup_Select_Column_Moped_Workgroup_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Workgroup_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Workgroup_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Moped_Workgroup_Select_Column_Moped_Workgroup_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Moped_Workgroup_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Moped_Workgroup_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Moped_Workgroup_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Moped_Workgroup_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "moped_workgroup" */
export type Moped_Workgroup_Arr_Rel_Insert_Input = {
  data: Array<Moped_Workgroup_Insert_Input>;
  /** upsert condition */
  on_conflict?: Moped_Workgroup_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "moped_workgroup". All fields are combined with a logical 'AND'. */
export type Moped_Workgroup_Bool_Exp = {
  _and?: Array<Moped_Workgroup_Bool_Exp> | null | undefined;
  _not?: Moped_Workgroup_Bool_Exp | null | undefined;
  _or?: Array<Moped_Workgroup_Bool_Exp> | null | undefined;
  date_added?: Timestamptz_Comparison_Exp | null | undefined;
  department_id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  moped_department?: Moped_Department_Bool_Exp | null | undefined;
  workgroup_abbreviation?: String_Comparison_Exp | null | undefined;
  workgroup_id?: Int_Comparison_Exp | null | undefined;
  workgroup_name?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "moped_workgroup" */
export type Moped_Workgroup_Constraint =
  /** unique or primary key constraint on columns "workgroup_id" */
  | "moped_workgroup_pkey"
  /** unique or primary key constraint on columns "workgroup_id" */
  | "moped_workgroup_workgroup_id_key";

/** input type for inserting data into table "moped_workgroup" */
export type Moped_Workgroup_Insert_Input = {
  date_added?: unknown;
  department_id?: number | null | undefined;
  /** Indicates soft deletion */
  is_deleted?: boolean | null | undefined;
  moped_department?: Moped_Department_Obj_Rel_Insert_Input | null | undefined;
  workgroup_abbreviation?: string | null | undefined;
  workgroup_id?: number | null | undefined;
  workgroup_name?: string | null | undefined;
};

/** input type for inserting object relation for remote table "moped_workgroup" */
export type Moped_Workgroup_Obj_Rel_Insert_Input = {
  data: Moped_Workgroup_Insert_Input;
  /** upsert condition */
  on_conflict?: Moped_Workgroup_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "moped_workgroup" */
export type Moped_Workgroup_On_Conflict = {
  constraint: Moped_Workgroup_Constraint;
  update_columns?: Array<Moped_Workgroup_Update_Column>;
  where?: Moped_Workgroup_Bool_Exp | null | undefined;
};

/** select columns of table "moped_workgroup" */
export type Moped_Workgroup_Select_Column =
  /** column name */
  | "date_added"
  /** column name */
  | "department_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "workgroup_abbreviation"
  /** column name */
  | "workgroup_id"
  /** column name */
  | "workgroup_name";

/** select "moped_workgroup_aggregate_bool_exp_bool_and_arguments_columns" columns of table "moped_workgroup" */
export type Moped_Workgroup_Select_Column_Moped_Workgroup_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  "is_deleted";

/** select "moped_workgroup_aggregate_bool_exp_bool_or_arguments_columns" columns of table "moped_workgroup" */
export type Moped_Workgroup_Select_Column_Moped_Workgroup_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  "is_deleted";

/** update columns of table "moped_workgroup" */
export type Moped_Workgroup_Update_Column =
  /** column name */
  | "date_added"
  /** column name */
  | "department_id"
  /** column name */
  | "is_deleted"
  /** column name */
  | "workgroup_abbreviation"
  /** column name */
  | "workgroup_id"
  /** column name */
  | "workgroup_name";

export type Project_Geography_Aggregate_Bool_Exp = {
  bool_and?: Project_Geography_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Project_Geography_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Project_Geography_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Project_Geography_Aggregate_Bool_Exp_Bool_And = {
  arguments: Project_Geography_Select_Column_Project_Geography_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Project_Geography_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Project_Geography_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Project_Geography_Select_Column_Project_Geography_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Project_Geography_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Project_Geography_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Project_Geography_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Project_Geography_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "project_geography" */
export type Project_Geography_Arr_Rel_Insert_Input = {
  data: Array<Project_Geography_Insert_Input>;
};

/** Boolean expression to filter rows from the table "project_geography". All fields are combined with a logical 'AND'. */
export type Project_Geography_Bool_Exp = {
  _and?: Array<Project_Geography_Bool_Exp> | null | undefined;
  _not?: Project_Geography_Bool_Exp | null | undefined;
  _or?: Array<Project_Geography_Bool_Exp> | null | undefined;
  attributes?: Json_Comparison_Exp | null | undefined;
  component_archtype_id?: Int_Comparison_Exp | null | undefined;
  component_id?: Int_Comparison_Exp | null | undefined;
  component_name?: String_Comparison_Exp | null | undefined;
  council_districts?: Int_Array_Comparison_Exp | null | undefined;
  feature_created_at?: Timestamptz_Comparison_Exp | null | undefined;
  feature_created_by_user_id?: Int_Comparison_Exp | null | undefined;
  feature_id?: Int_Comparison_Exp | null | undefined;
  feature_updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  feature_updated_by_user_id?: Int_Comparison_Exp | null | undefined;
  geography?: Geography_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  length_feet?: Int_Comparison_Exp | null | undefined;
  line_representation?: Boolean_Comparison_Exp | null | undefined;
  original_fk?: String_Comparison_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  project_name?: String_Comparison_Exp | null | undefined;
  table?: String_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "project_geography" */
export type Project_Geography_Insert_Input = {
  attributes?: unknown;
  component_archtype_id?: number | null | undefined;
  component_id?: number | null | undefined;
  component_name?: string | null | undefined;
  council_districts?: Array<number> | null | undefined;
  feature_created_at?: unknown;
  feature_created_by_user_id?: number | null | undefined;
  feature_id?: number | null | undefined;
  feature_updated_at?: unknown;
  feature_updated_by_user_id?: number | null | undefined;
  geography?: unknown;
  is_deleted?: boolean | null | undefined;
  length_feet?: number | null | undefined;
  line_representation?: boolean | null | undefined;
  original_fk?: string | null | undefined;
  project_id?: number | null | undefined;
  project_name?: string | null | undefined;
  table?: string | null | undefined;
};

/** select columns of table "project_geography" */
export type Project_Geography_Select_Column =
  /** column name */
  | "attributes"
  /** column name */
  | "component_archtype_id"
  /** column name */
  | "component_id"
  /** column name */
  | "component_name"
  /** column name */
  | "council_districts"
  /** column name */
  | "feature_created_at"
  /** column name */
  | "feature_created_by_user_id"
  /** column name */
  | "feature_id"
  /** column name */
  | "feature_updated_at"
  /** column name */
  | "feature_updated_by_user_id"
  /** column name */
  | "geography"
  /** column name */
  | "is_deleted"
  /** column name */
  | "length_feet"
  /** column name */
  | "line_representation"
  /** column name */
  | "original_fk"
  /** column name */
  | "project_id"
  /** column name */
  | "project_name"
  /** column name */
  | "table";

/** select "project_geography_aggregate_bool_exp_bool_and_arguments_columns" columns of table "project_geography" */
export type Project_Geography_Select_Column_Project_Geography_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  | "is_deleted"
  /** column name */
  | "line_representation";

/** select "project_geography_aggregate_bool_exp_bool_or_arguments_columns" columns of table "project_geography" */
export type Project_Geography_Select_Column_Project_Geography_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  | "is_deleted"
  /** column name */
  | "line_representation";

/** Boolean expression to filter rows from the table "project_list_view". All fields are combined with a logical 'AND'. */
export type Project_List_View_Bool_Exp = {
  _and?: Array<Project_List_View_Bool_Exp> | null | undefined;
  _not?: Project_List_View_Bool_Exp | null | undefined;
  _or?: Array<Project_List_View_Bool_Exp> | null | undefined;
  added_by?: String_Comparison_Exp | null | undefined;
  children_project_ids?: Jsonb_Comparison_Exp | null | undefined;
  component_work_type_names?: String_Comparison_Exp | null | undefined;
  components?: String_Comparison_Exp | null | undefined;
  construction_start_date?: Timestamptz_Comparison_Exp | null | undefined;
  contract_numbers?: String_Comparison_Exp | null | undefined;
  current_phase?: String_Comparison_Exp | null | undefined;
  current_phase_key?: String_Comparison_Exp | null | undefined;
  current_phase_simple?: String_Comparison_Exp | null | undefined;
  date_added?: Timestamptz_Comparison_Exp | null | undefined;
  ecapris_subproject_id?: String_Comparison_Exp | null | undefined;
  funding_program_names?: String_Comparison_Exp | null | undefined;
  funding_source_and_program_names?: String_Comparison_Exp | null | undefined;
  funding_source_name?: String_Comparison_Exp | null | undefined;
  interim_project_id?: Int_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  knack_project_id?: String_Comparison_Exp | null | undefined;
  parent_project_id?: Int_Comparison_Exp | null | undefined;
  parent_project_name?: String_Comparison_Exp | null | undefined;
  parent_project_url?: String_Comparison_Exp | null | undefined;
  project_and_child_project_council_districts?:
    Jsonb_Comparison_Exp | null | undefined;
  project_and_child_project_council_districts_string?:
    String_Comparison_Exp | null | undefined;
  project_council_districts?: Jsonb_Comparison_Exp | null | undefined;
  project_council_districts_string?: String_Comparison_Exp | null | undefined;
  project_description?: String_Comparison_Exp | null | undefined;
  project_designer?: String_Comparison_Exp | null | undefined;
  project_feature?: Json_Comparison_Exp | null | undefined;
  project_id?: Int_Comparison_Exp | null | undefined;
  project_inspector?: String_Comparison_Exp | null | undefined;
  project_lead?: String_Comparison_Exp | null | undefined;
  project_name?: String_Comparison_Exp | null | undefined;
  project_name_full?: String_Comparison_Exp | null | undefined;
  project_name_secondary?: String_Comparison_Exp | null | undefined;
  project_partners?: String_Comparison_Exp | null | undefined;
  project_sponsor?: String_Comparison_Exp | null | undefined;
  project_status_update?: String_Comparison_Exp | null | undefined;
  project_status_update_author?: String_Comparison_Exp | null | undefined;
  project_status_update_date_created?:
    Timestamptz_Comparison_Exp | null | undefined;
  project_tags?: String_Comparison_Exp | null | undefined;
  project_team_members?: String_Comparison_Exp | null | undefined;
  project_url?: String_Comparison_Exp | null | undefined;
  project_website?: String_Comparison_Exp | null | undefined;
  public_process_status?: String_Comparison_Exp | null | undefined;
  substantial_completion_date?: Timestamptz_Comparison_Exp | null | undefined;
  substantial_completion_date_estimated?:
    Timestamptz_Comparison_Exp | null | undefined;
  task_order_names?: String_Comparison_Exp | null | undefined;
  task_order_names_short?: String_Comparison_Exp | null | undefined;
  task_orders?: Jsonb_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  workgroup_contractors?: String_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "project_list_view" */
export type Project_List_View_Insert_Input = {
  added_by?: string | null | undefined;
  children_project_ids?: unknown;
  component_work_type_names?: string | null | undefined;
  components?: string | null | undefined;
  construction_start_date?: unknown;
  contract_numbers?: string | null | undefined;
  current_phase?: string | null | undefined;
  current_phase_key?: string | null | undefined;
  current_phase_simple?: string | null | undefined;
  date_added?: unknown;
  ecapris_subproject_id?: string | null | undefined;
  funding_program_names?: string | null | undefined;
  funding_source_and_program_names?: string | null | undefined;
  funding_source_name?: string | null | undefined;
  interim_project_id?: number | null | undefined;
  is_deleted?: boolean | null | undefined;
  knack_project_id?: string | null | undefined;
  parent_project_id?: number | null | undefined;
  parent_project_name?: string | null | undefined;
  parent_project_url?: string | null | undefined;
  project_and_child_project_council_districts?: unknown;
  project_and_child_project_council_districts_string?:
    string | null | undefined;
  project_council_districts?: unknown;
  project_council_districts_string?: string | null | undefined;
  project_description?: string | null | undefined;
  project_designer?: string | null | undefined;
  project_feature?: unknown;
  project_id?: number | null | undefined;
  project_inspector?: string | null | undefined;
  project_lead?: string | null | undefined;
  project_name?: string | null | undefined;
  project_name_full?: string | null | undefined;
  project_name_secondary?: string | null | undefined;
  project_partners?: string | null | undefined;
  project_sponsor?: string | null | undefined;
  project_status_update?: string | null | undefined;
  project_status_update_author?: string | null | undefined;
  project_status_update_date_created?: unknown;
  project_tags?: string | null | undefined;
  project_team_members?: string | null | undefined;
  project_url?: string | null | undefined;
  project_website?: string | null | undefined;
  public_process_status?: string | null | undefined;
  substantial_completion_date?: unknown;
  substantial_completion_date_estimated?: unknown;
  task_order_names?: string | null | undefined;
  task_order_names_short?: string | null | undefined;
  task_orders?: unknown;
  updated_at?: unknown;
  workgroup_contractors?: string | null | undefined;
};

/** input type for inserting object relation for remote table "project_list_view" */
export type Project_List_View_Obj_Rel_Insert_Input = {
  data: Project_List_View_Insert_Input;
};

export type St_D_Within_Geography_Input = {
  distance: number;
  from: unknown;
  use_spheroid?: boolean | null | undefined;
};

export type St_D_Within_Input = {
  distance: number;
  from: unknown;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: unknown;
  _gt?: unknown;
  _gte?: unknown;
  _in?: Array<unknown> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: unknown;
  _lte?: unknown;
  _neq?: unknown;
  _nin?: Array<unknown> | null | undefined;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: unknown;
  _gt?: unknown;
  _gte?: unknown;
  _in?: Array<unknown> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: unknown;
  _lte?: unknown;
  _neq?: unknown;
  _nin?: Array<unknown> | null | undefined;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: unknown;
  _gt?: unknown;
  _gte?: unknown;
  _in?: Array<unknown> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: unknown;
  _lte?: unknown;
  _neq?: unknown;
  _nin?: Array<unknown> | null | undefined;
};

export type GetComponentsFormOptionsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetComponentsFormOptionsQuery = {
  moped_components: Array<{
    __typename: "moped_components";
    component_id: number;
    component_name: string;
    component_subtype: string | null;
    line_representation: boolean;
    feature_layer: { __typename: "feature_layers"; internal_table: string };
    asset_feature_layer: {
      __typename: "feature_layers";
      internal_table: string;
    } | null;
    moped_components_subcomponents: Array<{
      __typename: "moped_components_subcomponents";
      moped_subcomponent: {
        __typename: "moped_subcomponents";
        subcomponent_id: number;
        subcomponent_name: string;
      };
    }>;
    moped_component_work_types: Array<{
      __typename: "moped_component_work_types";
      moped_work_type: {
        __typename: "moped_work_types";
        id: number;
        name: string;
      };
    }>;
  }>;
  moped_phases: Array<{
    __typename: "moped_phases";
    phase_name: string;
    phase_id: number;
    phase_name_simple: string;
    moped_subphases: Array<{
      __typename: "moped_subphases";
      subphase_id: number;
      subphase_name: string;
    }>;
  }>;
  moped_component_tags: Array<{
    __typename: "moped_component_tags";
    slug: string;
    id: number;
    full_name: string | null;
  }>;
};

export type AddProjectComponentMutationVariables = Exact<{
  object: Moped_Proj_Components_Insert_Input;
}>;

export type AddProjectComponentMutation = {
  insert_moped_proj_components_one: {
    __typename: "moped_proj_components";
    component_id: number;
  } | null;
};

export type ProjectComponentFieldsFragment = {
  __typename: "moped_proj_components";
  project_component_id: number;
  component_id: number;
  description: string | null;
  phase_id: number | null;
  subphase_id: number | null;
  completion_date: unknown;
  project_id: number;
  srts_id: string | null;
  location_description: string | null;
  moped_components: {
    __typename: "moped_components";
    component_id: number;
    component_name: string;
    component_subtype: string | null;
    line_representation: boolean;
    feature_layer: { __typename: "feature_layers"; internal_table: string };
    asset_feature_layer: {
      __typename: "feature_layers";
      internal_table: string;
    } | null;
  };
  moped_proj_components_subcomponents: Array<{
    __typename: "moped_proj_components_subcomponents";
    subcomponent_id: number;
    moped_subcomponent: {
      __typename: "moped_subcomponents";
      subcomponent_name: string;
    };
  }>;
  moped_proj_component_work_types: Array<{
    __typename: "moped_proj_component_work_types";
    moped_work_type: {
      __typename: "moped_work_types";
      id: number;
      name: string;
    };
  }>;
  moped_proj_component_tags: Array<{
    __typename: "moped_proj_component_tags";
    component_tag_id: number;
    moped_component_tag: {
      __typename: "moped_component_tags";
      full_name: string | null;
    };
  }>;
  moped_phase: {
    __typename: "moped_phases";
    phase_id: number;
    phase_name: string;
    phase_name_simple: string;
    phase_key: string;
    moped_subphases: Array<{
      __typename: "moped_subphases";
      subphase_id: number;
      subphase_name: string;
    }>;
  } | null;
  moped_subphase: {
    __typename: "moped_subphases";
    subphase_id: number;
    subphase_name: string;
  } | null;
  feature_street_segments: Array<{
    __typename: "feature_street_segments";
    id: number;
    source_layer: string;
    ctn_segment_id: number;
    component_id: number;
    geometry: unknown;
  }>;
  feature_intersections: Array<{
    __typename: "feature_intersections";
    id: number;
    source_layer: string;
    intersection_id: number;
    component_id: number;
    geometry: unknown;
  }>;
  feature_signals: Array<{
    __typename: "feature_signals";
    id: number;
    component_id: number;
    location_name: string;
    signal_id: number;
    signal_type: string;
    knack_id: string;
    geometry: unknown;
  }>;
  feature_drawn_lines: Array<{
    __typename: "feature_drawn_lines";
    id: number;
    source_layer: string;
    component_id: number;
    geometry: unknown;
  }>;
  feature_drawn_points: Array<{
    __typename: "feature_drawn_points";
    id: number;
    source_layer: string;
    component_id: number;
    geometry: unknown;
  }>;
  feature_school_beacons: Array<{
    __typename: "feature_school_beacons";
    id: number;
    component_id: number;
    knack_id: string;
    location_name: string;
    beacon_id: string;
    school_zone_beacon_id: string;
    zone_name: string;
    beacon_name: string;
    geometry: unknown;
  }>;
} & { " $fragmentName"?: "ProjectComponentFieldsFragment" };

export type GetProjectComponentsQueryVariables = Exact<{
  projectId: number;
  parentProjectId?: number | null | undefined;
}>;

export type GetProjectComponentsQuery = {
  moped_proj_components: Array<
    { __typename: "moped_proj_components" } & {
      " $fragmentRefs"?: {
        ProjectComponentFieldsFragment: ProjectComponentFieldsFragment;
      };
    }
  >;
  project_geography: Array<{
    __typename: "project_geography";
    component_id: number | null;
    attributes: unknown;
    council_districts: Array<number> | null;
    length_feet: number | null;
    geometry: unknown;
  }>;
  parentProjectComponents: Array<
    { __typename: "moped_proj_components" } & {
      " $fragmentRefs"?: {
        ProjectComponentFieldsFragment: ProjectComponentFieldsFragment;
      };
    }
  >;
  siblingProjects: Array<{
    __typename: "moped_project";
    moped_proj_components: Array<
      { __typename: "moped_proj_components" } & {
        " $fragmentRefs"?: {
          ProjectComponentFieldsFragment: ProjectComponentFieldsFragment;
        };
      }
    >;
  }>;
  childProjects: Array<{
    __typename: "moped_project";
    moped_proj_components: Array<
      { __typename: "moped_proj_components" } & {
        " $fragmentRefs"?: {
          ProjectComponentFieldsFragment: ProjectComponentFieldsFragment;
        };
      }
    >;
  }>;
};

export type UpdateProjectComponentMutationVariables = Exact<{
  projectComponentId: number;
  componentId: number;
  description?: string | null | undefined;
  subcomponents:
    | Array<Moped_Proj_Components_Subcomponents_Insert_Input>
    | Moped_Proj_Components_Subcomponents_Insert_Input;
  workTypes:
    | Array<Moped_Proj_Component_Work_Types_Insert_Input>
    | Moped_Proj_Component_Work_Types_Insert_Input;
  signalsToCreate:
    Array<Feature_Signals_Insert_Input> | Feature_Signals_Insert_Input;
  schoolBeaconsToCreate:
    | Array<Feature_School_Beacons_Insert_Input>
    | Feature_School_Beacons_Insert_Input;
  featureIdsToDelete: Array<number> | number;
  phaseId?: number | null | undefined;
  subphaseId?: number | null | undefined;
  completionDate?: unknown;
  componentTags:
    | Array<Moped_Proj_Component_Tags_Insert_Input>
    | Moped_Proj_Component_Tags_Insert_Input;
  srtsId?: string | null | undefined;
  locationDescription?: string | null | undefined;
}>;

export type UpdateProjectComponentMutation = {
  update_moped_proj_components_subcomponents: {
    __typename: "moped_proj_components_subcomponents_mutation_response";
    affected_rows: number;
  } | null;
  update_moped_proj_component_work_types: {
    __typename: "moped_proj_component_work_types_mutation_response";
    affected_rows: number;
  } | null;
  update_moped_proj_component_tags: {
    __typename: "moped_proj_component_tags_mutation_response";
    affected_rows: number;
  } | null;
  update_moped_proj_components_by_pk: {
    __typename: "moped_proj_components";
    project_component_id: number;
  } | null;
  insert_moped_proj_components_subcomponents: {
    __typename: "moped_proj_components_subcomponents_mutation_response";
    affected_rows: number;
  } | null;
  insert_moped_proj_component_work_types: {
    __typename: "moped_proj_component_work_types_mutation_response";
    affected_rows: number;
  } | null;
  insert_feature_signals: {
    __typename: "feature_signals_mutation_response";
    affected_rows: number;
  } | null;
  insert_moped_proj_component_tags: {
    __typename: "moped_proj_component_tags_mutation_response";
    affected_rows: number;
  } | null;
  insert_feature_school_beacons: {
    __typename: "feature_school_beacons_mutation_response";
    affected_rows: number;
  } | null;
  update_features: {
    __typename: "features_mutation_response";
    affected_rows: number;
  } | null;
};

export type UpdateComponentFeaturesMutationVariables = Exact<{
  updates: Array<Features_Updates> | Features_Updates;
  streetSegments:
    | Array<Feature_Street_Segments_Insert_Input>
    | Feature_Street_Segments_Insert_Input;
  intersections:
    | Array<Feature_Intersections_Insert_Input>
    | Feature_Intersections_Insert_Input;
  signals: Array<Feature_Signals_Insert_Input> | Feature_Signals_Insert_Input;
  drawnLines:
    Array<Feature_Drawn_Lines_Insert_Input> | Feature_Drawn_Lines_Insert_Input;
  drawnPoints:
    | Array<Feature_Drawn_Points_Insert_Input>
    | Feature_Drawn_Points_Insert_Input;
  drawnLinesDragUpdates:
    Array<Feature_Drawn_Lines_Updates> | Feature_Drawn_Lines_Updates;
  drawnPointsDragUpdates:
    Array<Feature_Drawn_Points_Updates> | Feature_Drawn_Points_Updates;
  schoolBeacons:
    | Array<Feature_School_Beacons_Insert_Input>
    | Feature_School_Beacons_Insert_Input;
}>;

export type UpdateComponentFeaturesMutation = {
  insert_feature_street_segments: {
    __typename: "feature_street_segments_mutation_response";
    affected_rows: number;
  } | null;
  insert_feature_intersections: {
    __typename: "feature_intersections_mutation_response";
    affected_rows: number;
  } | null;
  insert_feature_signals: {
    __typename: "feature_signals_mutation_response";
    affected_rows: number;
  } | null;
  insert_feature_drawn_lines: {
    __typename: "feature_drawn_lines_mutation_response";
    affected_rows: number;
  } | null;
  insert_feature_drawn_points: {
    __typename: "feature_drawn_points_mutation_response";
    affected_rows: number;
  } | null;
  update_features_many: Array<{
    __typename: "features_mutation_response";
    affected_rows: number;
  } | null> | null;
  update_feature_drawn_lines_many: Array<{
    __typename: "feature_drawn_lines_mutation_response";
    affected_rows: number;
  } | null> | null;
  update_feature_drawn_points_many: Array<{
    __typename: "feature_drawn_points_mutation_response";
    affected_rows: number;
  } | null> | null;
  insert_feature_school_beacons: {
    __typename: "feature_school_beacons_mutation_response";
    affected_rows: number;
  } | null;
};

export type DeleteMopedComponentMutationVariables = Exact<{
  projectComponentId: number;
}>;

export type DeleteMopedComponentMutation = {
  update_moped_proj_components_by_pk: {
    __typename: "moped_proj_components";
    project_component_id: number;
  } | null;
  update_moped_proj_components_subcomponents: {
    __typename: "moped_proj_components_subcomponents_mutation_response";
    affected_rows: number;
  } | null;
};

export type UpdateComponentAttributesMutationVariables = Exact<{
  componentId: number;
  projectId: number;
}>;

export type UpdateComponentAttributesMutation = {
  update_moped_proj_components_by_pk: {
    __typename: "moped_proj_components";
    project_component_id: number;
  } | null;
};

export type AddProjectMutationVariables = Exact<{
  object: Moped_Project_Insert_Input;
}>;

export type AddProjectMutation = {
  insert_moped_project_one: {
    __typename: "moped_project";
    added_by: number | null;
    project_id: number;
    project_name: string;
    project_description: string;
    ecapris_subproject_id: string | null;
    moped_proj_phases: Array<{
      __typename: "moped_proj_phases";
      phase_id: number;
      is_current_phase: boolean | null;
    }>;
  } | null;
};

export type ProjectSummaryQueryVariables = Exact<{
  projectId?: number | null | undefined;
  userId?: number | null | undefined;
}>;

export type ProjectSummaryQuery = {
  moped_project: Array<{
    __typename: "moped_project";
    project_id: number;
    project_name: string;
    project_name_secondary: string | null;
    project_name_full: string | null;
    project_description: string;
    ecapris_subproject_id: string | null;
    knack_project_id: string | null;
    project_sponsor: number | null;
    project_lead_id: number | null;
    project_website: string | null;
    parent_project_id: number | null;
    interim_project_id: number | null;
    is_deleted: boolean;
    should_sync_ecapris_statuses: boolean;
    should_sync_ecapris_funding: boolean;
    moped_project: {
      __typename: "moped_project";
      project_name: string;
      project_name_full: string | null;
    } | null;
    moped_proj_components: Array<{
      __typename: "moped_proj_components";
      feature_signals: Array<{
        __typename: "feature_signals";
        signal_id: number;
        knack_id: string;
        id: number;
      }>;
    }>;
    moped_entity: {
      __typename: "moped_entity";
      entity_name: string;
      entity_id: number;
    } | null;
    moped_project_lead: {
      __typename: "moped_entity";
      entity_name: string;
      entity_id: number;
    } | null;
    moped_proj_phases: Array<{
      __typename: "moped_proj_phases";
      moped_phase: {
        __typename: "moped_phases";
        phase_id: number;
        phase_name: string;
        phase_key: string;
      };
    }>;
    moped_public_process_statuses: {
      __typename: "moped_public_process_statuses";
      id: number;
      name: string;
    } | null;
    project_list_view: {
      __typename: "project_list_view";
      project_id: number | null;
      project_status_update: string | null;
      project_status_update_date_created: unknown;
      project_status_update_author: string | null;
    } | null;
  }>;
  moped_proj_partners: Array<{
    __typename: "moped_proj_partners";
    proj_partner_id: number;
    project_id: number;
    entity_id: number;
    moped_entity: {
      __typename: "moped_entity";
      entity_name: string;
      entity_id: number;
    };
  }>;
  moped_phases: Array<{
    __typename: "moped_phases";
    phase_id: number;
    phase_name: string;
    phase_order: number | null;
  }>;
  moped_entity: Array<{
    __typename: "moped_entity";
    entity_id: number;
    entity_name: string;
  }>;
  moped_note_types: Array<{
    __typename: "moped_note_types";
    id: number;
    name: string;
    slug: string;
    source: string;
  }>;
  moped_public_process_statuses: Array<{
    __typename: "moped_public_process_statuses";
    id: number;
    name: string;
  }>;
  moped_user_followed_projects: Array<{
    __typename: "moped_user_followed_projects";
    project_id: number;
    user_id: number;
  }>;
  project_geography: Array<{
    __typename: "project_geography";
    attributes: unknown;
    council_districts: Array<number> | null;
    geometry: unknown;
  }>;
  moped_proj_components: Array<
    { __typename: "moped_proj_components" } & {
      " $fragmentRefs"?: {
        ProjectComponentFieldsFragment: ProjectComponentFieldsFragment;
      };
    }
  >;
  childProjects: Array<{
    __typename: "moped_project";
    project_geography: Array<{
      __typename: "project_geography";
      council_districts: Array<number> | null;
    }>;
    moped_proj_components: Array<
      { __typename: "moped_proj_components" } & {
        " $fragmentRefs"?: {
          ProjectComponentFieldsFragment: ProjectComponentFieldsFragment;
        };
      }
    >;
  }>;
  ecapris_subproject_funding: Array<{
    __typename: "ecapris_subproject_funding";
    ecapris_subproject_id: string;
    subproject_name: string;
  }>;
};

export type TeamQueryQueryVariables = Exact<{
  projectId: number;
}>;

export type TeamQueryQuery = {
  moped_project_by_pk: {
    __typename: "moped_project";
    project_id: number;
    moped_proj_personnel: Array<{
      __typename: "moped_proj_personnel";
      notes: string | null;
      project_personnel_id: number;
      created_at: unknown;
      created_by_user_id: number | null;
      is_deleted: boolean;
      moped_user: {
        __typename: "moped_users";
        first_name: string;
        last_name: string;
        user_id: number;
        is_deleted: boolean;
        email: unknown;
        moped_workgroup: {
          __typename: "moped_workgroup";
          workgroup_id: number;
          workgroup_name: string;
        } | null;
      };
      moped_proj_personnel_roles: Array<{
        __typename: "moped_proj_personnel_roles";
        id: number;
        project_personnel_id: number;
        project_role_id: number;
        moped_project_role: {
          __typename: "moped_project_roles";
          project_role_id: number;
          project_role_name: string;
          project_role_description: string | null;
        };
      }>;
    }>;
  } | null;
  moped_project_roles: Array<{
    __typename: "moped_project_roles";
    project_role_id: number;
    project_role_name: string;
    project_role_description: string | null;
  }>;
  moped_users: Array<{
    __typename: "moped_users";
    first_name: string;
    last_name: string;
    workgroup_id: number | null;
    user_id: number;
    is_deleted: boolean;
    email: unknown;
  }>;
  moped_workgroup: Array<{
    __typename: "moped_workgroup";
    workgroup_id: number;
    workgroup_name: string;
  }>;
};

export type InserProjectPersonnelMutationVariables = Exact<{
  object: Moped_Proj_Personnel_Insert_Input;
}>;

export type InserProjectPersonnelMutation = {
  insert_moped_proj_personnel_one: {
    __typename: "moped_proj_personnel";
    project_personnel_id: number;
  } | null;
};

export type UpdateProjectPersonnelMutationVariables = Exact<{
  deleteIds?: Array<number> | number | null | undefined;
  id: number;
  updatePersonnelObject: Moped_Proj_Personnel_Set_Input;
  addRolesObjects:
    | Array<Moped_Proj_Personnel_Roles_Insert_Input>
    | Moped_Proj_Personnel_Roles_Insert_Input;
}>;

export type UpdateProjectPersonnelMutation = {
  update_moped_proj_personnel_by_pk: {
    __typename: "moped_proj_personnel";
    project_personnel_id: number;
  } | null;
  update_moped_proj_personnel_roles: {
    __typename: "moped_proj_personnel_roles_mutation_response";
    affected_rows: number;
  } | null;
  insert_moped_proj_personnel_roles: {
    __typename: "moped_proj_personnel_roles_mutation_response";
    affected_rows: number;
  } | null;
};

export type DeleteProjectPersonnelMutationVariables = Exact<{
  id: number;
}>;

export type DeleteProjectPersonnelMutation = {
  update_moped_proj_personnel_by_pk: {
    __typename: "moped_proj_personnel";
    is_deleted: boolean;
    project_personnel_id: number;
  } | null;
};

export type TeamTimelineQueryVariables = Exact<{
  projectId?: number | null | undefined;
}>;

export type TeamTimelineQuery = {
  moped_phases: Array<{
    __typename: "moped_phases";
    phase_id: number;
    phase_name: string;
    phase_order: number | null;
    moped_subphases: Array<{
      __typename: "moped_subphases";
      subphase_name: string;
      subphase_id: number;
    }>;
  }>;
  moped_subphases: Array<{
    __typename: "moped_subphases";
    subphase_name: string;
    subphase_id: number;
  }>;
  moped_proj_phases: Array<{
    __typename: "moped_proj_phases";
    project_phase_id: number;
    is_current_phase: boolean | null;
    project_id: number;
    phase_start: unknown;
    phase_end: unknown;
    phase_id: number;
    subphase_id: number | null;
    is_phase_start_confirmed: boolean;
    is_phase_end_confirmed: boolean;
    phase_description: string | null;
    moped_subphase: {
      __typename: "moped_subphases";
      subphase_id: number;
      subphase_name: string;
    } | null;
    moped_phase: {
      __typename: "moped_phases";
      phase_id: number;
      phase_name: string;
    };
  }>;
  moped_milestones: Array<{
    __typename: "moped_milestones";
    milestone_id: number;
    milestone_name: string;
    related_phase_id: number | null;
  }>;
  moped_proj_milestones: Array<{
    __typename: "moped_proj_milestones";
    milestone_id: number;
    description: string | null;
    date_estimate: unknown;
    date_actual: unknown;
    completed: boolean | null;
    project_milestone_id: number;
    project_id: number;
    moped_milestone: {
      __typename: "moped_milestones";
      milestone_id: number;
      milestone_name: string;
      related_phase_id: number | null;
    };
  }>;
  project_list_view: Array<{
    __typename: "project_list_view";
    substantial_completion_date: unknown;
    project_id: number | null;
  }>;
  moped_note_types: Array<{
    __typename: "moped_note_types";
    id: number;
    name: string;
    slug: string;
  }>;
};

export type AddProjectPhaseMutationVariables = Exact<{
  objects:
    Array<Moped_Proj_Phases_Insert_Input> | Moped_Proj_Phases_Insert_Input;
  current_phase_id_to_clear?: Array<number> | number | null | undefined;
}>;

export type AddProjectPhaseMutation = {
  update_moped_proj_phases: {
    __typename: "moped_proj_phases_mutation_response";
    affected_rows: number;
  } | null;
  insert_moped_proj_phases: {
    __typename: "moped_proj_phases_mutation_response";
    returning: Array<{
      __typename: "moped_proj_phases";
      phase_id: number;
      phase_description: string | null;
      phase_start: unknown;
      phase_end: unknown;
      project_phase_id: number;
      is_current_phase: boolean | null;
      project_id: number;
    }>;
  } | null;
};

export type AddProjectPhaseWithStatusUpdateMutationVariables = Exact<{
  objects:
    Array<Moped_Proj_Phases_Insert_Input> | Moped_Proj_Phases_Insert_Input;
  current_phase_id_to_clear?: Array<number> | number | null | undefined;
  noteObjects:
    Array<Moped_Proj_Notes_Insert_Input> | Moped_Proj_Notes_Insert_Input;
}>;

export type AddProjectPhaseWithStatusUpdateMutation = {
  update_moped_proj_phases: {
    __typename: "moped_proj_phases_mutation_response";
    affected_rows: number;
  } | null;
  insert_moped_proj_phases: {
    __typename: "moped_proj_phases_mutation_response";
    returning: Array<{
      __typename: "moped_proj_phases";
      phase_id: number;
      phase_description: string | null;
      phase_start: unknown;
      phase_end: unknown;
      project_phase_id: number;
      is_current_phase: boolean | null;
      project_id: number;
    }>;
  } | null;
  insert_moped_proj_notes: {
    __typename: "moped_proj_notes_mutation_response";
    returning: Array<{
      __typename: "moped_proj_notes";
      project_id: number;
      project_note: string;
    }>;
  } | null;
};

export type ProjectPhasesMutationMutationVariables = Exact<{
  project_phase_id: number;
  object: Moped_Proj_Phases_Set_Input;
  current_phase_id_to_clear?: Array<number> | number | null | undefined;
  noteObjects:
    Array<Moped_Proj_Notes_Insert_Input> | Moped_Proj_Notes_Insert_Input;
}>;

export type ProjectPhasesMutationMutation = {
  update_moped_proj_phases: {
    __typename: "moped_proj_phases_mutation_response";
    affected_rows: number;
  } | null;
  update_moped_proj_phases_by_pk: {
    __typename: "moped_proj_phases";
    project_id: number;
    project_phase_id: number;
    phase_id: number;
    phase_start: unknown;
    phase_end: unknown;
    subphase_id: number | null;
    is_current_phase: boolean | null;
    phase_description: string | null;
  } | null;
  insert_moped_proj_notes: {
    __typename: "moped_proj_notes_mutation_response";
    returning: Array<{
      __typename: "moped_proj_notes";
      project_id: number;
      project_note: string;
    }>;
  } | null;
};

export type DeleteProjectPhaseMutationVariables = Exact<{
  project_phase_id: number;
}>;

export type DeleteProjectPhaseMutation = {
  update_moped_proj_phases: {
    __typename: "moped_proj_phases_mutation_response";
    affected_rows: number;
  } | null;
};

export type ProjectMilestonesMutationMutationVariables = Exact<{
  description?: string | null | undefined;
  completed?: boolean | null | undefined;
  date_estimate?: unknown;
  date_actual?: unknown;
  project_milestone_id: number;
  milestone_id: number;
}>;

export type ProjectMilestonesMutationMutation = {
  update_moped_proj_milestones_by_pk: {
    __typename: "moped_proj_milestones";
    project_id: number;
    project_milestone_id: number;
    date_estimate: unknown;
    date_actual: unknown;
    completed: boolean | null;
    description: string | null;
  } | null;
};

export type DeleteProjectMilestoneMutationVariables = Exact<{
  project_milestone_id: number;
}>;

export type DeleteProjectMilestoneMutation = {
  update_moped_proj_milestones: {
    __typename: "moped_proj_milestones_mutation_response";
    affected_rows: number;
  } | null;
};

export type AddProjectMilestoneMutationVariables = Exact<{
  objects:
    | Array<Moped_Proj_Milestones_Insert_Input>
    | Moped_Proj_Milestones_Insert_Input;
}>;

export type AddProjectMilestoneMutation = {
  insert_moped_proj_milestones: {
    __typename: "moped_proj_milestones_mutation_response";
    returning: Array<{
      __typename: "moped_proj_milestones";
      milestone_id: number;
      description: string | null;
      date_estimate: unknown;
      date_actual: unknown;
      completed: boolean | null;
      project_milestone_id: number;
      project_id: number;
    }>;
  } | null;
};

export type FollowProjectMutationVariables = Exact<{
  object: Moped_User_Followed_Projects_Insert_Input;
}>;

export type FollowProjectMutation = {
  insert_moped_user_followed_projects_one: {
    __typename: "moped_user_followed_projects";
    project_id: number;
    user_id: number;
  } | null;
};

export type UnfollowProjectMutationVariables = Exact<{
  project_id: number;
  user_id: number;
}>;

export type UnfollowProjectMutation = {
  delete_moped_user_followed_projects: {
    __typename: "moped_user_followed_projects_mutation_response";
    affected_rows: number;
  } | null;
};

export type GetMopedProjectChangesQueryVariables = Exact<{
  projectId: number;
}>;

export type GetMopedProjectChangesQuery = {
  moped_activity_log: Array<{
    __typename: "moped_activity_log";
    activity_id: unknown;
    created_at: unknown;
    record_project_id: number | null;
    record_type: string;
    description: unknown;
    operation_type: string | null;
    record_data: unknown;
    updated_by_user: {
      __typename: "moped_users";
      first_name: string;
      last_name: string;
      picture: string | null;
      email: unknown;
      user_id: number;
    } | null;
  }>;
  moped_users: Array<{
    __typename: "moped_users";
    first_name: string;
    last_name: string;
    user_id: number;
    email: unknown;
  }>;
  moped_phases: Array<{
    __typename: "moped_phases";
    phase_id: number;
    phase_name: string;
  }>;
  moped_subphases: Array<{
    __typename: "moped_subphases";
    subphase_id: number;
    subphase_name: string;
  }>;
  moped_milestones: Array<{
    __typename: "moped_milestones";
    milestone_id: number;
    milestone_name: string;
  }>;
  moped_tags: Array<{ __typename: "moped_tags"; name: string; id: number }>;
  moped_entity: Array<{
    __typename: "moped_entity";
    entity_id: number;
    entity_name: string;
  }>;
  moped_fund_sources: Array<{
    __typename: "moped_fund_sources";
    funding_source_id: number;
    funding_source_name: string;
  }>;
  moped_fund_programs: Array<{
    __typename: "moped_fund_programs";
    funding_program_id: number;
    funding_program_name: string;
  }>;
  moped_fund_status: Array<{
    __typename: "moped_fund_status";
    funding_status_id: number;
    funding_status_name: string;
  }>;
  moped_public_process_statuses: Array<{
    __typename: "moped_public_process_statuses";
    id: number;
    name: string;
  }>;
  moped_components: Array<{
    __typename: "moped_components";
    component_id: number;
    component_name: string;
    component_subtype: string | null;
  }>;
  deprecated_moped_types: Array<{
    __typename: "deprecated_moped_types";
    type_id: number;
    type_name: string;
  }>;
  activity_log_lookup_tables: Array<{
    __typename: "moped_activity_log";
    record_type: string;
  }>;
};

export type GetMopedProjectChangeDetailsQueryVariables = Exact<{
  activityId: unknown;
}>;

export type GetMopedProjectChangeDetailsQuery = {
  moped_activity_log: Array<{
    __typename: "moped_activity_log";
    activity_id: unknown;
    created_at: unknown;
    record_project_id: number | null;
    record_type: string;
    record_data: unknown;
    description: unknown;
    operation_type: string | null;
    moped_user: {
      __typename: "moped_users";
      first_name: string;
      last_name: string;
      user_id: number;
    } | null;
    updated_by_user: {
      __typename: "moped_users";
      first_name: string;
      last_name: string;
      picture: string | null;
      email: unknown;
      user_id: number;
    } | null;
  }>;
  activity_log_lookup_tables: Array<{
    __typename: "moped_activity_log";
    record_type: string;
  }>;
};

export type MopedProjectFilesQueryVariables = Exact<{
  projectId: number;
}>;

export type MopedProjectFilesQuery = {
  moped_project_files: Array<{
    __typename: "moped_project_files";
    project_file_id: number;
    project_id: number;
    file_key: string | null;
    file_name: string;
    file_type: number;
    file_description: string | null;
    file_size: number;
    file_metadata: unknown;
    created_at: unknown;
    created_by_user_id: number;
    file_url: string | null;
    moped_user: {
      __typename: "moped_users";
      user_id: number;
      first_name: string;
      last_name: string;
    };
  }>;
  moped_file_types: Array<{
    __typename: "moped_file_types";
    id: number;
    name: string;
  }>;
};

export type UpdateProjectFileAttachmentMutationVariables = Exact<{
  fileId: number;
  fileName: string;
  fileType: number;
  fileDescription?: string | null | undefined;
  fileUrl?: string | null | undefined;
}>;

export type UpdateProjectFileAttachmentMutation = {
  update_moped_project_files: {
    __typename: "moped_project_files_mutation_response";
    affected_rows: number;
  } | null;
};

export type DeleteProjectFileAttachmentMutationVariables = Exact<{
  fileId: number;
}>;

export type DeleteProjectFileAttachmentMutation = {
  update_moped_project_files: {
    __typename: "moped_project_files_mutation_response";
    affected_rows: number;
  } | null;
  update_files_ecapris_funding: {
    __typename: "files_ecapris_funding_mutation_response";
    affected_rows: number;
  } | null;
  update_files_project_funding: {
    __typename: "files_project_funding_mutation_response";
    affected_rows: number;
  } | null;
};

export type Insert_Single_ArticleMutationVariables = Exact<{
  object: Moped_Project_Files_Insert_Input;
}>;

export type Insert_Single_ArticleMutation = {
  insert_moped_project_files: {
    __typename: "moped_project_files_mutation_response";
    affected_rows: number;
  } | null;
};

export type InsertFileWithEcaprisConnectionMutationVariables = Exact<{
  object: Moped_Project_Files_Insert_Input;
}>;

export type InsertFileWithEcaprisConnectionMutation = {
  insert_moped_project_files_one: {
    __typename: "moped_project_files";
    project_file_id: number;
    files_ecapris_fundings: Array<{
      __typename: "files_ecapris_funding";
      id: number;
    }>;
  } | null;
};

export type DetachFileEcaprisFundingMutationVariables = Exact<{
  id: number;
}>;

export type DetachFileEcaprisFundingMutation = {
  update_files_ecapris_funding_by_pk: {
    __typename: "files_ecapris_funding";
    id: number;
  } | null;
};

export type InsertFileWithMopedFundingConnectionMutationVariables = Exact<{
  object: Moped_Project_Files_Insert_Input;
}>;

export type InsertFileWithMopedFundingConnectionMutation = {
  insert_moped_project_files_one: {
    __typename: "moped_project_files";
    project_file_id: number;
    files_project_fundings: Array<{
      __typename: "files_project_funding";
      id: number;
    }>;
  } | null;
};

export type DetachFileMopedFundingMutationVariables = Exact<{
  id: number;
}>;

export type DetachFileMopedFundingMutation = {
  update_files_project_funding_by_pk: {
    __typename: "files_project_funding";
    id: number;
  } | null;
};

export type AttachExistingFileToEcaprisFundingMutationVariables = Exact<{
  object: Files_Ecapris_Funding_Insert_Input;
}>;

export type AttachExistingFileToEcaprisFundingMutation = {
  insert_files_ecapris_funding_one: {
    __typename: "files_ecapris_funding";
    id: number;
  } | null;
};

export type AttachExistingFileToMopedFundingMutationVariables = Exact<{
  object: Files_Project_Funding_Insert_Input;
}>;

export type AttachExistingFileToMopedFundingMutation = {
  insert_files_project_funding_one: {
    __typename: "files_project_funding";
    id: number;
  } | null;
};

export type ArchiveMopedProjectMutationVariables = Exact<{
  projectId: number;
}>;

export type ArchiveMopedProjectMutation = {
  update_moped_project: {
    __typename: "moped_project_mutation_response";
    affected_rows: number;
  } | null;
  clear_parent_project: {
    __typename: "moped_project_mutation_response";
    affected_rows: number;
  } | null;
};

export type GetSignalComponentsQueryVariables = Exact<{ [key: string]: never }>;

export type GetSignalComponentsQuery = {
  moped_components: Array<{
    __typename: "moped_components";
    component_name: string;
    component_subtype: string | null;
    component_id: number;
    line_representation: boolean;
  }>;
};

export type ProjectStatusUpdateInsertMutationVariables = Exact<{
  statusUpdate:
    Array<Moped_Proj_Notes_Insert_Input> | Moped_Proj_Notes_Insert_Input;
}>;

export type ProjectStatusUpdateInsertMutation = {
  insert_moped_proj_notes: {
    __typename: "moped_proj_notes_mutation_response";
    affected_rows: number;
  } | null;
};

export type ProjectUpdateSponsorMutationVariables = Exact<{
  projectId: number;
  fieldValueId?: number | null | undefined;
}>;

export type ProjectUpdateSponsorMutation = {
  update_moped_project_by_pk: {
    __typename: "moped_project";
    project_sponsor: number | null;
  } | null;
};

export type ProjectUpdateLeadMutationVariables = Exact<{
  projectId: number;
  fieldValueId?: number | null | undefined;
}>;

export type ProjectUpdateLeadMutation = {
  update_moped_project_by_pk: {
    __typename: "moped_project";
    project_lead_id: number | null;
  } | null;
};

export type ProjectUpdatePublicProcessMutationVariables = Exact<{
  projectId: number;
  fieldValueId?: number | null | undefined;
}>;

export type ProjectUpdatePublicProcessMutation = {
  update_moped_project_by_pk: {
    __typename: "moped_project";
    public_process_status_id: number | null;
  } | null;
};

export type UpdateMopedProjectPartnersMutationVariables = Exact<{
  partners:
    Array<Moped_Proj_Partners_Insert_Input> | Moped_Proj_Partners_Insert_Input;
  deleteList: Array<number> | number;
}>;

export type UpdateMopedProjectPartnersMutation = {
  insert_moped_proj_partners: {
    __typename: "moped_proj_partners_mutation_response";
    affected_rows: number;
  } | null;
  update_moped_proj_partners: {
    __typename: "moped_proj_partners_mutation_response";
    affected_rows: number;
  } | null;
};

export type UpdateProjectWebsiteMutationVariables = Exact<{
  projectId: number;
  website?: string | null | undefined;
}>;

export type UpdateProjectWebsiteMutation = {
  update_moped_project: {
    __typename: "moped_project_mutation_response";
    affected_rows: number;
  } | null;
};

export type UpdateProjectDescriptionMutationVariables = Exact<{
  projectId: number;
  description: string;
}>;

export type UpdateProjectDescriptionMutation = {
  update_moped_project: {
    __typename: "moped_project_mutation_response";
    affected_rows: number;
  } | null;
};

export type UpdateProjectECaprisMutationVariables = Exact<{
  projectId: number;
  eCaprisSubprojectId?: string | null | undefined;
}>;

export type UpdateProjectECaprisMutation = {
  update_moped_project: {
    __typename: "moped_project_mutation_response";
    affected_rows: number;
  } | null;
};

export type UpdateProjectECaprisClearMutationVariables = Exact<{
  projectId: number;
}>;

export type UpdateProjectECaprisClearMutation = {
  update_moped_project: {
    __typename: "moped_project_mutation_response";
    affected_rows: number;
  } | null;
};

export type UpdateProjectInterimIdMutationVariables = Exact<{
  projectId: number;
  interimProjectId?: number | null | undefined;
}>;

export type UpdateProjectInterimIdMutation = {
  update_moped_project_by_pk: {
    __typename: "moped_project";
    interim_project_id: number | null;
  } | null;
};

export type ClearProjectInterimIdMutationVariables = Exact<{
  projectId: number;
}>;

export type ClearProjectInterimIdMutation = {
  update_moped_project_by_pk: {
    __typename: "moped_project";
    interim_project_id: number | null;
  } | null;
};

export type UpdateProjectECaprisSyncMutationVariables = Exact<{
  projectId: number;
  shouldSync: boolean;
}>;

export type UpdateProjectECaprisSyncMutation = {
  update_moped_project: {
    __typename: "moped_project_mutation_response";
    affected_rows: number;
  } | null;
};

export type UpdateProjectECaprisFundingSyncMutationVariables = Exact<{
  projectId: number;
  shouldSync: boolean;
}>;

export type UpdateProjectECaprisFundingSyncMutation = {
  update_moped_project: {
    __typename: "moped_project_mutation_response";
    affected_rows: number;
  } | null;
};

export type UpdateProjectNameMutationVariables = Exact<{
  projectId: number;
  projectName: string;
  projectNameSecondary?: string | null | undefined;
}>;

export type UpdateProjectNameMutation = {
  update_moped_project_by_pk: {
    __typename: "moped_project";
    project_name: string;
    project_name_secondary: string | null;
  } | null;
};

export type ProjectLookupsQueryVariables = Exact<{ [key: string]: never }>;

export type ProjectLookupsQuery = {
  moped_fund_sources: Array<{
    __typename: "moped_fund_sources";
    funding_source_id: number;
    funding_source_name: string;
  }>;
  moped_fund_programs: Array<{
    __typename: "moped_fund_programs";
    funding_program_id: number;
    funding_program_name: string;
  }>;
  moped_entity: Array<{
    __typename: "moped_entity";
    entity_id: number;
    entity_name: string;
  }>;
  moped_tags: Array<{ __typename: "moped_tags"; name: string; id: number }>;
  moped_public_process_statuses: Array<{
    __typename: "moped_public_process_statuses";
    name: string;
    id: number;
  }>;
  moped_users: Array<{
    __typename: "moped_users";
    first_name: string;
    last_name: string;
    user_id: number;
  }>;
  moped_phases: Array<{
    __typename: "moped_phases";
    phase_id: number;
    phase_name: string;
  }>;
  moped_components: Array<{
    __typename: "moped_components";
    component_id: number;
    component_name_full: string | null;
  }>;
  layer_council_district: Array<{
    __typename: "layer_council_district";
    id: number;
    council_district: number;
  }>;
  moped_work_types: Array<{
    __typename: "moped_work_types";
    id: number;
    name: string;
  }>;
};

export type ProjectOptionsQueryVariables = Exact<{
  projectId: number;
}>;

export type ProjectOptionsQuery = {
  moped_project: Array<{
    __typename: "moped_project";
    project_id: number;
    project_name_full: string | null;
  }>;
};

export type GetProjectsComponentsQueryVariables = Exact<{
  projectIds?: Array<number> | number | null | undefined;
}>;

export type GetProjectsComponentsQuery = {
  project_geography: Array<{
    __typename: "project_geography";
    project_id: number | null;
    project_name: string | null;
    component_id: number | null;
    geography: unknown;
    attributes: unknown;
    component_name: string | null;
    line_representation: boolean | null;
  }>;
};

export const ProjectComponentFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "projectComponentFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "moped_proj_components" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "project_component_id" },
          },
          { kind: "Field", name: { kind: "Name", value: "component_id" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "phase_id" } },
          { kind: "Field", name: { kind: "Name", value: "subphase_id" } },
          { kind: "Field", name: { kind: "Name", value: "completion_date" } },
          { kind: "Field", name: { kind: "Name", value: "project_id" } },
          { kind: "Field", name: { kind: "Name", value: "srts_id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "location_description" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_components" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_subtype" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "feature_layer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "internal_table" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "asset_feature_layer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "internal_table" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "line_representation" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "moped_proj_components_subcomponents",
            },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subcomponent_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_subcomponent" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subcomponent_name" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_proj_component_work_types" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_work_type" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_proj_component_tags" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_tag_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_component_tag" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "full_name" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_phase" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "phase_id" } },
                { kind: "Field", name: { kind: "Name", value: "phase_name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "phase_name_simple" },
                },
                { kind: "Field", name: { kind: "Name", value: "phase_key" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_subphases" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subphase_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subphase_name" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_subphase" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "subphase_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subphase_name" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_street_segments" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "source_layer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "ctn_segment_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_intersections" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "source_layer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "intersection_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_signals" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "location_name" },
                },
                { kind: "Field", name: { kind: "Name", value: "signal_id" } },
                { kind: "Field", name: { kind: "Name", value: "signal_type" } },
                { kind: "Field", name: { kind: "Name", value: "knack_id" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_drawn_lines" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "source_layer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_drawn_points" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "source_layer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_school_beacons" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "knack_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "location_name" },
                },
                { kind: "Field", name: { kind: "Name", value: "beacon_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "school_zone_beacon_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "zone_name" } },
                { kind: "Field", name: { kind: "Name", value: "beacon_name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProjectComponentFieldsFragment, unknown>;
export const GetComponentsFormOptionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetComponentsFormOptions" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_components" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ListValue",
                  values: [
                    {
                      kind: "ObjectValue",
                      fields: [
                        {
                          kind: "ObjectField",
                          name: { kind: "Name", value: "component_name" },
                          value: { kind: "EnumValue", value: "asc" },
                        },
                      ],
                    },
                    {
                      kind: "ObjectValue",
                      fields: [
                        {
                          kind: "ObjectField",
                          name: { kind: "Name", value: "component_subtype" },
                          value: { kind: "EnumValue", value: "asc" },
                        },
                      ],
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_subtype" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "line_representation" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "feature_layer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "internal_table" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "asset_feature_layer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "internal_table" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: {
                    kind: "Name",
                    value: "moped_components_subcomponents",
                  },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "order_by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "moped_subcomponent" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: {
                                    kind: "Name",
                                    value: "subcomponent_name",
                                  },
                                  value: { kind: "EnumValue", value: "asc" },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "moped_subcomponent" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "subcomponent_id" },
                            },
                            {
                              kind: "Field",
                              name: {
                                kind: "Name",
                                value: "subcomponent_name",
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_component_work_types" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "moped_work_type" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_phases" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "phase_order" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "phase_name" } },
                { kind: "Field", name: { kind: "Name", value: "phase_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "phase_name_simple" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_subphases" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subphase_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subphase_name" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_component_tags" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ListValue",
                  values: [
                    {
                      kind: "ObjectValue",
                      fields: [
                        {
                          kind: "ObjectField",
                          name: { kind: "Name", value: "type" },
                          value: { kind: "EnumValue", value: "asc" },
                        },
                      ],
                    },
                    {
                      kind: "ObjectValue",
                      fields: [
                        {
                          kind: "ObjectField",
                          name: { kind: "Name", value: "name" },
                          value: { kind: "EnumValue", value: "asc" },
                        },
                      ],
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "full_name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetComponentsFormOptionsQuery,
  GetComponentsFormOptionsQueryVariables
>;
export const AddProjectComponentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddProjectComponent" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "object" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "moped_proj_components_insert_input",
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_proj_components_one" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "object" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "object" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AddProjectComponentMutation,
  AddProjectComponentMutationVariables
>;
export const GetProjectComponentsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetProjectComponents" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "parentProjectId" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "0" },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_proj_components" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "projectComponentFields" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "project_geography" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "attributes" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "council_districts" },
                },
                { kind: "Field", name: { kind: "Name", value: "length_feet" } },
              ],
            },
          },
          {
            kind: "Field",
            alias: { kind: "Name", value: "parentProjectComponents" },
            name: { kind: "Name", value: "moped_proj_components" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "parentProjectId" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "projectComponentFields" },
                },
              ],
            },
          },
          {
            kind: "Field",
            alias: { kind: "Name", value: "siblingProjects" },
            name: { kind: "Name", value: "moped_project" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "parent_project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "parentProjectId" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_proj_components" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "where" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "project_id" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_neq" },
                                  value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "projectId" },
                                  },
                                },
                              ],
                            },
                          },
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "is_deleted" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: { kind: "BooleanValue", value: false },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "projectComponentFields" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            alias: { kind: "Name", value: "childProjects" },
            name: { kind: "Name", value: "moped_project" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "parent_project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_proj_components" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "where" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "is_deleted" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: { kind: "BooleanValue", value: false },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "projectComponentFields" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "projectComponentFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "moped_proj_components" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "project_component_id" },
          },
          { kind: "Field", name: { kind: "Name", value: "component_id" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "phase_id" } },
          { kind: "Field", name: { kind: "Name", value: "subphase_id" } },
          { kind: "Field", name: { kind: "Name", value: "completion_date" } },
          { kind: "Field", name: { kind: "Name", value: "project_id" } },
          { kind: "Field", name: { kind: "Name", value: "srts_id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "location_description" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_components" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_subtype" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "feature_layer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "internal_table" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "asset_feature_layer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "internal_table" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "line_representation" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "moped_proj_components_subcomponents",
            },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subcomponent_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_subcomponent" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subcomponent_name" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_proj_component_work_types" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_work_type" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_proj_component_tags" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_tag_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_component_tag" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "full_name" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_phase" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "phase_id" } },
                { kind: "Field", name: { kind: "Name", value: "phase_name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "phase_name_simple" },
                },
                { kind: "Field", name: { kind: "Name", value: "phase_key" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_subphases" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subphase_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subphase_name" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_subphase" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "subphase_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subphase_name" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_street_segments" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "source_layer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "ctn_segment_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_intersections" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "source_layer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "intersection_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_signals" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "location_name" },
                },
                { kind: "Field", name: { kind: "Name", value: "signal_id" } },
                { kind: "Field", name: { kind: "Name", value: "signal_type" } },
                { kind: "Field", name: { kind: "Name", value: "knack_id" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_drawn_lines" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "source_layer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_drawn_points" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "source_layer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_school_beacons" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "knack_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "location_name" },
                },
                { kind: "Field", name: { kind: "Name", value: "beacon_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "school_zone_beacon_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "zone_name" } },
                { kind: "Field", name: { kind: "Name", value: "beacon_name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetProjectComponentsQuery,
  GetProjectComponentsQueryVariables
>;
export const UpdateProjectComponentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProjectComponent" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectComponentId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "componentId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "description" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "subcomponents" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "moped_proj_components_subcomponents_insert_input",
                  },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "workTypes" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "moped_proj_component_work_types_insert_input",
                  },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "signalsToCreate" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "feature_signals_insert_input" },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "schoolBeaconsToCreate" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "feature_school_beacons_insert_input",
                  },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "featureIdsToDelete" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "Int" },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "phaseId" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "subphaseId" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "completionDate" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "timestamptz" },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "componentTags" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "moped_proj_component_tags_insert_input",
                  },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "srtsId" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "locationDescription" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "update_moped_proj_components_subcomponents",
            },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_component_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: {
                                kind: "Name",
                                value: "projectComponentId",
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "update_moped_proj_component_work_types",
            },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_component_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: {
                                kind: "Name",
                                value: "projectComponentId",
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_component_tags" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_component_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: {
                                kind: "Name",
                                value: "projectComponentId",
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_components_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_component_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "projectComponentId" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "component_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "componentId" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "description" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "description" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "phase_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "phaseId" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "subphase_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "subphaseId" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "completion_date" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "completionDate" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "srts_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "srtsId" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "location_description" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "locationDescription" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_component_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "insert_moped_proj_components_subcomponents",
            },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "subcomponents" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "on_conflict" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "constraint" },
                      value: {
                        kind: "EnumValue",
                        value: "unique_component_and_subcomponent",
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "update_columns" },
                      value: {
                        kind: "ListValue",
                        values: [{ kind: "EnumValue", value: "is_deleted" }],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "insert_moped_proj_component_work_types",
            },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "workTypes" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "on_conflict" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "constraint" },
                      value: {
                        kind: "EnumValue",
                        value:
                          "moped_proj_component_work_types_project_component_id_work_type_",
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "update_columns" },
                      value: {
                        kind: "ListValue",
                        values: [{ kind: "EnumValue", value: "is_deleted" }],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_feature_signals" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "signalsToCreate" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_proj_component_tags" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "componentTags" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "on_conflict" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "constraint" },
                      value: {
                        kind: "EnumValue",
                        value: "unique_component_and_tag",
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "update_columns" },
                      value: {
                        kind: "ListValue",
                        values: [{ kind: "EnumValue", value: "is_deleted" }],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_feature_school_beacons" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "schoolBeaconsToCreate" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "update_features" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_in" },
                            value: {
                              kind: "Variable",
                              name: {
                                kind: "Name",
                                value: "featureIdsToDelete",
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProjectComponentMutation,
  UpdateProjectComponentMutationVariables
>;
export const UpdateComponentFeaturesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateComponentFeatures" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "updates" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "features_updates" },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "streetSegments" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "feature_street_segments_insert_input",
                  },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "intersections" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "feature_intersections_insert_input",
                  },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "signals" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "feature_signals_insert_input" },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "drawnLines" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "feature_drawn_lines_insert_input",
                  },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "drawnPoints" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "feature_drawn_points_insert_input",
                  },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "drawnLinesDragUpdates" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "feature_drawn_lines_updates" },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "drawnPointsDragUpdates" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "feature_drawn_points_updates" },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "schoolBeacons" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "feature_school_beacons_insert_input",
                  },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_feature_street_segments" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "streetSegments" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_feature_intersections" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "intersections" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_feature_signals" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "signals" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_feature_drawn_lines" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "drawnLines" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_feature_drawn_points" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "drawnPoints" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "update_features_many" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "updates" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "updates" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "update_feature_drawn_lines_many" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "updates" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "drawnLinesDragUpdates" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "update_feature_drawn_points_many" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "updates" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "drawnPointsDragUpdates" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_feature_school_beacons" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "schoolBeacons" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateComponentFeaturesMutation,
  UpdateComponentFeaturesMutationVariables
>;
export const DeleteMopedComponentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteMopedComponent" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectComponentId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_components_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_component_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "projectComponentId" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_component_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "update_moped_proj_components_subcomponents",
            },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_component_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: {
                                kind: "Name",
                                value: "projectComponentId",
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteMopedComponentMutation,
  DeleteMopedComponentMutationVariables
>;
export const UpdateComponentAttributesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateComponentAttributes" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "componentId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_components_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_component_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "componentId" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "projectId" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_component_id" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateComponentAttributesMutation,
  UpdateComponentAttributesMutationVariables
>;
export const AddProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "object" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "moped_project_insert_input" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_project_one" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "object" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "object" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "added_by" } },
                { kind: "Field", name: { kind: "Name", value: "project_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_description" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "ecapris_subproject_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_proj_phases" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "phase_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "is_current_phase" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AddProjectMutation, AddProjectMutationVariables>;
export const ProjectSummaryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ProjectSummary" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "userId" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_project" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "project_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_name_secondary" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_name_full" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_description" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "ecapris_subproject_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "knack_project_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_sponsor" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_lead_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_website" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "parent_project_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "interim_project_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "is_deleted" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "should_sync_ecapris_statuses" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "should_sync_ecapris_funding" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_project" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_name_full" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_proj_components" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "where" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "is_deleted" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: { kind: "BooleanValue", value: false },
                                },
                              ],
                            },
                          },
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "feature_signals" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "is_deleted" },
                                  value: {
                                    kind: "ObjectValue",
                                    fields: [
                                      {
                                        kind: "ObjectField",
                                        name: { kind: "Name", value: "_eq" },
                                        value: {
                                          kind: "BooleanValue",
                                          value: false,
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "feature_signals" },
                        arguments: [
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "where" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "is_deleted" },
                                  value: {
                                    kind: "ObjectValue",
                                    fields: [
                                      {
                                        kind: "ObjectField",
                                        name: { kind: "Name", value: "_eq" },
                                        value: {
                                          kind: "BooleanValue",
                                          value: false,
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "signal_id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "knack_id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_entity" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "entity_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "entity_id" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_project_lead" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "entity_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "entity_id" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_proj_phases" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "where" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "is_current_phase" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: { kind: "BooleanValue", value: true },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "moped_phase" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "phase_id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "phase_name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "phase_key" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: {
                    kind: "Name",
                    value: "moped_public_process_statuses",
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_list_view" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_status_update" },
                      },
                      {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "project_status_update_date_created",
                        },
                      },
                      {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "project_status_update_author",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_proj_partners" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "proj_partner_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "project_id" } },
                { kind: "Field", name: { kind: "Name", value: "entity_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_entity" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "entity_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "entity_id" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_phases" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "phase_order" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "phase_id" } },
                { kind: "Field", name: { kind: "Name", value: "phase_name" } },
                { kind: "Field", name: { kind: "Name", value: "phase_order" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_entity" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "entity_name" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "entity_id" } },
                { kind: "Field", name: { kind: "Name", value: "entity_name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_note_types" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "source" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_public_process_statuses" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_user_followed_projects" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "user_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "userId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "project_id" } },
                { kind: "Field", name: { kind: "Name", value: "user_id" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "project_geography" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                { kind: "Field", name: { kind: "Name", value: "attributes" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "council_districts" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_proj_components" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "projectComponentFields" },
                },
              ],
            },
          },
          {
            kind: "Field",
            alias: { kind: "Name", value: "childProjects" },
            name: { kind: "Name", value: "moped_project" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "parent_project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_geography" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "where" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "is_deleted" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: { kind: "BooleanValue", value: false },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "council_districts" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_proj_components" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "where" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "is_deleted" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: { kind: "BooleanValue", value: false },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "projectComponentFields" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "ecapris_subproject_funding" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "distinct_on" },
                value: { kind: "EnumValue", value: "ecapris_subproject_id" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "ecapris_subproject_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subproject_name" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "projectComponentFields" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "moped_proj_components" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "project_component_id" },
          },
          { kind: "Field", name: { kind: "Name", value: "component_id" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "phase_id" } },
          { kind: "Field", name: { kind: "Name", value: "subphase_id" } },
          { kind: "Field", name: { kind: "Name", value: "completion_date" } },
          { kind: "Field", name: { kind: "Name", value: "project_id" } },
          { kind: "Field", name: { kind: "Name", value: "srts_id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "location_description" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_components" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_subtype" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "feature_layer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "internal_table" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "asset_feature_layer" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "internal_table" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "line_representation" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "moped_proj_components_subcomponents",
            },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subcomponent_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_subcomponent" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subcomponent_name" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_proj_component_work_types" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_work_type" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_proj_component_tags" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_tag_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_component_tag" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "full_name" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_phase" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "phase_id" } },
                { kind: "Field", name: { kind: "Name", value: "phase_name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "phase_name_simple" },
                },
                { kind: "Field", name: { kind: "Name", value: "phase_key" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_subphases" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subphase_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subphase_name" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_subphase" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "subphase_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subphase_name" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_street_segments" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "source_layer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "ctn_segment_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_intersections" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "source_layer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "intersection_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_signals" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "location_name" },
                },
                { kind: "Field", name: { kind: "Name", value: "signal_id" } },
                { kind: "Field", name: { kind: "Name", value: "signal_type" } },
                { kind: "Field", name: { kind: "Name", value: "knack_id" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_drawn_lines" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "source_layer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_drawn_points" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "source_layer" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "feature_school_beacons" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  alias: { kind: "Name", value: "geometry" },
                  name: { kind: "Name", value: "geography" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "knack_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "location_name" },
                },
                { kind: "Field", name: { kind: "Name", value: "beacon_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "school_zone_beacon_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "zone_name" } },
                { kind: "Field", name: { kind: "Name", value: "beacon_name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProjectSummaryQuery, ProjectSummaryQueryVariables>;
export const TeamQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "TeamQuery" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_project_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "project_id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "projectId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "project_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_proj_personnel" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "where" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "is_deleted" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "_eq" },
                                  value: { kind: "BooleanValue", value: false },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "order_by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: {
                              kind: "Name",
                              value: "project_personnel_id",
                            },
                            value: { kind: "EnumValue", value: "asc" },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "notes" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_personnel_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "created_at" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "created_by_user_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "is_deleted" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "moped_user" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "first_name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "last_name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "user_id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "is_deleted" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "email" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "moped_workgroup" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "workgroup_id",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "workgroup_name",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "moped_proj_personnel_roles",
                        },
                        arguments: [
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "where" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "is_deleted" },
                                  value: {
                                    kind: "ObjectValue",
                                    fields: [
                                      {
                                        kind: "ObjectField",
                                        name: { kind: "Name", value: "_eq" },
                                        value: {
                                          kind: "BooleanValue",
                                          value: false,
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: {
                                kind: "Name",
                                value: "project_personnel_id",
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "project_role_id" },
                            },
                            {
                              kind: "Field",
                              name: {
                                kind: "Name",
                                value: "moped_project_role",
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "project_role_id",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "project_role_name",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "project_role_description",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_project_roles" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_role_name" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "active_role" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: true },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_role_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_role_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_role_description" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_users" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "last_name" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "first_name" } },
                { kind: "Field", name: { kind: "Name", value: "last_name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "workgroup_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "user_id" } },
                { kind: "Field", name: { kind: "Name", value: "is_deleted" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_workgroup" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "workgroup_id" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "workgroup_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "workgroup_name" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamQueryQuery, TeamQueryQueryVariables>;
export const InserProjectPersonnelDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "InserProjectPersonnel" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "object" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "moped_proj_personnel_insert_input",
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_proj_personnel_one" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "object" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "object" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_personnel_id" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  InserProjectPersonnelMutation,
  InserProjectPersonnelMutationVariables
>;
export const UpdateProjectPersonnelDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProjectPersonnel" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "deleteIds" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "updatePersonnelObject" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "moped_proj_personnel_set_input" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "addRolesObjects" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "moped_proj_personnel_roles_insert_input",
                  },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_personnel_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_personnel_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "updatePersonnelObject" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_personnel_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_personnel_roles" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_in" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "deleteIds" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_proj_personnel_roles" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "addRolesObjects" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProjectPersonnelMutation,
  UpdateProjectPersonnelMutationVariables
>;
export const DeleteProjectPersonnelDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteProjectPersonnel" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_personnel_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_personnel_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "is_deleted" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_personnel_id" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteProjectPersonnelMutation,
  DeleteProjectPersonnelMutationVariables
>;
export const TeamTimelineDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "TeamTimeline" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_phases" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "phase_order" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "phase_id" } },
                { kind: "Field", name: { kind: "Name", value: "phase_name" } },
                { kind: "Field", name: { kind: "Name", value: "phase_order" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_subphases" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "order_by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "subphase_name" },
                            value: { kind: "EnumValue", value: "asc" },
                          },
                        ],
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subphase_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subphase_id" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_subphases" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subphase_name" },
                },
                { kind: "Field", name: { kind: "Name", value: "subphase_id" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_proj_phases" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ListValue",
                  values: [
                    {
                      kind: "ObjectValue",
                      fields: [
                        {
                          kind: "ObjectField",
                          name: { kind: "Name", value: "moped_phase" },
                          value: {
                            kind: "ObjectValue",
                            fields: [
                              {
                                kind: "ObjectField",
                                name: { kind: "Name", value: "phase_order" },
                                value: { kind: "EnumValue", value: "asc" },
                              },
                            ],
                          },
                        },
                      ],
                    },
                    {
                      kind: "ObjectValue",
                      fields: [
                        {
                          kind: "ObjectField",
                          name: { kind: "Name", value: "moped_subphase" },
                          value: {
                            kind: "ObjectValue",
                            fields: [
                              {
                                kind: "ObjectField",
                                name: { kind: "Name", value: "subphase_name" },
                                value: { kind: "EnumValue", value: "asc" },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_phase_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "is_current_phase" },
                },
                { kind: "Field", name: { kind: "Name", value: "project_id" } },
                { kind: "Field", name: { kind: "Name", value: "phase_start" } },
                { kind: "Field", name: { kind: "Name", value: "phase_end" } },
                { kind: "Field", name: { kind: "Name", value: "phase_id" } },
                { kind: "Field", name: { kind: "Name", value: "subphase_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "is_phase_start_confirmed" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "is_phase_end_confirmed" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_subphase" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subphase_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "subphase_name" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "phase_description" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_phase" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "phase_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "phase_name" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_milestones" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "milestone_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "milestone_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "related_phase_id" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_proj_milestones" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ListValue",
                  values: [
                    {
                      kind: "ObjectValue",
                      fields: [
                        {
                          kind: "ObjectField",
                          name: { kind: "Name", value: "milestone_order" },
                          value: { kind: "EnumValue", value: "asc" },
                        },
                      ],
                    },
                    {
                      kind: "ObjectValue",
                      fields: [
                        {
                          kind: "ObjectField",
                          name: { kind: "Name", value: "date_actual" },
                          value: { kind: "EnumValue", value: "desc" },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "milestone_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "date_estimate" },
                },
                { kind: "Field", name: { kind: "Name", value: "date_actual" } },
                { kind: "Field", name: { kind: "Name", value: "completed" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_milestone_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "project_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_milestone" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "milestone_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "milestone_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "related_phase_id" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "project_list_view" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "substantial_completion_date" },
                },
                { kind: "Field", name: { kind: "Name", value: "project_id" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_note_types" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "slug" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamTimelineQuery, TeamTimelineQueryVariables>;
export const AddProjectPhaseDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddProjectPhase" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "objects" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "moped_proj_phases_insert_input",
                  },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current_phase_id_to_clear" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
            },
          },
          defaultValue: { kind: "ListValue", values: [] },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_phases" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_current_phase" },
                      value: { kind: "BooleanValue", value: false },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_phase_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_in" },
                            value: {
                              kind: "Variable",
                              name: {
                                kind: "Name",
                                value: "current_phase_id_to_clear",
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_proj_phases" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "objects" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "returning" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "phase_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "phase_description" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "phase_start" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "phase_end" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_phase_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "is_current_phase" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_id" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AddProjectPhaseMutation,
  AddProjectPhaseMutationVariables
>;
export const AddProjectPhaseWithStatusUpdateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddProjectPhaseWithStatusUpdate" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "objects" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "moped_proj_phases_insert_input",
                  },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current_phase_id_to_clear" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
            },
          },
          defaultValue: { kind: "ListValue", values: [] },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "noteObjects" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "moped_proj_notes_insert_input",
                  },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_phases" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_current_phase" },
                      value: { kind: "BooleanValue", value: false },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_phase_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_in" },
                            value: {
                              kind: "Variable",
                              name: {
                                kind: "Name",
                                value: "current_phase_id_to_clear",
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_proj_phases" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "objects" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "returning" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "phase_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "phase_description" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "phase_start" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "phase_end" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_phase_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "is_current_phase" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_id" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_proj_notes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "noteObjects" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "returning" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_note" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AddProjectPhaseWithStatusUpdateMutation,
  AddProjectPhaseWithStatusUpdateMutationVariables
>;
export const ProjectPhasesMutationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ProjectPhasesMutation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "project_phase_id" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "object" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "moped_proj_phases_set_input" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "current_phase_id_to_clear" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
            },
          },
          defaultValue: { kind: "ListValue", values: [] },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "noteObjects" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "moped_proj_notes_insert_input",
                  },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_phases" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_current_phase" },
                      value: { kind: "BooleanValue", value: false },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_phase_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_in" },
                            value: {
                              kind: "Variable",
                              name: {
                                kind: "Name",
                                value: "current_phase_id_to_clear",
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_phases_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_phase_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "project_phase_id" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "object" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "project_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_phase_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "phase_id" } },
                { kind: "Field", name: { kind: "Name", value: "phase_start" } },
                { kind: "Field", name: { kind: "Name", value: "phase_end" } },
                { kind: "Field", name: { kind: "Name", value: "subphase_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "is_current_phase" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "phase_description" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_proj_notes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "noteObjects" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "returning" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_note" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ProjectPhasesMutationMutation,
  ProjectPhasesMutationMutationVariables
>;
export const DeleteProjectPhaseDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteProjectPhase" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "project_phase_id" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_phases" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_current_phase" },
                      value: { kind: "BooleanValue", value: false },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_phase_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "project_phase_id" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteProjectPhaseMutation,
  DeleteProjectPhaseMutationVariables
>;
export const ProjectMilestonesMutationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ProjectMilestonesMutation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "description" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "completed" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "date_estimate" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "date" } },
          defaultValue: { kind: "NullValue" },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "date_actual" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "date" } },
          defaultValue: { kind: "NullValue" },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "project_milestone_id" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "milestone_id" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_milestones_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_milestone_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "project_milestone_id" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "description" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "description" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "completed" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "completed" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "date_estimate" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "date_estimate" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "date_actual" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "date_actual" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "milestone_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "milestone_id" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "project_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_milestone_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "date_estimate" },
                },
                { kind: "Field", name: { kind: "Name", value: "date_actual" } },
                { kind: "Field", name: { kind: "Name", value: "completed" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ProjectMilestonesMutationMutation,
  ProjectMilestonesMutationMutationVariables
>;
export const DeleteProjectMilestoneDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteProjectMilestone" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "project_milestone_id" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_milestones" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_milestone_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: {
                                kind: "Name",
                                value: "project_milestone_id",
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteProjectMilestoneMutation,
  DeleteProjectMilestoneMutationVariables
>;
export const AddProjectMilestoneDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddProjectMilestone" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "objects" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "moped_proj_milestones_insert_input",
                  },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_proj_milestones" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "objects" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "returning" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "milestone_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "description" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "date_estimate" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "date_actual" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "completed" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_milestone_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "project_id" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AddProjectMilestoneMutation,
  AddProjectMilestoneMutationVariables
>;
export const FollowProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "FollowProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "object" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "moped_user_followed_projects_insert_input",
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "insert_moped_user_followed_projects_one",
            },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "object" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "object" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "project_id" } },
                { kind: "Field", name: { kind: "Name", value: "user_id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  FollowProjectMutation,
  FollowProjectMutationVariables
>;
export const UnfollowProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UnfollowProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "project_id" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "user_id" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: {
              kind: "Name",
              value: "delete_moped_user_followed_projects",
            },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "project_id" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "user_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "user_id" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UnfollowProjectMutation,
  UnfollowProjectMutationVariables
>;
export const GetMopedProjectChangesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getMopedProjectChanges" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_activity_log" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "record_project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "created_at" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "activity_id" } },
                { kind: "Field", name: { kind: "Name", value: "created_at" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "record_project_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "record_type" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "operation_type" },
                },
                { kind: "Field", name: { kind: "Name", value: "record_data" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "updated_by_user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "first_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "last_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "picture" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "user_id" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_users" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "first_name" } },
                { kind: "Field", name: { kind: "Name", value: "last_name" } },
                { kind: "Field", name: { kind: "Name", value: "user_id" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_phases" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "phase_id" } },
                { kind: "Field", name: { kind: "Name", value: "phase_name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_subphases" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "subphase_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "subphase_name" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_milestones" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "milestone_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "milestone_name" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_tags" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "name" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_entity" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "entity_id" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "entity_id" } },
                { kind: "Field", name: { kind: "Name", value: "entity_name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_fund_sources" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "funding_source_id" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "funding_source_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "funding_source_name" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_fund_programs" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "funding_program_id" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "funding_program_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "funding_program_name" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_fund_status" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "funding_status_id" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "funding_status_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "funding_status_name" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_public_process_statuses" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_components" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "component_id" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_subtype" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "deprecated_moped_types" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "type_id" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "type_id" } },
                { kind: "Field", name: { kind: "Name", value: "type_name" } },
              ],
            },
          },
          {
            kind: "Field",
            alias: { kind: "Name", value: "activity_log_lookup_tables" },
            name: { kind: "Name", value: "moped_activity_log" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "record_project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "distinct_on" },
                value: { kind: "EnumValue", value: "record_type" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "record_type" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetMopedProjectChangesQuery,
  GetMopedProjectChangesQueryVariables
>;
export const GetMopedProjectChangeDetailsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getMopedProjectChangeDetails" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "activityId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_activity_log" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "activity_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "activityId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "activity_id" } },
                { kind: "Field", name: { kind: "Name", value: "created_at" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "record_project_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "record_type" } },
                { kind: "Field", name: { kind: "Name", value: "record_data" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "operation_type" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "first_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "last_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "user_id" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "updated_by_user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "first_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "last_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "picture" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "user_id" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            alias: { kind: "Name", value: "activity_log_lookup_tables" },
            name: { kind: "Name", value: "moped_activity_log" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "activity_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "activityId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "distinct_on" },
                value: { kind: "EnumValue", value: "record_type" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "record_type" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetMopedProjectChangeDetailsQuery,
  GetMopedProjectChangeDetailsQueryVariables
>;
export const MopedProjectFilesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "MopedProjectFiles" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_project_files" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "created_at" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_file_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "project_id" } },
                { kind: "Field", name: { kind: "Name", value: "file_key" } },
                { kind: "Field", name: { kind: "Name", value: "file_name" } },
                { kind: "Field", name: { kind: "Name", value: "file_type" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "file_description" },
                },
                { kind: "Field", name: { kind: "Name", value: "file_size" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "file_metadata" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "file_description" },
                },
                { kind: "Field", name: { kind: "Name", value: "created_at" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "created_by_user_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "file_url" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "moped_user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "user_id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "first_name" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "last_name" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_file_types" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  MopedProjectFilesQuery,
  MopedProjectFilesQueryVariables
>;
export const UpdateProjectFileAttachmentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProjectFileAttachment" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "fileId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "fileName" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "fileType" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "fileDescription" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "fileUrl" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project_files" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_file_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "fileId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "file_name" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "fileName" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "file_type" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "fileType" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "file_description" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "fileDescription" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "file_url" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "fileUrl" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProjectFileAttachmentMutation,
  UpdateProjectFileAttachmentMutationVariables
>;
export const DeleteProjectFileAttachmentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteProjectFileAttachment" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "fileId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project_files" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_file_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "fileId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "update_files_ecapris_funding" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "file_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "fileId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "update_files_project_funding" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "file_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "fileId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteProjectFileAttachmentMutation,
  DeleteProjectFileAttachmentMutationVariables
>;
export const Insert_Single_ArticleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "insert_single_article" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "object" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "moped_project_files_insert_input" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_project_files" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "ListValue",
                  values: [
                    {
                      kind: "Variable",
                      name: { kind: "Name", value: "object" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  Insert_Single_ArticleMutation,
  Insert_Single_ArticleMutationVariables
>;
export const InsertFileWithEcaprisConnectionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "InsertFileWithEcaprisConnection" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "object" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "moped_project_files_insert_input" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_project_files_one" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "object" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "object" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_file_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "files_ecapris_fundings" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  InsertFileWithEcaprisConnectionMutation,
  InsertFileWithEcaprisConnectionMutationVariables
>;
export const DetachFileEcaprisFundingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DetachFileEcaprisFunding" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_files_ecapris_funding_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DetachFileEcaprisFundingMutation,
  DetachFileEcaprisFundingMutationVariables
>;
export const InsertFileWithMopedFundingConnectionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "InsertFileWithMopedFundingConnection" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "object" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "moped_project_files_insert_input" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_project_files_one" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "object" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "object" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_file_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "files_project_fundings" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  InsertFileWithMopedFundingConnectionMutation,
  InsertFileWithMopedFundingConnectionMutationVariables
>;
export const DetachFileMopedFundingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DetachFileMopedFunding" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_files_project_funding_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DetachFileMopedFundingMutation,
  DetachFileMopedFundingMutationVariables
>;
export const AttachExistingFileToEcaprisFundingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AttachExistingFileToEcaprisFunding" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "object" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "files_ecapris_funding_insert_input",
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_files_ecapris_funding_one" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "object" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "object" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "on_conflict" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "constraint" },
                      value: {
                        kind: "EnumValue",
                        value:
                          "files_ecapris_funding_project_id_entity_id_file_id_key",
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "update_columns" },
                      value: {
                        kind: "ListValue",
                        values: [{ kind: "EnumValue", value: "is_deleted" }],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AttachExistingFileToEcaprisFundingMutation,
  AttachExistingFileToEcaprisFundingMutationVariables
>;
export const AttachExistingFileToMopedFundingDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AttachExistingFileToMopedFunding" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "object" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "files_project_funding_insert_input",
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_files_project_funding_one" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "object" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "object" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "on_conflict" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "constraint" },
                      value: {
                        kind: "EnumValue",
                        value: "files_project_funding_entity_id_file_id_key",
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "update_columns" },
                      value: {
                        kind: "ListValue",
                        values: [{ kind: "EnumValue", value: "is_deleted" }],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AttachExistingFileToMopedFundingMutation,
  AttachExistingFileToMopedFundingMutationVariables
>;
export const ArchiveMopedProjectDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ArchiveMopedProject" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            alias: { kind: "Name", value: "clear_parent_project" },
            name: { kind: "Name", value: "update_moped_project" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "parent_project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "parent_project_id" },
                      value: { kind: "NullValue" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ArchiveMopedProjectMutation,
  ArchiveMopedProjectMutationVariables
>;
export const GetSignalComponentsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetSignalComponents" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_components" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "component_name" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_ilike" },
                            value: {
                              kind: "StringValue",
                              value: "signal",
                              block: false,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_subtype" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "line_representation" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetSignalComponentsQuery,
  GetSignalComponentsQueryVariables
>;
export const ProjectStatusUpdateInsertDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ProjectStatusUpdateInsert" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "statusUpdate" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "moped_proj_notes_insert_input",
                  },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_proj_notes" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "statusUpdate" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
                { kind: "Field", name: { kind: "Name", value: "__typename" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ProjectStatusUpdateInsertMutation,
  ProjectStatusUpdateInsertMutationVariables
>;
export const ProjectUpdateSponsorDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ProjectUpdateSponsor" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "fieldValueId" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "projectId" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_sponsor" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "fieldValueId" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_sponsor" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ProjectUpdateSponsorMutation,
  ProjectUpdateSponsorMutationVariables
>;
export const ProjectUpdateLeadDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ProjectUpdateLead" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "fieldValueId" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "projectId" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_lead_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "fieldValueId" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_lead_id" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ProjectUpdateLeadMutation,
  ProjectUpdateLeadMutationVariables
>;
export const ProjectUpdatePublicProcessDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ProjectUpdatePublicProcess" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "fieldValueId" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "projectId" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "public_process_status_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "fieldValueId" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "public_process_status_id" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ProjectUpdatePublicProcessMutation,
  ProjectUpdatePublicProcessMutationVariables
>;
export const UpdateMopedProjectPartnersDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateMopedProjectPartners" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "partners" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "moped_proj_partners_insert_input",
                  },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "deleteList" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "Int" },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_moped_proj_partners" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "partners" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_proj_partners" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "proj_partner_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_in" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "deleteList" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateMopedProjectPartnersMutation,
  UpdateMopedProjectPartnersMutationVariables
>;
export const UpdateProjectWebsiteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProjectWebsite" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "website" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_website" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "website" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProjectWebsiteMutation,
  UpdateProjectWebsiteMutationVariables
>;
export const UpdateProjectDescriptionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProjectDescription" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "description" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_description" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "description" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProjectDescriptionMutation,
  UpdateProjectDescriptionMutationVariables
>;
export const UpdateProjectECaprisDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProjectECapris" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "eCaprisSubprojectId" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "ecapris_subproject_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "eCaprisSubprojectId" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: {
                        kind: "Name",
                        value: "should_sync_ecapris_statuses",
                      },
                      value: { kind: "BooleanValue", value: true },
                    },
                    {
                      kind: "ObjectField",
                      name: {
                        kind: "Name",
                        value: "should_sync_ecapris_funding",
                      },
                      value: { kind: "BooleanValue", value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProjectECaprisMutation,
  UpdateProjectECaprisMutationVariables
>;
export const UpdateProjectECaprisClearDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProjectECaprisClear" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "ecapris_subproject_id" },
                      value: { kind: "NullValue" },
                    },
                    {
                      kind: "ObjectField",
                      name: {
                        kind: "Name",
                        value: "should_sync_ecapris_statuses",
                      },
                      value: { kind: "BooleanValue", value: false },
                    },
                    {
                      kind: "ObjectField",
                      name: {
                        kind: "Name",
                        value: "should_sync_ecapris_funding",
                      },
                      value: { kind: "BooleanValue", value: false },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProjectECaprisClearMutation,
  UpdateProjectECaprisClearMutationVariables
>;
export const UpdateProjectInterimIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProjectInterimId" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "interimProjectId" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "projectId" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "interim_project_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "interimProjectId" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "interim_project_id" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProjectInterimIdMutation,
  UpdateProjectInterimIdMutationVariables
>;
export const ClearProjectInterimIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ClearProjectInterimId" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "projectId" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "interim_project_id" },
                      value: { kind: "NullValue" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "interim_project_id" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ClearProjectInterimIdMutation,
  ClearProjectInterimIdMutationVariables
>;
export const UpdateProjectECaprisSyncDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProjectECaprisSync" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "shouldSync" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: {
                        kind: "Name",
                        value: "should_sync_ecapris_statuses",
                      },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "shouldSync" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProjectECaprisSyncMutation,
  UpdateProjectECaprisSyncMutationVariables
>;
export const UpdateProjectECaprisFundingSyncDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProjectECaprisFundingSync" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "shouldSync" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectId" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: {
                        kind: "Name",
                        value: "should_sync_ecapris_funding",
                      },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "shouldSync" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "affected_rows" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProjectECaprisFundingSyncMutation,
  UpdateProjectECaprisFundingSyncMutationVariables
>;
export const UpdateProjectNameDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateProjectName" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectName" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectNameSecondary" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "update_moped_project_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "pk_columns" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "projectId" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "_set" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_name" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "projectName" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_name_secondary" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "projectNameSecondary" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_name_secondary" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProjectNameMutation,
  UpdateProjectNameMutationVariables
>;
export const ProjectLookupsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ProjectLookups" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_fund_sources" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "funding_source_name" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "funding_source_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "funding_source_name" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_fund_programs" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "funding_program_name" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "funding_program_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "funding_program_name" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_entity" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "entity_id" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "entity_id" } },
                { kind: "Field", name: { kind: "Name", value: "entity_name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_tags" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "name" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_public_process_statuses" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "name" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_users" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "last_name" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "first_name" } },
                { kind: "Field", name: { kind: "Name", value: "last_name" } },
                { kind: "Field", name: { kind: "Name", value: "user_id" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_phases" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "phase_name" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "phase_id" } },
                { kind: "Field", name: { kind: "Name", value: "phase_name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_components" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "component_name_full" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_name_full" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "layer_council_district" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "council_district" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_work_types" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "order_by" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "name" },
                      value: { kind: "EnumValue", value: "asc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProjectLookupsQuery, ProjectLookupsQueryVariables>;
export const ProjectOptionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ProjectOptions" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectId" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "moped_project" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "_and" },
                      value: {
                        kind: "ListValue",
                        values: [
                          {
                            kind: "ObjectValue",
                            fields: [
                              {
                                kind: "ObjectField",
                                name: { kind: "Name", value: "is_deleted" },
                                value: {
                                  kind: "ObjectValue",
                                  fields: [
                                    {
                                      kind: "ObjectField",
                                      name: { kind: "Name", value: "_eq" },
                                      value: {
                                        kind: "BooleanValue",
                                        value: false,
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                          {
                            kind: "ObjectValue",
                            fields: [
                              {
                                kind: "ObjectField",
                                name: { kind: "Name", value: "project_id" },
                                value: {
                                  kind: "ObjectValue",
                                  fields: [
                                    {
                                      kind: "ObjectField",
                                      name: { kind: "Name", value: "_neq" },
                                      value: {
                                        kind: "Variable",
                                        name: {
                                          kind: "Name",
                                          value: "projectId",
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "project_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_name_full" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProjectOptionsQuery, ProjectOptionsQueryVariables>;
export const GetProjectsComponentsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetProjectsComponents" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "projectIds" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "project_geography" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "project_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_in" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "projectIds" },
                            },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "is_deleted" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: { kind: "BooleanValue", value: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "project_id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "project_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_id" },
                },
                { kind: "Field", name: { kind: "Name", value: "geography" } },
                { kind: "Field", name: { kind: "Name", value: "attributes" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "component_name" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "line_representation" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetProjectsComponentsQuery,
  GetProjectsComponentsQueryVariables
>;
