"use strict";

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

var _logSymbols = require("log-symbols");

var _logSymbols2 = _interopRequireDefault(_logSymbols);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _ora = require("ora");

var _ora2 = _interopRequireDefault(_ora);

var _util = require("./util.js");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const util = require("util");
const exec = util.promisify(require("child_process").exec);


let init = async (username, token) => {
  try {
    await loadCmd(`git init`, "git初始化");
    console.log(_logSymbols2.default.success, _chalk2.default.green(`
    UserName:${username}
    token:${token}
    `));
    if (!username || !token) {
      console.log(_logSymbols2.default.warning, _chalk2.default.yellow("缺少入参无法创建远端仓库"));
    } else {
      //   const projectName = process.cwd().split("/").slice(-1)[0];
      const _projectName = process.cwd().split("\\");
      const projectName = _projectName[_projectName.length - 1];
      console.log("projectName:", projectName);

      const data = await loadCmd(`curl -u "${username}:${token}" https://api.github.com/user/repos -d "{"name": "${projectName}"}"`, "Github仓库创建");
      console.log("data:", data);

      await loadCmd(`git remote add origin https://github.com/${username}/${projectName}.git`, "关联远端仓库");
      let loading = (0, _ora2.default)();
      loading.start(`package.json更新repository: 命令执行中...`);
      let pack = _path2.default.join(__dirname, "package.json");
      _fs2.default.readFile(pack, "utf-8", (err, data) => {
        if (err) {
          console.log(_logSymbols2.default.success, _chalk2.default.red(err));
          return;
        }
        let arr = JSON.parse(data);
        arr.push({
          repository: {
            type: "git",
            url: `https://github.com/${username}/${projectName}.git`
          }
        });
        _fs2.default.writeFile(pack, JSON.stringify(arr), "utf-8", err => {
          console.log(_logSymbols2.default.error, _chalk2.default.red("package.json写入仓库信息失败"));
          console.log(_logSymbols2.default.error, _chalk2.default.red(err));
        });
      });
      loading.succeed(`package.json更新repository: 命令执行完成`);

      await loadCmd(`git add .`, "执行git add");
      await loadCmd(`git commit -a -m 'init'`, "执行git commit");
      await loadCmd(`git push --set-upstream origin master`, "执行git push");
    }
  } catch (err) {
    console.log(_chalk2.default.red(`
      ${_logSymbols2.default.error}初始化失败
      ${_logSymbols2.default.error}内部错误:仓库鉴权错误
    `));
    console.log(_logSymbols2.default.error, _chalk2.default.red(err));
    process.exit(1);
  }
};

let loadCmd = async (cmd, text) => {
  let loading = (0, _ora2.default)();
  loading.start(`${text}: 执行中...`);
  await exec(cmd);
  loading.succeed(`${text}: 执行完成`);
};

module.exports = init;