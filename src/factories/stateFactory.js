import connection from '../database/database.js';

export default async function stateFacoty(state) {
  let state_id;
  try {
    const existState = await connection.query('SELECT * FROM state WHERE state_name = $1', [state]);
    if (existState.rowCount !== 0) {
      state_id = existState.rows[0].id;
    } else {
      const newState = await connection.query('INSERT INTO state (state_name) VALUES ($1) RETURNING *', [state]);
      state_id = newState.rows[0].id;
    }
  } catch (erro) {
    // console.log(erro);
  }
  return state_id;
}
