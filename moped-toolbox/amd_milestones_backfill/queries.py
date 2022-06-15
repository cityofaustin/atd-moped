PROJECTS_QUERY = """query NeedsMilestonesProjects($max_date_added: timestamptz!) {
	moped_project(
		where: {
			_and: [
				# not-deleted projects only
				{ is_deleted: { _eq: false } }
				# exclude completed and post-construction projects
				{
					_and: [
						{ current_phase: { _nilike: "complete" } }
						{ current_phase: { _nilike: "post-construction" } }
					]
				}
				# must contain at least one project type related to signals or PHBs
				{
					moped_project_types: {
						moped_type: { type_name: { _similar: "%(Signal|PHB)%" } }
					}
				}
				# only projects added before specified date - so as to filter on pre-v1.4 release
				{ date_added: { _lte: $max_date_added } }
			]
		}
	) {
		project_id
		project_name
		date_added
		moped_project_types {
			moped_type {
				type_name
			}
		}
		# exclude soft-deleted milestones - todo: check if soft delete work has changed this
		moped_proj_milestones(where: { status_id: { _eq: 1 } }) {
			moped_milestone {
				milestone_id
				milestone_name
			}
		}
	}
}
"""

PROJ_MILESTONES_MUTATION = """mutation InsertMilestones($objects: [moped_proj_milestones_insert_input!]!) {
  insert_moped_proj_milestones(objects: $objects) {
    returning {
      project_milestone_id
    }
  }
}"""
