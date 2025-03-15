import { getString as getStringBase } from "zotero-plugin-toolkit/dist/helpers/locale";

export function getString(key: string) {
  return getStringBase(key, "zotero-auto-tagger");
} 