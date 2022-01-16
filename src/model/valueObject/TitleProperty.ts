import { Page, RichText } from "../../@types/notion-api-types";
import { isDetectivePagePropertyType, reduceRichText } from "../../utils";

type TitlePropertyType = Page.Property.Values.Title;

export class TitleProperty {
  #name: string;
  constructor(propValue: Page.Property.PropertyValue) {
    if (!isDetectivePagePropertyType<TitlePropertyType>(propValue)) {
      throw new Error(
        `Invalid NameProperty propValue: ${console.dir(propValue)}`
      );
    }
    this.#name = reduceRichText(propValue.title);
  }
  get name(): string {
    return this.#name;
  }
  set name(name: string) {
    this.#name = name;
  }

  generateTitleProperty(input: string): RichText.AllRichText.Text {
    return {
      type: "text",
      text: {
        content: input,
        link: null,
      },
      annotations: {
        bold: true,
        italic: false,
        strikethrough: false,
        underline: true,
        code: true,
        color: "default",
      },
      plain_text: input,
      href: null,
    };
  }

  isTitlePropertyType(
    input: Page.Property.PropertyValue
  ): input is TitlePropertyType {
    return isDetectivePagePropertyType<TitlePropertyType>(input);
  }
}
