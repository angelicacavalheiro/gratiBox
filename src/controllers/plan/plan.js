import connection from '../../database/database.js';
import planTypeFactory from '../../factories/planTypeFactory.js';
import deliveryFactory from '../../factories/deliveryFactory.js';
import productsFactory from '../../factories/productsFactory.js';

async function planPost(req, res) {
  const {
    planType, delivery, product, token,
  } = req.body;

  // get na tabela plan_type
  const plan_type_id = await planTypeFactory(planType);

  // get na tabela delivery
  const delivery_id = await deliveryFactory(delivery);

  // get na tabela products
  const products_id = await productsFactory(product);

  // pegando id do user
  if (!token) return res.sendStatus(401);
  try {
    const findToken = await connection.query(`
    SELECT "user_id" FROM "session" WHERE "token" = ($1);
    `, [token]);

    if (findToken.rowCount === 0) {
      return res.status(401).send('Você não está logado');
    }

    const { user_id } = findToken.rows[0];

    // verificando se esse usuario ja possui um plano
    const findAdress = await connection.query(`
    SELECT "user_id" FROM "plan" WHERE "user_id" = ($1);
    `, [user_id]);

    if (findAdress.rowCount === 0) {
      // insert na tabela plano
      await connection.query(`
      INSERT INTO plan (type_plan_id, delivery_id, products_id, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `, [plan_type_id, delivery_id, products_id, user_id]);
      return res.sendStatus(200);
    }

    // update na tabela plano
    await connection.query(`
      UPDATE plan SET type_plan_id = $1, delivery_id = $2, products_id = $3
       WHERE user_id = $4
      RETURNING *
      `, [plan_type_id, delivery_id, products_id, user_id]);
    return res.sendStatus(200);
  } catch (erro) {
    return res.status(500).send(erro);
  }
}

async function planGet(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  try {
    if (!token) return res.sendStatus(401);
    const findToken = await connection.query(`
    SELECT "user_id" FROM "session" WHERE "token" = ($1);
    `, [token]);

    if (findToken.rowCount === 0) {
      return res.status(401).send('Você não está logado');
    }

    const { user_id } = findToken.rows[0];
    const plan = await connection.query(
      `
        SELECT plan.id, plan.user_id, plan_type.type, delivery.day, products.product
        FROM plan
          JOIN plan_type ON plan.type_plan_id = plan_type.id
          JOIN delivery ON plan.delivery_id = delivery.id
          JOIN products ON plan.products_id = products.id
        WHERE plan.user_id = $1;
      `,
      [user_id],
    );
    return res.send(plan.rows);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export {
  planPost,
  planGet,
};
