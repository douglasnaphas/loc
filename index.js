import { AxiosResponse } from "axios";
const axios = require("axios");
exports.loc = () => {
  console.log("loc");
};
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
exports.print_user = async (token) => {
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
    .then((r) => {
      console.log(JSON.stringify(r.data));
    })
    .catch((err) => {
      console.error(`problem encountered getting the user`);
      console.error(err.message);
      process.exit(1);
    });
};

exports.checkTokenScope = async (token) => "not implemented";
