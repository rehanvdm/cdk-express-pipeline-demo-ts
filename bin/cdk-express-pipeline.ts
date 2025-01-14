// #!/usr/bin/env node
// import * as path from 'path'
// import * as os from 'os'
// import {fileURLToPath} from 'url';
// import { Command, InvalidArgumentError } from 'commander';
// // import pLimit from 'p-limit';
//
// //eslint-disable-next-line @typescript-eslint/no-require-imports
import execa = require('execa');

async function main() {
  await execa.command('echo $PATH', {
    env: {
      ...process.env,
      FORCE_COLOR: 'true',
    },
    stdout: 'inherit',
    stderr: 'inherit',
    preferLocal: true,
    localDir: process.cwd(),
    reject: true,
    shell: true,
    all: true,
  });

  await execa.command('cdk --help', {
    env: {
      ...process.env,
      FORCE_COLOR: 'true',
    },
    stdout: 'inherit',
    stderr: 'inherit',
    preferLocal: true,
    localDir: process.cwd(),
    reject: true,
    shell: true,
    all: true,
  });
}
main()

// import * as fs from "fs";
// import {
//   CloudFormationClient, DescribeStackEventsCommand, DescribeStackEventsOutput,
//   DescribeStacksCommand,
//   GetTemplateCommand,
//   UpdateStackCommand, UpdateStackCommandOutput
// } from "@aws-sdk/client-cloudformation";
// import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
// import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
// import {fromIni} from "@aws-sdk/credential-provider-ini";
// import * as yaml from 'yaml';
// import * as yaml_types from 'yaml/types'; //Needs 1.10.2 same as CDK code
// import * as crypto from 'crypto';
// import {start} from "node:repl";
// import * as chalk from "chalk";
//
//
// const sleep = (ms: number) => new Promise((resolve,) => setTimeout(() => resolve(true), ms));
//
// /***
//   * This function will take the JSON and return the YAML string. Same as CDK's toYAML function (aws-cdk/lib/serialize)
//   * @param json
//   * @returns {string}
//   */
// function toYAML(json: string): string {
//   const oldFold = yaml_types.strOptions.fold.lineWidth;
//   try {
//     yaml_types.strOptions.fold.lineWidth = 0;
//     return yaml.stringify(json, {schema: 'yaml-1.1'});
//   } finally {
//     yaml_types.strOptions.fold.lineWidth = oldFold;
//   }
// }
//
// /**
//  * This function will take the data and return the hash of it. Same as CDK's contentHash function (aws-cdk/lib/util/content-hash)
//  * @param data
//  */
// export function contentHash(data: string | Buffer | DataView) {
//   return crypto.createHash('sha256').update(data).digest('hex');
// }
//
// function padRight(n: number, x: string): string {
//   return x + ' '.repeat(Math.max(0, n - x.length));
// }
// function padLeft(n: number, x: string): string {
//   return ' '.repeat(Math.max(0, n - x.length)) + x;
// }
//
// function colorFromStatusResult(status?: string) {
//   if (!status) {
//     return chalk.reset;
//   }
//
//   if (status.indexOf('FAILED') !== -1) {
//     return chalk.red;
//   }
//   if (status.indexOf('ROLLBACK') !== -1) {
//     return chalk.yellow;
//   }
//   if (status.indexOf('COMPLETE') !== -1) {
//     return chalk.green;
//   }
//
//   return chalk.reset;
// }
//
// const WIDTH_TIMESTAMP = 12;
// const WIDTH_STATUS = 20;
// const WIDTH_RESOURCE_TYPE= 25;
//
// // ===========
//
// function stripAnsiCodes(str: string): string {
//   return str.replace(/\x1B\[\d{1,2}m/g, '');
// }
//
// function extractOriginalArg(extractArg: string, arg: string): string | undefined {
//   if(!arg.includes(extractArg)) {
//     return undefined;
//   }
//   return arg.split(extractArg)[1].split(/=|\s/)[1].trim();
// }
//
// async function assumeRoleAndGetCredentials(region: string, profile: string | undefined, roleArn: string): Promise<{accessKeyId: string, secretAccessKey: string, sessionToken: string}> {
//   const stsClient = new STSClient({
//     region,
//     credentials: profile ? fromIni({ profile: profile }) : undefined
//   });
//   // use profile systanics-role-exported
//   const stsRole = await stsClient.send(new AssumeRoleCommand({
//     RoleArn: roleArn,
//     RoleSessionName: "cdk-express-pipeline--save-templates",
//     DurationSeconds: 3600
//   }));
//
//   if(!stsRole.Credentials || !stsRole.Credentials.AccessKeyId || !stsRole.Credentials.SecretAccessKey || !stsRole.Credentials.SessionToken) {
//     throw new Error(`Can not assume role ${roleArn}`);
//   }
//
//   return {
//     accessKeyId: stsRole.Credentials.AccessKeyId,
//     secretAccessKey: stsRole.Credentials.SecretAccessKey,
//     sessionToken: stsRole.Credentials.SessionToken,
//   };
// }
//
// type ManifestArtifactDeployed = ManifestArtifact & {
//   /**
//    * If the stack was deployed or not, will not include the stack that rolled back if any
//    */
//   deployed: boolean;
//
//   /**
//    * The CDK stack ID
//    */
//   stackId: string;
// };
//
// type ManifestArtifact = {
//   type: string;
//   properties: {
//     requiresBootstrapStackVersion: number;
//     bootstrapStackVersionSsmParameter: string;
//     templateFile: string;
//     terminationProtection: boolean;
//     validateOnSynth: boolean;
//     assumeRoleArn: string;
//     cloudFormationExecutionRoleArn: string;
//     stackTemplateAssetObjectUrl: string;
//     additionalDependencies: string[];
//     lookupRole: {
//       arn: string;
//       requiresBootstrapStackVersion: number;
//       bootstrapStackVersionSsmParameter: string;
//     };
//     stackName: string;
//   };
//   environment: string;
//   dependencies?: string[];
//   metadata: {
//     [key: string]: Array<{
//       type: string;
//       data: string;
//     }>;
//   };
//   displayName: string;
// };
//
// type ManifestArtifacts = {
//   [key: string]: ManifestArtifact;
// };
//
// type Manifest = {
//   version: string;
//   artifacts: ManifestArtifacts;
// };
//
// function getManifestStackArtifactProperties(manifestStackArtifact: ManifestArtifact) {
//   const ret = {
//     stackName: manifestStackArtifact.properties.stackName,
//     region: manifestStackArtifact.environment.split('/')[3],
//     assumeRole: manifestStackArtifact.properties.assumeRoleArn.replace("${AWS::Partition}", "aws"),
//   };
//   console.log('StackArtifactProperties:', ret);
//   return ret;
// }
//
// function getManifestStackArtifacts(assemblyPath: string, pattern?: string) {
//   const manifest = JSON.parse(fs.readFileSync(path.join(assemblyPath, 'manifest.json'), 'utf-8')) as Manifest;
//   const stacks = Object.entries(manifest.artifacts).filter(([id, artifact]) => (artifact as any).type == "aws:cloudformation:stack");
//
//   let patternToFilter: string | undefined;
//   if(pattern?.endsWith('*')) {
//     patternToFilter = pattern.slice(0, -1);
//   }
//   else if(pattern?.length == 4 && pattern?.includes('**')) {
//     patternToFilter = undefined;
//   }
//
//   return stacks.filter(([stackId, artifact]) => {
//     if(patternToFilter) {
//       return stackId.startsWith(patternToFilter);
//     }
//     return true;
//   });
// }
//
//
// type RollbackStack = {
//   stackId: string;
//   hasRollbackTemplate: boolean;
//   rollbackTemplatePath: string;
//   rollbackTemplateSize: number;
// }
// async function saveCurrentCfnTemplates(pattern: string, originalArgs: string, assemblyPath: string) {
//   const profile = extractOriginalArg('--profile', originalArgs);
//   console.log('Profile:', profile);
//
//   const stackArtifacts = getManifestStackArtifacts(assemblyPath, pattern);
//
//   const rollbackTemplateDir = `./.cdk-express-pipeline/rollback`;
//   if (!fs.existsSync(rollbackTemplateDir)) {
//     fs.rmSync(rollbackTemplateDir, {recursive: true, force: true});
//   }
//   fs.mkdirSync(rollbackTemplateDir, {recursive: true});
//
//   let rollbackStacks: RollbackStack[] = [];
//   for (const [stackId, stackArtifact] of stackArtifacts) {
//     const {stackName, region, assumeRole} = getManifestStackArtifactProperties(stackArtifact);
//     const credentials = await assumeRoleAndGetCredentials(region, profile, assumeRole);
//     const client = new CloudFormationClient({
//       region: region, //TODO: needed? might be different than the stsclient?
//       credentials
//     });
//
//     let hasRollbackTemplate = false;
//     let rollbackTemplateSize = 0;
//     try {
//       const templateDetails = await client.send(new GetTemplateCommand({StackName: stackName}));
//       fs.writeFileSync(`${rollbackTemplateDir}/${stackId}.template.json`, templateDetails.TemplateBody!);
//       hasRollbackTemplate = true;
//       rollbackTemplateSize = toYAML(templateDetails.TemplateBody!).length;
//     }
//     catch (err) {
//       if((err as any).name == 'ValidationError' && (err as any).message.includes('does not exist')) {
//         hasRollbackTemplate = false;
//       } else {
//         throw err;
//       }
//     }
//     rollbackStacks.push({
//       stackId,
//       hasRollbackTemplate,
//       rollbackTemplatePath: `${rollbackTemplateDir}/${stackId}.template.json`,
//       rollbackTemplateSize: rollbackTemplateSize,
//     });
//   }
//   return rollbackStacks;
// }
//
// async function synth(pattern: string, originalArgs: string) {
//
//   let assemblyArg = "";
//   let assemblyPath = extractOriginalArg('--app', originalArgs);
//
//   if (!assemblyPath) {
//     assemblyPath = '.cdk-express-pipeline/assembly';
//     assemblyArg = ` --app ${assemblyPath} `;
//     console.log('Creating assembly...');
//
//     // Remove the assembly directory if exists
//     if(fs.existsSync(assemblyPath)) {
//       fs.rmSync(assemblyPath, {recursive: true, force: true});
//     }
//
//     const synthArg = `cdk synth ${pattern} ${originalArgs} --output ${assemblyPath}`;
//     console.log('Running synth:', synthArg);
//     await execa(synthArg, {
//       env: {
//         ...process.env,
//         FORCE_COLOR: 'true',
//       },
//       stdout: 'inherit',
//       stderr: 'inherit',
//       preferLocal: true,
//       reject: true, //TODO: Later cacth handle better
//       shell: true,
//       all: true,
//     });
//   } else {
//     if(!fs.existsSync(assemblyPath)) {
//       throw new Error(`Assembly at path ${assemblyPath} does not exist`);
//     }
//
//     console.log('Assembly exists');
//   }
//   return {assemblyArg, assemblyPath};
// }
//
// async function deploy(pattern: string, originalArgs: string, assemblyArg: string, assemblyPath: string) {
//   const argument = `cdk deploy ${pattern} ${originalArgs} ${assemblyArg}`;
//   console.log('Argument:', argument);
//
//   const subprocess = execa(argument, {
//     env: {...process.env, FORCE_COLOR: 'true'},
//     preferLocal: true,
//     reject: false,
//     shell: true,
//     all: true,
//   });
//   subprocess.all?.on('data', (data) => {
//     process.stdout.write(data);
//   });
//
//   const result = await subprocess;
//
//   const completedStackIds = stripAnsiCodes(result.all!)
//     .split('\n')
//     .filter((line) => line.includes(' ✅  ') && !line.includes('(no changes)'))
//     .map((line) => line.split(' ✅  ')[1].split(' (')[0]);
//
//   const stackArtifacts = getManifestStackArtifacts(assemblyPath, pattern);
//   let completedStacks: ManifestArtifactDeployed[] = [];
//   for (const [stackId, stackArtifact] of stackArtifacts) {
//     const deployed = completedStackIds.includes(stackId);
//     completedStacks.push({
//       ...stackArtifact,
//       deployed,
//       stackId,
//     });
//   }
//   return completedStacks;
// }
//
// export function formatUtcTime(date?: Date, includeUtcIdentifier: boolean = true)
// {
//   if(!date)
//     return undefined;
//
//   return date.toISOString().replace("T", " ").slice(11,19) + (includeUtcIdentifier ? " UTC" : "");
// }
//
// async function printStackEvents(printFrom: Date, cfnClient: CloudFormationClient, stackName: string, currentEventId?: string) {
//
//   let lastEventId: string | undefined = currentEventId
//   let nextToken: string | undefined = undefined;
//   do {
//     const eventsResp: DescribeStackEventsOutput = await cfnClient.send(new DescribeStackEventsCommand({
//       StackName: stackName,
//       NextToken: nextToken,
//     }));
//
//
//     if (eventsResp.StackEvents && eventsResp.StackEvents.length > 0) {
//       for (const event of eventsResp.StackEvents) {
//         if (event.EventId === lastEventId) {
//           break;
//         }
//
//         if(event.Timestamp && event.Timestamp < printFrom) {
//           continue;
//         }
//
//         const colorStatus = colorFromStatusResult(event.ResourceStatus);
//         const colorStatusReason = chalk.cyan;
//
//         // const timestamp = padRight(WIDTH_TIMESTAMP, formatUtcTime(event.Timestamp, true) || '');
//         const timestamp = event.Timestamp?.toISOString()|| '';
//         const status = colorStatus(padRight(WIDTH_STATUS, event.ResourceStatus || '').slice(0, WIDTH_STATUS));
//         const type = event.ResourceType;
//         const resourceId = colorStatus(event.LogicalResourceId);
//         const resourceStatusReason = colorStatusReason(event.ResourceStatusReason ? "| " + event.ResourceStatusReason : '');
//         console.log(`${stackName} | ${timestamp} | ${status} | ${type} | ${resourceId} ${resourceStatusReason}`);
//       }
//
//       lastEventId = eventsResp.StackEvents[0].EventId;
//     }
//     nextToken = eventsResp.NextToken;
//     console.log(">>> Describe Event", eventsResp.StackEvents?.length, lastEventId)
//   } while (nextToken);
//
//   return lastEventId;
// }
//
// async function rollBack(deployedStackArtifacts: ManifestArtifactDeployed[], rollbackStackTemplates: RollbackStack[], originalArgs: string) {
//   const deployedStackArtifactsReversed = deployedStackArtifacts.reverse(); //TODO: Check that in correct reversed order...
//   // console.log("deployedStackArtifactsReversed", deployedStackArtifactsReversed)
//
//   const MAX_TEMPLATE_DIRECT_UPLOAD_BYTE_SIZE = 50_000; //TODO: Lower and see if S3 upload works
//
//   const stacksRolledBackStatus: { stackId: string, status: string }[] = [];
//   for (const stackArtifact of deployedStackArtifactsReversed) {
//     if (!stackArtifact.deployed) {
//       console.log(`Stack: ${stackArtifact.stackId} - Not deployed/rolled back all ready, skipping rollback..`);
//       stacksRolledBackStatus.push({stackId: stackArtifact.stackId, status: 'ROLLBACK_NOT_NEEDED'});
//       continue;
//     }
//
//     console.log(`Stack: ${stackArtifact.stackId} - Deployed: ${stackArtifact.deployed}`);
//
//     const rollbackStack = rollbackStackTemplates.find((rollbackStack) => rollbackStack.stackId == stackArtifact.stackId);
//     if (!rollbackStack) {
//       console.log(`No rollback template found for ${stackArtifact.stackId}, skipping rollback..`);
//       stacksRolledBackStatus.push({stackId: stackArtifact.stackId, status: 'ROLLBACK_TEMPLATE_NOT_FOUND_NEW_STACK'});
//       continue;
//     }
//
//     let templateArg: { templateBody?: string, templateUrl?: string } = {
//       templateBody: undefined,
//       templateUrl: undefined,
//     };
//
//     const profile = extractOriginalArg('--profile', originalArgs);
//     const {stackName, region, assumeRole} = getManifestStackArtifactProperties(stackArtifact);
//     const credentials = await assumeRoleAndGetCredentials(region, profile, assumeRole);
//     const cfnClient = new CloudFormationClient({
//       region: region, //TODO: needed? might be different than the stsclient?
//       credentials
//     });
//
//     if (rollbackStack.rollbackTemplateSize <= MAX_TEMPLATE_DIRECT_UPLOAD_BYTE_SIZE) {
//       templateArg.templateBody = fs.readFileSync(rollbackStack.rollbackTemplatePath, 'utf-8');
//     } else {
//       /* Get CDK Toolkit Stack Bucket and BootstrapVersion outputs */
//       console.log('Getting CDK Assets Bucket name..')
//       const cdkToolkitStackName = 'CDKToolkit';
//       const cdkToolkitStack = await cfnClient.send(new DescribeStacksCommand({StackName: cdkToolkitStackName}));
//       const cdkAssetsBucket = cdkToolkitStack.Stacks?.[0].Outputs?.find((output) => output.OutputKey == 'BucketName')?.OutputValue;
//       // const cdkBootstrapVersion = cdkToolkitStack.Stacks?.[0].Outputs?.find((output) => output.OutputKey == 'BootstrapVersion')?.OutputValue;
//
//       /* Upload to S3 */
//       const client = new S3Client({
//         region: region, //TODO: needed? might be different than the stsclient?
//         credentials
//       });
//
//       console.log('Uploading template to S3..');
//       const templateBody = fs.readFileSync(rollbackStack.rollbackTemplatePath, 'utf-8');
//       const templateHash = contentHash(templateBody);
//       const key = `cdk-express-pipeline-rollback-stacks/${stackArtifact.stackId}/${templateHash}.yml`;
//       const uploadResult = await client.send(new PutObjectCommand({
//         Bucket: cdkAssetsBucket,
//         Key: key,
//         Body: templateBody,
//       }));
//       const url = `https://${cdkAssetsBucket}.s3.${region}.amazonaws.com/${key}`;
//       console.log('Uploaded to S3:', url);
//       templateArg.templateUrl = url;
//     }
//
//     let rollbackResult: UpdateStackCommandOutput | undefined;
//     try {
//       console.log(`Rolling back stack: ${stackArtifact.stackId} (${stackName})`);
//       rollbackResult = await cfnClient.send(new UpdateStackCommand({
//         StackName: stackName,
//         TemplateBody: templateArg.templateBody,
//         TemplateURL: templateArg.templateUrl,
//         Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM', 'CAPABILITY_AUTO_EXPAND']
//       }));
//     } catch (err) {
//       const errTyped = err as any;
//       const noUpdateError = errTyped.name == 'ValidationError' && errTyped.message == "No updates are to be performed.";
//       if (!noUpdateError)
//         throw err;
//     }
//
//     if (!rollbackResult) {
//       console.log('No rollback needed for stack:', stackArtifact.stackId);
//       stacksRolledBackStatus.push({stackId: stackArtifact.stackId, status: 'NO_UPDATES_NEEDED'});
//       continue;
//     }
//
//     // console.log('Rollback result:', rollbackResult);
//
//     /* Wait for the stack to be updated, show the events */
//     let currentEventId: string | undefined = undefined;
//     let stackInProgress = true;
//     const startDate = new Date();
//     do {
//
//       currentEventId = await printStackEvents(startDate, cfnClient, stackName, currentEventId);
//
//       /* Check and continue polling only if the stack is still in progress */
//       await sleep(3000);
//       const stackResp = await cfnClient.send(new DescribeStacksCommand({StackName: stackName}));
//       const stackStatus = stackResp.Stacks?.[0].StackStatus;
//       stackInProgress = stackStatus?.endsWith("_IN_PROGRESS") ?? false;
//
//     } while (stackInProgress);
//
//     stacksRolledBackStatus.push({stackId: stackArtifact.stackId, status: 'ROLLED_BACK'});
//   }
//
//   console.log('Stacks rolled back status:', JSON.stringify(stacksRolledBackStatus, null, 2));
// }
//
// async function main()
// {
//   const program = new Command();
//   program
//     .command('deploy <pattern> [extraArgs...]')
//     .description('Deploy command with pattern and extra arguments')
//     .action(async (pattern: string, extraArgs: string[]) => {
//       let originalArgs = extraArgs.join(' ');
//       if(originalArgs.includes('--all')) {
//         pattern = '"**"';
//       }
//       //TODO Extract originalArgs into props
//
//       const approval = extractOriginalArg('--require-approval', originalArgs);
//       if(!approval || approval != 'never') {
//         throw new Error("CDK Express Pipeline `deploy` requires --require-approval never");
//       }
//
//       console.log('Pattern:', pattern);
//       console.log('Extra Args:', originalArgs);
//
//       // TODO: Write test for this
//       // const profile = extractOriginalArg('--profile', originalArgs);
//       // const {stackName, region, assumeRole} = {
//       //   stackName: 'StackC',
//       //   // stackName: 'StackE', Test what errors look like
//       //   region: 'eu-west-1',
//       //   assumeRole: 'arn:aws:iam::581184285249:role/cdk-hnb659fds-deploy-role-581184285249-eu-west-1'
//       // }
//       // const credentials = await assumeRoleAndGetCredentials(region, profile, assumeRole);
//       // const cfnClient = new CloudFormationClient({
//       //   region: region, //TODO: needed? might be different than the stsclient?
//       //   credentials
//       // });
//       // /* Wait for the stack to be updated, show the events */
//       // let currentEventId: string | undefined = undefined;
//       // let stackInProgress = true;
//       // // const startDate = new Date();
//       // // const startDate = new Date(Date.parse('2024-08-13T07:45:45Z')); // Just before the stack creation // StackC
//       // const startDate = new Date(Date.parse('2024-01-00T00:00:00Z')); // Just before the stack creation // //Test paging events
//       //
//       // do
//       // {
//       //   currentEventId = await printStackEvents(startDate, cfnClient, stackName, currentEventId);
//       //
//       //   /* Check and continue polling only if the stack is still in progress */
//       //   await sleep(3000);
//       //   const stackResp = await cfnClient.send(new DescribeStacksCommand({StackName: stackName}));
//       //   const stackStatus = stackResp.Stacks?.[0].StackStatus;
//       //   stackInProgress = stackStatus?.endsWith("_IN_PROGRESS") ?? false;
//       //
//       // } while (stackInProgress);
//
//       let { assemblyArg, assemblyPath} = await synth(pattern, originalArgs);
//       const rollbackStackTemplates = await saveCurrentCfnTemplates(pattern, originalArgs, assemblyPath);
//       const deployedStackArtifacts = await deploy(pattern, originalArgs, assemblyArg, assemblyPath);
//       await rollBack(deployedStackArtifacts, rollbackStackTemplates, originalArgs);
//     });
//
//   program.parse(process.argv);
//
//   // const program = new Command();
//   // program.name('cdk-pipeline-helper')
//   //   .description('Helper to see the CDK diffs and do the CDK deploys of pipeline stacks')
//   //   .version('0.8.0');
//   //
//   // program.command('deploy')
//   //   .description('Run the CDK diff command for all environment pipelines')
//   //   // .option('--dry-run', 'set to true to only print the stacks that will be used for the diff')
//   //   // .option('--profile <string>', 'aws profile to use, default none', '')
//   //   // .option('--environment <string>', 'either sandbox or main', (value) =>
//   //   // {
//   //   //   const allowedEnvs = ["main", "sandbox"]
//   //   //   if(!allowedEnvs.includes(value)) {
//   //   //     throw new InvalidArgumentError("Allowed values " + allowedEnvs.join(', '));
//   //   //   }
//   //   //   return value;
//   //   // })
//   //   .action((args) =>
//   //   {
//   //     console.log(args);
//   //     // setAwsSdkSettings(args.profile);
//   //     // cdkDeployPipelinesForEnvironment(args.environment, [], !!args.dryRun)
//   //
//   //   });
//   //
//   // program.parse(process.argv);
//   //
//   // // /* Specify the name of the pipelines that you want to skip, if any */
//   // // const skipStackNames = [];
//   // //
//   // // /* Can only be sandbox or main */
//   // // const environment = "sandbox";
//   // //
//   // // /* If true then, it will not do the call to actually start the pipelines, it will only print the names of the ones it will start */
//   // // const dryRun = true;
//   // //
//   // // await startAllPipelinesForEnvironment(environment, skipStackNames, dryRun);
// }
// main().catch(err => console.error(err));
