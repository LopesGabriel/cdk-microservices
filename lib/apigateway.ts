import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface ISwnApiGatewayProps {
  productMicroservice: IFunction
  basketMicroservice: IFunction
  orderMicroservice: IFunction
}

export class SwnApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: ISwnApiGatewayProps) {
    super(scope, id)
    const { productMicroservice, basketMicroservice, orderMicroservice } = props

    this.createProductApi(productMicroservice)
    this.createBasketApi(basketMicroservice)
    this.createOrderApi(orderMicroservice)
  }

  private createProductApi(productMicroservice: IFunction) {
    const apiGateway = new LambdaRestApi(this, 'productApi', {
      restApiName: 'Product Service',
      handler: productMicroservice,
      proxy: false,
    })

    const products = apiGateway.root.addResource('product');
    products.addMethod('GET')
    products.addMethod('POST')

    const product = products.addResource('{id}')
    product.addMethod('GET')
    product.addMethod('PUT')
    product.addMethod('DELETE')
  }

  private createBasketApi(basketMicroservice: IFunction) {
    const apiGateway = new LambdaRestApi(this, 'basketApi', {
      restApiName: 'Basket Service',
      handler: basketMicroservice,
      proxy: false,
    })

    const baskets = apiGateway.root.addResource('basket');
    baskets.addMethod('GET');
    baskets.addMethod('POST');

    const singleBasket = baskets.addResource('{userName}')
    singleBasket.addMethod('GET');
    singleBasket.addMethod('DELETE');

    const basketCheckout = singleBasket.addResource('checkout');
    basketCheckout.addMethod('POST');
  }

  private createOrderApi(orderMicroservice: IFunction) {
    const apiGateway = new LambdaRestApi(this, 'orderApi', {
      restApiName: 'Ordering Service',
      handler: orderMicroservice,
      proxy: false,
    })

    const order = apiGateway.root.addResource('order');
    order.addMethod('GET');

    const singleOrder = order.addResource('{userName}')
    singleOrder.addMethod('GET');
  }
}