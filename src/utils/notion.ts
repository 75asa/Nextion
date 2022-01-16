import { Database, Page, RichText } from "../@types/notion-api-types";

type PagePropertyValueType = Page.Property.PropertyValue;
type DatabasePropertyValueType = Database.Property.PropertyValue;

export const isDetectivePagePropertyType = <T extends PagePropertyValueType>(
  propValue: PagePropertyValueType
): propValue is T => {
  const propertyType = (propValue as T).type;
  return (propValue as T).type === propertyType;
};

export const isDetectiveDatabasePropertyType = <
  T extends DatabasePropertyValueType
>(
  propValue: DatabasePropertyValueType
): propValue is T => {
  const propertyType = (propValue as T).type;
  return (propValue as T).type === propertyType;
};

export const reduceRichText = (titleList: RichText.RichText[]) => {
  return titleList.reduce((acc, cur) => {
    if (!("plain_text" in cur)) return acc;
    return (acc += (acc.length ? " " : "") + cur.plain_text);
  }, "");
};
