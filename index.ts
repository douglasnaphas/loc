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

export interface SearchCommitsByUserAndDateProps {
  token: string;
  fromDate: Date;
  toDate: Date;
  author: string;
}
const searchCommitsByUserAndDate = async (
  props: SearchCommitsByUserAndDateProps
) => {
  const { token, fromDate, toDate, author } = props;
  const fromDateString = fromDate.toISOString().substring(0, 10);
  const toDateString = toDate.toISOString().substring(0, 10);
  const dateRangeString = `${fromDateString}..${toDateString}`;
  const octokit = new Octokit({ auth: token });
  const response = await octokit.request("GET /search/commits", {
    // q: `committer-email=${author}@gmail.com&committer-date=${dateRangeString}&repo=douglasnaphas/madliberation`,
    // q: `author-name="Douglas Naphas <douglasnaphas@gmail.com>"&committer-date=${dateRangeString}`,
    // q: `hash=4b78cfacec8d030ae06ab04f3f7a859e6a480a05`, /* gives a result */
    // q: `hash=4b78cfacec8d030ae06ab04f3f7a859e6a480a05&committer-date=${dateRangeString}` /* gives a result */,
    // q: `hash=4b78cfacec8d030ae06ab04f3f7a859e6a480a05&committer-date=${dateRangeString}&author-name="Douglas Naphas"` /* gives a result */,
    // q: `hash=4b78cfacec8d030ae06ab04f3f7a859e6a480a05&committer-date=${dateRangeString}&author-name="Douglas Naphas"` /* got results */,
    // q: `committer-date=${dateRangeString}&author-name="Douglas Naphas"` /* no results, only difference is no hash */,
    // q: `repo="douglasnaphas/madliberation"&committer-date=${dateRangeString}&author-name="Douglas Naphas"`, /* no results */
    // q: `repo="douglasnaphas/madliberation"&committer-date=${dateRangeString}&author-name="Douglas Naphas"&hash=4b78cfacec8d030ae06ab04f3f7a859e6a480a05` /* got results */,
    // q: `repo="douglasnaphas/madliberations"&committer-date=${dateRangeString}&author-name="Douglas Naphas"&hash=4b78cfacec8d030ae06ab04f3f7a859e6a480a05` /* no results, deliberate misspell of repo name */,
    // q: `user="douglasnaphas"&committer-date=${dateRangeString}&author-name="Douglas Naphas"&hash=4b78cfacec8d030ae06ab04f3f7a859e6a480a05`, /* got results */
    q: `user="douglasnaphas"&committer-date=${dateRangeString}&author-name="Douglas Naphas"`,

    mediaType: { previews: ["cloak"] },
  });
  return response;
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
}
