#!/usr/bin/env node
import 'source-map-support/register';

import { StackA } from '../lib/stack-a';
import { StackB } from '../lib/stack-b';
import { StackC } from '../lib/stack-c';
import {App} from "aws-cdk-lib";
import {CdkExpressPipeline} from "cdk-express-pipeline";

const app = new App();
const stackEnv = {
  account: "581184285249",
  region: "eu-west-1"
};
const expressPipeline = new CdkExpressPipeline();

// === Wave 1 ===
const wave1 = expressPipeline.addWave('Wave1');
// --- Wave 1, Stage 1---
const wave1Stage1 = wave1.addStage('Stage1');

const stackA = new StackA(app, 'StackA', wave1Stage1, {env: stackEnv});
const stackB = new StackB(app, 'StackB', wave1Stage1, {env: stackEnv});
stackB.addExpressDependency(stackA);

const wave1Stage2 = wave1.addStage('Stage2');
new StackA(app, 'Stack2A', wave1Stage2, {env: stackEnv});
new StackB(app, 'Stack2B', wave1Stage2, {env: stackEnv});

const wave1Stage3 = wave1.addStage('Stage3');
new StackA(app, 'Stack3A', wave1Stage3, {env: stackEnv});
new StackB(app, 'Stack3B', wave1Stage3, {env: stackEnv});

// === Wave 2 ===
const wave2 = expressPipeline.addWave('Wave2');
// --- Wave 2, Stage 1---
const wave2Stage1 = wave2.addStage('Stage1');
new StackC(app, 'StackC', wave2Stage1, {env: stackEnv});

expressPipeline.synth([
  wave1,
  wave2,
]);
app.synth();

expressPipeline.generateGitHubWorkflows({
  buildConfig: {
    type: 'preset-npm',
  },
  diff: [{
    on: {
      pullRequest: {
        branches: ['main'],
      },
    },
    stackSelector: 'stage',
    assumeRoleArn: 'arn:aws:iam::581184285249:role/githuboidc-git-hub-deploy-role',
    assumeRegion: 'us-east-1',
    commands: {
      dev: {
        synth: "npm run cdk -- synth '**'",
        diff: 'npm run cdk -- diff {stackSelector}'
      }
    }
  }],
  deploy: [{
    on: {
      push: {
        branches: ['main'],
      },
    },
    stackSelector: 'stack',
    assumeRoleArn: 'arn:aws:iam::581184285249:role/githuboidc-git-hub-deploy-role',
    assumeRegion: 'us-east-1',
    commands: {
      dev: {
        synth: "npm run cdk -- synth '**'",
        deploy: 'npm run cdk -- deploy {stackSelector} --concurrency 10 --require-approval never --exclusively'
      }
    }
  }]
});