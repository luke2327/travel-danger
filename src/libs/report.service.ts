import queryPromise, { connection } from "@/libs/mysql";

export const insertReport = async (params: { content: string }) => {
  const conn = await connection();
  const queryString = `
    INSERT IGNORE INTO daisy_report (content, is_confirm)
    VALUES (${conn.escape(params.content)}, DEFAULT);
  `;

  await queryPromise(queryString);
};

export const getReport = async () => {
  const queryString = `
    SELECT * FROM daisy_report WHERE is_confirm = 1;
  `;

  return queryPromise(queryString);
};
