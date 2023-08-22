import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Circle, Map } from "react-kakao-maps-sdk";

import { makeMutable } from "@/libs/common";
import mapMatchInfo from "@/libs/mapMatchInfo";
import type { ServerThreatList, ThreatList } from "@/models/Threat";

import KakaoMapMarker from "./KakaoMapMarker";

const KakaoMap = ({ q }: { q: string | null }) => {
  const mapRef = useRef<any>(null);
  const [coordinate, setCoordinate] = useState<Record<"lat" | "lng", number>>({
    lat: 37.5054,
    lng: 127.0071,
  });
  const [statusColor] = useState({
    예고: {
      background: "rgb(255, 249, 219)",
      stroke: "rgb(250, 176, 5)",
    },
    검거완료: {
      background: "rgb(231, 245, 255)",
      stroke: "rgb(34, 139, 230)",
    },
    허위: {
      background: "rgb(248, 249, 250)",
      stroke: "rgb(134, 142, 150)",
    },
  });
  const [threatList, setThreatList] = useState<ThreatList>([]);
  const [isOpen, setIsOpen] = useState<Record<number, boolean>>({});
  const getThreatList = async () => {
    const url = "https://travel-danger.vercel.app/api/threat/v1/list";
    const result = await axios
      .post<ServerThreatList>(url)
      .then((re) => re.data);

    setThreatList(result.result.data.json.threats);
    result.result.data.json.threats.forEach((x, index) => {
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
    }
  }, []);

  useEffect(() => {
    if (threatList.length) {
      localStorage.setItem("threatList", JSON.stringify(threatList));
    }
  }, [threatList]);

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
          {threatList &&
            threatList.map((threat, index) => (
              <>
                <KakaoMapMarker
                  key={index}
                  index={index}
                  isOpen={isOpen[index]}
                  threat={threat}
                  lat={threat.locationLatitude}
                  lng={threat.locationLongitude}
                  markerSelect={markerSelect}
                  markerClose={markerClose}
                />
                <Circle
                  key={index}
                  center={{
                    lat: threat?.locationLatitude,
                    lng: threat?.locationLongitude,
                  }}
                  radius={200}
                  strokeWeight={1} // 선의 두께입니다
                  strokeColor={`${
                    statusColor[
                      (threat?.status as keyof typeof statusColor) || "예고"
                    ]?.stroke
                  }`} // 선의 색깔입니다
                  strokeOpacity={2} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                  strokeStyle={"solid"} // 선의 스타일 입니다
                  fillColor={`${
                    statusColor[
                      (threat?.status as keyof typeof statusColor) || "예고"
                    ]?.background
                  }`} // 채우기 색깔입니다
                  fillOpacity={0.7} // 채우기 불투명도 입니다
                />
              </>
            ))}
        </Map>
        <MapTooltip />
      </div>
    </>
  );
};

export default KakaoMap;

function MapTooltip() {
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
        <span style={{ color: "rgb(250, 176, 5)" }}>예고</span>
        <Square background={"rgb(34, 139, 230)"} />
        <span style={{ color: "rgb(34, 139, 230)" }}>검거완료</span>
        <Square background={"rgb(134, 142, 150)"} />
        <span style={{ color: "rgb(134, 142, 150)" }}>허위</span>
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
