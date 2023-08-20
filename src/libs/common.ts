import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export const makeMutable = (data: any) => JSON.parse(JSON.stringify(data));

export const openGate = async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
};
