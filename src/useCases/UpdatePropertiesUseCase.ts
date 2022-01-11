import { Config } from "../Config";
import { NotionRepository } from "../repository/NotionRepository";
import {
  PropertyValueMap,
  PropertyValueSelect,
} from "../@types/notion-api-types";
import { isDetectiveType } from "../utils";

const { Prop, Status } = Config.Notion;

export class UpdatePropertiesUseCase {
  #repository;
  constructor(repository: NotionRepository) {
    this.#repository = repository;
  }
  async invoke(pageID: string, properties: PropertyValueMap) {
    const updateProperties = Object.keys(properties).reduce((acc, cur) => {
      const prop = properties[cur];
      if (cur !== Prop.STATUS) return acc;
      prop.type;
      if (!isDetectiveType<PropertyValueSelect>(prop)) return acc;
      if (!prop.select) return acc;
      prop.select.name = Status.NEXT.valueOf();
      acc[Prop.STATUS] = prop;
      return acc;
    }, {} as PropertyValueMap);
    return await this.#repository.updatePage(pageID, updateProperties);
  }
}
