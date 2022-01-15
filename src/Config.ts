import dotenv from "dotenv";

const config = dotenv.config().parsed;

if (config) {
  for (const key in config) {
    process.env[key] = config[key];
  }
}

export namespace Config {
  export const Mode = {
    CHOOSE_NEXT: "chooseNext",
    WATCH_DONE: "watchDone",
    FETCH_ICON: "fetchIcon",
  } as const;
  export interface CLI_ARGS {
    mode: string;
  }
  export namespace Slack {
    export const BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
    export const CHANNEL_NAME = process.env.SLACK_CHANNEL_NAME;
  }
  export namespace Notion {
    export const KEY = process.env.NOTION_KEY;
    export const DATABASE_ID = process.env.NOTION_DATABASE_ID;
    export const Prop = {
      NAME: process.env.NOTION_NAME_PROP || "Name",
      STATUS: process.env.NOTION_STATUS_PROP || "Status",
      LAST_EDITED_AT: process.env.NOTION_LAST_EDITED_AT_PROP || "LastEditedAt",
    } as const;
    export const Status = {
      NEXT: "Next",
      DONE: "Done",
      NO_TARGET: "NoTarget",
      NO_STATUS: "NoStatus",
    } as const;
    export const PageStatusValues = Object.values(Config.Notion.Status)[0];
  }
}
