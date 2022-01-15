import { Page } from "../../@types/notion-api-types";
import { isDetectivePagePropertyType } from "../../utils";

export class AssignProperty {
  #id: string | null = null;
  #name: string | null = null;
  #avatarURL: string | null = null;

  constructor(propValue: Page.Property.PropertyValue) {
    if (!isDetectivePagePropertyType<Page.Property.Values.People>(propValue)) {
      throw new Error("propValue is not PropertyValuePeople");
    }
    const assignValue = propValue.people;
    if (!assignValue.length) return;
    const firstAssign = assignValue[0];
    if (!("type" in firstAssign)) return;
    const { id, name, avatar_url } = firstAssign;
    this.#id = id;
    this.#name = name;
    this.#avatarURL = avatar_url;
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
