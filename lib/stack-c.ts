import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {ExpressStack, ExpressStage} from "cdk-express-pipeline";
import {StackProps} from "aws-cdk-lib";

export class StackC extends ExpressStack {
  constructor(scope: Construct, id: string, stage: ExpressStage, stackProps?: StackProps) {
    super(scope, id, stage, stackProps);

    new cdk.aws_sns.Topic(this, 'MyTopicC');

    new cdk.aws_sns.Topic(this, 'MyTopicC2');

    new cdk.aws_sns.Topic(this, 'MyTopicC3');

    new cdk.aws_sns.Topic(this, 'MyTopicC5');

    new cdk.aws_sns.Topic(this, 'MyTopicC6');

    // ... more resources
  }
}