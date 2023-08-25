export type Threat = {
  createdAt: EpochTimeStamp;
  updatedAt: EpochTimeStamp;
  eventTime: EpochTimeStamp;
  locationRadius: number;
  locationLatitude: number;
  locationLongitude: number;
  description: string;
  id: string;
  locationName: string;
  objectType: string;
  status: "검거완료" | "예고" | "허위신고";
  statusClass: "liar" | "caution" | "safe";
  timeline: {
    createdAt: EpochTimeStamp;
    eventTime: EpochTimeStamp;
    source: string[];
    status: string;
  }[];
};

export type ThreatList = Array<Threat>;
export type ServerThreatList = {
  result: {
    data: {
      json: {
        threats: ThreatList;
      };
    };
  };
};
