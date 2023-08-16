import type {NextApiRequest, NextApiResponse} from 'next'
import axios, {AxiosRequestConfig} from 'axios';

type Data = {
  name: string
}

const config = {
  method: 'get',
  maxBodyLength: Infinity,
} as AxiosRequestConfig;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  config.url = 'https://api.terrorless.01ab.net/trpc/threat.list';

  const response = await axios.request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  res.status(200).json(response)
}
