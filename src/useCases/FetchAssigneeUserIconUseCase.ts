import { NotionRepository } from "../repository/NotionRepository";
import { ConcurrencyLock } from "../utils";

export class FetchAssigneeUserIconUseCase {
  #repository;
  constructor(repository: NotionRepository) {
    this.#repository = repository;
  }
  async invoke() {
    const pages = await this.#repository.getPages();
    const lock = new ConcurrencyLock({ concurrency: 3, interval: 1000 });
    return await Promise.all(
      pages.map(async (page) => {
        page.setAssignIconToPageCover();
        page.changeTitle();
        return await lock.run(async () => {
          return await this.#repository.updatePage(page);
        });
      })
    );
  }
}
