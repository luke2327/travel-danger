import type { FieldPacket, RowDataPacket } from "mysql2/promise";
import { createConnection, format } from "mysql2/promise";

async function getConnection(dbName?: "private") {
  return createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: dbName || process.env.DB_DATABASE,
  });
}

export default async function queryPromise<T = any>(
  queryString: string,
  values?: any
): Promise<T> {
  const conn = await getConnection();
  let returnObject;

  try {
    [returnObject] = await conn.query(queryString, values);
  } catch (e) {
    console.log(e);
  } finally {
    conn.end();
  }

  return returnObject as any;
}

export async function connection() {
  return getConnection();
}
