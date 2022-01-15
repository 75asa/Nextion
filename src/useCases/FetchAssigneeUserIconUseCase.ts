import { NotionRepository } from "../repository/NotionRepository";

export class FetchAssigneeUserIconUseCase {
  #repository;
  constructor(repository: NotionRepository) {
    this.#repository = repository;
  }
  async invoke() {
    const pages = await this.#repository.getPages();
    return await Promise.all(
      pages.map(async (page) => {
        page.setAssignIconToPageCover();
        return await this.#repository.updatePage(page);
      })
    );
  }
}
