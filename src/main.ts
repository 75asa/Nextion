import { Config } from "./Config";
import { NextChooser } from "./controller/NextChooser";
import { NotionRepository } from "./repository/NotionRepository";
import {
  GetAllPagesAndGroupByUseCase,
  UpdatePropertiesUseCase,
} from "./useCases";

const { KEY, DATABASE_ID } = Config.Notion;

const main = async () => {
  const notionRepo = new NotionRepository({
    KEY,
    DATABASE_ID,
  });
  const handler = await new NextChooser(
    new GetAllPagesAndGroupByUseCase(notionRepo),
    new UpdatePropertiesUseCase(notionRepo)
  ).run();
  console.log({ handler });
};

main();
