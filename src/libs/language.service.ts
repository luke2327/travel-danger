import axios from "axios";

import { sendUrl } from "@/libs/common";
import type {
  LanguageTranslateResult,
  SupportedLanguage,
} from "@/models/language";

const getNaverHeader = () => {
  axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded; charset=UTF-8";
  axios.defaults.headers.post["x-naver-client-id"] =
    process.env.NAVER_CLIENT_ID;
  axios.defaults.headers.post["x-naver-client-secret"] =
    process.env.NAVER_CLIENT_SECRET;
};

export const translate = async (
  text: string,
  to: SupportedLanguage,
  source = "ko"
) => {
  let target: any = to;

  if (to === "cn") {
    target = "zh-CN";
  }

  console.log(source, target);
  const {
    data: {
      message: {
        result: { translatedText },
      },
    },
  } = await sendUrl<LanguageTranslateResult>({
    method: "POST",
    url: "https://openapi.naver.com/v1/papago/n2mt",
    params: {
      source,
      target,
      text: text
        .replaceAll("[", "")
        .replaceAll("]", "")
        .replaceAll("「", "")
        .replaceAll("」", ""),
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-naver-client-id": process.env.NAVER_CLIENT_ID,
      "x-naver-client-secret": process.env.NAVER_CLIENT_SECRET,
    },
  });

  return translatedText;
};
