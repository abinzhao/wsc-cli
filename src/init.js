import child from "child_process";
import symbol from "log-symbols";
import chalk from "chalk";
import ora from "ora";
const util = require("util");
const exec = util.promisify(require("child_process").exec);
import { updateJsonFile } from "./util.js";
import path from "path";
import fs from "fs";

let init = async (username, token) => {
  try {
    await loadCmd(`git init`, "git初始化");
    console.log(
      symbol.success,
      chalk.green(`
    UserName:${username}
    token:${token}
    `)
    );
    if (!username || !token) {
      console.log(symbol.warning, chalk.yellow("缺少入参无法创建远端仓库"));
    } else {
      //   const projectName = process.cwd().split("/").slice(-1)[0];
      const _projectName = process.cwd().split("\\");
      const projectName = _projectName[_projectName.length - 1];
      console.log("projectName:", projectName);

      const data = await loadCmd(
        `curl -u "${username}:${token}" https://api.github.com/user/repos -d "{"name": "${projectName}"}"`,
        "Github仓库创建"
      );
      console.log("data:", data);

      await loadCmd(
        `git remote add origin https://github.com/${username}/${projectName}.git`,
        "关联远端仓库"
      );
      let loading = ora();
      loading.start(`package.json更新repository: 命令执行中...`);
      let pack = path.join(__dirname, "package.json");
      fs.readFile(pack, "utf-8", (err, data) => {
        if (err) {
          console.log(symbol.success, chalk.red(err));
          return;
        }
        let arr = JSON.parse(data);
        arr.push({
          repository: {
            type: "git",
            url: `https://github.com/${username}/${projectName}.git`,
          },
        });
        fs.writeFile(pack, JSON.stringify(arr), "utf-8", (err) => {
          console.log(symbol.error, chalk.red("package.json写入仓库信息失败"));
          console.log(symbol.error, chalk.red(err));
        });
      });
      loading.succeed(`package.json更新repository: 命令执行完成`);

      await loadCmd(`git add .`, "执行git add");
      await loadCmd(`git commit -a -m 'init'`, "执行git commit");
      await loadCmd(`git push --set-upstream origin master`, "执行git push");
    }
  } catch (err) {
    console.log(
      chalk.red(`
      ${symbol.error}初始化失败
      ${symbol.error}内部错误:仓库鉴权错误
    `)
    );
    console.log(symbol.error, chalk.red(err));
    process.exit(1);
  }
};

let loadCmd = async (cmd, text) => {
  let loading = ora();
  loading.start(`${text}: 执行中...`);
  await exec(cmd);
  loading.succeed(`${text}: 执行完成`);
};

module.exports = init;
