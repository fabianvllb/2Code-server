const path = require("path");
const FileApi = require("../api/FileApi");
const CRunner = require("./CRunner");
const CppRunner = require("./CppRunner");
const JavaRunner = require("./JavaRunner");
const JavaScriptRunner = require("./JavaScriptRunner");
const PythonRunner = require("./PythonRunner");
const appRoot = require("app-root-path");
const { DateTime } = require("luxon");

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
 * Creates the corresponding script runner for the problem's language selected by the user.
 * @param {Submission} submission Receives the submission data and in particular the code of the solution sent by the user.
 * @param {Problem} problem Receives de data related to de problem. In particular, the problem's unique name and language are used to create
 *                          an instance of the appropiate compiler.
 * @param {Function} callback Used to calculate the total time execution of the solution and returning the resulto to the client.
 */
exports.run = function (submission, problem, callback) {
  const factory = new Factory();
  const runner = factory.createRunner(submission.language.toLowerCase());

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
          const filename = path.parse(sourceFile).name; // main or Solution.js in this case
          const extension = path.parse(sourceFile).ext; // .js

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
