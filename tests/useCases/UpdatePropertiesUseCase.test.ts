import { beforeEach, describe, expect, test, vi } from "vitest";
import { PageEntity } from "../../src/model/entity/Page";
import type { NotionRepository } from "../../src/repository/NotionRepository";
import { UpdatePropertiesUseCase } from "../../src/useCases/UpdatePropertiesUseCase";
import { buildPage } from "../fixtures";

const getStatusOptionNames = vi.fn();
const updatePage = vi.fn();
const repository = {
  getStatusOptionNames,
  updatePage,
} as unknown as NotionRepository;

beforeEach(() => {
  vi.resetAllMocks();
  getStatusOptionNames.mockResolvedValue(new Set(["Next"]));
});

describe("UpdatePropertiesUseCase", () => {
  test("updates the page when the option exists", async () => {
    const page = new PageEntity(buildPage());

    await new UpdatePropertiesUseCase(repository).invoke(page, "Next");

    expect(updatePage).toHaveBeenCalledWith(page);
    expect(page.toUpdate().properties).toEqual({
      Status: { select: { name: "Next" } },
    });
  });

  test("skips instead of creating a missing option", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const page = new PageEntity(buildPage());

    await new UpdatePropertiesUseCase(repository).invoke(page, "Done");

    expect(updatePage).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"Done"'));
  });

  test("clears the status without looking up options", async () => {
    const page = new PageEntity(buildPage({ status: "Done" }));

    await new UpdatePropertiesUseCase(repository).invoke(page, "NoStatus");

    expect(getStatusOptionNames).not.toHaveBeenCalled();
    expect(page.toUpdate().properties).toEqual({ Status: { select: null } });
  });
});
