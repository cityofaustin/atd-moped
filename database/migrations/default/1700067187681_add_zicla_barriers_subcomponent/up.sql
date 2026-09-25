INSERT INTO moped_subcomponents (subcomponent_name) VALUES ('Protection Type - ZICLA Barriers');


WITH inserts_todo AS (
    SELECT
        mcs.component_id
    FROM 
        moped_components_subcomponents mcs 
    JOIN 
        moped_subcomponents ms ON ms.subcomponent_id = mcs.subcomponent_id
    WHERE 
        subcomponent_name LIKE 'Protection Type%'
    GROUP BY 
        mcs.component_id
    )
INSERT INTO moped_components_subcomponents (component_id, subcomponent_id)
SELECT
    inserts_todo.component_id, ms.subcomponent_id
FROM
    inserts_todo
    -- gets the component id of the new subcomponent we created
    LEFT JOIN moped_subcomponents ms ON ms.subcomponent_name = 'Protection Type - ZICLA Barriers';
