import connection from '../database/database.js';

export default async function deliveryFactory(delivery) {
  let delivery_id;
  try {
    const delivery_date = await connection.query('SELECT * FROM delivery WHERE day = $1', [delivery]);
    if (delivery_date.rowCount !== 0) {
      delivery_id = delivery_date.rows[0].id;
    }
  } catch (erro) {
    // console.log(erro);
  }
  return delivery_id;
}
