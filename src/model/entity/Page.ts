import type { PageObjectResponse } from "@notionhq/client";
import { Config } from "../../Config";
import type { PageCoverUpdate, PagePropertiesUpdate } from "../../notion/types";
import { AssignProperty } from "../valueObject/AssignProperty";
import { PageCover } from "../valueObject/PageCover";
import {
  type PageStatus,
  StatusPropertyValue,
} from "../valueObject/StatusPropertyValue";
import { TitleProperty } from "../valueObject/TitleProperty";

const { Prop } = Config.Notion;

export type PageUpdate = {
  properties: PagePropertiesUpdate;
  cover: PageCoverUpdate;
};

export class PageEntity {
  #id;
  #name;
  #status;
  #assign;
  #cover;
  #propertiesUpdate: PagePropertiesUpdate = {};

  constructor(page: PageObjectResponse) {
    const { id, properties, cover } = page;
    this.#id = id;
    this.#name = new TitleProperty(properties[Prop.NAME]);
    this.#status = new StatusPropertyValue(properties[Prop.STATUS]);
    this.#assign = new AssignProperty(properties[Prop.ASSIGN]);
    this.#cover = new PageCover(cover);
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get statusProperty() {
    return this.#status;
  }

  get assignProperty() {
    return this.#assign;
  }

  get cover() {
    return this.#cover;
  }

  updateStatus(status: PageStatus) {
    this.#propertiesUpdate[Prop.STATUS] = StatusPropertyValue.toUpdate(status);
  }

  changeTitle() {
    if (this.#name.name || !this.#assign.name) return;
    this.#propertiesUpdate[Prop.NAME] = TitleProperty.toUpdate(
      this.#assign.name,
    );
  }

  setAssignIconToPageCover() {
    if (!this.#assign.avatarURL) return;
    this.#cover.coverURL = this.#assign.avatarURL;
  }

  get hasChanges(): boolean {
    return (
      Object.keys(this.#propertiesUpdate).length > 0 || this.#cover.isChanged
    );
  }

  toUpdate(): PageUpdate {
    return {
      properties: this.#propertiesUpdate,
      cover: this.#cover.isChanged ? this.#cover.toUpdate() : undefined,
    };
  }
}
