DELETE FROM moped_components_subcomponents WHERE id IN (
    SELECT
        mcs.id
    FROM 
        moped_components_subcomponents mcs 
    JOIN 
        moped_subcomponents ms ON ms.subcomponent_id = mcs.subcomponent_id
    WHERE 
        subcomponent_name = 'Protection Type - ZICLA Barriers');

DELETE FROM moped_subcomponents WHERE subcomponent_name = 'Protection Type - ZICLA Barriers'

