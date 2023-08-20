import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

import { openGate } from "@/libs/common";
import { getNews } from "@/libs/news.service";

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
  };
  if (typeof body === "string") {
    body = JSON.parse(body);
  }
  const response = await getNews(body);

  res.status(200).json(response);
}
