import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Circle, Map } from "react-kakao-maps-sdk";

import { makeMutable } from "@/libs/common";
import mapMatchInfo from "@/libs/mapMatchInfo";
import type { SupportedLanguage } from "@/models/language";
import type { ThreatList } from "@/models/Threat";

import KakaoMapMarker from "./KakaoMapMarker";

const KakaoMap = ({
  q,
  locale,
  lat,
  lng
}: {
  q: string | null;
  locale: SupportedLanguage;
  lat: string;
  lng: string;
}) => {
  const mapRef = useRef<any>(null);
  const [coordinate, setCoordinate] = useState<Record<"lat" | "lng", number>>({
    lat: 37.5054,
    lng: 127.0071,
  });
  const [statusColor] = useState({
    caution: {
      background: "rgb(255, 249, 219)",
      stroke: "rgb(250, 176, 5)",
    },
    safe: {
      background: "rgb(231, 245, 255)",
      stroke: "rgb(34, 139, 230)",
    },
    liar: {
      background: "rgb(248, 249, 250)",
      stroke: "rgb(134, 142, 150)",
    },
  });
  const [threatList, setThreatList] = useState<ThreatList>([]);
  const [isOpen, setIsOpen] = useState<Record<number, boolean>>({});
  const getThreatList = async () => {
    const url = "https://travel-danger.vercel.app/api/threat/v1/list";
    // const url = "http://localhost:3001/api/threat/v1/list";
    const response = await axios
      .post<{ result: ThreatList }>(url, { locale })
      .then((re) => re.data)
      .catch((e) => {
        console.log("-------------------------");
        console.log(e);
        console.log("-------------------------");

        return { result: [] };
      });

    setThreatList(response.result);
    response.result.forEach((x, index) => {
      setIsOpen({ ...isOpen, [index]: false });
    });
  };

  useEffect(() => {
    const threatListLocalStorage = localStorage.getItem("threatList");

    if (!threatListLocalStorage || !JSON.parse(threatListLocalStorage).length) {
      getThreatList();
    } else {
      setThreatList(JSON.parse(threatListLocalStorage));
    }

    if (q && mapMatchInfo[q as keyof typeof mapMatchInfo]) {
      const [lat, lng] = mapMatchInfo[q as keyof typeof mapMatchInfo];

      setCoordinate({
        lat: parseFloat(lat.toFixed(4)),
        lng: parseFloat(lng.toFixed(4)),
      });
    } else if (lat && lng) {
      setCoordinate({
        lat: Number(lat),
        lng: Number(lng),
      });
    }
  }, []);

  // useEffect(() => {
  //   if (threatList.length) {
  //     localStorage.setItem("threatList", JSON.stringify(threatList));
  //   }
  // }, [threatList]);

  const markerSelect = (index: number, lat: number, lng: number) => {
    const mutable = makeMutable(isOpen);

    Object.keys(mutable).forEach((key) => {
      mutable[key] = false;
    });

    mutable[index] = true;

    setCoordinate({ lat, lng });
    setIsOpen(mutable);
  };

  const markerClose = (index: number) => {
    setIsOpen({ ...isOpen, [index]: false });
  };

  return (
    <>
      <div style={{ width: "100vw", height: "100vh", position: "absolute" }}>
        <Map
          center={coordinate}
          style={{ width: "100%", height: "100%" }}
          level={7}
          ref={mapRef}
          isPanto={true}
        >
          {(lat && lng) && (
          <Circle center={{
            lat: lat as any, lng: lng as any
          }}
          radius={600}
          fillColor="rgb(166, 223, 178)"
          strokeWeight={1}
          strokeOpacity={2}
          strokeStyle={"solid"}
          fillOpacity={0.5}
          strokeColor="rgb(90, 195, 102)"
          />)}
          {threatList &&
            threatList.map((threat, index) => (
              <>
                <KakaoMapMarker
                  key={`marker${index}`}
                  index={index}
                  isOpen={isOpen[index]}
                  threat={threat}
                  lat={threat.locationLatitude}
                  lng={threat.locationLongitude}
                  markerSelect={markerSelect}
                  markerClose={markerClose}
                  statusClass={threat.statusClass}
                />
                <Circle
                  key={`circle${index}`}
                  center={{
                    lat: threat?.locationLatitude,
                    lng: threat?.locationLongitude,
                  }}
                  radius={200}
                  strokeWeight={1} // 선의 두께입니다
                  strokeColor={`${
                    statusColor[threat?.statusClass as keyof typeof statusColor]
                      ?.stroke
                  }`} // 선의 색깔입니다
                  strokeOpacity={2} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                  strokeStyle={"solid"} // 선의 스타일 입니다
                  fillColor={`${
                    statusColor[threat?.statusClass as keyof typeof statusColor]
                      ?.background
                  }`} // 채우기 색깔입니다
                  fillOpacity={0.7} // 채우기 불투명도 입니다
                />
              </>
            ))}
        </Map>
        <MapTooltip locale={locale} />
      </div>
    </>
  );
};

export default KakaoMap;

const tooltipMsgList: Record<
  SupportedLanguage,
  { caution: string; safe: string; liar: string }
> = {
  ko: {
    caution: "예고",
    safe: "검거완료",
    liar: "허위",
  },
  ja: {
    caution: "予告",
    safe: "検挙完了",
    liar: "虚偽",
  },
  en: {
    caution: "Caution",
    safe: "Arrest",
    liar: "Falsehood",
  },
  cn: {
    caution: "预告",
    safe: "检举完毕",
    liar: "虚伪",
  },
  vi: {
    caution: "sự cảnh báo",
    safe: "sự giam giữ",
    liar: "sự hư cấu",
  },
};

function MapTooltip({ locale }: { locale: SupportedLanguage }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% - 40px)",
        right: 0,
        zIndex: 10,
        backgroundColor: "#f2ffffb7",
        border: "1px solid #d1d1d1",
        borderRight: "none",
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        padding: 4,
        paddingLeft: 12,
        paddingRight: 12,
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Square background={"rgb(250, 176, 5)"} />
        <span style={{ color: "rgb(250, 176, 5)" }}>
          {tooltipMsgList[locale].caution}
        </span>
        <Square background={"rgb(34, 139, 230)"} />
        <span style={{ color: "rgb(34, 139, 230)" }}>
          {tooltipMsgList[locale].safe}
        </span>
        <Square background={"rgb(134, 142, 150)"} />
        <span style={{ color: "rgb(134, 142, 150)" }}>
          {tooltipMsgList[locale].liar}
        </span>
      </span>
    </div>
  );
}

function Square({ background }: { background: string }) {
  return (
    <div
      style={{
        width: 14,
        height: 14,
        backgroundColor: background,
        border: "1px solid #d1d1d1",
      }}
    />
  );
}
