import { Client, collectPaginatedAPI, isFullPage } from "@notionhq/client";
import type { Config } from "../Config";
import { PageEntity } from "../model/entity/Page";

export class NotionRepository {
  #client;
  #DATABASE_ID;
  #dataSourceId: Promise<string> | undefined;

  constructor(notionConfig: Partial<typeof Config.Notion>) {
    const { KEY, DATABASE_ID, DATA_SOURCE_ID } = notionConfig;
    if (!KEY || !DATABASE_ID) throw new Error("key/Database ID is not defined");
    this.#DATABASE_ID = DATABASE_ID;
    this.#client = new Client({ auth: KEY });
    if (DATA_SOURCE_ID) this.#dataSourceId = Promise.resolve(DATA_SOURCE_ID);
  }

  // Since Notion API 2025-09-03, pages are queried per data source, not per database.
  #getDataSourceId() {
    this.#dataSourceId ??= this.#resolveDataSourceId();
    return this.#dataSourceId;
  }

  async #resolveDataSourceId() {
    const database = await this.#client.databases.retrieve({
      database_id: this.#DATABASE_ID,
    });
    const dataSources = "data_sources" in database ? database.data_sources : [];
    if (dataSources.length === 1) return dataSources[0].id;
    const list = dataSources.map(({ id, name }) => `${name} (${id})`);
    throw new Error(
      `Database has ${dataSources.length} data sources. Set NOTION_DATA_SOURCE_ID to one of: ${list.join(", ")}`,
    );
  }

  async getPages() {
    const results = await collectPaginatedAPI(this.#client.dataSources.query, {
      data_source_id: await this.#getDataSourceId(),
    });

    return results
      .filter(isFullPage)
      .filter((page) => !page.in_trash && !page.is_archived)
      .map((page) => new PageEntity(page));
  }

  async updatePage(page: PageEntity) {
    const { properties, cover } = page.toUpdate();
    try {
      return await this.#client.pages.update({
        page_id: page.id,
        properties,
        cover,
      });
    } catch (e) {
      if (e instanceof Error) {
        console.dir(properties, { depth: null });
        console.error(`----- ${e.message} -----`);
      }
      throw new Error("Failed to update page");
    }
  }
}
