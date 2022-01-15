import { FetchAssigneeUserIconUseCase } from "../useCases";

export class IconFetcher {
  constructor(
    private fetchAssigneeUserIconUseCase: FetchAssigneeUserIconUseCase
  ) {}
  async run() {
    return await this.fetchAssigneeUserIconUseCase.invoke();
  }
}
