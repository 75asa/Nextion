import { Page } from "../../@types/notion-api-types";

export class PageCover {
  #coverURL: string | null;
  constructor(prop: Page.PageCover) {
    if (!prop) this.#coverURL = null;
    this.#coverURL = prop?.type === "external" ? prop.external.url : null;
  }
  get coverURL() {
    return this.#coverURL;
  }
}
