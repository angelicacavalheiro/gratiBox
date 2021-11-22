/* eslint-disable indent */
import connection from '../../database/database.js';
import cepFactory from '../../factories/cepFactory.js';
import cityFactory from '../../factories/cityFactory.js';
import stateFactory from '../../factories/stateFactory.js';

async function adressPost(req, res) {
  const {
    cep, state, city, street, number, token,
  } = req.body;

  // insert na tabela cep
  const cep_id = await cepFactory(cep);

  // insert na tabela state
  const city_id = await cityFactory(city);

  // insert na tabela city
  const state_id = await stateFactory(state);

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

    // verificando se esse usuario ja possui um endereço

    const findAdress = await connection.query(`
    SELECT "user_id" FROM "adress" WHERE "user_id" = ($1);
    `, [user_id]);

    if (findAdress.rowCount === 0) {
      // insert na tabela adress
      await connection.query(`
      INSERT INTO adress (street, number, state_id, city_id, cep_id, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `, [street, number, state_id, city_id, cep_id, user_id]);
      return res.sendStatus(200);
    }

    // update na tabela adress
    await connection.query(`
      UPDATE adress SET street = $1, number = $2, state_id = $3, city_id = $4, cep_id = $5
       WHERE user_id = $6
      RETURNING *
      `, [street, number, state_id, city_id, cep_id, user_id]);
    return res.sendStatus(200);
  } catch (erro) {
    return res.sendStatus(500);
  }
}

async function adressGet(req, res) {
  const {
    token,
  } = req.body;
    if (!token) return res.sendStatus(401);
    const findToken = await connection.query(`
    SELECT "user_id" FROM "session" WHERE "token" = ($1);
    `, [token]);

    if (findToken.rowCount === 0) {
      return res.status(401).send('Você não está logado');
    }

    const { user_id } = findToken.rows[0];
    try {
      const adresses = await connection.query(
`
      SELECT adress.id, adress.street, adress.number, state.state_name, city.city_name, cep.code
      FROM adress
        JOIN state ON adress.state_id = state.id
        JOIN city ON adress.city_id = city.id
        JOIN cep ON adress.cep_id = cep.id
      WHERE adress.user_id = $1;
      `,
      [user_id],
      );
      return res.send(adresses.rows);
    } catch (error) {
      return res.sendStatus(500);
    }
}

export {
    adressPost,
    adressGet,
};
