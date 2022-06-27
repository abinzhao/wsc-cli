import program from "commander";
import create from "./create"; // 项目创建
import update from "./update"; // 项目更新

/**
 * works-space-cli 命令列表
 */

let actionMap = {
  // 项目创建
  create: {
    description: "创建一个新的项目", // 描述
    usages: [
      // 使用方法
      "works-space-cli create ProjectName",
      "ws-cli create ProjectName",
      "wsc create ProjectName",
    ],
    alias: "c", // 命令简称
  },
  // // 项目初始化
  // init: {
  //   description: "初始化项目",
  //   usages: ["works-space-cli init", "ws-cli init", "wsc init"],
  //   options: [
  //     {
  //       flags: "-u --username <port>",
  //       description: "github用户名",
  //       defaultValue: "",
  //     },
  //     {
  //       flags: "-t --token <port>",
  //       description: "github创建的token",
  //       defaultValue: "",
  //     },
  //   ],
  //   alias: "i",
  // },
  // 更新项目
  update: {
    description: "更新项目版本", // 描述
    usages: [
      // 使用方法
      "works-space-cli update",
      "ws-cli update",
      "wsc update",
    ],
    alias: "up", // 命令简称
  },
  // 启动项目
  // dev: {
  //   description: "本地启动项目",
  //   usages: ["works-space-cli dev", "ws-cli dev", "wsc dev"],
  //   options: [
  //     {
  //       flags: "-p --port <port>",
  //       description: "端口",
  //       defaultValue: 3000,
  //     },
  //   ],
  //   alias: "d",
  // },
  //打包
  // build: {
  //   description: "服务端项目打包",
  //   usages: ["works-space-cli build", "ws-cli build", "wsc build"],
  //   options: [
  //     {
  //       flags: "-u --username <port>",
  //       description: "github用户名",
  //       defaultValue: "",
  //     },
  //     {
  //       flags: "-t --token <port>",
  //       description: "github创建的token",
  //       defaultValue: "",
  //     },
  //   ],
  //   alias: "b",
  // },
};

// 添加create,init,dev命令
Object.keys(actionMap).forEach((action) => {
  if (actionMap[action].options) {
    Object.keys(actionMap[action].options).forEach((option) => {
      let obj = actionMap[action].options[option];
      program.option(obj.flags, obj.description, obj.defaultValue);
    });
  }

  program
    .command(action)
    .description(actionMap[action].description)
    .alias(actionMap[action].alias)
    .action(() => {
      switch (action) {
        // 到这里具体命令实现逻辑还空缺，我们先打日志，看下命令处理情况
        case "create":
          create(...process.argv.slice(3));
          break;
        case "update":
          update(program.username, program.token);
          break;
        default:
          break;
      }
    });
});

// 项目版本
program
  .version(require("../package.json").version, "-v --version")
  .parse(process.argv);

/**
 * works-space-cli命令后不带参数的时候，输出帮助信息
 */
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
