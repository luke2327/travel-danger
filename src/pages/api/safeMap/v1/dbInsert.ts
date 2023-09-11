import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import qs from "qs";

import { openGate } from "@/libs/common";

type Data = {
  result: any;
};

const auth = {
  id: "10000568",
  apiKey: "c65fe2aac3754104",
};

const config = {
  method: "post",
  maxBodyLength: Infinity,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
} as AxiosRequestConfig;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const MAX = 130;
  const COUNT = 100;
  await openGate(req, res);

  config.url = "https://www.safe182.go.kr/api/lcm/safeMap.do";

  const returnData = [];

  for (let i = 1; i <= 130; i++) {
    config.data = qs.stringify({
      esntlId: auth.id,
      authKey: auth.apiKey,
      pageIndex: i,
      pageUnit: COUNT,
    });

    const response = await axios
      .request(config)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
      });

    returnData.push(...response.list);
  }

  res.status(200).json({ result: returnData });
}
