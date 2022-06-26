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
}, {
  type: "list",
  name: "eslint",
  message: "是否使用ESLint代码检测",
  choices: ["Yes", "No"]
}, {
  type: "list",
  name: "prettier",
  message: "是否使用Prettier代码格式化",
  choices: ["Yes", "No"]
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
  return new Promise(async resolve => {
    if (data.eslint == "Yes") {
      let loading = (0, _ora2.default)("正在安装ESlint中...");
      loading.start("正在安装ESlint中...");
      await console.log("***", process.cwd(), "data:", data.name);
      await exec(`cd ${data.name}`);
      await console.log("**--*", process.cwd(), "data:", data.name);
      await exec(`yarn add @typescript-eslint/parser eslint eslint-plugin-standard @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-promise  --dev`);
      loading.succeed("ESlint安装完成");
      let loadingFile = (0, _ora2.default)("正在初始化ESlint...");
      loadingFile.start("正在初始化ESlint...");
      await exec(`yarn eslint`);
      loadingFile.succeed("ESlint初始化完成");
    }
    if (data.prettier == "Yes") {
      let loading = (0, _ora2.default)("正在安装Prettier中...");
      loading.start("正在安装Prettier中...");
      await exec(`yarn add prettier --dev`);
      loading.succeed("Prettier安装完成");
      let loadingFile = (0, _ora2.default)("正在初始化Prettier...");
      loadingFile.start("正在初始化Prettier...");
      const da = await exec(`yarn prettier`);
      console.log("---", da);
      loadingFile.succeed("Prettier初始化完成");
    }
    resolve();
  });
};

module.exports = {
  notExistFold,
  prompt,
  updateJsonFile,
  installCode
};