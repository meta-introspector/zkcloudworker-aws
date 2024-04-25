import {
  LambdaClient,
  InvokeCommand,
  InvokeCommandInput,
} from "@aws-sdk/client-lambda";

export async function callLambda(
  name: string,
  payload: any,
  attempt: number = 0
) {
  // TODO: Check user balance before calling lambda
  try {
    //console.log("Lambda call:", name);
    if (attempt > 0) console.log("Attempt:", attempt);
    const client = new LambdaClient();

    const params: InvokeCommandInput = {
      FunctionName: "zkcloudworker-dev-" + name, // the lambda function we are going to invoke
      InvocationType: "Event",
      Payload: payload,
    } as InvokeCommandInput;
    const command = new InvokeCommand(params);
    const result = await client.send(command);
    //console.log("Lambda call result", result);
    console.log("Lambda call:", name, "id:", result.$metadata.requestId);
    if (
      result.FunctionError ||
      result.StatusCode !== 202 ||
      result.$metadata.requestId === undefined
    )
      console.error("Lambda call error:", result);
    if (attempt > 0) console.log("Lambda call result:", result);
    await sleep(500);
  } catch (error: any) {
    console.error("Error: Lambda call", error);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
