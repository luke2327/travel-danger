import { useRef, useState, useEffect } from "react";
import { Circle, Map } from "react-kakao-maps-sdk";

import { Select } from "antd";
import { makeMutable } from "@/libs/common";

import type { ShelterList } from "@/models/safeMapList";
import shelterListModel from "@/models/safeMapList";
import type { SupportedLanguage } from "@/models/language";
import KakaoMapMarkerShelter from "./KakaoMapMarkerShelter";

const KakaoMapShelter = ({
  lat,
  lng,
  locale,
  isPhone
}: {
  lat: string;
  lng: string;
  locale: SupportedLanguage;
  isPhone: boolean;
}) => {
  const mapRef = useRef<any>(null);
  const [coordinate, setCoordinate] = useState<Record<"lat" | "lng", number>>({
    lat: 37.5054,
    lng: 127.0071,
  });
  const [shelterList, setShelterList] = useState<ShelterList>(
    shelterListModel.filter((x: ShelterList[0]) => x.lcinfoLa && x.lcinfoLo)
  );
  const [isOpen, setIsOpen] = useState<Record<number, boolean>>({});

  const locationChange = (keyword: string) => {
    setShelterList(shelterListModel.filter((x) => x.adres?.includes(keyword)));
  };

  useEffect(() => {
    setLocalAreaMap();

    if (lat && lng) {
      setCoordinate({
        lat: Number(lat),
        lng: Number(lng),
      });
    }
  }, []);

  const setLocalAreaMap = () => {
    let filter = (x: ShelterList[0]) => x.adres?.includes("서울");
    if (isPhone && lat && lng) {
      filter = (x: ShelterList[0]) => (
        x.lcinfoLa &&
        x.lcinfoLo &&
        Math.abs(x.lcinfoLa - Number(lat)) < 0.02 &&
        Math.abs(x.lcinfoLo - Number(lng)) < 0.02
      ) as boolean;
    } else if (!isPhone && lat && lng) {
      filter = (x: ShelterList[0]) => (
        x.lcinfoLa &&
        x.lcinfoLo &&
        Math.abs(x.lcinfoLa - Number(lat)) < 0.03 &&
        Math.abs(x.lcinfoLo - Number(lng)) < 0.03
      ) as boolean;
    }

    setShelterList(shelterListModel.filter(filter));
  };

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
        <LocationSelector handleChange={locationChange as any} locale={locale} />
      </div>
    </>
  );
};

export default KakaoMapShelter;

