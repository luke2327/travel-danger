import type { NextApiRequest, NextApiResponse } from "next";

import { openGate } from "@/libs/common";
import { insertNewsExclusive } from "@/libs/news.service";
import type { SupportedLanguage } from "@/models/language";

type Data = {
  result: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await openGate(req, res);

  let body = req.body as {
    keyword: string;
    language: SupportedLanguage;
  };
  if (typeof body === "string" && body !== "") {
    body = JSON.parse(body);
  }

  await insertNewsExclusive(body.language);

  res.status(200).json({ result: "SUCCESS" });
}
