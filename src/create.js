import symbol from "log-symbols";
import chalk from "chalk";
import ora from "ora";
import downloadGit from "download-git-repo";

import { notExistFold, prompt, updateJsonFile } from "./util";

let create = async (ProjectName) => {
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
              console.log(
                chalk.yellow(`
              🚀项目创建完毕，请使用以下命令进入项目：
              💻进入项目目录：${chalk.green(`cd ${ProjectName}`)}
              😎初始化项目：${chalk.green(`wsc init 用户名 token`)}
              ${chalk.yellow("该命令需要输入GitHub用户名以及token来连接仓库")}
              ${chalk.yellow("功能：自动创建GitHub存放源代码")}
              🚀启动项目：${chalk.green("npm run dev (or yarn dev)")}
              🚴‍♂️安装依赖：${chalk.green("npm install (or yarn install)")}
              🔨打包构建：${chalk.green("npm run build (or yarn build)")}
              ${chalk.yellow("推荐使用yarn启动或构建项目")}
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
