import connection from '../database/database.js';

export default async function cityFactory(city) {
  let city_id;
  try {
    const existCity = await connection.query('SELECT * FROM city WHERE city_name = $1', [city]);
    if (existCity.rowCount !== 0) {
      city_id = existCity.rows[0].id;
    } else {
      const newCity = await connection.query('INSERT INTO city (city_name) VALUES ($1) RETURNING *', [city]);
      city_id = newCity.rows[0].id;
    }
  } catch (erro) {
    // console.log(erro);
  }
  return city_id;
}
