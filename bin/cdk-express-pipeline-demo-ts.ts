#!/usr/bin/env node
import 'source-map-support/register';

import { StackA } from '../lib/stack-a';
import { StackB } from '../lib/stack-b';
import { StackC } from '../lib/stack-c';
import {App} from "aws-cdk-lib";
import {CdkExpressPipeline} from "cdk-express-pipeline";

const app = new App();
const expressPipeline = new CdkExpressPipeline();

// === Wave 1 ===
const wave1 = expressPipeline.addWave('Wave1');
// --- Wave 1, Stage 1---
const wave1Stage1 = wave1.addStage('Stage1');

const stackA = new StackA(app, 'StackA', wave1Stage1);
const stackB = new StackB(app, 'StackB', wave1Stage1);
stackB.addExpressDependency(stackA);

// === Wave 2 ===
const wave2 = expressPipeline.addWave('Wave2');
// --- Wave 2, Stage 1---
const wave2Stage1 = wave2.addStage('Stage1');
new StackC(app, 'StackC', wave2Stage1);

expressPipeline.synth([
  wave1,
  wave2,
]);