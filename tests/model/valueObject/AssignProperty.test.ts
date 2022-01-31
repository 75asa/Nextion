import { AssignProperty } from "../../../src/model/valueObject/AssignProperty";
import { pageMock } from "../../data/page.mock";

describe("AssignProperty", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  test("include a person", (): void => {
    const assign = new AssignProperty({ ...pageMock });
  });

  test("include a person", (): void => {});
});
