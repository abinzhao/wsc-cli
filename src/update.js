import symbol from "log-symbols";
import chalk from "chalk";
import ora from "ora";
const util = require("util");
const exec = util.promisify(require("child_process").exec);

let update = async () => {
  let loading = ora("更新版本中...");
  loading.start("更新版本中...");
  await exec(`npm install works-space-cli -g`);
  loading.succeed("新版本下载完成");
  console.log(symbol.success, chalk.green("版本更新成功"));
};

module.exports = update;
