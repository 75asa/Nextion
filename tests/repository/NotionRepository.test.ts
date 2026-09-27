import { Client } from "@notionhq/client/build/src";
import { describe, expect, type Mock, test, vi } from "vitest";
import { NotionRepository } from "../../src/repository/NotionRepository";

vi.mock("@notionhq/client/build/src");

const buildRawPage = (id: string, archived = false) => ({
  object: "page",
  id,
  archived,
  cover: null,
  properties: {
    Name: { id: "title", type: "title", title: [] },
    Status: { id: "status", type: "select", select: null },
    Assign: { id: "assign", type: "people", people: [] },
  },
});

const mockQuery = (
  responses: { results: unknown[]; next_cursor: string | null }[],
) => {
  const query = vi.fn();
  for (const { results, next_cursor } of responses) {
    query.mockResolvedValueOnce({
      results,
      next_cursor,
      has_more: next_cursor !== null,
    });
  }
  (Client as unknown as Mock<new () => object>).mockImplementation(
    class {
      databases = { query };
    },
  );
  return query;
};

describe("NotionRepository#getPages", () => {
  const config = { KEY: "key", DATABASE_ID: "db" };

  test("fetches all pages across multiple cursors (#57)", async () => {
    const query = mockQuery([
      { results: [buildRawPage("1")], next_cursor: "c1" },
      { results: [buildRawPage("2")], next_cursor: "c2" },
      { results: [buildRawPage("3")], next_cursor: null },
    ]);

    const pages = await new NotionRepository(config).getPages();

    expect(pages.map((page) => page.id)).toEqual(["1", "2", "3"]);
    expect(query).toHaveBeenCalledTimes(3);
    expect(query).toHaveBeenNthCalledWith(1, { database_id: "db" });
    expect(query).toHaveBeenNthCalledWith(2, {
      database_id: "db",
      start_cursor: "c1",
    });
    expect(query).toHaveBeenNthCalledWith(3, {
      database_id: "db",
      start_cursor: "c2",
    });
  });

  test("excludes archived pages (#60)", async () => {
    mockQuery([
      {
        results: [buildRawPage("1"), buildRawPage("2", true)],
        next_cursor: null,
      },
    ]);

    const pages = await new NotionRepository(config).getPages();

    expect(pages.map((page) => page.id)).toEqual(["1"]);
  });
});
