import axios from "axios";
import cheerio from "cheerio";

// axios를 활용해 AJAX로 HTML 문서를 가져오는 함수 구현
export async function getHTML(params: { keyword: string }) {
  try {
    const searchKeyWord = encodeURI(`${params.keyword}`);

    return await axios
      .get(
        `https://search.naver.com/search.naver?where=news&ie=utf8&sm=nws_hty&query=${searchKeyWord}`
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
          };
        });
        return titleList;
      });
  } catch (error) {
    console.error(error);

    return error;
  }
}
