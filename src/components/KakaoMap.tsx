import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Map } from "react-kakao-maps-sdk";

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

  const markerSelect = (index: number) => {
    const mutable = makeMutable(isOpen);

    Object.keys(mutable).forEach((key) => {
      mutable[key] = false;
    });

    mutable[index] = true;

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
            ))}
        </Map>
      </div>
    </>
  );
};

export default KakaoMap;
