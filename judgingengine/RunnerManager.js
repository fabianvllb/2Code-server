const path = require("path");
const FileApi = require("../api/FileApi");
const CRunner = require("./CRunner");
const CppRunner = require("./CppRunner");
const JavaRunner = require("./JavaRunner");
const JavaScriptRunner = require("./JavaScriptRunner");
const PythonRunner = require("./PythonRunner");
const appRoot = require("app-root-path");
const { DateTime } = require("luxon");
const os = require("os");

class Factory {
  constructor() {
    this.createRunner = function createRunner(lang) {
      let runner;

      if (lang === "javascript") {
        runner = new JavaScriptRunner();
      } else if (lang === "c") {
        runner = new CRunner();
      } else if (lang === "c++") {
        runner = new CppRunner();
      } else if (lang === "java") {
        runner = new JavaRunner();
      } else if (lang === "python") {
        runner = new PythonRunner();
      }

      return runner;
    };
  }
}
/**
 *
 * @param {*} question
 * @param {*} lang
 * @param {*} solution
 * @param {*} callback
 */
//exports.run = function (question, lang, solution, callback) { //uniquename, language, solution y callback
exports.run = function (submission, problem, callback) {
  //console.log("**Starting run function in RunnerManager.js**");

  const factory = new Factory();
  const runner = factory.createRunner(submission.language.toLowerCase());

  // copy all files from solution folder to temp/question folder
  // TODO get questions from database instead of directory
  const sourceDir = path.resolve(`${appRoot}`, "solution", problem.uniquename);
  const targetDir = path.resolve(
    `${appRoot}`,
    "judgingengine",
    "temp",
    problem.uniquename +
      "_" +
      submission.language +
      "_" +
      DateTime.now().toISO().substring(0, 23) // 2022-02-03T22:44:30.652 on local server time
  );

  // copy source code files
  FileApi.copyDirectory(
    path.join(sourceDir, submission.language),
    targetDir,
    (err) => {
      if (err) {
        callback("99", String(err)); // 99, system error
      }

      const testcaseFile = path.join(targetDir, "testcase.txt");
      // copy test case file
      FileApi.copyFile(
        path.join(sourceDir, "testcase.txt"),
        testcaseFile,
        (err) => {
          let readyToExportSolution;
          if (err) {
            callback("99", String(err)); // 99, system error
          }
          // save the solution to Solution.js/Solution.java/Solution.c
          const sourceFile = path.resolve(targetDir, runner.sourceFile());
          //console.log(`source file: ${sourceFile}`);
          const filename = path.parse(sourceFile).name; // main or Solution.js in this case
          const extension = path.parse(sourceFile).ext; // .js
          //console.log(`filename: ${filename}`);
          //console.log(`extension: ${extension}`);

          // If language is javascript then write at the end of solution the method name and export it
          if (submission.language == "javascript") {
            //TODO upgrade method finding.
            // gets the method name i.e: twoSum
            const method = submission.solution
              .substring(
                submission.solution.indexOf("var") + 4,
                submission.solution.indexOf("=")
              )
              .trim();
            // add to module exports
            readyToExportSolution =
              submission.solution + "; " + "module.exports = " + method + ";";
            //solution = solution + os.EOL + " module.exports = reverseString;";
          }
          // We save Solution.js with its modified content
          FileApi.saveFile(sourceFile, readyToExportSolution, () => {
            const testFile = path.resolve(targetDir, runner.testFile());
            const testFileName = path.parse(testFile).name; // main or SolutionTester in this case
            runner.run(
              testFile,
              targetDir,
              testFileName,
              extension,
              function (status, message) {
                if (status == "ok") {
                  // no error
                  if (message.startsWith("[Success]")) {
                    //submission.status = "pass";
                    callback("pass", message.slice(9)); // ok, pass
                  } else {
                    //submission.status = "fail";
                    callback("fail", message.slice(6)); // ok, fail
                  }
                } else {
                  callback(status, message);
                }
              }
            );
          });
        }
      );
    }
  );
};
