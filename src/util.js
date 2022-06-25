import fs from "fs";
import symbol from "log-symbols";
import chalk from "chalk";
import inquirer from "inquirer";
import handlebars from "handlebars";

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

module.exports = {
  notExistFold,
  prompt,
  updateJsonFile,
};
