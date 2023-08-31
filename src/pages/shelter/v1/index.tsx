import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import KakaoMapShelter from "@/components/KakaoMapShelter";

export default function () {
  const router = useRouter();
  const [load, setLoad] = useState<boolean>(true);

  useEffect(() => {
    if (!router.isReady) return;

    setLoad(false);
  }, [router.isReady]);

  return load ? <div>loading</div> : <KakaoMapShelter></KakaoMapShelter>;
}
