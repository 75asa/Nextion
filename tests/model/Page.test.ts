import { describe, expect, test } from "vitest";
import { Config } from "../../src/Config";
import { PageEntity } from "../../src/model/entity/Page";
import { buildPage } from "../fixtures";

const external = (url: string) =>
  ({ type: "external", external: { url } }) as const;

describe("PageEntity status", () => {
  test.each([
    [null, "NoStatus"],
    ["Next", "Next"],
    ["Done", "Done"],
    ["NoTarget", "NoTarget"],
  ])("reads select %s as %s", (status, expected) => {
    const page = new PageEntity(buildPage({ status }));
    expect(page.statusProperty.status).toBe(expected);
  });

  test("throws on an unknown option", () => {
    expect(() => new PageEntity(buildPage({ status: "Doing" }))).toThrow(
      /Unknown status option: Doing/,
    );
  });

  test("throws when the property is not a select (#24)", () => {
    expect(
      () => new PageEntity(buildPage({ statusType: "rich_text" })),
    ).toThrow(/not a select/);
  });

  test.each([
    ["Next", { select: { name: "Next" } }],
    ["Done", { select: { name: "Done" } }],
    ["NoStatus", { select: null }],
  ] as const)("updateStatus(%s) sets %o", (status, expected) => {
    const page = new PageEntity(buildPage({ cover: external("x") }));
    page.updateStatus(status);
    expect(page.toUpdate().properties).toEqual({ Status: expected });
  });
});

describe("PageEntity fetch icon", () => {
  const assignee = { name: "Alice", avatar_url: "https://avatar" };

  test("sets the assignee avatar as cover and the name as empty title", () => {
    const page = new PageEntity(
      buildPage({ assignee, cover: external("https://old") }),
    );
    page.setAssignIconToPageCover();
    page.changeTitle();

    const { properties, cover } = page.toUpdate();
    expect(cover).toEqual(external("https://avatar"));
    expect(properties.Name).toMatchObject({
      title: [{ text: { content: "Alice" } }],
    });
  });

  test("keeps an existing title", () => {
    const page = new PageEntity(
      buildPage({
        assignee,
        title: "Already",
        cover: external("https://avatar"),
      }),
    );
    page.changeTitle();
    expect(page.toUpdate().properties).toEqual({});
  });

  test("has no changes when cover already matches and title is set", () => {
    const page = new PageEntity(
      buildPage({ assignee, title: "t", cover: external("https://avatar") }),
    );
    page.setAssignIconToPageCover();
    page.changeTitle();
    expect(page.hasChanges).toBe(false);
  });

  test("uses the placeholder cover for pages without any cover", () => {
    const page = new PageEntity(buildPage({ title: "t" }));
    expect(page.toUpdate().cover).toEqual(external(Config.Notion.NO_IMAGE_URL));
  });

  test("keeps an uploaded (file) cover when there is no avatar", () => {
    const page = new PageEntity(
      buildPage({
        title: "t",
        cover: {
          type: "file",
          file: { url: "https://file", expiry_time: "" },
        },
      }),
    );
    page.setAssignIconToPageCover();
    expect(page.hasChanges).toBe(false);
  });
});
