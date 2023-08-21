import type { NextApiRequest, NextApiResponse } from "next";

import { openGate } from "@/libs/common";
import policeInfo from "@/libs/policeInfo";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await openGate(req, res);

  let body = req.body as {
    capital: keyof typeof policeInfo;
  };
  let response: any = {};

  if (body && typeof body === "string") {
    body = JSON.parse(body);
  }

  if (body) {
    const { capital } = body;

    response = { [capital]: policeInfo[capital] };
  } else {
    response = policeInfo;
  }

  res.status(200).json(response);
}
