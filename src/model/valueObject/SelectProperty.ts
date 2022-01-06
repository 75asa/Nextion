import {
  PropertyValue,
  PropertyValueSelect,
} from "../../@types/notion-api-types";
import { isDetectiveType } from "../../utils";

export class SelectProperty {
  #selectName?: string;
  constructor(propValue: PropertyValue) {
    if (!isDetectiveType<PropertyValueSelect>(propValue))
      throw new Error("propValue is not PropertyValueSelect");
    propValue.select?.name;
    this.#selectName = propValue.select?.name;
  }
  get name() {
    return this.#selectName;
  }
}
