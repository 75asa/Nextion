import { Config } from "../Config";
import { NotionRepository } from "../repository/NotionRepository";
import { PostResult, PropertyValueMap } from "../@types/notion-api-types";

const { NEXT, DONE, UNCHOOSEBLE, NO_STATUS } = Config.Notion.Status;

type PageStatus =
  | typeof NEXT
  | typeof DONE
  | typeof UNCHOOSEBLE
  | typeof NO_STATUS;

type GroupedByStatusPages = Record<PageStatus, PostResult[]>;

export class UpdatePropertiesUseCase {
  #repository;
  constructor(repository: NotionRepository) {
    this.#repository = repository;
  }
  async invoke(pageID: string, properties: PropertyValueMap) {
    this.#repository.updatePage(pageID, properties);
  }
}
