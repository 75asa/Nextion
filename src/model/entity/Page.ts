import { Page, PropertyColor } from "../../@types/notion-api-types";
import { SelectProperty } from "../valueObject/SelectProperty";
import { Config } from "../../Config";
import { PageCover } from "../valueObject/PageCover";
import { AssignProperty } from "../valueObject/AssignProperty";

export interface IPageEntity {
  id: string;
  statusProperty: SelectProperty;
  assignProperty: AssignProperty;
  cover: PageCover;
  properties: Page.Property.PropertyValueMap;
}

type UpdateStatusInput = {
  id: string;
  color: PropertyColor;
} | null;

export class PageEntity implements IPageEntity {
  #id;
  #status;
  #properties;
  #assign;
  #cover;
  constructor(args: Page.RawPage) {
    const { id, properties, cover } = args;
    this.#id = id;
    this.#status = new SelectProperty(properties[Config.Notion.Prop.STATUS]);
    this.#cover = new PageCover(cover);
    this.#assign = new AssignProperty(properties[Config.Notion.Prop.ASSIGN]);
    this.#properties = properties;
  }

  get id() {
    return this.#id;
  }

  get statusProperty() {
    return this.#status;
  }

  get properties() {
    return this.#properties;
  }

  set properties(value: Page.Property.PropertyValueMap) {
    this.#properties = value;
  }

  get assignProperty() {
    return this.#assign;
  }

  updateStatus(
    inputStatus: UpdateStatusInput,
    pageStatus: typeof Config.Notion.PageStatusValues
  ) {
    const updateProperties = Object.keys(this.#properties).reduce(
      (acc, key) => {
        const propValue = this.#properties[key];
        if (
          !this.#status.isStatusProperty(propValue) ||
          key !== Config.Notion.Prop.STATUS
        ) {
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

  setAssignIconToPageCover() {
    if (!this.#assign.avatarURL) return;
    this.#cover.coverURL = this.#assign.avatarURL;
  }

  get cover() {
    return this.#cover;
  }
}
