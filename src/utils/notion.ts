import {
  DatabasePropertyValue,
  PropertyValue,
} from "../@types/notion-api-types";

export const isDetectivePagePropertyType = <T extends PropertyValue>(
  propValue: PropertyValue
): propValue is T => {
  const propertyType = (propValue as T).type;
  return (propValue as T).type === propertyType;
};

export const isDetectiveDatabasePropertyType = <
  T extends DatabasePropertyValue
>(
  propValue: DatabasePropertyValue
): propValue is T => {
  const propertyType = (propValue as T).type;
  return (propValue as T).type === propertyType;
};
