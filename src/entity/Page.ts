import { Config } from "../Config";

const { Status } = Config.Notion;

type PageStatus = typeof Status[keyof typeof Status];

export interface PageEntity {
  id: string;
  status: PageStatus;
  properties: unknown;
  lastEditedAt: Date;
}
