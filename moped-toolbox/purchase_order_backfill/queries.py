
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

ADD_PURCHASE_ORDER = """
    mutation AddPurchaseOrder($objects: [moped_purchase_order_insert_input!]!) 
    {
        insert_moped_purchase_order(objects: $objects) {
            returning
            {
                id
            }
        }
    }
"""
