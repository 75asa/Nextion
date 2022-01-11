import {
  GetAllPagesAndGroupByUseCase,
  UpdatePropertiesUseCase,
} from "../useCases";

export class NextChooser {
  constructor(
    private getAllPagesUseCase: GetAllPagesAndGroupByUseCase,
    private updatePropertiesUseCase: UpdatePropertiesUseCase
  ) {}
  async run() {
    const { Next, NoStatus, Done, NoTarget } =
      await this.getAllPagesUseCase.invoke();
    if (!NoStatus.length) return;
    const { id, properties } =
      NoStatus[Math.floor(Math.random() * NoStatus.length)];
    // TODO: properties[Config.Notion.Prop.STATUS] = NEXT;
    const result = await this.updatePropertiesUseCase.invoke(id, properties);
  }
}
