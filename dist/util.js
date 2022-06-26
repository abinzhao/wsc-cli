"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _logSymbols = require("log-symbols");

var _logSymbols2 = _interopRequireDefault(_logSymbols);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _ora = require("ora");

var _ora2 = _interopRequireDefault(_ora);

var _inquirer = require("inquirer");

var _inquirer2 = _interopRequireDefault(_inquirer);

var _handlebars = require("handlebars");

var _handlebars2 = _interopRequireDefault(_handlebars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const util = require("util");
const exec = util.promisify(require("child_process").exec);

// 文件是否存在
let notExistFold = async name => {
  return new Promise(resolve => {
    if (_fs2.default.existsSync(name)) {
      console.log(_logSymbols2.default.error, _chalk2.default.red("文件夹名已被占用，请更换名字重新创建"));
    } else {
      resolve();
    }
  });
};

// 询问用户
let promptList = [{
  type: "list",
  name: "frame",
  message: "请选择项目模板",
  choices: ["vue", "react"]
}, {
  type: "input",
  name: "description",
  message: "请输入项目描述："
}, {
  type: "input",
  name: "version",
  message: "请输入项目版本号："
}, {
  type: "input",
  name: "author",
  message: "请输入作者姓名："
}, {
  type: "input",
  name: "author",
  message: "请输入作者姓名："
}];

let prompt = () => {
  return new Promise(resolve => {
    _inquirer2.default.prompt(promptList).then(answer => {
      resolve(answer);
    });
  });
};

// 更新json配置文件
let updateJsonFile = (fileName, obj) => {
  const meta = {
    name: obj.name,
    description: obj.description,
    author: obj.author,
    version: obj.version
  };
  return new Promise(resolve => {
    if (_fs2.default.existsSync(fileName)) {
      const data = _fs2.default.readFileSync(fileName).toString();
      const result = _handlebars2.default.compile(data)(meta);
      _fs2.default.writeFileSync(fileName, result, "utf-8");
      resolve();
    }
  });
};

//安装eslint,prettier工具
let installCode = (ProjectName, data) => {
  return new Promise(resolve => {
    resolve();
  });
};

module.exports = {
  notExistFold,
  prompt,
  updateJsonFile,
  installCode
};