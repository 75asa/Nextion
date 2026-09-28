import { Config } from "../../Config";
import {
  isPropertyOfType,
  type PagePropertiesUpdate,
  type PagePropertyValue,
} from "../../notion/types";

const { Status } = Config.Notion;

export type PageStatus = (typeof Status)[keyof typeof Status];

const isPageStatus = (name: string): name is PageStatus =>
  (Object.values(Status) as string[]).includes(name);

export class StatusPropertyValue {
  #status: PageStatus;

  constructor(propValue: PagePropertyValue | undefined) {
    if (!isPropertyOfType(propValue, "select")) {
      throw new Error(`Status property is not a select: ${propValue?.type}`);
    }
    const name = propValue.select?.name;
    if (!name) {
      this.#status = Status.NO_STATUS;
      return;
    }
    if (!isPageStatus(name)) {
      throw new Error(
        `Unknown status option: ${name} (expected one of ${Object.values(Status).join(", ")})`,
      );
    }
    this.#status = name;
  }

  get status() {
    return this.#status;
  }

  static toUpdate(status: PageStatus): PagePropertiesUpdate[string] {
    return {
      select: status === Status.NO_STATUS ? null : { name: status },
    };
  }
}
