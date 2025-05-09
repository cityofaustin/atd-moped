DELETE FROM "public"."moped_subphases" WHERE "subphase_name" = 'Discovery' and "related_phase_id" = 1;
DELETE FROM "public"."moped_subphases" WHERE "subphase_name" = 'Vetting'  and "related_phase_id" = 4;
DELETE FROM "public"."moped_subphases" WHERE "subphase_name" = 'Commissioning'  and "related_phase_id" = 7;
DELETE FROM "public"."moped_subphases" WHERE "subphase_name" = 'In-Service'  and "related_phase_id" = 9;
DELETE FROM "public"."moped_subphases" WHERE "subphase_name" = 'Close-Out'  and "related_phase_id" = 11;
