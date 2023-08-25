// import type { NextApiRequest, NextApiResponse } from "next";
//
// import { openGate } from "@/libs/common";
// import { getThreatList } from "@/libs/threat.service";
// import type { SupportedLanguage } from "@/models/language";
// import type { ThreatList } from "@/models/Threat";
//
// type Data = {
//   result: ThreatList;
// };
//
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   await openGate(req, res);
//
//   let body = req.query as {
//     keyword: string;
//     locale: SupportedLanguage;
//   };
//
//   if (typeof body === "string" && body !== "") {
//     body = JSON.parse(body);
//   }
//
//   const result = await getThreatList(body);
//
//   res.status(200).json({ result });
// }

import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

import { openGate } from "@/libs/common";
import type { SupportedLanguage } from "@/models/language";

type Data = {
  result: any;
  body: any;
};

const config = {
  method: "get",
  maxBodyLength: Infinity,
} as AxiosRequestConfig;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await openGate(req, res);

  let body = req.body as {
    keyword: string;
    locale: SupportedLanguage;
  };

  if (typeof body === "string" && body !== "") {
    body = JSON.parse(body);
  }

  config.url = "https://api.terrorless.01ab.net/trpc/threat.list";

  const response = await axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  const result = response.result.data.json.threats.map((x: any) => {
    const { objectType, id, ...r } = x;

    return r;
  });

  res.status(200).json({ result, body });
}
