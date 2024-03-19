const { spawn } = require("child_process");
const fs = require("fs");
const _ = require("lodash");
const path = require("path");

const DB_NAME = "template-app";
const ARCHIVE_PATH = path.join(__dirname, "../../", `${DB_NAME}.gzip`);
const do_backup = async () => {
  console.log(ARCHIVE_PATH, "path");
  const child = spawn("mongodump", [
    `--db=${DB_NAME}`,
    `--archive=${ARCHIVE_PATH}`,
    "--gzip",
  ]);

  child.stdout.on("data", (data) => {
    console.log("stdout:\n", data);
  });
  child.stderr.on("data", (data) => {
    console.log("stderr:\n", Buffer.from(data).toString());
  });
  child.on("error", (error) => {
    console.log("error:\n", error);
  });
  child.on("exit", (code, signal) => {
    if (code) console.log("Process exit with code:", code);
    else if (signal) console.log("Process killed with signal:", signal);
    else console.log("Backup is successfull ✅");
  });
};
module.exports = { do_backup };
