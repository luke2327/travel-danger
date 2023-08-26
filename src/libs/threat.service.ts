import moment from "moment";

import { difference } from "@/libs/common";
import { translate } from "@/libs/language.service";
import queryPromise, { connection } from "@/libs/mysql";
import type { SupportedLanguage } from "@/models/language";
import { supportedLanguage } from "@/models/language";
import type { ThreatList } from "@/models/Threat";

export const insertThreatList = async (params: { data: ThreatList }) => {
  const conn = await connection();

  const prefix = `
    INSERT IGNORE INTO \`fmawo.com\`.threat_list (id, locationName, description, status, createdAt, updatedAt, eventTime,
                                          locationRadius, locationLatitude, locationLongitude, timeline, language)
  `;

  const duplCheckQuery =
    "select id, locationName, group_concat(language) as language from threat_list group by id";

  const duplRows = await queryPromise(duplCheckQuery);
  for (const row of params.data) {
    const supLanguage = supportedLanguage;
    const match = duplRows.find((x: any) => x.id === row.id);

    const diffLanguage: SupportedLanguage[] = difference(
      supLanguage,
      match.language.split(",")
    );

    for (const language of diffLanguage) {
      const locationName = await translate(row.locationName, language);
      const description = await translate(row.description, language);
      const status = await translate(row.status, language);

      const timeline = [];

      for (const s of row.timeline) {
        const statusData = { ...s };

        const rowStatus = await translate(s.status, language);

        statusData.status = rowStatus;

        timeline.push(statusData);
      }

      const queryString = `
        ${prefix}
        VALUES (
          '${row.id}',
          ${conn.escape(locationName)},
          ${conn.escape(description)},
          ${conn.escape(status)},
          '${moment(row.createdAt).format("YYYY-MM-DD HH:mm:SS")}',
          '${moment(row.updatedAt).format("YYYY-MM-DD HH:mm:SS")}',
          '${moment(row.eventTime).format("YYYY-MM-DD HH:mm:SS")}',
          ${row.locationRadius || "NULL"},
          ${row.locationLatitude || "NULL"},
          ${row.locationLongitude || "NULL"},
          ${conn.escape(JSON.stringify(timeline)) || "NULL"},
          '${language}'
        );
      `;

      await queryPromise(queryString);

      console.log("INSERT SUCCESS!!", row.id, language);
    }
  }
};
export const getThreatList = async (params: { locale: SupportedLanguage }) => {
  const queryString = `
    SELECT locationName, description, status, statusClass, createdAt, updatedAt, eventTime, locationLatitude, locationLongitude, timeline
    FROM threat_list
    WHERE language = '${params.locale}'
  `;

  return queryPromise(queryString);
};

export const updateThreatList = async (params: { data: ThreatList }) => {
  for (const row of params.data) {
    const queryString = `
      UPDATE threat_list SET locationLatitude = '${row.locationLatitude}', locationLongitude = '${row.locationLongitude}'
      WHERE id = '${row.id}';
    `;

    await queryPromise(queryString);
  }
};
