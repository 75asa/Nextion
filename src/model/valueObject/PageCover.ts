import { Page } from "../../@types/notion-api-types";

export class PageCover {
  #coverURL: Extract<Page.PageCover, { type: "external" }> | null = null;
  constructor(prop: Page.PageCover) {
    if (!prop || prop.type === "file") return;
    this.#coverURL = prop;
  }

  set coverURL(url: string) {
    if (this.#coverURL) {
      this.#coverURL.external.url = url;
      return;
    }
    this.#coverURL = {
      type: "external",
      external: {
        url,
      },
    };
  }

  // TODO: getter, setter の正合成を確保する
  getCoverURL() {
    return this.#coverURL;
  }
}
