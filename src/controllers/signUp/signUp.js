import bcrypt from 'bcrypt';
import connection from '../../database/database.js';
import signUpSchema from '../../schemas/signUpSchema.js';

async function singUp(req, res) {
  const {
    name, email, password,
  } = req.body;
  const isCorrectBody = signUpSchema.validate(req.body);

  if (isCorrectBody.error) {
    return res.status(400).send(`${isCorrectBody.error.details[0].message}`);
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  try {
    const existEmail = await connection.query(
      `
        SELECT * FROM "user"
        WHERE email = $1
    `,
      [email],
    );

    if (existEmail.rowCount !== 0) {
      return res.sendStatus(403);
    }

    await connection.query(
      `
        INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3)
    `,
      [name, email, passwordHash],
    );
    return res.sendStatus(200);
  } catch (erro) {
    return res.sendStatus(500);
  }
}

export default singUp;
