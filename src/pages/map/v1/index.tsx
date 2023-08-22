import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import KakaoMap from "@/components/KakaoMap";

export default function () {
  const router = useRouter();
  const params = (router.query as { q: string }) || { q: "" };
  const [load, setLoad] = useState<boolean>(true);

  useEffect(() => {
    if (!router.isReady) return;

    setLoad(false);
  }, [router.isReady]);

  return load ? <div>loading</div> : <KakaoMap {...params}></KakaoMap>;
}
