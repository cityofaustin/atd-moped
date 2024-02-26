-- Most recent migration: moped-database/migrations/1708978121747_demo-view-exporter/up.sql

CREATE VIEW dad_joke AS SELECT
    'Why did the scarecrow win an award?'::text AS setup,
    'Because he was outstanding in his field! ðŸ¥\x81'::text AS punchline;
