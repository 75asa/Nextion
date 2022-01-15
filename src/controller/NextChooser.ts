import { Config } from "../Config";
import {
  GetAllPagesAndGroupByUseCase,
  UpdatePropertiesUseCase,
} from "../useCases";

export class NextChooser {
  constructor(
    private getAllPagesAndGroupByUseCase: GetAllPagesAndGroupByUseCase,
    private updatePropertiesUseCase: UpdatePropertiesUseCase
  ) {}
  async run() {
    const { NoStatus } = await this.getAllPagesAndGroupByUseCase.invoke();
    if (!NoStatus.length) return;
    const chosenNext = NoStatus[Math.floor(Math.random() * NoStatus.length)];
    return await this.updatePropertiesUseCase.invoke(
      chosenNext,
      Config.Notion.Status.NEXT
    );
  }
}
