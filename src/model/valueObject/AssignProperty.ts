import { isPropertyOfType, type PagePropertyValue } from "../../notion/types";

export class AssignProperty {
  #id: string | null = null;
  #name: string | null = null;
  #avatarURL: string | null = null;

  constructor(propValue: PagePropertyValue | undefined) {
    if (!isPropertyOfType(propValue, "people")) {
      throw new Error(`Assign property is not a people: ${propValue?.type}`);
    }
    const [firstAssign] = propValue.people;
    if (!firstAssign || !("type" in firstAssign)) return;
    this.#id = firstAssign.id;
    this.#name = firstAssign.name;
    this.#avatarURL = firstAssign.avatar_url;
  }

  get id(): string | null {
    return this.#id;
  }

  get avatarURL(): string | null {
    return this.#avatarURL;
  }

  get name(): string | null {
    return this.#name;
  }
}
