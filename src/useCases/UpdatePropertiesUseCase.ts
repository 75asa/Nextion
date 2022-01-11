import { NotionRepository } from "../repository/NotionRepository";
import { PropertyValueMap } from "../@types/notion-api-types";

export class UpdatePropertiesUseCase {
  #repository;
  constructor(repository: NotionRepository) {
    this.#repository = repository;
  }
  async invoke(pageID: string, properties: PropertyValueMap) {
    return await this.#repository.updatePage(pageID, properties);
  }
}
