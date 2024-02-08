import { databasePool } from './database';

async function deleteData() {
  const id = 7;
  // try {
  //     const res = await pool.query('DELETE FROM Shark WHERE id = $1', id);
  //     console.log(`deleted row with id ${id}`);
  // } catch (error) {
  //     console.log(error);
  // }
  const res = await databasePool.query('DELETE FROM Shark WHERE id = $1', [id]);
  // const res = await pool.query(`DELETE FROM Shark WHERE id = ${id}`); // ! BAD, ${} is reserved
  console.log(`deleted row with id ${id}`);
}

try {
  deleteData().then().catch();
} catch (error) {
  console.error(error);
}
