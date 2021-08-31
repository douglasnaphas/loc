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
    .version("2.0.0")
    .description(
      "Print info about lines of code contributed to GitHub by the authenticated" +
        " GitHub user. Prints something like:" +
        `\n` +
        `[{"owner":"douglasnaphas","repo":"loc","ref":"9b6704d47d86e9733816023c8c53f4b976fc97a0","stats":{"additions":220,"deletions":0}}]`
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
  let token: string;
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
  const author = await LOC.user(token);
  const contributions = await LOC.contributions(token, fromDate, toDate);
  const searchResults1 = await LOC.searchCommitsByUserAndDatename({
    token,
    owner: "douglasnaphas",
    repo: "madliberation",
    fromDate,
    toDate,
    author,
  });
  const locStats = [];
  for (let i = 0; i < contributions.length; i++) {
    const contribution = contributions[i];
    const { owner } = contribution;
    const repo = contribution.name;
    const commits = await LOC.searchCommitsByUserAndDatename({
      token,
      owner,
      repo,
      fromDate,
      toDate,
      author,
    });
    // console.log(`commits in ${owner}/${repo}:`);
    // console.log(JSON.stringify(commits));
    for (let j = 0; j < commits.length; j++) {
      const ref = commits[j];
      const stats = await LOC.getAdditionsAndDeletionsForCommit({
        token,
        owner,
        repo,
        ref,
      });
      // console.log(JSON.stringify(stats));
      locStats.push({ owner, repo, ref, stats });
    }
  }
  console.log(JSON.stringify(locStats));
})().catch((err: Error) => {
  console.error("Error encountered");
  console.error(err.message);
  process.exit(1);
});
