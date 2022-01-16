import { Page } from "../../@types/notion-api-types";
import { Config } from "../../Config";

export class PageCover {
  #coverURL: Extract<Page.PageCover, { type: "external" }> = {
    type: "external",
    external: {
      url: Config.Notion.NO_IMAGE_URL,
    },
  };
  constructor(prop: Page.PageCover) {
    if (!prop || prop.type === "file") return;
    this.#coverURL = prop;
  }

  get coverURL(): string {
    return this.#coverURL.external.url;
  }

  set coverURL(url: string) {
    this.#coverURL.external.url = url;
    return;
  }

  getPageCover() {
    return this.#coverURL;
  }
}
