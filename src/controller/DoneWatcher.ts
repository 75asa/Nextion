import { Config } from "../Config";
import type {
  GetAllPagesAndGroupByUseCase,
  UpdatePropertiesUseCase,
} from "../useCases";
import { ConcurrencyLock } from "../utils";

export class DoneWatcher {
  constructor(
    private getAllPagesAndGroupByUseCase: GetAllPagesAndGroupByUseCase,
    private updatePropertiesUseCase: UpdatePropertiesUseCase,
  ) {}
  async run() {
    const { NoStatus, Done } = await this.getAllPagesAndGroupByUseCase.invoke();
    console.log({ NoStatus, Done });
    if (NoStatus.length) return;
    const target = [...Done];
    // NOTE: 開発時は Next も分割代入して target に含めると動作確認しやすい
    const lock = new ConcurrencyLock({ concurrency: 3, interval: 1000 });
    return await Promise.all(
      target.map(async (page) => {
        return await lock.run(async () => {
          return await this.updatePropertiesUseCase.invoke(
            page,
            Config.Notion.Status.NO_STATUS,
          );
        });
      }),
    );
  }
}
