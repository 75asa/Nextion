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
    const { Next, NoStatus, Done, NoTarget } =
      await this.getAllPagesAndGroupByUseCase.invoke();
    if (!NoStatus.length) return;
    const { id, properties } =
      NoStatus[Math.floor(Math.random() * NoStatus.length)];
    // TODO: properties[Config.Notion.Prop.STATUS] = NEXT;
    return await this.updatePropertiesUseCase.invoke(id, properties);
  }
}
