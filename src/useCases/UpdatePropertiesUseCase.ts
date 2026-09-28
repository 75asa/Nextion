import type { PageEntity } from "../model/entity/Page";
import type { PageStatus } from "../model/valueObject/StatusPropertyValue";
import type { NotionRepository } from "../repository/NotionRepository";

export class UpdatePropertiesUseCase {
  #repository;
  constructor(repository: NotionRepository) {
    this.#repository = repository;
  }

  async invoke(page: PageEntity, pageStatus: PageStatus) {
    page.updateStatus(pageStatus);
    return await this.#repository.updatePage(page);
  }
}
