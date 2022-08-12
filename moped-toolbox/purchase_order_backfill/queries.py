
PROJECTS_QUERY = """query PurchaseOrders {
    moped_project(
        order_by: {project_id: asc}
        where:{
            is_deleted: {_eq: false}
        }
    )
    {
        project_id
        project_name
        contractor
        purchase_order_number
    }
}
"""

ADD_CONTRACT = """
    mutation AddPurchaseOrder($objects: [moped_proj_contract_insert_input!]!) 
    {
        insert_moped_proj_contract(objects: $objects) {
            returning
            {
                id
            }
        }
    }
"""
