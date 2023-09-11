import { useRef, useState, useEffect } from "react";
import { Circle, Map } from "react-kakao-maps-sdk";

import { Select } from "antd";
import { makeMutable } from "@/libs/common";

import type { ShelterList } from "@/models/safeMapList";
import shelterListModel from "@/models/safeMapList";
import KakaoMapMarkerShelter from "./KakaoMapMarkerShelter";

const KakaoMapShelter = ({
  lat,
  lng
}: {
  lat: string;
  lng: string;
}) => {
  const mapRef = useRef<any>(null);
  const [coordinate, setCoordinate] = useState<Record<"lat" | "lng", number>>({
    lat: 37.5054,
    lng: 127.0071,
  });
  const [shelterList, setShelterList] = useState<ShelterList>(
    shelterListModel.filter((x) => x.lcinfoLa && x.lcinfoLo)
  );
  const [isOpen, setIsOpen] = useState<Record<number, boolean>>({});

  const locationChange = (keyword: string) => {
    setShelterList(shelterListModel.filter((x) => x.adres?.includes(keyword)));
  };

  useEffect(() => {
    locationChange("서울");

    if (lat && lng) {
      setCoordinate({
        lat: Number(lat),
        lng: Number(lng),
      });
    }
  }, []);

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
          level={5}
          ref={mapRef}
          isPanto={true}
        >

          {(lat && lng) && (
            <Circle center={{
              lat: lat as any, lng: lng as any
            }}
            radius={300}
            fillColor="rgb(166, 223, 178)"
            strokeWeight={1}
            strokeOpacity={2}
            strokeStyle={"solid"}
            fillOpacity={0.5}
            strokeColor="rgb(90, 195, 102)"
            />
          )}
          {shelterList &&
            shelterList.map((shelter, index) => (
              <>
                <KakaoMapMarkerShelter
                  key={`markerShelter${index}`}
                  index={index}
                  isOpen={isOpen[index]}
                  shelter={shelter as any}
                  lat={shelter.lcinfoLa as any}
                  lng={shelter.lcinfoLo as any}
                  markerSelect={markerSelect}
                  markerClose={markerClose}
                />
                <Circle
                  key={`circleShelter${index}`}
                  center={{
                    lat: shelter?.lcinfoLa as any,
                    lng: shelter?.lcinfoLo as any,
                  }}
                  radius={200}
                  strokeWeight={1} // 선의 두께입니다
                  strokeColor={`rgb(34, 139, 230)`} // 선의 색깔입니다
                  strokeOpacity={2} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                  strokeStyle={"solid"} // 선의 스타일 입니다
                  fillColor={`rgb(231, 245, 255)`} // 채우기 색깔입니다
                  fillOpacity={0.7} // 채우기 불투명도 입니다
                />
              </>
            ))}
        </Map>
        <LocationSelector handleChange={locationChange as any} />
      </div>
    </>
  );
};

export default KakaoMapShelter;

function LocationSelector({ handleChange }: { handleChange: () => void }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "calc(100% - 40px)",
        left: 0,
        zIndex: 10,
        backgroundColor: "#f2ffffb7",
        border: "1px solid #d1d1d1",
        borderLeft: "none",
        borderTopRightRadius: "none",
        borderBottomRightRadius: 4,
        padding: 4,
        paddingLeft: 12,
        paddingRight: 12,
      }}
    >
      <Select
        defaultValue="서울"
        style={{ width: 200 }}
        onChange={handleChange}
        options={[
          {
            label: "수도권",
            options: [
              { label: "서울", value: "서울" },
              { label: "경기도", value: "경기도" },
            ],
          },
          {
            label: "강원",
            options: [{ label: "강원도", value: "강원" }],
          },
          {
            label: "충청도",
            options: [
              { label: "충청북도", value: "충청북도" },
              { label: "충청남도", value: "충청남도" },
            ],
          },
          {
            label: "경상도",
            options: [
              { label: "경상북도", value: "경상북도" },
              { label: "경상남도", value: "경상남도" },
            ],
          },
          {
            label: "전라도",
            options: [
              { label: "전라북도", value: "전라북도" },
              { label: "전라남도", value: "전라남도" },
            ],
          },
          {
            label: "제주도",
            options: [{ label: "제주도", value: "제주" }],
          },
        ]}
      />
    </div>
  );
}
