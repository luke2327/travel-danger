import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import MobileDetect from "mobile-detect";
import KakaoMapShelter from "@/components/KakaoMapShelter";
import type { SupportedLanguage } from "@/models/language";

export default function () {
  const router = useRouter();
  const params = (router.query as {
    lat: string;
    lng: string;
    locale: SupportedLanguage;
  }) || { q: "", locale: "en" };
  const [load, setLoad] = useState<boolean>(true);
  const [isPhone, setIsPhone] = useState<boolean>(false);

  useEffect(() => {
    if (!router.isReady) return;

    const md = new MobileDetect(navigator.userAgent);

    if (md.phone()) {
      setIsPhone(true);
    }

    setLoad(false);
  }, [router.isReady]);

  return load ? <div style={{
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignContent: "center" }}
  >loading</div> : <KakaoMapShelter {...params} isPhone={isPhone}></KakaoMapShelter>;
}
