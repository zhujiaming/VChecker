"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const source_1 = require("./source");
function runExample() {
    new QVersion()
        .local({
        vernum: 0,
        vercode: "",
        force: false,
        dateTime: 0,
        forElse: "",
    })
        .remote(new source_1.GithubFileSource(""))
        .tryCheck()
        .then((res) => {
        if (res) {
            // 有版本更新
            console.log("need update:", res);
        }
    })
        .catch((e) => {
        console.error("update check error");
    });
}
