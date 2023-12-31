import type { NextApiRequest, NextApiResponse } from "next";

import { openGate } from "@/libs/common";
import { getNews2 } from "@/libs/news.service";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await openGate(req, res);

  let body = req.body as {
    keyword: string;
    language: "ko" | "ja" | "cn";
  };
  if (typeof body === "string" && body !== "") {
    body = JSON.parse(body);
  }

  const response = await getNews2(body);

  // await insertNews(response);

  res.status(200).json(response as any);
}
