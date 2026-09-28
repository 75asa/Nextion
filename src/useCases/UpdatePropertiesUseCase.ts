import { Config } from "../Config";
import type { PageEntity } from "../model/entity/Page";
import type { PageStatus } from "../model/valueObject/StatusPropertyValue";
import type { NotionRepository } from "../repository/NotionRepository";

export class UpdatePropertiesUseCase {
  #repository;
  constructor(repository: NotionRepository) {
    this.#repository = repository;
  }

  async invoke(page: PageEntity, pageStatus: PageStatus) {
    // Setting a select by a name that isn't an option would create that option,
    // so skip the update instead (NoStatus clears the value and needs no option).
    if (pageStatus !== Config.Notion.Status.NO_STATUS) {
      const options = await this.#repository.getStatusOptionNames();
      if (!options.has(pageStatus)) {
        console.warn(
          `Status option "${pageStatus}" does not exist; skipped page ${page.id}`,
        );
        return;
      }
    }
    page.updateStatus(pageStatus);
    return await this.#repository.updatePage(page);
  }
}
