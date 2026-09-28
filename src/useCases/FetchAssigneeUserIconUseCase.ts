import type { NotionRepository } from "../repository/NotionRepository";
import { ConcurrencyLock } from "../utils";

export class FetchAssigneeUserIconUseCase {
  #repository;
  constructor(repository: NotionRepository) {
    this.#repository = repository;
  }
  async invoke() {
    const pages = await this.#repository.getPages();
    const lock = new ConcurrencyLock({ concurrency: 3, interval: 1000 });
    for (const page of pages) {
      page.setAssignIconToPageCover();
      page.changeTitle();
    }
    return await Promise.all(
      pages
        .filter((page) => page.hasChanges)
        .map(async (page) => {
          return await lock.run(async () => {
            return await this.#repository.updatePage(page);
          });
        }),
    );
  }
}
