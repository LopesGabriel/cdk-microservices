import { IOrderingRepository } from "../repositories/IOrderingRepository";

export class GetAllOrdersUseCase {
  private readonly repo: IOrderingRepository;

  constructor(repo: IOrderingRepository) {
    this.repo = repo;
  }

  public handle() {
    return this.repo.getAllOrders();
  }
}