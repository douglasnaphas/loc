#!/usr/bin/env node

import { LOC } from "./index";
import { sub } from "date-fns";
(async () => {
  const program = require("commander");
  const fs = require("fs");

  const now = new Date();
  const defaultRangeInDays = 30;
  const defaults = {
    beginningDate: sub(now, { days: defaultRangeInDays }),
    endDate: now,
  };
  const AUTH_W_GITHUB_URL =
    "https://developer.github.com/v4/guides/forming-calls/" +
    "#authenticating-with-graphql";
  program
    .name("loc")
    .version("0.1.0-f")
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
    .option(
      "-b, --beginning-date <DATE>",
      `Query starting from this date, ISO format like '2021-06-01'` +
        `, default 30 days ago`
    )
    .option(
      "-e, --end-date <DATE>",
      `Query up through this date, ISO format like '2021-06-30'` +
        `, default today`
    )
    .parse(process.argv);
  const options = program.opts();
  const { tokenFile, beginningDate, endDate } = options;
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

  // make sure dates are valid
  if (beginningDate && !Date.parse(beginningDate)) {
    console.error(
      `Could not parse beginningDate ${beginningDate}, use something like '2020-06-30'`
    );
    process.exit(1);
  }
  if (endDate && !Date.parse(endDate)) {
    console.error(
      `Could not parse endDate ${endDate}, use something like '2020-06-30'`
    );
    process.exit(1);
  }
  let fromDate = defaults.beginningDate;
  if (beginningDate) {
    fromDate = new Date(beginningDate);
  }
  let toDate = defaults.endDate;
  if (endDate) toDate = new Date(endDate);
  const user = await LOC.user(token);
  // console.log(user);
  const contributions = await LOC.contributions(token, fromDate, toDate);
  // console.log(JSON.stringify(contributions));
  const searchResults1 = await LOC.searchCommitsByUserAndDatename({
    token,
    fromDate,
    toDate,
    author: user,
  });
  console.log(JSON.stringify(searchResults1));
})().catch((err: Error) => {
  console.error("Error encountered");
  console.error(err.message);
  process.exit(1);
});
