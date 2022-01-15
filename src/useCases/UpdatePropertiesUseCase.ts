import { Config } from "../Config";
import { PageEntity } from "../model/entity/Page";
import { NotionRepository } from "../repository/NotionRepository";

const PageStatusValues = Object.values(Config.Notion.Status)[0];

export class UpdatePropertiesUseCase {
  #repository;
  constructor(repository: NotionRepository) {
    this.#repository = repository;
  }

  async invoke(page: PageEntity, pageStatus: typeof PageStatusValues) {
    const statusProps = (await this.#repository.getStatusProperties())
      .statusPropertyMap[pageStatus];
    page.updateStatus(statusProps, pageStatus);
    return await this.#repository.updatePage(page);
  }
}
