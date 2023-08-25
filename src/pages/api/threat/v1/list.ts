import type { NextApiRequest, NextApiResponse } from "next";

import { openGate } from "@/libs/common";
import { getThreatList } from "@/libs/threat.service";
import type { ThreatList } from "@/models/Threat";

type Data = {
  result: ThreatList;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await openGate(req, res);
  const { body } = req;

  console.log(body);

  const result = await getThreatList(body);

  res.status(200).json({ result });
}
