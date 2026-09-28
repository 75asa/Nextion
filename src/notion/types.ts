import type {
  PageObjectResponse,
  UpdatePageParameters,
} from "@notionhq/client";

export type PagePropertyValue = PageObjectResponse["properties"][string];
export type PagePropertyType = PagePropertyValue["type"];
export type PagePropertyValueOf<T extends PagePropertyType> = Extract<
  PagePropertyValue,
  { type: T }
>;

export type PageCoverValue = PageObjectResponse["cover"];

export type PagePropertiesUpdate = NonNullable<
  UpdatePageParameters["properties"]
>;
export type PageCoverUpdate = UpdatePageParameters["cover"];

export const isPropertyOfType = <T extends PagePropertyType>(
  propValue: PagePropertyValue | undefined,
  type: T,
): propValue is PagePropertyValueOf<T> => propValue?.type === type;
