import { AxiosResponse } from "axios";
const axios = require("axios");
exports.loc = () => {
  console.log("loc");
};
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
exports.print_user = async (token: string) => {
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

const f1: (token: string) => string = (token: string) => "not implemented";
const f2: (token: string) => Promise<string> = async (token: string) =>
  "not implemented";
exports.checkTokenScope = async (token: string) => "not implemented";
