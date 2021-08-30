import { AxiosResponse } from "axios";
const axios = require("axios");
import { Octokit } from "@octokit/core";

exports.loc = () => {
  console.log("loc");
};
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const user = async (token: string) => {
  const login = await axios
    .post(
      GITHUB_GRAPHQL_URL,
      {
        query: `query { 
          viewer { 
            login } }`,
      },
      {
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((r: AxiosResponse) => {
      // console.log(r.data);
      // console.log(JSON.stringify(r));
      return r.data.data.viewer.login;
    })
    .catch((err: Error) => {
      console.error(`problem encountered getting the user`);
      console.error(err.message);
      process.exit(1);
    });
  return login;
};
const contributions = async (token: string, fromDate: Date, toDate: Date) => {
  const r = await axios
    .post(
      GITHUB_GRAPHQL_URL,
      {
        query: `query {
          viewer {
            login
            contributionsCollection(from: "${fromDate.toISOString()}", to: "${toDate.toISOString()}") {
              commitContributionsByRepository {
                contributions(first: 100) {
                  pageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                  }
                  nodes {
                    commitCount
                    repository {
                      owner {
                        login
                      }
                      name
                    }
                  }
                }
              }
            }
          }
        }`,
      },
      {
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((r: AxiosResponse) => {
      return r.data;
    })
    .catch((err: Error) => {
      console.error(`problem encountered getting the user`);
      console.error(err.message);
      process.exit(1);
    });
  return r.data.viewer.contributionsCollection.commitContributionsByRepository.map(
    (c: any) => {
      return {
        owner: c.contributions.nodes[0].repository.owner.login,
        name: c.contributions.nodes[0].repository.name,
      };
    }
  );
};

export interface SearchCommitsByUserAndDateProps {
  token: string;
  owner: string;
  repo: string;
  fromDate: Date;
  toDate: Date;
  author: string;
}
const searchCommitsByUserAndDate = async (
  props: SearchCommitsByUserAndDateProps
) => {
  const { token, owner, repo, fromDate, toDate, author } = props;
  const since = fromDate.toISOString();
  const until = toDate.toISOString();
  const octokit = new Octokit({ auth: token });
  const response = await octokit.request("GET /repos/{owner}/{repo}/commits", {
    owner,
    repo,
    since,
    until,
    author,
  });
  return response.data.map((c) => c.sha);
};

export interface GetAdditionsAndDeletionsForCommitProps {
  token: string;
  owner: string;
  repo: string;
  ref: string;
}
const getAdditionsAndDeletionsForCommit = async (
  props: GetAdditionsAndDeletionsForCommitProps
) => {
  const { token, owner, repo, ref } = props;
  const octokit = new Octokit({ auth: token });
  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/commits/{ref}",
    {
      owner,
      repo,
      ref,
    }
  );
  return {
    additions: response.data.stats?.additions || 0,
    deletions: response.data.stats?.deletions || 0,
  };
};

export class LOC {
  public static contributions(token: string, fromDate: Date, toDate: Date) {
    return contributions(token, fromDate, toDate);
  }
  public static user(token: string) {
    return user(token);
  }
  public static searchCommitsByUserAndDatename(
    props: SearchCommitsByUserAndDateProps
  ) {
    return searchCommitsByUserAndDate(props);
  }
  public static getAdditionsAndDeletionsForCommit(
    props: GetAdditionsAndDeletionsForCommitProps
  ) {
    return getAdditionsAndDeletionsForCommit(props);
  }
}
