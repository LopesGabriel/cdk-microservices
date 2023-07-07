export interface IEventDetail {
  userName: string,
  totalPrice: number,
  firstName: string,
  lastName: string,
  email: string,
  address: string,
  cardInfo: string,
  paymentMethod: number,
  items: {
    quantity: number,
    color: string,
    productId: string,
    price: number,
    productName: string
  }[]
}