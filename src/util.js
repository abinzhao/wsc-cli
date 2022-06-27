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
  return new Promise(async (resolve) => {
    if (data.eslint) {
      await loadCmd(
        `yarn add --dev --exact eslint && npx eslint --init`,
        "ESlint",
        ProjectName
      );
      await loadCmd(
        `yarn add --dev --exact prettier && npx prettier --init`,
        "Prettier",
        ProjectName
      );
    }

    // npx eslint --init
    // await exec(`cd ${ProjectName}`, (error, stdout, stderr) => {
    console.log(ProjectName, "data", data);
    // });
    resolve();
  });
};

let loadCmd = async (cmd, text, ProjectName) => {
  let loading = ora(`正在安装${text}中...`);
  loading.start(`正在安装${text}中...`);
  exec(cmd, { cwd: ProjectName }, function (error, stdout, stderr) {
    if (error) {
      loading.fail(`${text}安装完成`);
      console.log(symbol.error, chalk.red(`${text}安装失败`));
      return;
    }
    loading.succeed(`${text}安装完成`);
    console.log(symbol.success, chalk.green(`${text}安装成功`));
  });
};

module.exports = {
  notExistFold,
  prompt,
  updateJsonFile,
  installCode,
};
