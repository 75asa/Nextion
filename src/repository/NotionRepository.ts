import { Client } from "@notionhq/client/build/src";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import {
  PropertyValueMap,
  PropertyValueSelect,
} from "../@types/notion-api-types";
import { Config } from "../Config";
import { PageEntity } from "../model/entity/Page";
import { StatusProperty } from "../model/entity/StatusProperty";
import { isDetectiveDatabasePropertyType } from "../utils";

const { Status, Prop } = Config.Notion;
const PageStatusValues = Object.values(Status)[0];

export class NotionRepository {
  #client;
  #DATABASE_ID;
  constructor(notionConfig: Partial<typeof Config.Notion>) {
    // constructor(notionConfig: Omit<typeof Config.Notion, "Prop">) {
    const { KEY, DATABASE_ID } = notionConfig;
    if (!KEY || !DATABASE_ID) throw new Error("key/Database ID is not defined");
    this.#DATABASE_ID = DATABASE_ID;
    this.#client = new Client({ auth: KEY });
  }

  async getStatusProperties() {
    const { properties } = await this.#client.databases.retrieve({
      database_id: this.#DATABASE_ID,
    });
    const statusProperty = Object.keys(properties).find((item) => {
      if (Prop.STATUS !== item) return false;
      if (!isDetectiveDatabasePropertyType<PropertyValueSelect>()) return acc;
    });
    return new StatusProperty(properties);
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
        console.error(e.message);
      }
      if (!res) throw new Error("Failed to get pages");
    }
    return res;
  }
  async getPages() {
    const pages = [];
    const { results, next_cursor, has_more } = await this.#crawl();
    pages.push(...results);
    if (has_more) this.#crawl(next_cursor);

    return await Promise.all(
      pages
        .filter(async (page) => {
          return page.archived === false;
        })
        .map(async (page) => {
          return new PageEntity(page);
        })
        .filter(
          (page): page is Exclude<typeof page, undefined> => page !== undefined
        )
    );
  }
  async updatePage(pageID: string, properties: PropertyValueMap) {
    return await this.#client.pages.update({
      page_id: pageID,
      properties,
    });
  }
}
