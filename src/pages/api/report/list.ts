import type { NextApiRequest, NextApiResponse } from "next";

import { openGate } from "@/libs/common";
import { getReport, insertReport } from "@/libs/report.service";

type Data = {
  result: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await openGate(req, res);

  let { body } = req;

  if (body && typeof body === "string") {
    body = JSON.parse(body);
  }

  const result = await getReport();

  res.status(200).json({ result });
}
