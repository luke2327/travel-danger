import axios from "axios";
import cheerio from "cheerio";
import { Md5 } from "md5-typescript";
import qs from "qs";

import { difference } from "@/libs/common";
import { translate } from "@/libs/language.service";
import queryPromise, { connection } from "@/libs/mysql";
import type { SupportedLanguage } from "@/models/language";
import { supportedLanguage } from "@/models/language";

// axios를 활용해 AJAX로 HTML 문서를 가져오는 함수 구현
export async function getNews(params: {
  keyword: string;
  language: "ko" | "ja" | "cn";
}) {
  if (params.language === "ko") {
    return getNewsNaver(params);
  }
  if (params.language === "ja") {
    return getNewsYahoo(params);
  }

  return getNewsNaver(params);
}

export async function getNews2(params: { language: SupportedLanguage }) {
  let where = `WHERE language = '${params.language}'`;

  if (params.language === "ko") {
    where += ` AND source = 'naver.com'`;
  } else if (params.language === "ja") {
    where += ` AND source = 'yahoo.co.jp'`;
  }

  const queryString = `
    SELECT * FROM daisy_news ${where} ORDER BY id;
  `;

  return queryPromise(queryString);
}

async function getNewsNaver(params: { keyword: string }) {
  const searchKeyWord = encodeURI(`${params.keyword}`);
  const limit = 10 + 1;
  const chunk = 10;
  const query = {
    where: "news",
    ie: "utf8",
    sm: "tab_opt",
    sort: 1,
  } as any;

  const returnData = [];

  for (let i = 1; i <= limit; i += chunk) {
    query.start = i;

    const data = await axios
      .get(
        `https://search.naver.com/search.naver?query=살인&${qs.stringify(
          query
        )}`
      )
      .then((html) => {
        const titleList = [] as any;
        const $ = cheerio.load(html.data);
        // ul.list_news를 찾고 그 children 노드를 bodyList에 저장
        const bodyList = $("ul.list_news").children("li.bx");

        // bodyList를 순회하며 titleList에 div > div > a의 내용을 저장
        bodyList.each(function (i, elem) {
          titleList[i] = {
            source: "naver.com",
            title: $(this).find("div div a.news_tit").text(),
            desc: $(this).find("div div div.news_dsc div a").text(),
            url: $(this).find("div div a.news_tit").attr("href"),
            imgUrl: $(this).find("div a.dsc_thumb img").attr("data-lazysrc"),
            language: "ko",
          };

          titleList[i].id = Md5.init(
            [titleList[i].title, titleList[i].source].join("")
          );
        });

        return titleList;
      });

    returnData.push(...data);
  }

  return returnData.filter((x) => x.imgUrl);
}
async function getNewsGoogle(params: { keyword: string }) {}
async function getNewsYahoo(params: { keyword: string }) {
  const query = {
    where: "news",
    ei: "utf-8",
    categories: "world",
    sort: 1,
  } as any;
  const url = `https://news.yahoo.co.jp/search?p=韓国 殺人&${qs.stringify(
    query
  )}`;
  const returnData = [] as any;

  await axios.get(url).then((html) => {
    const $ = cheerio.load(html.data);

    $("li.newsFeed_item-normal")
      .children("a")
      .each(function () {
        const url = $(this).attr("href");
        const imgUrl = $(this)
          .find("picture source:first-child")
          .attr("srcset");
        const title = $(this)
          .find(".newsFeed_item_text .newsFeed_item_title")
          .text();
        const desc = $(this)
          .find(".newsFeed_item_text div:nth-child(2)")
          .text()
          .replace(/…/, "")
          // eslint-disable-next-line no-irregular-whitespace
          .replace(/ /, " ");
        const time = $(this).find(".newsFeed_item_date").text();

        const data: any = {
          source: "yahoo.co.jp",
          language: "ja",
          url,
          imgUrl,
          title,
          desc,
          time,
        };

        data.id = Md5.init([data.title, data.source].join(""));

        returnData.push(data);
      });
  });

  return returnData;
}
async function getNewsBaidu() {
  const url =
    "https://bbs.icnkr.com/search.php?mod=forum&searchid=720&orderby=lastpost&ascdesc=desc&searchsubmit=yes&kw=韩国+谋杀";

  await axios.get(url).then((html) => {
    console.log(html);
  });
}

export async function insertNews(params: any) {
  const conn = await connection();

  for (const row of params) {
    const queryString = `
      INSERT IGNORE INTO \`fmawo.com\`.daisy_news (id, source, language, title, description, url, img_url)
      VALUES (
        '${row.id}',
        '${row.source}',
        '${row.language}',
        ${conn.escape(row.title)},
        ${conn.escape(row.desc)},
        '${row.url}',
        '${row.imgUrl}'
      )
  `;

    await queryPromise(queryString);
  }
}

export async function insertNewsExclusive(source: SupportedLanguage) {
  const conn = await connection();
  const prefix = `
      INSERT IGNORE INTO \`fmawo.com\`.daisy_news (id, source, language, title, description, url, img_url)
  `;

  const list = await queryPromise(
    `SELECT id, source, title, description, url, img_url, group_concat(language) as language FROM daisy_news GROUP BY id`
  );

  for (const row of list) {
    const supLanguage = supportedLanguage;
    const diffLanguage: SupportedLanguage[] = difference(
      supLanguage,
      row.language.split(",")
    );

    console.log(diffLanguage);

    for (const language of diffLanguage) {
      console.log(row.title);
      const title = await translate(row.title, language, source);
      const description = await translate(row.description, language, source);
      const url = `https://papago.naver.net/website?locale=ko&source=auto&target=${language}&url=${row.url}`;

      const queryString = `
        ${prefix}
        VALUES (
          '${row.id}',
          '${row.source}',
          '${language}',
          ${conn.escape(title)},
          ${conn.escape(description)},
          '${url}',
          '${row.img_url}'
        )
      `;

      await queryPromise(queryString);
    }
  }
}
