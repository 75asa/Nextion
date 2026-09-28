import { Client } from "@notionhq/client";
import { beforeEach, describe, expect, type Mock, test, vi } from "vitest";
import { NotionRepository } from "../../src/repository/NotionRepository";
import { buildPage } from "../fixtures";

vi.mock("@notionhq/client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@notionhq/client")>()),
  Client: vi.fn(),
}));

const databasesRetrieve = vi.fn();
const dataSourcesQuery = vi.fn();
const dataSourcesRetrieve = vi.fn();
const pagesUpdate = vi.fn();

const mockQuery = (
  responses: { results: unknown[]; next_cursor: string | null }[],
) => {
  for (const { results, next_cursor } of responses) {
    dataSourcesQuery.mockResolvedValueOnce({
      results,
      next_cursor,
      has_more: next_cursor !== null,
    });
  }
};

beforeEach(() => {
  vi.resetAllMocks();
  (Client as unknown as Mock<new () => object>).mockImplementation(
    class {
      databases = { retrieve: databasesRetrieve };
      dataSources = { query: dataSourcesQuery, retrieve: dataSourcesRetrieve };
      pages = { update: pagesUpdate };
    },
  );
  databasesRetrieve.mockResolvedValue({
    object: "database",
    id: "db",
    title: [],
    data_sources: [{ id: "ds-1", name: "Main" }],
  });
});

describe("NotionRepository#getPages", () => {
  const config = { KEY: "key", DATABASE_ID: "db" };

  test("queries the database's data source across all cursors (#57)", async () => {
    mockQuery([
      { results: [buildPage({ id: "1" })], next_cursor: "c1" },
      { results: [buildPage({ id: "2" })], next_cursor: "c2" },
      { results: [buildPage({ id: "3" })], next_cursor: null },
    ]);

    const pages = await new NotionRepository(config).getPages();

    expect(pages.map((page) => page.id)).toEqual(["1", "2", "3"]);
    expect(databasesRetrieve).toHaveBeenCalledWith({ database_id: "db" });
    expect(dataSourcesQuery).toHaveBeenCalledTimes(3);
    expect(dataSourcesQuery).toHaveBeenNthCalledWith(1, {
      data_source_id: "ds-1",
    });
    expect(dataSourcesQuery).toHaveBeenNthCalledWith(2, {
      data_source_id: "ds-1",
      start_cursor: "c1",
    });
    expect(dataSourcesQuery).toHaveBeenNthCalledWith(3, {
      data_source_id: "ds-1",
      start_cursor: "c2",
    });
  });

  test("excludes trashed, archived and partial pages (#60)", async () => {
    mockQuery([
      {
        results: [
          buildPage({ id: "1" }),
          buildPage({ id: "2", in_trash: true }),
          buildPage({ id: "3", is_archived: true }),
          { object: "page", id: "4" },
        ],
        next_cursor: null,
      },
    ]);

    const pages = await new NotionRepository(config).getPages();

    expect(pages.map((page) => page.id)).toEqual(["1"]);
  });

  test("uses NOTION_DATA_SOURCE_ID without resolving the database", async () => {
    mockQuery([{ results: [], next_cursor: null }]);

    await new NotionRepository({
      ...config,
      DATA_SOURCE_ID: "ds-x",
    }).getPages();

    expect(databasesRetrieve).not.toHaveBeenCalled();
    expect(dataSourcesQuery).toHaveBeenCalledWith({ data_source_id: "ds-x" });
  });

  test("fails with a hint when the database has multiple data sources", async () => {
    databasesRetrieve.mockResolvedValue({
      object: "database",
      id: "db",
      title: [],
      data_sources: [
        { id: "ds-1", name: "A" },
        { id: "ds-2", name: "B" },
      ],
    });

    await expect(new NotionRepository(config).getPages()).rejects.toThrow(
      /NOTION_DATA_SOURCE_ID.*A \(ds-1\), B \(ds-2\)/,
    );
  });
});

test("NotionRepository fails clearly when the database is not readable", async () => {
  databasesRetrieve.mockResolvedValue({ object: "database", id: "db" });

  await expect(
    new NotionRepository({ KEY: "key", DATABASE_ID: "db" }).getPages(),
  ).rejects.toThrow(/Could not read database db\. Make sure it is shared/);
});

describe("NotionRepository#getStatusOptionNames", () => {
  const config = { KEY: "key", DATABASE_ID: "db", DATA_SOURCE_ID: "ds-1" };

  test("returns the select options and fetches the schema only once", async () => {
    dataSourcesRetrieve.mockResolvedValue({
      object: "data_source",
      id: "ds-1",
      title: [],
      properties: {
        Status: {
          type: "select",
          select: { options: [{ name: "Next" }, { name: "Done" }] },
        },
      },
    });
    const repository = new NotionRepository(config);

    expect(await repository.getStatusOptionNames()).toEqual(
      new Set(["Next", "Done"]),
    );
    await repository.getStatusOptionNames();
    expect(dataSourcesRetrieve).toHaveBeenCalledTimes(1);
    expect(dataSourcesRetrieve).toHaveBeenCalledWith({
      data_source_id: "ds-1",
    });
  });

  test("throws when the status property is not a select", async () => {
    dataSourcesRetrieve.mockResolvedValue({
      object: "data_source",
      id: "ds-1",
      title: [],
      properties: { Status: { type: "status", status: { options: [] } } },
    });

    await expect(
      new NotionRepository(config).getStatusOptionNames(),
    ).rejects.toThrow(/Status property "Status" is not a select: status/);
  });
});

describe("NotionRepository#updatePage", () => {
  test("sends only the changed properties", async () => {
    mockQuery([
      { results: [buildPage({ id: "1", title: "t" })], next_cursor: null },
    ]);
    const repository = new NotionRepository({ KEY: "key", DATABASE_ID: "db" });
    const [page] = await repository.getPages();

    page.updateStatus("Next");
    await repository.updatePage(page);

    expect(pagesUpdate).toHaveBeenCalledWith({
      page_id: "1",
      properties: { Status: { select: { name: "Next" } } },
      cover: { type: "external", external: { url: expect.any(String) } },
    });
  });
});
