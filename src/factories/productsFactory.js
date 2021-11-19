import connection from '../database/database.js';

export default async function productsFactory(product) {
  let products_id;
  try {
    const products = await connection.query('SELECT * FROM products WHERE product = $1', [product]);
    if (products.rowCount !== 0) {
      products_id = products.rows[0].id;
    }
  } catch (erro) {
    console.log(erro);
  }
  return products_id;
}
