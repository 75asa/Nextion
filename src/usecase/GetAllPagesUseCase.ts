import { NotionRepository } from "../repository/NotionRepository";

export class GetAllPagesUseCase {
  #repository;
  constructor(repository: NotionRepository) {
    this.#repository = repository;
  }
  async execute() {
    const pages = await this.#repository.getPages();
    return pages;
  }
}
