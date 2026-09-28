import type { PagePropertyValueOf } from "../notion/types";

type RichTextItem = PagePropertyValueOf<"title">["title"][number];

export const reduceRichText = (richText: RichTextItem[]) =>
  richText.map((item) => item.plain_text).join("");
