import type { PageObjectResponse } from "@notionhq/client";

type Overrides = {
  id?: string;
  title?: string;
  status?: string | null;
  statusType?: "select" | "rich_text";
  assignee?: { name: string; avatar_url: string | null } | null;
  cover?: PageObjectResponse["cover"];
  in_trash?: boolean;
  is_archived?: boolean;
};

export const buildPage = ({
  id = "page-1",
  title = "",
  status = null,
  statusType = "select",
  assignee = null,
  cover = null,
  in_trash = false,
  is_archived = false,
}: Overrides = {}) =>
  ({
    object: "page",
    id,
    url: `https://www.notion.so/${id}`,
    in_trash,
    is_archived,
    cover,
    properties: {
      Name: {
        id: "title",
        type: "title",
        title: title ? [{ type: "text", plain_text: title }] : [],
      },
      Status:
        statusType === "select"
          ? {
              id: "status",
              type: "select",
              select: status
                ? { id: "opt", name: status, color: "blue" }
                : null,
            }
          : { id: "status", type: "rich_text", rich_text: [] },
      Assign: {
        id: "assign",
        type: "people",
        people: assignee
          ? [{ object: "user", id: "user-1", type: "person", ...assignee }]
          : [],
      },
    },
  }) as unknown as PageObjectResponse;
