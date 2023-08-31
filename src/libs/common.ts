import type { AxiosResponse, RawAxiosRequestConfig } from "axios";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export const makeMutable = (data: any) => JSON.parse(JSON.stringify(data));

export const openGate = async (req: NextApiRequest, res: NextApiResponse) => {
  const origin =
    process.env.NODE_ENV === "development"
      ? "*"
      : [
          "daisy.fmawo.com",
          "fmawo.com",
          "http://fmawo.com",
          "http://daisy.fmawo.com",
          "https://travel-danger.vercel.app",
          "vercel.app",
        ];
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
};

export const sendUrl = async <T extends object = any>({
  method = "GET",
  ...rest
}: RawAxiosRequestConfig<any>): Promise<AxiosResponse<T, T>> =>
  axios({ method, ...rest });

export const difference = (first: any[], second: any[]) =>
  first.filter((x) => second.indexOf(x) === -1);

export const chunkArray = (arr: any[], chunkCount: number) => {
  if (chunkCount === 1) return [arr];
  const chunked = [];
  let position = 0;
  for (let i = 0; i < chunkCount; i++) {
    const chunkLength = Math.ceil((arr.length - position) / (chunkCount - i));
    chunked.push([]);
    chunked[i] = arr.slice(position, chunkLength + position);
    position += chunkLength;
  }
  return chunked;
};
