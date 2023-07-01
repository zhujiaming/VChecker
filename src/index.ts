import GithubFileSource from "./source";
import { VChecker } from "./ver";

function runExample() {
  new VChecker()
    .local({
      vernum: 0,
      vercode: "0.0.0",
      force: false,
      dateTime: 0,
      forElse: "",
    })
    .remote(
      new GithubFileSource(
        "https://raw.githubusercontent.com/zhujiaming/VChecker/main/.ver"
      )
    )
    .tryCheck()
    .then((res) => {
      if (res) {
        // 有版本更新
        console.log("need update:", res);
      } else {
        console.log("no update:", res);
      }
    })
    .catch((e) => {
      console.error("update check error");
    });
}

runExample();
