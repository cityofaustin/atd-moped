ALTER TABLE "public"."moped_phases" ADD COLUMN "subphases" integer[] NULL;

UPDATE public.moped_phases SET subphases = '{4,5,9,10}' WHERE phase_id = 1;
UPDATE public.moped_phases SET subphases = '{4,9}' WHERE phase_id = 2;
UPDATE public.moped_phases SET subphases = null WHERE phase_id = 3;
UPDATE public.moped_phases SET subphases = null WHERE phase_id = 4;
UPDATE public.moped_phases SET subphases = null WHERE phase_id = 5;
UPDATE public.moped_phases SET subphases = '{8}' WHERE phase_id = 6;
UPDATE public.moped_phases SET subphases = '{2,3}' WHERE phase_id = 7;
UPDATE public.moped_phases SET subphases = null WHERE phase_id = 8;
UPDATE public.moped_phases SET subphases = '{6,7}' WHERE phase_id = 9;
UPDATE public.moped_phases SET subphases = '{1}' WHERE phase_id = 10;
UPDATE public.moped_phases SET subphases = '{10}' WHERE phase_id = 11;
