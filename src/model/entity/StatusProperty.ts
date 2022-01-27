import { Database as DB, PropertyColor } from "../../@types/notion-api-types";
import { Config } from "../../Config";
import { isDetectiveDatabasePropertyType } from "../../utils";

const { Prop, PageStatusValues } = Config.Notion;

type StatusPropertyMap = {
  [key in typeof PageStatusValues]: {
    id: string;
    color: PropertyColor;
  } | null;
};

export class StatusProperty {
  #statusPropertyMap: StatusPropertyMap;
  constructor(properties: DB.Property.PropertyValueMap) {
    const targetProperty = properties[Prop.STATUS];
    if (
      !isDetectiveDatabasePropertyType<DB.Property.Values.Select>(
        targetProperty
      )
    ) {
      throw new Error("targetProperty is not PropertyValueSelect");
    }
    const initValue: StatusPropertyMap = {
      Next: null,
      Done: null,
      NoTarget: null,
      NoStatus: null,
    };

    if (!targetProperty.select.options.length) {
      this.#statusPropertyMap = initValue;
      return;
    }

    this.#statusPropertyMap =
      targetProperty.select.options.reduce<StatusPropertyMap>((acc, cur) => {
        const { id, name, color } = cur;
        if (name !== PageStatusValues) return acc;
        if (!id || !color) return acc;
        acc[name] = { id, color };
        return acc;
      }, initValue);
  }

  get statusPropertyMap() {
    return this.#statusPropertyMap;
  }
}
