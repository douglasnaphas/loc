# loc
Lines of code for the current user from GitHub.

## Examples
```
$ npx @douglasnaphas/loc --help
Usage: loc [options]

Print info about lines of code contributed to GitHub by the authenticated GitHub user. Prints something like:
[{"owner":"douglasnaphas","repo":"loc","ref":"9b6704d47d86e9733816023c8c53f4b976fc97a0","stats":{"additions":220,"deletions":0}}]

Options:
  -V, --version                output the version number
  -t, --token-file <PATH>      Path to a GitHub authentication token, see https://developer.github.com/v4/guides/forming-calls/#authenticating-with-graphql
  -b, --beginning-date <DATE>  Query starting from this date, ISO format like '2021-06-01', default 30 days ago
  -e, --end-date <DATE>        Query up through this date, ISO format like '2021-06-30', default today
  -h, --help                   display help for command

$ # how many lines of code did I add from August 26th through August 29th in 2021?

$ npx @douglasnaphas/loc -t /path/to/github-personal-access-token -b '2021-08-26' -e '2021-08-29' | jq 'map(.stats.additions)[]' | awk '{s += $1} END {print s}'
7386

$ npx @douglasnaphas/loc -t /path/to/github-personal-access-token -b '2021-08-26' -e '2021-08-29' | jq '.'
[
  {
    "owner": "douglasnaphas",
    "repo": "loc",
    "ref": "9b6704d47d86e9733816023c8c53f4b976fc97a0",
    "stats": {
      "additions": 220,
      "deletions": 0
    }
  },
  {
    "owner": "douglasnaphas",
    "repo": "loc",
    "ref": "52b7eec327bf355ba681aba74b274c42017c9e02",
    "stats": {
      "additions": 0,
      "deletions": 151462
    }
  },
  {
    "owner": "douglasnaphas",
    "repo": "loc",
    "ref": "57e372eed996735579bb1ec36896934a21a7b87e",
    "stats": {
      "additions": 1,
      "deletions": 0
    }
  },
  {
    "owner": "douglasnaphas",
    "repo": "loc",
    "ref": "e960a038d8a6d9b5dfcdc471c5306a57b3dfbd48",
    "stats": {
      "additions": 2984,
      "deletions": 5845
    }
  },
  {
    "owner": "douglasnaphas",
    "repo": "loc",
    "ref": "662c5a7c10e38af96a0efce30eff8ee11c444006",
    "stats": {
      "additions": 4164,
      "deletions": 665
    }
  },
  {
    "owner": "douglasnaphas",
    "repo": "madliberation",
    "ref": "4b78cfacec8d030ae06ab04f3f7a859e6a480a05",
    "stats": {
      "additions": 6,
      "deletions": 0
    }
  },
  {
    "owner": "douglasnaphas",
    "repo": "madliberation",
    "ref": "ab720ad9a83a1e1660e2bbcf95c7a8ac7791e8d4",
    "stats": {
      "additions": 6,
      "deletions": 0
    }
  },
  {
    "owner": "douglasnaphas",
    "repo": "madliberation",
    "ref": "3e1debf4a01f6f5d93a474f8584db7057c2ccf5b",
    "stats": {
      "additions": 5,
      "deletions": 5
    }
  }
]

```
