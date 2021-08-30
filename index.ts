import { AxiosResponse } from "axios";
const axios = require("axios");

exports.loc = () => {
  console.log("loc");
};
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const print_user = async (token: string) => {
  await axios
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
      console.log(JSON.stringify(r.data));
    })
    .catch((err: Error) => {
      console.error(`problem encountered getting the user`);
      console.error(err.message);
      process.exit(1);
    });
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
                      nameWithOwner
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
    (c: any) => c.contributions.nodes[0].repository.nameWithOwner
  );
};

export class LOC {
  public static contributions(token: string, fromDate: Date, toDate: Date) {
    return contributions(token, fromDate, toDate);
  }
  public static print_user(token: string) {
    return print_user(token);
  }
}
