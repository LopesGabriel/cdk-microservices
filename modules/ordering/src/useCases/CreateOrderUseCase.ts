import { IEventDetail } from "../models/IEventDetail";
import { IOrderingRepository } from "../repositories/IOrderingRepository";

export class CreateOrderUseCase {
  repo: IOrderingRepository;

  constructor(repo: IOrderingRepository) {
    this.repo = repo;
  }

  async handle(basket: IEventDetail) {
    return await this.repo.create({
      ...basket,
      orderDate: new Date().toISOString()
    })
  }
}