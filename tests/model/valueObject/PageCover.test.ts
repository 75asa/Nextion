import { Config } from "../../../src/Config";
import { PageCover } from "../../../src/model/valueObject/PageCover";

const { NO_IMAGE_URL } = Config.Notion;

describe("PageCover", (): void => {
  test("if original page cover is empty, return no image url", (): void => {
    const pageCover: PageCover = new PageCover(null);
    expect(pageCover.coverURL).toBe(NO_IMAGE_URL);
    expect(pageCover.coverURL).toBe("");
  });
});
