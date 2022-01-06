import { Client } from "@notionhq/client/build/src";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { Config } from "../Config";

export class NotionRepository {
  #client;
  #DATABASE_ID;
  constructor(notionConfig: typeof Config.Notion) {
    const { KEY, DATABASE_ID } = notionConfig;
    if (!KEY || !DATABASE_ID) throw new Error("key/Database ID is not defined");
    this.#DATABASE_ID = DATABASE_ID;
    this.#client = new Client({ auth: KEY });
  }
  async #crawl(startCursor?: string | null) {
    let res = null;
    const option: QueryDatabaseParameters = {
      database_id: this.#DATABASE_ID,
    };

    if (startCursor) option.start_cursor = startCursor;
    try {
      res = await this.#client.databases.query(option);
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
      if (!res) throw new Error("Failed to get pages");
    }
    return res;
  }
  async getPages() {
    const pages = [];
    const res = await this.#crawl();
    pages.push(res);
    if (res.has_more) this.#crawl(res.next_cursor);

    return await Promise.all(
      res.results
        .filter(async (page) => {
          return page.archived;
        })
        .map(async (page) => {
          return page;
        })
    );
  }
  async chooseNext(pageID: string, status: typeof Config.Notion.Status) {
    return await this.#client.pages.update({
      page_id: pageID,
      properties: {
        [Config.Notion.Prop.STATUS]: {
          select: {
            name: status.NEXT,
          },
        },
      },
    });
  }
}
