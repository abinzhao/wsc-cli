import fs from "fs";
import symbol from "log-symbols";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import handlebars from "handlebars";
const util = require("util");
const exec = util.promisify(require("child_process").exec);

// 文件是否存在
let notExistFold = async (name) => {
  return new Promise((resolve) => {
    if (fs.existsSync(name)) {
      console.log(
        symbol.error,
        chalk.red("文件夹名已被占用，请更换名字重新创建")
      );
    } else {
      resolve();
    }
  });
};

// 询问用户
let promptList = [
  {
    type: "list",
    name: "frame",
    message: "请选择项目模板",
    choices: ["vue", "react"],
  },
  {
    type: "input",
    name: "description",
    message: "请输入项目描述：",
  },
  {
    type: "input",
    name: "version",
    message: "请输入项目版本号：",
  },
  {
    type: "input",
    name: "author",
    message: "请输入作者姓名：",
  },
  {
    type: "input",
    name: "author",
    message: "请输入作者姓名：",
  },
  // {
  //   type: "list",
  //   name: "eslint",
  //   message: "是否使用ESLint代码检测",
  //   choices: ["Yes", "No"],
  // },
  // {
  //   type: "list",
  //   name: "prettier",
  //   message: "是否使用Prettier代码格式化",
  //   choices: ["Yes", "No"],
  // },
];

let prompt = () => {
  return new Promise((resolve) => {
    inquirer.prompt(promptList).then((answer) => {
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
    version: obj.version,
  };
  return new Promise((resolve) => {
    if (fs.existsSync(fileName)) {
      const data = fs.readFileSync(fileName).toString();
      const result = handlebars.compile(data)(meta);
      fs.writeFileSync(fileName, result, "utf-8");
      resolve();
    }
  });
};

//安装eslint,prettier工具
let installCode = (ProjectName, data) => {
  return new Promise((resolve) => {
    resolve();
  });
};

module.exports = {
  notExistFold,
  prompt,
  updateJsonFile,
  installCode,
};
