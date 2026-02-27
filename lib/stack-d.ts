import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {ExpressStack, ExpressStage} from "cdk-express-pipeline";
import {StackProps} from "aws-cdk-lib";
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class StackD extends ExpressStack {
  constructor(scope: Construct, id: string, stage: ExpressStage, stackProps?: StackProps) {
    super(scope, id, stage, stackProps);

    // new lambda.Function(this, 'LambdaCodeAndVersion', {
    //   runtime: lambda.Runtime.NODEJS_20_X,
    //   handler: 'index.handler',
    //   code: lambda.Code.fromInline('original code'),
    //   environment: { VERSION: '1.0.0' }
    // });
    // new lambda.Function(this, 'LambdaVersion', {
    //   runtime: lambda.Runtime.NODEJS_20_X,
    //   handler: 'index.handler',
    //   code: lambda.Code.fromInline('original code'),
    //   environment: { VERSION: '1.0.0' }
    // });
    // new lambda.Function(this, 'LambdaWithOtherChanges', {
    //   runtime: lambda.Runtime.NODEJS_20_X,
    //   handler: 'index.handler',
    //   code: lambda.Code.fromInline('original code'),
    //   memorySize: 256
    // });

    new lambda.Function(this, 'LambdaCodeAndVersion', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('changed code'),
      environment: { VERSION: '2.0.0' }
    });
    new lambda.Function(this, 'LambdaVersion', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('original code'),
      environment: { VERSION: '2.0.0' }
    });
    new lambda.Function(this, 'LambdaWithOtherChanges', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('changed code'),
      memorySize: 512
    });
  }
}