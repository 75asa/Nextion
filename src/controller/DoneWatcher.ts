import { Config } from "../Config";
import {
  GetAllPagesAndGroupByUseCase,
  UpdatePropertiesUseCase,
} from "../useCases";

export class DoneWatcher {
  constructor(
    private getAllPagesAndGroupByUseCase: GetAllPagesAndGroupByUseCase,
    private updatePropertiesUseCase: UpdatePropertiesUseCase
  ) {}
  async run() {
    const { NoStatus, Done } = await this.getAllPagesAndGroupByUseCase.invoke();
    console.log({ NoStatus, Done });
    if (NoStatus.length) return;
    return await Promise.all(
      Done.map(async (page) => {
        return await this.updatePropertiesUseCase.invoke(
          page,
          Config.Notion.Status.NO_STATUS
        );
      })
    );
  }
}
