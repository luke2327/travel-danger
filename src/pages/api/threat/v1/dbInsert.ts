import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

import { openGate } from "@/libs/common";
import { insertThreatList, updateThreatList } from "@/libs/threat.service";
import type { ServerThreatList } from "@/models/Threat";

type Data = Omit<ServerThreatList, "objectType" | "id">;

const config = {
  method: "get",
  maxBodyLength: Infinity,
} as AxiosRequestConfig;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await openGate(req, res);

  config.url = "https://api.terrorless.01ab.net/trpc/threat.list";

  const response = (await axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    })) as ServerThreatList;

  // await insertThreatList({
  //   data: response.result.data.json.threats,
  // });

  await updateThreatList({ data: response.result.data.json.threats });

  const result = response.result.data.json.threats.map((x) => {
    const { objectType, id, ...r } = x;

    return r;
  });

  res
    .status(200)
    .json({ result: { data: { json: { threats: result } } } } as Data);
}
