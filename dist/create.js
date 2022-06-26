"use strict";

var _logSymbols = require("log-symbols");

var _logSymbols2 = _interopRequireDefault(_logSymbols);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _ora = require("ora");

var _ora2 = _interopRequireDefault(_ora);

var _downloadGitRepo = require("download-git-repo");

var _downloadGitRepo2 = _interopRequireDefault(_downloadGitRepo);

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const util = require("util");
const exec = util.promisify(require("child_process").exec);

let create = async ProjectName => {
  //检测脚手架最新版本
  const versionNew = await exec(`npm view works-space-cli version`);
  const versionOld = await exec(`works-space-cli -v`);
  if (!(versionNew.stdout == versionOld.stdout)) {
    console.log(_chalk2.default.yellow(`
    --------------------------------------
            当前安装版本为:${_chalk2.default.green(versionOld.stdout)}
              最新版本为:${_chalk2.default.green(versionNew.stdout)}
        请使用${_chalk2.default.green("wsc update")}以安装最新版本
    --------------------------------------
    `));
  }
  // 项目名不能为空
  if (ProjectName === undefined) {
    console.log(_logSymbols2.default.error, _chalk2.default.red("创建项目的时候，请输入项目名"));
  } else {
    // 如果文件名不存在则继续执行,否则退出
    (0, _util.notExistFold)(ProjectName).then(() => {
      // 用户询问交互
      (0, _util.prompt)().then(answer => {
        /**
         * 根据用户输入的配置信息下载模版&更新模版配置
         * 下载模版比较耗时,这里通过ora插入下载loading, 提示用户正在下载模版
         */
        let loading = (0, _ora2.default)("模板下载中...");
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

        (0, _downloadGitRepo2.default)(Api, ProjectName, { clone: true }, err => {
          if (!err) {
            loading.fail("模板下载失败");
            console.log(_logSymbols2.default.error, _chalk2.default.red(err));
          } else {
            loading.succeed("模板下载完成");
            console.log(_logSymbols2.default.success, _chalk2.default.green("配置文件更新中..."));

            // 下载完成后,根据用户输入更新配置文件
            const fileName = `${ProjectName}/package.json`;
            answer.name = ProjectName;
            (0, _util.updateJsonFile)(fileName, answer).then(() => {
              console.log(_logSymbols2.default.success, _chalk2.default.green("配置文件更新完成"));
            });
            // 安装代码检测，代码格式化工具
            (0, _util.installCode)(ProjectName, answer).then(() => {
              console.log(_chalk2.default.yellow(`
              🚀项目创建完毕，请使用以下命令进入项目：
              💻进入项目目录：${_chalk2.default.green(`cd ${ProjectName}`)}

              😎初始化项目：${_chalk2.default.green(`wsc init 用户名 token`)}
              ${_chalk2.default.yellow("该命令需要输入GitHub用户名以及token来连接仓库")}
              ${_chalk2.default.yellow("功能：自动创建GitHub存放源代码")}
              🚀启动项目：${_chalk2.default.green("yarn dev")}
              🚀安装依赖：${_chalk2.default.green("yarn install")}
              🔨打包构建：${_chalk2.default.green("yarn build")}
              `));
            });
          }
        });
      });
    });
  }
};

module.exports = create;