import { Config } from "../../../src/Config";
import { PageCover } from "../../../src/model/valueObject/PageCover";

const { NO_IMAGE_URL } = Config.Notion;

describe("PageCover", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  test("if a page cover is empty, return no image url", (): void => {
    const pageCover = new PageCover(null);
    expect(pageCover.coverURL).toBe(NO_IMAGE_URL);
  });

  test("coverURL setter works", (): void => {
    const pageCover = new PageCover(null);
    const value = "https://example.com/image.png";
    pageCover.coverURL = value;
    expect(pageCover.coverURL).toBe(value);
  });

  test("pageCover Object is expected type", (): void => {
    const pageCover = new PageCover(null);
    expect(pageCover.getPageCover()).toEqual({
      type: "external",
      external: {
        url: NO_IMAGE_URL,
      },
    });
  });
});
