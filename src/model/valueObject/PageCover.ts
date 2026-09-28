import { Config } from "../../Config";
import type { PageCoverUpdate, PageCoverValue } from "../../notion/types";

export class PageCover {
  #current: PageCoverValue;
  #next: string | null = null;

  constructor(cover: PageCoverValue) {
    this.#current = cover;
    // pages without any cover get the placeholder image
    if (!cover) this.#next = Config.Notion.NO_IMAGE_URL;
  }

  get coverURL(): string | null {
    if (this.#next) return this.#next;
    return this.#current?.type === "external"
      ? this.#current.external.url
      : null;
  }

  set coverURL(url: string) {
    this.#next = url;
  }

  get isChanged(): boolean {
    if (!this.#next) return false;
    return !(
      this.#current?.type === "external" &&
      this.#current.external.url === this.#next
    );
  }

  toUpdate(): PageCoverUpdate {
    if (!this.#next) return undefined;
    return { type: "external", external: { url: this.#next } };
  }
}
