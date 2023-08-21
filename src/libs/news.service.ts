import axios from "axios";
import cheerio from "cheerio";
import qs from "qs";

// axios를 활용해 AJAX로 HTML 문서를 가져오는 함수 구현
export async function getNews(params: {
  keyword: string;
  language: "ko" | "ja";
}) {
  if (params.language === "ko") {
    return getNewsNaver(params);
  }
  if (params.language === "ja") {
    return getNewsYahoo(params);
  }

  return [];
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
            title: $(this).find("div div a.news_tit").text(),
            desc: $(this).find("div div div.news_dsc div a").text(),
            url: $(this).find("div div a.news_tit").attr("href"),
            imgUrl: $(this).find("div a.dsc_thumb img").attr("data-lazysrc"),
          };
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

        returnData.push({
          url,
          imgUrl,
          title,
          desc,
          time,
        });
      });
  });

  return returnData;
}
