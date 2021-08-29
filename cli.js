#!/usr/bin/env node

(async () => {
  const program = require("commander");
  const fs = require("fs");

  const defaults = {};
  const AUTH_W_GITHUB_URL =
    "https://developer.github.com/v4/guides/forming-calls/" +
    "#authenticating-with-graphql";
  program
    .name("loc")
    .version("0.1.0")
    .description(
      "Print info about lines of code contributed to GitHub by the authenticated" +
        " GitHub user. Prints something like:" +
        `\n` +
        `[{"repo": "octocat/repo1","loc":44}]`
    )
    .option(
      "-t, --token-file <PATH>",
      `Path to a GitHub authentication token, see ${AUTH_W_GITHUB_URL}`
    )
    .parse(process.argv);
  const options = program.opts();
  const { tokenFile } = options;
  if (!tokenFile) {
    console.error(
      `A file with a GitHub authentication token must be specified` +
        ` with -t or --token-file. See ${AUTH_W_GITHUB_URL}.`
    );
    process.exit(2);
  }
  if (!fs.existsSync(tokenFile)) {
    console.error(`Token file ${tokenFile} does not exist.`);
    process.exit(3);
  }
  let token;
  try {
    fs.accessSync(tokenFile, fs.constants.F_OK & fs.constants.R_OK);
    token = fs.readFileSync(tokenFile, "utf8").trim();
  } catch (err) {
    console.error(`Unable to read token file ${tokenFile}.`);
    process.exit(4);
  }
  const loc = require("./index.js");
  await loc.print_user(token);
})().catch((err) => {
  console.error("Error encountered");
  console.error(err.message);
  process.exit(1);
});