const localLanguageMenu: Record<SupportedLanguage, { [key in string]: { label: string; value: string } }> = {
  ko: {
    metropolitan: { label: '수도권', value: '수도권' },
    seoul: { label: '서울', value: '서울' },
    kyeongkido: { label: '경기도', value: '경기도' },
    kangwon: { label: '강원', value: '강원' },
    kangwondo: { label: '강원도', value: '강원도' },
    chungcheongdo: { label: '충청도', value: '충청도' },
    chungcheongbukdo: { label: '충청북도', value: '충청북도' },
    chungcheongnamdo: { label: '충청남도', value: '충청남도' },
    kyungsangdo: { label: '경상도', value: '경상도' },
    kyungsangbukdo: { label: '경상북도', value: '경상북도' },
    kyungsangnamdo: { label: '경상남도', value: '경상남도' },
    jeonlado: { label: '전라도', value: '전라도' },
    jeonlabukdo: { label: '전라북도', value: '전라북도' },
    jeonlanamdo: { label: '전라남도', value: '전라남도' },
    jejudo: { label: '제주도', value: '제주도' },
  },
  en: {
    metropolitan: { label: 'metropolitan area', value: '수도권' },
    seoul: { label: 'Seoul', value: '서울' },
    kyeongkido: { label: 'Gyeonggi-do', value: '경기도' },
    kangwon: { label: 'Gangwon', value: '강원' },
    kangwondo: { label: 'Gangwon-do', value: '강원도' },
    chungcheongdo: { label: 'Chungcheong-do', value: '충청도' },
    chungcheongbukdo: { label: 'Chungcheongbuk-do', value: '충청북도' },
    chungcheongnamdo: { label: 'Chungcheongnam-do', value: '충청남도' },
    kyungsangdo: { label: 'Gyeongsangdo', value: '경상도' },
    kyungsangbukdo: { label: 'Gyeongsangbuk-do', value: '경상북도' },
    kyungsangnamdo: { label: 'Gyeongsangnam-do', value: '경상남도' },
    jeonlado: { label: 'Jeollado', value: '전라도' },
    jeonlabukdo: { label: 'Jeollabuk-do', value: '전라북도' },
    jeonlanamdo: { label: 'Jeollanam-do', value: '전라남도' },
    jejudo: { label: 'Jeju Island', value: '제주도' },
  },
  ja: {
    metropolitan: { label: '大都市圏', value: '수도권' },
    seoul: { label: 'ソウル', value: '서울' },
    kyeongkido: { label: '京畿道', value: '경기도' },
    kangwon: { label: '江原', value: '강원' },
    kangwondo: { label: '江原道', value: '강원도' },
    chungcheongdo: { label: '忠清道', value: '충청도' },
    chungcheongbukdo: { label: '忠清北道', value: '충청북도' },
    chungcheongnamdo: { label: '忠清南道', value: '충청남도' },
    kyungsangdo: { label: '慶尚道', value: '경상도' },
    kyungsangbukdo: { label: '慶尚北道', value: '경상북도' },
    kyungsangnamdo: { label: '慶尚南道', value: '경상남도' },
    jeonlado: { label: '全羅道', value: '전라도' },
    jeonlabukdo: { label: '全羅北道', value: '전라북도' },
    jeonlanamdo: { label: '全羅南道', value: '전라남도' },
    jejudo: { label: '済州島', value: '제주도' },
  },
  cn: {
    metropolitan: { label: '大都市区', value: '수도권' },
    seoul: { label: '首尔', value: '서울' },
    kyeongkido: { label: '京畿道', value: '경기도' },
    kangwon: { label: '江原', value: '강원' },
    kangwondo: { label: '江原道', value: '강원도' },
    chungcheongdo: { label: '忠清道', value: '충청도' },
    chungcheongbukdo: { label: '忠清北道', value: '충청북도' },
    chungcheongnamdo: { label: '忠清南道', value: '충청남도' },
    kyungsangdo: { label: '庆尚道', value: '경상도' },
    kyungsangbukdo: { label: '庆尚北道', value: '경상북도' },
    kyungsangnamdo: { label: '庆尚南道', value: '경상남도' },
    jeonlado: { label: '全罗道', value: '전라도' },
    jeonlabukdo: { label: '全罗北道', value: '전라북도' },
    jeonlanamdo: { label: '全罗南道', value: '전라남도' },
    jejudo: { label: '济州岛', value: '제주도' },
  },
  vi: {
    metropolitan: { label: 'Khu đô thị', value: '수도권' },
    seoul: { label: 'Seoul', value: '서울' },
    kyeongkido: { label: 'Gyeonggi-do', value: '경기도' },
    kangwon: { label: 'Gangwon', value: '강원' },
    kangwondo: { label: 'Gangwon-do', value: '강원도' },
    chungcheongdo: { label: 'Chungcheong-do', value: '충청도' },
    chungcheongbukdo: { label: 'Chungcheongbuk-do', value: '충청북도' },
    chungcheongnamdo: { label: 'Chungcheongnam-do', value: '충청남도' },
    kyungsangdo: { label: 'Gyeongsangdo', value: '경상도' },
    kyungsangbukdo: { label: 'Gyeongsangbuk-do', value: '경상북도' },
    kyungsangnamdo: { label: 'Gyeongsangnam-do', value: '경상남도' },
    jeonlado: { label: 'Jeollado', value: '전라도' },
    jeonlabukdo: { label: 'Jeollabuk-do', value: '전라북도' },
    jeonlanamdo: { label: 'Jeollanam-do', value: '전라남도' },
    jejudo: { label: 'Jeju Island', value: '제주도' },
  },
};

function LocationSelector({ handleChange, locale }: { handleChange: () => void; locale: SupportedLanguage }) {
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
        defaultValue={localLanguageMenu[locale].seoul.value}
        style={{ width: 200 }}
        onChange={handleChange}
        options={[
          {
            label: localLanguageMenu[locale].metropolitan.label,
            options: [
              { label: localLanguageMenu[locale].seoul.label, value: localLanguageMenu[locale].seoul.value },
              { label: localLanguageMenu[locale].kyeongkido.label, value: localLanguageMenu[locale].kyeongkido.value },
            ],
          },
          {
            label: localLanguageMenu[locale].kangwon.label,
            options: [{ label: localLanguageMenu[locale].kangwondo.label, value: localLanguageMenu[locale].kangwondo.value }],
          },
          {
            label: localLanguageMenu[locale].chungcheongdo.label,
            options: [
              { label: localLanguageMenu[locale].chungcheongbukdo.label, value: localLanguageMenu[locale].chungcheongbukdo.value },
              { label: localLanguageMenu[locale].chungcheongnamdo.label, value: localLanguageMenu[locale].chungcheongnamdo.value },
            ],
          },
          {
            label: localLanguageMenu[locale].kyungsangdo.label,
            options: [
              { label: localLanguageMenu[locale].kyungsangbukdo.label, value: localLanguageMenu[locale].kyungsangnamdo.value },
              { label: localLanguageMenu[locale].kyungsangnamdo.label, value: localLanguageMenu[locale].kyungsangbukdo.value },
            ],
          },
          {
            label: localLanguageMenu[locale].jeonlado.label,
            options: [
              { label: localLanguageMenu[locale].jeonlabukdo.label, value: localLanguageMenu[locale].jeonlabukdo.value },
              { label: localLanguageMenu[locale].jeonlanamdo.label, value: localLanguageMenu[locale].jeonlanamdo.value },
            ],
          },
          {
            label: localLanguageMenu[locale].jejudo.label,
            options: [{ label: localLanguageMenu[locale].jejudo.label, value: localLanguageMenu[locale].jejudo.value }],
          },
        ]}
      />
    </div>
  );
}
