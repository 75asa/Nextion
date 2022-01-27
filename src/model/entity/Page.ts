import { Page, PropertyColor } from "../../@types/notion-api-types";
import { StatusPropertyValue } from "../valueObject/StatusPropertyValue";
import { Config } from "../../Config";
import { PageCover } from "../valueObject/PageCover";
import { AssignProperty } from "../valueObject/AssignProperty";
import { TitleProperty } from "../valueObject/TitleProperty";

export interface IPageEntity {
  id: string;
  name: TitleProperty;
  statusProperty: StatusPropertyValue;
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
  #name;
  #status;
  #properties;
  #assign;
  #cover;
  constructor(args: Page.RawPage) {
    const { id, properties, cover } = args;
    this.#id = id;
    this.#name = new TitleProperty(properties[Config.Notion.Prop.NAME]);
    this.#status = new StatusPropertyValue(
      properties[Config.Notion.Prop.STATUS]
    );
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

  get name() {
    return this.#name;
  }

  updateStatus(
    inputStatus: UpdateStatusInput,
    pageStatus: typeof Config.Notion.PageStatusValues
  ) {
    this.properties = Object.keys(
      this.#properties
    ).reduce<Page.Property.PropertyValueMap>((acc, key) => {
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
      if (inputStatus && inputStatus.id && inputStatus.color) {
        propValue.select = {
          name: pageStatus,
          id: inputStatus.id,
          color: inputStatus.color,
        };
        acc[key] = propValue;
      }
      return acc;
    }, {});
  }

  changeTitle() {
    if (this.#name.name || !this.#assign.name) return;
    this.properties = Object.keys(this.#properties).reduce((acc, key) => {
      const propValue = this.#properties[key];
      if (
        !this.name.isTitlePropertyType(propValue) ||
        key !== Config.Notion.Prop.NAME
      ) {
        acc[key] = propValue;
        return acc;
      }
      if (!this.#assign.name) {
        acc[key] = propValue;
        return acc;
      }
      propValue.title = [this.#name.generateTitleProperty(this.#assign.name)];
      acc[key] = propValue;
      return acc;
    }, {} as Page.Property.PropertyValueMap);
  }

  setAssignIconToPageCover() {
    if (!this.#assign.avatarURL) return;
    this.#cover.coverURL = this.#assign.avatarURL;
  }

  get cover() {
    return this.#cover;
  }
}
