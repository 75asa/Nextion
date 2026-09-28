import {
  isPropertyOfType,
  type PagePropertiesUpdate,
  type PagePropertyValue,
} from "../../notion/types";
import { reduceRichText } from "../../utils";

export class TitleProperty {
  #name: string;
  constructor(propValue: PagePropertyValue | undefined) {
    if (!isPropertyOfType(propValue, "title")) {
      throw new Error(`Title property is not a title: ${propValue?.type}`);
    }
    this.#name = reduceRichText(propValue.title);
  }

  get name(): string {
    return this.#name;
  }

  static toUpdate(input: string): PagePropertiesUpdate[string] {
    return {
      title: [
        {
          type: "text",
          text: { content: input, link: null },
          annotations: {
            bold: true,
            italic: false,
            strikethrough: false,
            underline: true,
            code: true,
            color: "default",
          },
        },
      ],
    };
  }
}
