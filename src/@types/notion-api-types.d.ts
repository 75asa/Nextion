import type {
  ListBlockChildrenResponse,
  SearchResponse,
  QueryDatabaseResponse,
  GetDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";

export declare namespace Database {
  export type RawDatabase = SearchResponse["results"][number];
  export namespace Property {
    export type PropertyValueMap = GetDatabaseResponse["properties"];
    export type PropertyValue = PropertyValueMap[string];
    export type PropertyValueType = PropertyValue["type"];
    type ExtractedPropertyValue<TType extends PropertyValueType> = Extract<
      PropertyValue,
      { type: TType }
    >;
    export namespace Values {
      export type Title = ExtractedPropertyValue<"title">;
      export type RichText = ExtractedPropertyValue<"rich_text">;
      export type Number = ExtractedPropertyValue<"number">;
      export type URL = ExtractedPropertyValue<"url">;
      export type Select = ExtractedPropertyValue<"select">;
      export type MultiSelect = ExtractedPropertyValue<"multi_select">;
      export type People = ExtractedPropertyValue<"people">;
      export type Email = ExtractedPropertyValue<"email">;
      export type PhoneNumber = ExtractedPropertyValue<"phone_number">;
      export type Date = ExtractedPropertyValue<"date">;
      export type Files = ExtractedPropertyValue<"files">;
      export type Formula = ExtractedPropertyValue<"formula">;
      export type Relation = ExtractedPropertyValue<"relation">;
      export type Rollup = ExtractedPropertyValue<"rollup">;
      export type CreatedTime = ExtractedPropertyValue<"created_time">;
      export type CreatedBy = ExtractedPropertyValue<"created_by">;
      export type LastEditedTime = ExtractedPropertyValue<"last_edited_time">;
      export type LastEditedBy = ExtractedPropertyValue<"last_edited_by">;
    }
  }
}

export declare namespace Page {
  export type RawPage = QueryDatabaseResponse["results"][number];

  export type PageCover = RawPage["cover"];
  export type PageIcon = RawPage["icon"];

  export namespace Property {
    export type PropertyValueMap = RawPage["properties"];
    export type PropertyValue = PropertyValueMap[string];
    export type PropertyValueType = PropertyValue["type"];

    type ExtractedPropertyValue<TType extends PropertyValueType> = Extract<
      PropertyValue,
      { type: TType }
    >;
    export namespace Values {
      export type Title = ExtractedPropertyValue<"title">;
      export type RichText = ExtractedPropertyValue<"rich_text">;
      export type Number = ExtractedPropertyValue<"number">;
      export type URL = ExtractedPropertyValue<"url">;
      export type Select = ExtractedPropertyValue<"select">;
      export type MultiSelect = ExtractedPropertyValue<"multi_select">;
      export type People = ExtractedPropertyValue<"people">;
      export type Email = ExtractedPropertyValue<"email">;
      export type PhoneNumber = ExtractedPropertyValue<"phone_number">;
      export type Date = ExtractedPropertyValue<"date">;
      export type Files = ExtractedPropertyValue<"files">;
      export type Formula = ExtractedPropertyValue<"formula">;
      export type Relation = ExtractedPropertyValue<"relation">;
      export type Rollup = ExtractedPropertyValue<"rollup">;
      export type CreatedTime = ExtractedPropertyValue<"created_time">;
      export type CreatedBy = ExtractedPropertyValue<"created_by">;
      export type LastEditedTime = ExtractedPropertyValue<"last_edited_time">;
      export type LastEditedBy = ExtractedPropertyValue<"last_edited_by">;
    }
  }
}

export declare namespace People {
  export namespace PropertyValue {
    export type User = Extract<
      Page.Property.Values.People["people"][number],
      { type: string }
    >;
    export type UserType = User["type"];
    export type UserPerson = Extract<User, { type: "person" }>;
    export type UserBot = Extract<User, { type: "bot" }>;
    export type UserPersonOrBot = UserPerson | UserBot;
  }
  export type PeopleValue = Page.Property.Values.People["people"];
}

export declare namespace Block {
  export type RawBlock = ListBlockChildrenResponse["results"][number];
  export type RawBlockType = RawBlock["type"];
  type ExtractedBlockType<TType extends RawBlockType> = Extract<
    RawBlock,
    { type: TType }
  >;
  export type RawBlocks = RawBlock[];
  export namespace Blocks {
    export type Paragraph = ExtractedBlockType<"paragraph">;
    export type HeadingOne = ExtractedBlockType<"heading_1">;
    export type HeadingTwo = ExtractedBlockType<"heading_2">;
    export type HeadingThree = ExtractedBlockType<"heading_3">;
    export type HeadingBlock = HeadingOne | HeadingTwo | HeadingThree;
    export type BulletedListItem = ExtractedBlockType<"bulleted_list_item">;
    export type NumberedListItem = ExtractedBlockType<"numbered_list_item">;
    export type Quote = ExtractedBlockType<"quote">;
    export type Equation = ExtractedBlockType<"equation">;
    export type Code = ExtractedBlockType<"code">;
    export type Callout = ExtractedBlockType<"callout">;
    export type ToDo = ExtractedBlockType<"to_do">;
    export type Bookmark = ExtractedBlockType<"bookmark">;
    export type Toggle = ExtractedBlockType<"toggle">;
    export type ChildPage = ExtractedBlockType<"child_page">;
    export type ChildDatabase = ExtractedBlockType<"child_database">;
    export type Embed = ExtractedBlockType<"embed">;
    export type Image = ExtractedBlockType<"image">;
    export type Video = ExtractedBlockType<"video">;
    export type PDF = ExtractedBlockType<"pdf">;
    export type File = ExtractedBlockType<"file">;
    export type Audio = ExtractedBlockType<"audio">;
    export type TOC = ExtractedBlockType<"table_of_contents">;
    export type Divider = ExtractedBlockType<"divider">;
    export type Unsupported = ExtractedBlockType<"unsupported">;
  }
}

export type PropertyColor =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red";

export namespace RichText {
  export type RichText = Block.Blocks.Paragraph["paragraph"]["text"][number];
  export type Annotations = RichText["annotations"];
  export type RichTextType = RichText["type"];
  export type ExtractedRichText<TType extends RichTextType> = Extract<
    RichText,
    { type: TType }
  >;
  export namespace AllRichText {
    export type Text = ExtractedRichText<"text">;
    export type Mention = ExtractedRichText<"mention">;
    export type Equation = ExtractedRichText<"equation">;
  }
}

export namespace File {
  export type File = Block.Blocks.Image["image"];
  export type FileType = File["type"];
  export type ExtractedFile<TType extends FileType> = Extract<
    File,
    { type: TType }
  >;
  export type ExternalFileWithCaption = Omit<
    ExtractedFile<"external">,
    "caption"
  > & { caption?: ExtractedFile<"external">["caption"] };
  export type FileWithCaption = Omit<ExtractedFile<"file">, "caption"> & {
    caption?: ExtractedFile<"file">["caption"];
  };
}

export namespace Callout {
  export type CalloutIcon = Block.Blocks.Callout["callout"]["icon"];
  export type CalloutIconType = CalloutIcon["type"];
  export type ExtractedCalloutIcon<TType extends CalloutIconType> = Extract<
    CalloutIcon,
    { type: TType }
  >;
  export namespace AllCallOutIcon {
    export type Emoji = ExtractedCalloutIcon<"emoji">;
    export type External = ExtractedCalloutIcon<"external">;
    export type File = ExtractedCalloutIcon<"file">;
  }
}
