#!/usr/bin/perl

use strict;

use DBI;
use Data::Dumper;

# these are not secrets; they are in our Dockerfile for the DB
my $pg = DBI->connect("DBI:Pg:dbname=moped;host=host.docker.internal;port=5432", 'moped', 'moped', {RaiseError => 1});

my $sql = "SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name";
my $query = $pg->prepare($sql);
$query->execute();
while (my $table = $query->fetchrow_hashref) {

  #various views and special tables
  next if $table->{'table_name'} =~ /^project_list_view$/;
  next if $table->{'table_name'} =~ /^spatial_ref_sys$/;
  next if $table->{'table_name'} =~ /^geography_columns$/;
  next if $table->{'table_name'} =~ /^geometry_columns$/;
  next if $table->{'table_name'} =~ /^moped_activity_log$/;

  # non-int pk
  next if $table->{'table_name'} =~ /^moped_city_fiscal_years$/;

  # missing sequence
  next if $table->{'table_name'} =~ /^moped_phases$/;
  next if $table->{'table_name'} =~ /^moped_status$/;

  # missing PK
  next if $table->{'table_name'} =~ /^moped_fund_programs$/;
  next if $table->{'table_name'} =~ /^moped_proj_fiscal_years$/;

  #print $table->{'table_name'}, "\n";
  my $sql = "
    select kcu.table_schema,
           kcu.table_name,
           tco.constraint_name,
           kcu.ordinal_position as position,
           kcu.column_name as key_column
    from information_schema.table_constraints tco
    join information_schema.key_column_usage kcu 
      on kcu.constraint_name = tco.constraint_name
      and kcu.constraint_schema = tco.constraint_schema
      and kcu.constraint_name = tco.constraint_name
    where tco.constraint_type = 'PRIMARY KEY'
      and tco.table_name = ?
    order by kcu.table_schema,
             kcu.table_name,
             position;
             ";
  my $query = $pg->prepare($sql);
  $query->execute($table->{'table_name'});
  my $pk = $query->fetchrow_hashref;

  print "FREAK OUT: no pk in " . $table->{'table_name'}, "\n" unless $pk->{'key_column'};

  #print Dumper $pk, "\n";

  my $sql = "select max(" . $pk->{'key_column'}. ") from " . $table->{'table_name'};
  my $query = $pg->prepare($sql);
  $query->execute();
  my ($max_value) = $query->fetchrow_array;

  # for empty tables
  $max_value = 1 unless $max_value; 

  my $sql = "SELECT pg_get_expr(d.adbin, d.adrelid) AS default_value
             FROM   pg_catalog.pg_attribute a
             LEFT   JOIN pg_catalog.pg_attrdef d ON (a.attrelid, a.attnum) = (d.adrelid,  d.adnum)
             WHERE  NOT a.attisdropped           -- no dropped (dead) columns
             AND    a.attnum   > 0               -- no system columns
             AND    a.attrelid = ?::regclass
             AND    a.attname  = ?;";
  my $query = $pg->prepare($sql);
  $query->execute($pk->{'table_schema'} . '.' . $pk->{'table_name'}, $pk->{'key_column'});
  my $result = $query->fetchrow_hashref;
  #print $result->{'default_value'}, "\n";

  $result->{'default_value'} =~ /nextval\('(\w+)\'::regclass/;
  my $sequence_name = $1;
  #print $sequence_name, "\n";

  my $sql = "SELECT pg_catalog.setval('public." . $sequence_name . "', " . $max_value . ", true);";
  print $sql, "\n";

  my $sql = "SELECT pg_catalog.setval('public." . $sequence_name . "', ?, true);";
  #print $sql, "\n";
  my $query = $pg->prepare($sql);
  $query->execute($max_value);

  #print "------\n";
}
