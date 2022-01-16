import { Config } from "../Config";
import {
  GetAllPagesAndGroupByUseCase,
  UpdatePropertiesUseCase,
} from "../useCases";
import { ConcurrencyLock } from "../utils";

export class DoneWatcher {
  constructor(
    private getAllPagesAndGroupByUseCase: GetAllPagesAndGroupByUseCase,
    private updatePropertiesUseCase: UpdatePropertiesUseCase
  ) {}
  async run() {
    const { NoStatus, Done } = await this.getAllPagesAndGroupByUseCase.invoke();
    console.log({ NoStatus, Done });
    if (NoStatus.length) return;
    const lock = new ConcurrencyLock({ concurrency: 3, interval: 1000 });
    return await Promise.all(
      Done.map(async (page) => {
        return await lock.run(async () => {
          return await this.updatePropertiesUseCase.invoke(
            page,
            Config.Notion.Status.NO_STATUS
          );
        });
      })
    );
  }
}
