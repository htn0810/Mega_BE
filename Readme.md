Run script VietNam_units
-- Create Tables --
npx prisma db execute --file=prisma/migrations/createTable_vn_units/migration.sql
-- Import Data --
npx prisma db execute --file=prisma/migrations/importData_vn_units/migration.sql
-- Create temp-schema.prisma
-- Copy data from schema.prisma to temp-schema for backup before pull schema from db
copy prisma/schema.prisma prisma/temp-schema.prisma
-- Pull schema to temp-schema.prisma
npx prisma db pull --schema=./prisma/temp-schema.prisma
-- Choose and copy which model we need to schema.prisma
