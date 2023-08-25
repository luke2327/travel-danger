export type SupportedLanguage = "ko" | "ja" | "cn" | "en" | "vi";
export const supportedLanguage: SupportedLanguage[] = [
  "ko",
  "ja",
  "cn",
  "en",
  "vi",
];

export type LanguageTranslateResult<
  Src extends SupportedLanguage = "ko",
  Tar extends Omit<SupportedLanguage, "ko"> = "ja"
> = {
  message: {
    result: {
      srcLangType: Src;
      tarLangType: Tar;
      translatedText: string;
      engineType: "PRETRANS";
      pivot: unknown;
      dict: unknown;
      tarDict: unknown;
    };
    "@type": "response";
    "@service": "naverservice.nmt.proxy";
    "@version": "1.0.0";
  };
};
