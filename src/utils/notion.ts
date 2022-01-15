import { Database, Page } from "../@types/notion-api-types";

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
