import { Page } from "../../@types/notion-api-types";
import { Config } from "../../Config";
import { isDetectivePagePropertyType } from "../../utils";

const PageStatus = Config.Notion.Status;
const PageStatusValues = Object.values(PageStatus)[0];

type SelectType = Page.Property.Values.Select;

export class SelectProperty {
  #status: typeof PageStatusValues;
  #id: string | null;
  #color: string | null;

  constructor(propValue: Page.Property.PropertyValue) {
    if (!isDetectivePagePropertyType<Page.Property.Values.Select>(propValue)) {
      throw new Error("propValue is not PropertyValueSelect");
    }

    const selectValue = propValue.select;

    if (!selectValue) {
      this.#status = PageStatus.NO_STATUS as typeof PageStatusValues;
      this.#id = null;
      this.#color = null;
      return;
    }

    const { name, color, id } = selectValue;

    if (!Object.values(PageStatus).includes(name as typeof PageStatusValues)) {
      throw new Error(
        `option name is not PageStatusValues. name: ${name}, PageStatusValues: ${PageStatusValues}`
      );
    }

    this.#status = name as typeof PageStatusValues;

    switch (name) {
      case PageStatus.NEXT: {
        this.#color = color;
        this.#id = id;
        break;
      }
      case PageStatus.DONE: {
        this.#color = color;
        this.#id = id;
        break;
      }
      case PageStatus.NO_TARGET: {
        this.#color = color;
        this.#id = id;
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

  isStatusProperty(input: Page.Property.PropertyValue): input is SelectType {
    return isDetectivePagePropertyType<SelectType>(input);
  }
}
