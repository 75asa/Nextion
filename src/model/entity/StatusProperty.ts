import {
  PropertyColor,
  DatabasePropertyValueMap,
  DatabasePropertyValueSelect,
} from "../../@types/notion-api-types";
import { Config } from "../../Config";
import { isDetectiveDatabasePropertyType } from "../../utils";

const { Status, Prop } = Config.Notion;
const PageStatusValues = Object.values(Status)[0];

type StatusPropertyMap = {
  [key in typeof PageStatusValues]: {
    id: string;
    color: PropertyColor;
  } | null;
};

export class StatusProperty {
  #statusPropertyMap: StatusPropertyMap;
  constructor(properties: DatabasePropertyValueMap) {
    const data = Object.keys(properties).reduce(
      (acc, cur) => {
        const prop = properties[cur];
        if (Prop.STATUS !== cur) return acc;
        if (!isDetectiveDatabasePropertyType<DatabasePropertyValueSelect>(prop))
          return acc;
        if (!prop.select) return acc;
        const { id, color, name } = prop.select;
        if (name === PageStatusValues) return acc;
        acc[name as typeof PageStatusValues] = { id, color };
        return acc;
      },
      {
        Next: null,
        Done: null,
        NoTarget: null,
        NoStatus: null,
      } as StatusPropertyMap
    );
    this.#statusPropertyMap = data;
  }

  get statusPropertyMap() {
    return this.#statusPropertyMap;
  }
}
