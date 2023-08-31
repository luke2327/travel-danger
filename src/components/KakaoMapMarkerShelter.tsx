/* eslint-disable react/display-name */
/* eslint-disable import/no-anonymous-default-export */
import { CloseOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { MapMarker } from "react-kakao-maps-sdk";
import withImportantStyle from "react-with-important-style";

type IKakaoMapMarkerProps = {
  index: number;
  isOpen: boolean;
  lat: number;
  lng: number;
  shelter: {
    rn: number;
    lcSn: number;
    bsshNm: string;
    telno: "052-237-6234";
    adres: " 울산시 울주군 온양읍 발리 600-5";
    etcAdres: null;
    zip: "689-904";
    clNm: "아동안전지킴이집";
  };
  markerSelect: (index: number, lat: number, lng: number) => void;
  markerClose: (index: number) => void;
};

const Div = withImportantStyle("div");

export default function (params: IKakaoMapMarkerProps) {
  return (
    <MapMarker
      key={`kakaoMapMarker${params.index}`}
      position={{ lat: params.lat, lng: params.lng }}
      clickable={true} // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
      onClick={() => params.markerSelect(params.index, params.lat, params.lng)}
    >
      {params.isOpen && (
        <Div id={"markerWrapper"} style={{ background: "white !important" }}>
          <CloseOutlined
            style={{
              position: "absolute",
              right: "8px",
              top: "8px",
              cursor: "pointer",
            }}
            onClick={() => params.markerClose(params.index)}
          />
          <Typography style={{ marginBottom: 0 }} className={`safeText`}>
            {params.shelter.bsshNm?.trim()}
          </Typography>
          <div
            style={{
              paddingLeft: "5px",
              color: "#000",
              fontSize: 12,
              marginTop: 8,
            }}
          >
            {params.shelter.adres?.trim()} | {params.shelter.zip?.trim()}
          </div>
          <Typography
            className={"descriptionText"}
            style={{ paddingLeft: "5px", fontSize: 12 }}
          >
            {params.shelter.telno}
          </Typography>
        </Div>
      )}
    </MapMarker>
  );
}
