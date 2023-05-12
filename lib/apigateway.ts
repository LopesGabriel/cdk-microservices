import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface ISwnApiGatewayProps {
  productMicroservice: IFunction
}

export class SwnApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: ISwnApiGatewayProps) {
    super(scope, id)
    const { productMicroservice } = props

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
}