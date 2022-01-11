import {
  PostResult,
  PropertyValueMap,
  PropertyValueSelect,
} from "../../@types/notion-api-types";
import { SelectProperty } from "../valueObject/SelectProperty";
import { Config } from "../../Config";
import { LastEditedAt } from "../valueObject/LastEditedAt";
import { isDetectiveType } from "../../utils";

const { Status, Prop } = Config.Notion;

type PageStatus = typeof Status[keyof typeof Status];

export interface IPageEntity {
  id: string;
  status: PageStatus;
  properties: PropertyValueMap;
  lastEditedAt: Date;
}

export class PageEntity implements IPageEntity {
  #id;
  #status;
  #properties;
  #lastEditedAt;
  constructor(args: PostResult) {
    const { id, properties, last_edited_time } = args;
    const status = new SelectProperty(properties[Config.Notion.Prop.STATUS])
      .name;
    this.#id = id;
    this.#status = status;
    this.#properties = properties;
    this.#lastEditedAt = new LastEditedAt(last_edited_time).date;
  }

  get id() {
    return this.#id;
  }

  get status() {
    return this.#status;
  }

  get properties() {
    return this.#properties;
  }

  set properties(value) {
    this.#properties = value;
  }

  get lastEditedAt() {
    return this.#lastEditedAt;
  }

  updateProperties() {
    const updateProperties = Object.keys(this.#properties).reduce(
      (acc, cur) => {
        const prop = this.#properties[cur];
        if (cur !== Prop.STATUS) return acc;
        prop.type;
        if (!isDetectiveType<PropertyValueSelect>(prop)) return acc;
        if (!prop.select) return acc;
        prop.select.name = Status.NEXT.valueOf();
        acc[Prop.STATUS] = prop;
        return acc;
      },
      {} as PropertyValueMap
    );
    this.properties = updateProperties;
  }
}
