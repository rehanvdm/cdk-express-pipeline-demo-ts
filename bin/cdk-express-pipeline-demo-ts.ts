#!/usr/bin/env node
import 'source-map-support/register';

import { StackSucceedUpdate } from '../lib/stack-succeed-update';
import {App} from "aws-cdk-lib";
import {CdkExpressPipeline} from "cdk-express-pipeline";
import {StackFailEverytime} from "../lib/stack-fail-everytime";

const app = new App();
async function main() {
  const stackEnv = {
    account: "581184285249",
    region: "eu-west-1"
  };
  const expressPipeline = new CdkExpressPipeline();

// === Wave 1 ===
  const wave1 = expressPipeline.addWave('Wave1');
// --- Wave 1, Stage 1---
  const wave1Stage1 = wave1.addStage('Stage1');

  const stackA0 = new StackSucceedUpdate(app, 'StackA0', wave1Stage1, {env: stackEnv});
  const stackA1 = new StackSucceedUpdate(app, 'StackA1', wave1Stage1, {env: stackEnv});
  // const stackA2 = new StackSucceedUpdate(app, 'StackA2', wave1Stage1, {env: stackEnv}); // Will ignore coz not in stack anymore..
  const stackA3 = new StackFailEverytime(app, 'StackA3', wave1Stage1, {env: stackEnv}); // Will fail rollback coz new
  const stackB = new StackSucceedUpdate(app, 'StackB', wave1Stage1, {env: stackEnv});
  stackB.addExpressDependency(stackA1);


// === Wave 2 ===
  const wave2 = expressPipeline.addWave('Wave2');
// --- Wave 2, Stage 1---
  const wave2Stage1 = wave2.addStage('Stage1');
  const stackC = new StackSucceedUpdate(app, 'StackC', wave2Stage1, {
    analyticsReporting: false,
    env: stackEnv
  }); //Succeed, then Express Rollback
  const stackD = new StackFailEverytime(app, 'StackD', wave2Stage1, {
    analyticsReporting: false,
    env: stackEnv
  }); //Error, CFN Rollback
  stackD.addExpressDependency(stackC);
  const stackE = new StackSucceedUpdate(app, 'StackE', wave2Stage1, {
    analyticsReporting: false,
    env: stackEnv
  }); //Succeed, then Express Rollback ?

  expressPipeline.synth([
    wave1,
    wave2,
  ]);

  app.synth();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});