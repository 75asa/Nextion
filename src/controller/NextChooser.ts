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
    const { NoStatus, Next } = await this.getAllPagesAndGroupByUseCase.invoke();
    if (!NoStatus.length) return;
    const chosenNext = NoStatus[Math.floor(Math.random() * NoStatus.length)];
    {
      const { id, status, properties } = chosenNext;
      chosenNext.updateProperties(Next[0].status);
      console.dir({ NoStatus, id, properties, status }, { depth: null });
      console.log("------------------------------------");
    }
    const { id, properties } = chosenNext;
    return await this.updatePropertiesUseCase.invoke(id, properties);
  }
}
