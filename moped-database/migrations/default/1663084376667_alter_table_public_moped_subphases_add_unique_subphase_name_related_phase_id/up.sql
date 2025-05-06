alter table "public"."moped_subphases" add constraint "moped_subphases_subphase_name_related_phase_id_key" unique ("subphase_name", "related_phase_id");
