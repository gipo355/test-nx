import 'dotenv-defaults/config';

import { Pool } from 'pg';

export const databasePool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
});

// console.log(process.env.PGUSER);
