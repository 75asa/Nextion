import { Config } from "../Config";
import { NotionRepository } from "../repository/NotionRepository";
import { PageEntity } from "../model/entity/Page";

const { NEXT, DONE, NO_TARGET, NO_STATUS } = Config.Notion.Status;

type PageStatus =
  | typeof NEXT
  | typeof DONE
  | typeof NO_TARGET
  | typeof NO_STATUS;

type GroupedByStatusPages = Record<PageStatus, PageEntity[]>;

export class GetAllPagesAndGroupByUseCase {
  #repository;
  constructor(repository: NotionRepository) {
    this.#repository = repository;
  }
  async invoke() {
    const pages = await this.#repository.getPages();
    return pages.reduce<GroupedByStatusPages>(
      (acc, cur) => {
        const { statusProperty: status } = cur;

        switch (status.status) {
          case NEXT: {
            acc.Next.push(cur);
            break;
          }
          case DONE: {
            acc.Done.push(cur);
            break;
          }
          case NO_TARGET: {
            acc.NoTarget.push(cur);
            break;
          }
          case NO_STATUS: {
            acc.NoStatus.push(cur);
            break;
          }
          default:
            break;
        }

        return acc;
      },
      {
        Next: [],
        Done: [],
        NoTarget: [],
        NoStatus: [],
      }
    );
  }
}
