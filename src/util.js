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
    type: "confirm",
    name: "eslint",
    message: "是否使用ESLint代码检测",
    default: true,
  },
  {
    type: "confirm",
    name: "prettier",
    message: "是否使用Prettier代码格式化",
    default: true,
  },
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
  return new Promise((resolve) => {
    if (fs.existsSync(fileName)) {
      const data = fs.readFileSync(fileName).toString();
      const result = JSON.parse(data);
      result.name = obj.name;
      result.description = obj.description;
      result.author = obj.author;
      result.version = obj.version;
      if (!obj.eslint) {
        delete result.scripts["eslint"];
        delete result.devDependencies["@typescript-eslint/eslint-plugin"];
        delete result.devDependencies["@typescript-eslint/parser"];
        delete result.devDependencies["eslint"];
        delete result.devDependencies["eslint-config-prettier"];
        delete result.devDependencies["eslint-plugin-prettier"];
        delete result.devDependencies["eslint-plugin-react"];
        fs.unlinkSync(`./${obj.name}/.eslintrc.json`, (err) => {
          if (err) {
            console.log(symbol.error, chalk.red(err));
          }
        });
      }
      if (!obj.prettier) {
        delete result.scripts["format"];
        delete result.devDependencies["prettier"];
        fs.unlinkSync(`./${obj.name}/.prettierrc.json`, (err) => {
          if (err) {
            console.log(symbol.error, chalk.red(err));
          }
        });
      }
      fs.writeFileSync(fileName, result, "utf-8");
      resolve();
    }
  });
};

module.exports = {
  notExistFold,
  prompt,
  updateJsonFile,
};
