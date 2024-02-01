import { databasePool } from './database';

async function retrieveData() {
  const res = await databasePool.query('SELECT * FROM Shark');
  console.log(res.rows);
}

try {
  await retrieveData();
} catch (error) {
  console.error(error);
}
