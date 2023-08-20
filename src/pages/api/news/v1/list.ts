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

  const body = req.body as {
    keyword: string;
  };
  const response = await getNews(body);

  res.status(200).json(response);
}
