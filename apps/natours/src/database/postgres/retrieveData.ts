import { databasePool } from './database';

async function retrieveData() {
  const res = await databasePool.query('SELECT * FROM Shark');
  console.log(res.rows);
}

try {
  retrieveData().then().catch();
} catch (error) {
  console.error(error);
}
