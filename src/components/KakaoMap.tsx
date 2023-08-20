import axios from "axios";
import { useEffect, useState } from "react";
import { Map } from "react-kakao-maps-sdk";

import { makeMutable } from "@/libs/common";
import type { ServerThreatList, ThreatList } from "@/models/Threat";

import KakaoMapMarker from "./KakaoMapMarker";

const KakaoMap = () => {
  const [threatList, setThreatList] = useState<ThreatList>([]);
  const [isOpen, setIsOpen] = useState<Record<number, boolean>>({});
  const getThreatList = async () => {
    const result = await axios
      .post<ServerThreatList>(
        "https://travel-danger.vercel.app/api/threat/v1/list"
      )
      .then((re) => re.data);

    setThreatList(result.result.data.json.threats);
    result.result.data.json.threats.forEach((x, index) => {
      setIsOpen({ ...isOpen, [index]: false });
    });
  };

  useEffect(() => {
    getThreatList();
  }, []);

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
          center={{ lat: 37.5054, lng: 127.0071 }}
          style={{ width: "100%", height: "100%" }}
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
