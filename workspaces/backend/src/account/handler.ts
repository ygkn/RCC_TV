import { Request, Response } from 'express';
import MySQL from 'mysql';

import { connect, query } from '../utils/sql';
import { UsersRecord } from '../models/records';
import { dbConfig } from '../config';

export const handler = async (req: Request, res: Response) => {
  const name: string = req.params.name;

  const connection = MySQL.createConnection(dbConfig);

  try {
    await connect(connection);
    const users = await query<UsersRecord>(
      connection,
      `SELECT * FROM users WHERE name=?`,
      [name]
    );
    if (users.length === 0) {
      console.log(
        `ユーザーネーム '${name}' に対するアカウントが見つかりませんでした`
      );
      res.writeHead(400);
      res.end();
      return;
    }
    res.json(users[0]);
  } catch (e) {
    console.log(e);
    res.writeHead(500);
    res.end();
  } finally {
    connection.end();
  }
};
