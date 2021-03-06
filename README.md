# Nextion

This is a Notion Integration to pick a next page at random for a Notion Database.

[![Github issues](https://img.shields.io/github/issues/tam-bourine/Nextion)](https://github.com/tam-bourine/Nextion/issues)
[![Github forks](https://img.shields.io/github/forks/tam-bourine/Nextion)](https://github.com/tam-bourine/Nextion/network/members)
[![Github stars](https://img.shields.io/github/stars/tam-bourine/Nextion)](https://github.com/tam-bourine/Nextion/stargazers)
[![Github top language](https://img.shields.io/github/languages/top/tam-bourine/Nextion)](https://github.com/tam-bourine/Nextion/)
[![Github license](https://img.shields.io/github/license/tam-bourine/Nextion)](https://github.com/tam-bourine/Nextion/)

[![Nextion-logo](https://github.com/tam-bourine/Nextion/blob/main/docs/images/Nextion-log.png)](https://github.com/tam-bourine/Nextion/blob/main/docs/images/Nextion-log.png)

[README: JP 🇯🇵 ](https://github.com/tam-bourine/Nextion/blob/main/docs/README_JP.md)
# How to use

1. click [here](https://developers.notion.com/) to get a Notion API key.
1. set environment value to each use case. below section is for local & GitHub Actions.
1. confirm your Notion Database property setting. by default, it's defined constant values on `src/Config.ts`. if you wanna change key or value, you can change it.
1. confirm cron job setting. by default, it's defined constant expression values on `github/workflows/{chooseNext, watchDone, fetchIcon}.yaml`
    - chooseNext: '*/1 * * * *'
    - watchDone: '*/10 * * * *'
    - fetchIcon: '*/1 * * * *'

## How to set environment value

### When using on Local

1. `$ cp .env.example .env`
1. set each environmental value.
### When using on GitHub Actions

1. fork or clone this repository.(highly recommend fork)
1. move your repository Secrets settings and add your secret.

FYI: [Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

sample images see below.

[![GitHub Actions Secrets](https://github.com/tam-bourine/Nextion/blob/main/docs/images/github-setttings-Secrets.png)](https://github.com/tam-bourine/Nextion/blob/main/docs/images/github-setttings-Secrets.png)

# Notes

## Spec

### Choose Next

1. get all pages from database
1. group by status in use case
1. if nobody empty Status, nothing to do
1. randomly select one of the pages with empty Status and set its status to NEXT.

### Watch Done

1. get all pages from database
1. group by status in use case
1. if at least exist empty Status, nothing to do
1. set all done pages status to empty

### Fetch Icon

1. get all pages from a database
1. get icon url from a assign (person property type on Notion)
1. set page cover with icon url


# FYI

- [Start building with the Notion API BETA](https://developers.notion.com/)
- [GitHub Actions](https://github.co.jp/features/actions)

# Contributors

- [75asa](https://github.com/75asa)

- [k-gen](https://github.com/k-gen)
