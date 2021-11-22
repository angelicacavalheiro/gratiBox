import connection from '../database/database.js';

export default async function logout(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if (!token) return res.sendStatus(401);
  try {
    await connection.query(
      `
        DELETE FROM session WHERE token = $1;
        `,
      [token],
    );
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
}
