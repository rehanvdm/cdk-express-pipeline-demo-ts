import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {ExpressStack, ExpressStage} from "cdk-express-pipeline";
import {StackProps} from "aws-cdk-lib";

export class StackA extends ExpressStack {
  constructor(scope: Construct, id: string, stage: ExpressStage, stackProps?: StackProps) {
    super(scope, id, stage, stackProps);

    new cdk.aws_sns.Topic(this, 'MyTopicA',      {
        displayName: 'Topic AAA Updated'
      });

    new cdk.aws_sns.Topic(this, 'MyTopicA2',      {
      displayName: 'Topic AAA'
    });

    throw new Error('Simulate an error in StackA');
    // ... more resources
  }
}