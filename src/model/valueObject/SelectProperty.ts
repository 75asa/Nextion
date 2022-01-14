import {
  PropertyValue,
  PropertyValueSelect,
} from "../../@types/notion-api-types";
import { Config } from "../../Config";
import { isDetectiveDatabasePropertyType } from "../../utils";

const PageStatus = Config.Notion.Status;
const PageStatusValues = Object.values(PageStatus)[0];

export class SelectProperty {
  #status: typeof PageStatusValues;
  #id: string | null;
  #color: string | null;
  constructor(propValue: PropertyValue) {
    if (!isDetectiveDatabasePropertyType<PropertyValueSelect>(propValue))
      throw new Error("propValue is not PropertyValueSelect");
    const selectValue = propValue.select;
    const status = (selectValue?.name ||
      PageStatus.NO_STATUS.valueOf()) as typeof PageStatusValues;
    this.#status = status as typeof PageStatusValues;
    switch (status) {
      case PageStatus.NEXT: {
        this.#color = selectValue!.color;
        this.#id = selectValue!.id;
        break;
      }
      case PageStatus.DONE: {
        this.#color = selectValue!.color;
        this.#id = selectValue!.id;
        break;
      }
      case PageStatus.NO_TARGET: {
        this.#color = selectValue!.color;
        this.#id = selectValue!.id;
        break;
      }
      default: {
        this.#color = null;
        this.#id = null;
        break;
      }
    }
  }
  get status() {
    return this.#status;
  }

  get id() {
    return this.#id;
  }

  get color() {
    return this.#color;
  }
}
