import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {ExpressStack, ExpressStage} from "cdk-express-pipeline";
import {StackProps} from "aws-cdk-lib";
import * as iam from 'aws-cdk-lib/aws-iam';


export class StackD extends ExpressStack {
  constructor(scope: Construct, id: string, stage: ExpressStage, stackProps?: StackProps) {
    super(scope, id, stage, stackProps);

    // Force error
    new iam.Role(this, 'MyRole', {
      assumedBy: new iam.ServicePrincipal('nope.amazonaws.com'),
      managedPolicies:[
        iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccessNope')
      ]
    });

    // ... more resources
  }
}