import { Page } from "../../@types/notion-api-types";
import { Config } from "../../Config";
import { isDetectivePagePropertyType } from "../../utils";

const PageStatus = Config.Notion.Status;
const PageStatusValues = Object.values(PageStatus)[0];

type ExistStatusValue = Exclude<typeof PageStatusValues, "NoStatus">;

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

    if (name !== PageStatusValues) {
      throw new Error("option name is not PageStatusValues");
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

  isStatusProperty(
    input: Page.Property.PropertyValue
  ): input is Page.Property.Values.Select {
    if (!isDetectivePagePropertyType<Page.Property.Values.Select>(input))
      return false;
    return (
      input.select === null ||
      (input.select.name === PageStatusValues &&
        input.select.name !== PageStatus.NO_STATUS)
    );
  }
}
