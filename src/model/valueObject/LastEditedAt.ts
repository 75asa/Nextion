import { PostResult } from "../../@types/notion-api-types";
import { parseDate } from "../../utils";

export class LastEditedAt {
  #rawISO8601;
  #date;
  constructor(prop: PostResult["last_edited_time"]) {
    prop;
    this.#rawISO8601 = prop;
    this.#date = parseDate(prop);
  }

  get rawISO8601() {
    return this.#rawISO8601;
  }

  get date() {
    return this.#date;
  }
}
