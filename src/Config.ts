import dotenv from "dotenv";

const config = dotenv.config().parsed;

if (config) {
  for (const key in config) {
    process.env[key] = config[key];
  }
}

export namespace Config {
  export namespace Slack {
    export const BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
    export const CHANNEL_NAME = process.env.SLACK_CHANNEL_NAME;
  }
  export namespace Notion {
    export const KEY = process.env.NOTION_KEY;
    export namespace Status {
      export const NEXT = process.env.NOTION_STATUS_NEXT || "Next";
      export const DONE = process.env.NOTION_STATUS_DONE || "Done";
    }
  }
  export namespace Sentry {
    export const DSN = process.env.SENTRY_DSN;
  }
}
