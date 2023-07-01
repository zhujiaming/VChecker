"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const source_1 = __importDefault(require("./source"));
const ver_1 = require("./ver");
function runExample() {
    new ver_1.VChecker()
        .local({
        vernum: 0,
        vercode: "0.0.0",
        force: false,
        dateTime: 0,
        forElse: "",
    })
        .remote(new source_1.default("https://raw.githubusercontent.com/zhujiaming/VChecker/main/.ver"))
        .tryCheck()
        .then((res) => {
        if (res) {
            // 有版本更新
            console.log("need update:", res);
        }
        else {
            console.log("no update:", res);
        }
    })
        .catch((e) => {
        console.error("update check error");
    });
}
runExample();
