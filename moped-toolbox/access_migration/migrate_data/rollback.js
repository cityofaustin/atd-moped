const { runSql } = require("./utils/graphql");

const sql = `
-- delete migrated projects: this cascade deletes most related records
DELETE FROM moped_project WHERE is_migrated_from_access_db = TRUE; 

-- delete orphaned features (we cannot cascade this bc of table inheritance)
DELETE FROM features
WHERE id in(
        SELECT
            f.id FROM features f
        LEFT JOIN moped_proj_components mpc ON mpc.project_component_id = f.component_id
    WHERE
        mpc.project_component_id IS NULL);

-- delete feature_council_distrct (we cannot cascade this bc of table inheritance)
DELETE FROM features_council_districts
WHERE feature_id in(
        SELECT feature_id from features_council_districts fcd
        LEFT JOIN features f ON f.id = fcd.feature_id
    WHERE
        f.id IS NULL);

-- delete orphaned activity log events (we cannot cascade this bc we do not have an FK constraint)
DELETE FROM moped_activity_log
WHERE activity_id in(
        SELECT
            activity_id FROM moped_activity_log log
        LEFT JOIN moped_project mp ON log.record_project_id = mp.project_id
    WHERE
        log.record_type = 'moped_project'
        AND mp.project_id IS NULL);

-- reset all sequence values
select setval('features_id_seq', (select coalesce(max(id), 1) from features));
select setval('moped_proj_tags_id_seq', (select coalesce(max(id), 1) from moped_proj_tags));
select setval('moped_phase_history_project_milestone_id_seq', (select coalesce(max(project_phase_id), 1) from moped_proj_phases));
select setval('moped_proj_milestones_project_milestone_id_seq', (select coalesce(max(project_milestone_id), 1) from moped_proj_milestones));
select setval('moped_proj_component_tags_id_seq', (select coalesce(max(id), 1) from moped_proj_component_tags));
select setval('moped_proj_component_work_types_id_seq', (select coalesce(max(id), 1) from moped_proj_component_work_types));
select setval('moped_proj_components_subcomponen_component_subcomponent_id_seq', (select coalesce(max(component_subcomponent_id), 1) from moped_proj_components_subcomponents));
select setval('moped_proj_fund_source_proj_fund_source_id_seq', (select coalesce(max(proj_funding_id), 1) from moped_proj_funding));
select setval('moped_proj_notes_project_note_id_seq', (select coalesce(max(project_note_id), 1) from moped_proj_notes));
select setval('moped_proj_partners_proj_partner_id_seq', (select coalesce(max(proj_partner_id), 1) from moped_proj_partners));
select setval('moped_proj_personnel_project_personnel_id_seq', (select coalesce(max(project_personnel_id), 1) from moped_proj_personnel));
select setval('moped_proj_personnel_roles_id_seq', (select coalesce(max(id), 1) from moped_proj_personnel_roles));
select setval('moped_purchase_order_id_seq', (select coalesce(max(id), 1) from moped_proj_work_activity));
select setval('features_council_districts_id_seq', (select coalesce(max(id), 1) from features_council_districts));

-- restore misc triggers 
ALTER TABLE moped_proj_work_activity enable TRIGGER set_proj_work_activity_trigger_updated_at;
ALTER TABLE feature_drawn_lines enable TRIGGER update_feature_drawn_lines_council_district;
ALTER TABLE feature_drawn_lines enable TRIGGER update_feature_drawn_lines_council_district;
ALTER TABLE feature_drawn_points enable TRIGGER update_feature_drawn_points_council_district;
ALTER TABLE feature_drawn_points enable TRIGGER update_feature_drawn_points_council_district;
ALTER TABLE feature_intersections enable TRIGGER update_feature_intersections_council_district;
ALTER TABLE feature_intersections enable TRIGGER update_feature_intersections_council_district;
ALTER TABLE feature_signals enable TRIGGER update_feature_signals_council_district;
ALTER TABLE feature_signals enable TRIGGER update_feature_signals_council_district;
ALTER TABLE feature_street_segments enable TRIGGER update_feature_street_segments_council_district;
ALTER TABLE feature_street_segments enable TRIGGER update_feature_street_segments_council_district;
ALTER TABLE moped_proj_phases enable TRIGGER set_moped_proj_phases_confirmed_dates_trigger;
ALTER TABLE moped_proj_phases enable TRIGGER set_moped_proj_phases_confirmed_dates_trigger
`;

async function main(env) {
  console.log(`⏪ Rolling back Access migration on env ${env} `);

  await runSql({
    env,
    sql,
  });

  console.log(`✅ migration rolled back`);
  console.log(
    "💀 remember to re-apply metadata if migration did not fail gracefully"
  );
}

const getEnv = () => {
  const env = process.argv[2];
  // alter this to enable run against staging or prod 😬
  if (!["local", "test"].includes(env)) {
    throw "Unknown environment. Choose 'local', 'test'";
  }
  return env;
};

const env = getEnv();

main(env);
