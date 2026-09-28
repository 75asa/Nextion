import {
  Client,
  collectPaginatedAPI,
  isFullDatabase,
  isFullDataSource,
  isFullPage,
} from "@notionhq/client";
import { Config } from "../Config";
import { PageEntity } from "../model/entity/Page";

export class NotionRepository {
  #client;
  #DATABASE_ID;
  #dataSourceId: Promise<string> | undefined;
  #statusOptionNames: Promise<Set<string>> | undefined;

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
    if (!isFullDatabase(database)) {
      throw new Error(
        `Could not read database ${this.#DATABASE_ID}. Make sure it is shared with the integration.`,
      );
    }
    const dataSources = database.data_sources;
    if (dataSources.length === 1) return dataSources[0].id;
    const list = dataSources.map(({ id, name }) => `${name} (${id})`);
    throw new Error(
      `Database has ${dataSources.length} data sources. Set NOTION_DATA_SOURCE_ID to one of: ${list.join(", ")}`,
    );
  }

  // Option names of the status select property, fetched once per run.
  getStatusOptionNames() {
    this.#statusOptionNames ??= this.#fetchStatusOptionNames();
    return this.#statusOptionNames;
  }

  async #fetchStatusOptionNames() {
    const dataSource = await this.#client.dataSources.retrieve({
      data_source_id: await this.#getDataSourceId(),
    });
    if (!isFullDataSource(dataSource)) {
      throw new Error("Could not read the data source schema");
    }
    const property = dataSource.properties[Config.Notion.Prop.STATUS];
    if (property?.type !== "select") {
      throw new Error(
        `Status property "${Config.Notion.Prop.STATUS}" is not a select: ${property?.type}`,
      );
    }
    return new Set(property.select.options.map(({ name }) => name));
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
