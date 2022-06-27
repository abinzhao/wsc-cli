"use strict";

var _logSymbols = require("log-symbols");

var _logSymbols2 = _interopRequireDefault(_logSymbols);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _ora = require("ora");

var _ora2 = _interopRequireDefault(_ora);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const util = require("util");
const exec = util.promisify(require("child_process").exec);

let update = async () => {
  let loading = (0, _ora2.default)("更新版本中...");
  loading.start("更新版本中...");
  exec(`npm install works-space-cli -g`);
  loading.succeed("新版本下载完成");
  console.log(_logSymbols2.default.success, _chalk2.default.green("版本更新成功"));
};

module.exports = update;