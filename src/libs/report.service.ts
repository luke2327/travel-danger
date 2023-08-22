import queryPromise, { connection } from "@/libs/mysql";

export const insertReport = async (params: { content: string }) => {
  const conn = await connection();
  const queryString = `
    INSERT IGNORE INTO daisy_report (content, is_confirm)
    VALUES (${conn.escape(params.content)}, DEFAULT);
  `;

  await queryPromise(queryString);
};
