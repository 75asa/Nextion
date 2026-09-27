import { Client } from "@notionhq/client/build/src";
import {
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Config } from "../Config";
import { PageEntity } from "../model/entity/Page";
import { StatusProperty } from "../model/entity/StatusProperty";
export class NotionRepository {
  #client;
  #DATABASE_ID;

  constructor(notionConfig: Partial<typeof Config.Notion>) {
    const { KEY, DATABASE_ID } = notionConfig;
    if (!KEY || !DATABASE_ID) throw new Error("key/Database ID is not defined");
    this.#DATABASE_ID = DATABASE_ID;
    this.#client = new Client({ auth: KEY });
  }

  async getStatusProperties() {
    const { properties } = await this.#client.databases.retrieve({
      database_id: this.#DATABASE_ID,
    });
    return new StatusProperty(properties);
  }

  async #crawl(startCursor?: string | null): Promise<QueryDatabaseResponse> {
    let res = null;
    const option: QueryDatabaseParameters = {
      database_id: this.#DATABASE_ID,
    };

    if (startCursor) option.start_cursor = startCursor;
    try {
      res = await this.#client.databases.query(option);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
      if (!res) throw new Error("Failed to get pages");
    }
    return res;
  }

  async getPages() {
    const pages = [];
    let cursor: string | null = null;
    do {
      const res: QueryDatabaseResponse = await this.#crawl(cursor);
      pages.push(...res.results);
      cursor = res.has_more ? res.next_cursor : null;
    } while (cursor);

    return pages
      .filter((page) => page.archived === false)
      .map((page) => new PageEntity(page));
  }

  async updatePage(page: PageEntity) {
    try {
      const { id, cover, properties } = page;
      return await this.#client.pages.update({
        page_id: id,
        cover: cover.getPageCover(),
        properties: properties,
      });
    } catch (e) {
      if (e instanceof Error) {
        console.dir(page.properties, { depth: null });
        console.error(`----- ${e.message} -----`);
      }
      throw new Error("Failed to update page");
    }
  }
}
