import { IBasketRepository } from "../repositories/IBasketRepository"

class ListBasketUseCase {
  private repo: IBasketRepository;

  constructor(repo: IBasketRepository) {
    this.repo = repo;
  }

  public async handle() {
    const baskets = await this.repo.list();
    return baskets;
  }
}

export { ListBasketUseCase }
