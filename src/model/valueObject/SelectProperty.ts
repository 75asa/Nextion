import {
  PropertyValue,
  PropertyValueSelect,
} from "../../@types/notion-api-types";
import { Config } from "../../Config";
import { isDetectiveType } from "../../utils";

const PageStatus = Config.Notion.Status;

const PageStatusValues = Object.values(PageStatus)[0];

export class SelectProperty {
  #selectName: typeof PageStatusValues;
  constructor(propValue: PropertyValue) {
    if (!isDetectiveType<PropertyValueSelect>(propValue))
      throw new Error("propValue is not PropertyValueSelect");
    const value = propValue.select?.name || PageStatus.NO_STATUS.valueOf();
    if (!PageStatusValues.includes(value)) {
      throw new Error(`${value} is not valid value`);
    }
    this.#selectName = value as typeof PageStatusValues;
  }
  get name() {
    return this.#selectName;
  }
}
