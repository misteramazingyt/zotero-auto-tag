import { getString as getStringBase } from "zotero-plugin-toolkit";

export function getString(key: string) {
  return getStringBase(key, "zotero-auto-tagger");
} 