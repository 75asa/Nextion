import { parse } from "ts-command-line-args";
import { Config } from "./Config";
import { NextChooser } from "./controller/NextChooser";
import { NotionRepository } from "./repository/NotionRepository";
import {
  GetAllPagesAndGroupByUseCase,
  UpdatePropertiesUseCase,
} from "./useCases";

const { KEY, DATABASE_ID } = Config.Notion;

const main = async () => {
  const args = parse<Config.CLI_ARGS>({
    mode: String,
  });
  const notionRepo = new NotionRepository({
    KEY,
    DATABASE_ID,
  });

  switch (args.mode) {
    case Config.Mode.NEXT_CHOOSE: {
      const handler = await new NextChooser(
        new GetAllPagesAndGroupByUseCase(notionRepo),
        new UpdatePropertiesUseCase(notionRepo)
      ).run();
      console.log({ handler });
      break;
    }
    case Config.Mode.WATCH_DONE: {
      break;
    }
    case Config.Mode.FETCH_ICON: {
      break;
    }
    default:
      break;
  }
};

main();
