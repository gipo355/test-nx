import { databasePool } from './database';

async function insertData() {
  // const [name, color] = ['sammy', 'blue'];
  const [name, color] = ['san', 'red'];
  // try {
  //     const res = await pool.query(
  //         'INSERT INTO Shark (name,color) VALUES ($1, $2)',
  //         [name, color]
  //     );
  //     console.log(`added shark with name ${name}`);
  // } catch (error) {
  //     console.error(error);
  // }
  const res = await databasePool.query(
    'INSERT INTO Shark (name,color) VALUES ($1, $2)',
    [name, color]
  );
  console.log(`added shark with name ${name}`);
}
try {
  await insertData();
} catch (error) {
  console.error(error);
}
// insertData();
// insertData();

// pool.query('SELECT NOW()', (err: any, res: any) => {
//     console.log(err, res);
//     pool.end();
// });
