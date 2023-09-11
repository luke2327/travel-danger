import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import KakaoMap from "@/components/KakaoMap";
import type { SupportedLanguage } from "@/models/language";

export default function () {
  const router = useRouter();
  const params = (router.query as {
    q: string;
    locale: SupportedLanguage;
    lat: string;
    lng: string;
  }) || { q: "", locale: "en" };
  const [load, setLoad] = useState<boolean>(true);

  useEffect(() => {
    if (!router.isReady) return;

    setLoad(false);
  }, [router.isReady]);

  return load ? <div style={{
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignContent: "center" }}
  >loading</div> : <KakaoMap {...params}></KakaoMap>;
}
