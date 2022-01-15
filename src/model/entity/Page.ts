import { Page, PropertyColor } from "../../@types/notion-api-types";
import { SelectProperty } from "../valueObject/SelectProperty";
import { Config } from "../../Config";
import { LastEditedAt } from "../valueObject/LastEditedAt";
import { PageCover } from "../valueObject/PageCover";

const PageStatusValues = Object.values(Config.Notion.Status)[0];

export interface IPageEntity {
  id: string;
  statusProperty: SelectProperty;
  cover: string | null;
  properties: Page.Property.PropertyValueMap;
  lastEditedAt: Date;
}

type UpdateStatusInput = {
  id: string;
  color: PropertyColor;
} | null;

export class PageEntity implements IPageEntity {
  #id;
  #status;
  #properties;
  #cover: string | null;
  #lastEditedAt;
  constructor(args: Page.RawPage) {
    const { id, properties, last_edited_time, cover } = args;
    this.#id = id;
    this.#status = new SelectProperty(properties[Config.Notion.Prop.STATUS]);
    this.#cover = new PageCover(cover).coverURL;
    this.#properties = properties;
    this.#lastEditedAt = new LastEditedAt(last_edited_time).date;
  }

  get id() {
    return this.#id;
  }

  get statusProperty() {
    return this.#status;
  }

  get cover() {
    return this.#cover;
  }

  get properties() {
    return this.#properties;
  }

  set properties(value: Page.Property.PropertyValueMap) {
    this.#properties = value;
  }

  get lastEditedAt() {
    return this.#lastEditedAt;
  }

  updateStatus(
    inputStatus: UpdateStatusInput,
    pageStatus: typeof PageStatusValues
  ) {
    const updateProperties = Object.keys(this.#properties).reduce(
      (acc, key) => {
        const propValue = this.#properties[key];
        if (!this.#status.isStatusProperty(propValue)) {
          acc[key] = propValue;
          return acc;
        }
        if (pageStatus === "NoStatus") {
          propValue.select = null;
          acc[key] = propValue;
          return acc;
        }
        propValue.select = {
          name: pageStatus,
          id: inputStatus!.id,
          color: inputStatus!.color,
        };
        acc[key] = propValue;
        return acc;
      },
      {} as Page.Property.PropertyValueMap
    );
    this.properties = updateProperties;
  }
}
