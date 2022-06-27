import symbol from "log-symbols";
import chalk from "chalk";
import ora from "ora";
import downloadGit from "download-git-repo";
const util = require("util");
const exec = util.promisify(require("child_process").exec);

import { notExistFold, prompt, updateJsonFile, installCode } from "./util";

let create = async (ProjectName) => {
  //检测脚手架最新版本
  const versionNew = await exec(`npm view works-space-cli version`);
  const versionOld = await exec(`works-space-cli -v`);
  if (!(versionNew.stdout == versionOld.stdout)) {
    console.log(
      chalk.yellow(`
    --------------------------------------
            当前安装版本为:${chalk.green(versionOld.stdout)}
              最新版本为:${chalk.green(versionNew.stdout)}
        请使用${chalk.green("wsc update")}以安装最新版本
    --------------------------------------
    `)
    );
  }
  // 项目名不能为空
  if (ProjectName === undefined) {
    console.log(symbol.error, chalk.red("创建项目的时候，请输入项目名"));
  } else {
    // 如果文件名不存在则继续执行,否则退出
    notExistFold(ProjectName).then(() => {
      // 用户询问交互
      prompt().then((answer) => {
        /**
         * 根据用户输入的配置信息下载模版&更新模版配置
         * 下载模版比较耗时,这里通过ora插入下载loading, 提示用户正在下载模版
         */
        let loading = ora("模板下载中...");
        loading.start("模板下载中...");

        let Api = "";
        switch (answer.frame) {
          case "vue":
            Api = "direct:https://github.com/abinzhao/vue-ts.git";
            break;
          case "react":
            Api = "direct:https://github.com/abinzhao/react-ts.git";
            break;
          default:
            break;
        }

        downloadGit(Api, ProjectName, { clone: true }, (err) => {
          if (!err) {
            loading.fail("模板下载失败");
            console.log(symbol.error, chalk.red(err));
          } else {
            loading.succeed("模板下载完成");
            console.log(symbol.success, chalk.green("配置文件更新中..."));

            // 下载完成后,根据用户输入更新配置文件
            const fileName = `${ProjectName}/package.json`;
            answer.name = ProjectName;
            updateJsonFile(fileName, answer).then(() => {
              console.log(symbol.success, chalk.green("配置文件更新完成"));
            });
            // 安装代码检测，代码格式化工具
            installCode(ProjectName, answer).then(async () => {
              console.log(
                chalk.yellow(`
              🚀项目创建完毕，请使用以下命令进入项目：
              💻进入项目目录：${chalk.green(`cd ${ProjectName}`)}
              😎启动项目：${chalk.green("yarn dev")}
              😎更新项目：${chalk.green("wsc update")}
              🚀安装依赖：${chalk.green("yarn install")}
              🔨打包构建：${chalk.green("yarn build")}
              `)
              );
            });
          }
        });
      });
    });
  }
};

module.exports = create;
