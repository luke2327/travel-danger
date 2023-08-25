import type { NextApiRequest, NextApiResponse } from "next";

import { openGate } from "@/libs/common";
import { getThreatList } from "@/libs/threat.service";
import type { SupportedLanguage } from "@/models/language";
import type { ThreatList } from "@/models/Threat";

type Data = {
  result: ThreatList;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // await openGate(req, res);

  let body = req.body as {
    keyword: string;
    locale: SupportedLanguage;
  };

  if (typeof body === "string" && body !== "") {
    body = JSON.parse(body);
  }

  const result = await getThreatList(body);

  res.status(200).json({ result });
}
