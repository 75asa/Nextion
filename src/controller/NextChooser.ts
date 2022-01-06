import { GetAllPagesUseCase } from "../useCase/GetAllPagesAndGroupByUseCase";
import { UpdatePropertiesUseCase } from "../useCase/UpdatePropertiesUseCase";

export class NextChooser {
  constructor(
    private getAllPagesUseCase: GetAllPagesUseCase,
    private updatePropertiesUseCase: UpdatePropertiesUseCase
  ) {}
  async run() {
    const { Next, NoStatus, Done, Unchooseble } =
      await this.getAllPagesUseCase.invoke();
    if (!NoStatus.length) return;
    const { id, properties } =
      NoStatus[Math.floor(Math.random() * NoStatus.length)];
    // TODO: properties[Config.Notion.Prop.STATUS] = NEXT;
    const result = await this.updatePropertiesUseCase.invoke(id, properties);
  }
}
