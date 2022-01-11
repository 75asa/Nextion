import { Config } from "../Config";
import { SelectProperty } from "../model/valueObject/SelectProperty";
import { NotionRepository } from "../repository/NotionRepository";
import { PostResult } from "../@types/notion-api-types";

const { NEXT, DONE, NO_TARGET, NO_STATUS } = Config.Notion.Status;

type PageStatus =
  | typeof NEXT
  | typeof DONE
  | typeof NO_TARGET
  | typeof NO_STATUS;

type GroupedByStatusPages = Record<PageStatus, PostResult[]>;

export class GetAllPagesAndGroupByUseCase {
  #repository;
  constructor(repository: NotionRepository) {
    this.#repository = repository;
  }
  async invoke() {
    const pages = await this.#repository.getPages();
    return pages.reduce(
      (acc, cur) => {
        const status = new SelectProperty(
          cur.properties[Config.Notion.Prop.STATUS]
        ).name;

        switch (status) {
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
          case undefined: {
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
      } as GroupedByStatusPages
    );
  }
}
