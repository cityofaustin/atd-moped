-- Rollback is not possible: once the constraint is dropped, new event names
-- (e.g. funding_ecapris_*) may be logged. Re-adding the constraint would fail
-- because existing rows would violate it. This change is irreversible.
SELECT 0;
