import connection from '../database/database.js';

export default async function planTypeFactory(planType) {
  let plan_type_id;
  try {
    const plan = await connection.query('SELECT * FROM plan_type WHERE type = $1', [planType]);
    if (plan.rowCount !== 0) {
      plan_type_id = plan.rows[0].id;
    }
  } catch (erro) {
    // console.log(erro);
  }
  return plan_type_id;
}
