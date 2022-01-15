import { parse } from "ts-command-line-args";
import { Config } from "./Config";
import { NextChooser, DoneWatcher, IconFetcher } from "./controller";
import { NotionRepository } from "./repository/NotionRepository";
import {
  FetchAssigneeUserIconUseCase,
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
    case Config.Mode.CHOOSE_NEXT: {
      const handler = await new NextChooser(
        new GetAllPagesAndGroupByUseCase(notionRepo),
        new UpdatePropertiesUseCase(notionRepo)
      ).run();
      console.log({ handler });
      break;
    }
    case Config.Mode.WATCH_DONE: {
      const handler = await new DoneWatcher(
        new GetAllPagesAndGroupByUseCase(notionRepo),
        new UpdatePropertiesUseCase(notionRepo)
      ).run();
      console.log({ handler });
      break;
    }
    case Config.Mode.FETCH_ICON: {
      const handler = await new IconFetcher(
        new FetchAssigneeUserIconUseCase(notionRepo)
      ).run();
      console.log({ handler });
      break;
    }
    default:
      break;
  }
};

main();
