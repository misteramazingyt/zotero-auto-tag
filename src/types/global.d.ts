/// <reference types="zotero-types" />

declare const Zotero: _ZoteroTypes.Zotero;
declare const ZoteroPane: _ZoteroTypes.ZoteroPane;

declare module "*.ftl" {
  const content: string;
  export default content;
}

declare module "zotero-plugin-toolkit" {
  export class ZoteroToolkit {
    constructor();
    getProgressWindow(header?: string): ProgressWindow;
    log(message: string): void;
  }

  export interface ProgressWindow {
    show(): void;
    close(): void;
    startCloseTimer(ms: number): void;
    createLine(params: { text: string; type?: "default" | "success" | "error" }): void;
  }

  export const BasicTool: any;
  export const unregister: () => Promise<void>;
  export const getString: (key: string, addonRef: string) => string;
} 