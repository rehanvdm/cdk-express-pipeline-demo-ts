#!/usr/bin/env node
import 'source-map-support/register';

import { StackA } from '../lib/stack-a';
import { StackB } from '../lib/stack-b';
import { StackC } from '../lib/stack-c';
import { StackE } from '../lib/stack-e';

import {App} from "aws-cdk-lib";
import {CdkExpressPipeline} from "cdk-express-pipeline";
import {CloudFormationClient, DescribeStacksCommand, GetTemplateCommand} from "@aws-sdk/client-cloudformation";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import {CloudAssembly} from "aws-cdk-lib/cx-api";
import {Environment} from "aws-cdk-lib/cx-api/lib/environment";
import * as fs from "node:fs";
import {StackD} from "../lib/stack-d";

const app = new App();

// console.log(JSON.stringify(process.argv));



// const synted = app.synth()

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

  const stackA = new StackA(app, 'StackA', wave1Stage1, {env: stackEnv});
  const stackB = new StackB(app, 'StackB', wave1Stage1, {env: stackEnv});
  stackB.addExpressDependency(stackA);

// === Wave 2 ===
  const wave2 = expressPipeline.addWave('Wave2');
// --- Wave 2, Stage 1---
  const wave2Stage1 = wave2.addStage('Stage1');
  const stackC = new StackC(app, 'StackC', wave2Stage1, {
    analyticsReporting: false,
    env: stackEnv
  });
  const stackD = new StackD(app, 'StackD', wave2Stage1, {
    analyticsReporting: false,
    env: stackEnv
  });
  stackD.addExpressDependency(stackC);

  const stackE = new StackE(app, 'StackE', wave2Stage1, {
    analyticsReporting: false,
    env: stackEnv
  });

  expressPipeline.synth([
    wave1,
    wave2,
  ]);

  app.synth(); //TODO: Comment that must remove from outer, pipeline will synth..
  // const assembly = app.synth();
  // await readyRollback(assembly);


}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

//
// //TODO: Move within `.synth` method, hmm can not, cox need the assembly.. Rather do the `app.synth()` in the pipeline.synth,
// // That way only have to do once...
//
// async function readyRollback(assembly: CloudAssembly)
// {
//   // This would have to be done for each stack in the pipeline
//   //Todo use stack creds, region and assume role from synt, also profile to use or not.. hmmm
//   const client = new CloudFormationClient({
//     region: "eu-west-1",
//     credentials: fromIni({ profile: 'rehan-demo-exported' }),
//   });
//
//   const stackTemplates: {
//     [stackName: string]: {
//       params: { [paramKey: string]: string },
//       env: Environment,
//       profile?: string,
//       assumeRoleArn?: string,
//     }
//   }= {};
//
//   //Function to create nested dir if it does not exist
//   const createDir = (dir: string) => {
//     if (!fs.existsSync(dir)){
//       fs.mkdirSync(dir, { recursive: true });
//     }
//   }
//
//   for (const stack of assembly.stacks) {
//     const stackName = stack.stackName
//     const stackDetails = await client.send(new DescribeStacksCommand({ StackName: stackName }));
//     if (!stackDetails.Stacks?.length)
//       throw new Error(`Stack ${stackName} not found`);
//
//     // stackTemplates
//
//       const templateDetails = await client.send(new GetTemplateCommand({ StackName: stackName }));
//
//       stackTemplates[stackName] = {
//         params: stackDetails.Stacks[0].Parameters?.reduce((acc, param) => {
//           acc[param.ParameterKey!] = param.ParameterValue!;
//           return acc;
//         }, {} as { [paramKey: string]: string }) || {},
//         env: stack.environment,
//         profile: 'rehan-demo-exported', //TODO how to know what was used originally when doing cdk command?
//         assumeRoleArn: stack.assumeRoleArn
//     }
//
//     const dir = `./.cdk-express-pipeline/rollback/${stack.environment.account}/${stack.environment.region}`
//     if (!fs.existsSync(dir)){
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     fs.writeFileSync(`${dir}/${stack.stackName}.template.json`, templateDetails.TemplateBody!);
//     fs.writeFileSync(`${dir}/${stack.stackName}.args.json`, JSON.stringify(stackTemplates[stackName], null, 2));
//   }
// }
//
//
// // The command to roll back: WORKS
// // aws cloudformation update-stack --stack-name StackC --profile rehan-demo-exported --region eu-west-1  --template-body file://.cdk-express-pipeline/rollback/581184285249/eu-west-1/StackC.template.json
// // Need to double check assets are rolled back as well...., also SSM params? If update in previous stack will use that new SSM param still, only works if idempotent templates