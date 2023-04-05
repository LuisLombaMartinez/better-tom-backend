import { App } from "aws-cdk-lib";
import { MainStack } from "./MainStack";


const app = new App();

const mainStack = new MainStack(app, "Better-Tom", {
    stackName: "BetterTom"
});
