import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import qs from "qs";

import { openGate } from "@/libs/common";

type Data = {
  name: string;
};

type searchType = "09" | "23" | "22" | "20" | "18" | "17";

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
  await openGate(req, res);

  const { body } = req;

  config.url = "https://www.safe182.go.kr/api/lcm/safeMap.do";
  config.data = qs.stringify({
    esntlId: auth.id,
    authKey: auth.apiKey,
    pageIndex: body.pageIndex || 1,
    pageUnit: body.pageUnit || 100,
  });

  const response = await axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  res.status(200).json(response);
}
