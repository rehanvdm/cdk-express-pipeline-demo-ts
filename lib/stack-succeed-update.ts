import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {ExpressStack, ExpressStage} from "cdk-express-pipeline";
import {StackProps} from "aws-cdk-lib";

export class StackSucceedUpdate extends ExpressStack {
  constructor(scope: Construct, id: string, stage: ExpressStage, stackProps?: StackProps) {
    super(scope, id, stage, stackProps);

    // new cdk.aws_sns.Topic(this, 'MyTopicA');

    // Always hava an update
    new cdk.aws_sns.Topic(this, `TopicA${Date.now()}`);
  }
}