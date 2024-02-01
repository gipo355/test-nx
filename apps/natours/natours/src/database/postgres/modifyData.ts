import { databasePool } from './database';

async function modifyData() {
  const [id, name] = ['gigi', 'blue'];
  try {
    const res = await databasePool.query(
      'UPDATE Shark SET name = $1 WHERE id = $2',
      [name, id]
    );
    console.log(`updated shark name to ${name}`);
  } catch (error) {
    console.error(error);
  }
}

try {
  await modifyData();
} catch (error) {
  console.error(error);
}
