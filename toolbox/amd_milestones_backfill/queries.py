"""
Query projects which:
- are not deleted
- are not in a completed or post-construction phase
- have a project type that matches the (currently) four project types which support
  templates: Signal - Mod, Signal - New, PHB - Mod, PHB - New
- were created on or prior to a user-supplied date ($max_date_added)
"""
PROJECTS_QUERY = """query NeedsMilestonesProjects($max_date_added: timestamptz!) {
	moped_project(
		order_by: { project_id: asc }
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
				# must contain at least one not-deleted project type related to signals or PHBs
				{
					moped_project_types: {
						_and: [
							{ moped_type: { type_name: { _similar: "%(Signal|PHB)%" } } }
							{ status_id: { _eq: 1 } }
						]
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
	}
	# we don't currently have a hasura relationship between projects and milestones :/
	# so download them all so we can join them manually
	moped_proj_milestones(where: { status_id: { _eq: 1 } }) {
		project_id
		moped_milestone {
			milestone_id
			milestone_name
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
