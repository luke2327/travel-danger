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
  threat: {
    status: string;
    locationName: string;
    description: string;
  };
  markerSelect: (index: number, lat: number, lng: number) => void;
  markerClose: (index: number) => void;
};

const Div = withImportantStyle("div");

export default function (params: IKakaoMapMarkerProps) {
  const setStatusTextClass = (
    status: IKakaoMapMarkerProps["threat"]["status"]
  ) => {
    if (status === "허위") {
      return "liarText";
    }
    if (status === "예고") {
      return "cautionText";
    }
    if (status === "검거완료") {
      return "safeText";
    }

    return "liarText";
  };
  return (
    <MapMarker
      key={params.index}
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
          <Typography
            style={{ marginBottom: 0 }}
            className={setStatusTextClass(params.threat.status)}
          >
            {params.threat.status}
          </Typography>
          <div
            style={{
              paddingLeft: "5px",
              color: "#000",
              fontSize: 12,
              marginTop: 8,
            }}
          >
            {params.threat.locationName}
          </div>
          <Typography
            className={"descriptionText"}
            style={{ paddingLeft: "5px", fontSize: 12 }}
          >
            {params.threat.description}
          </Typography>
        </Div>
      )}
    </MapMarker>
  );
}
