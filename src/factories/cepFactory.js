import connection from '../database/database.js';

export default async function cepFactory(cep) {
  let cep_id;
  try {
    const existCEP = await connection.query('SELECT * FROM cep WHERE code = $1', [cep]);
    if (existCEP.rowCount !== 0) {
      cep_id = existCEP.rows[0].id;
    } else {
      const newCEP = await connection.query('INSERT INTO cep (code) VALUES ($1) RETURNING *', [cep]);
      cep_id = newCEP.rows[0].id;
    }
  } catch (erro) {
    // console.log(erro);
  }
  return cep_id;
}
