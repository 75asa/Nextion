# Nextion

This is a randomly choosing next page for the board view of Notion Database.

[![Nextion-logo](image-url)](link)

# How to use

1. click [here](https://developers.notion.com/) to get a Notion API key.
1. set environment value to each use case. below section is for local & GitHub Actions.
1. confirm your Notion Database property setting. by default, it's defined constant values on `src/Config.ts`. if you wanna change key or value, you can change it.
1. confirm cron job setting. by default, it's defined constant expression on `github/workflows/{chooseNext, watchDone, fetchIcon}.yaml`
    - chooseNext: '*/1 * * * *'
    - watchDone: '*/10 * * * *'
    - fetchIcon: '*/1 * * * *'

## When using on Local

1. `$ cp .env.example .env`
1. set each environmental value.
## When using on GitHub Actions

1. fork or clone this repository.(highly recommend fork)
1. move your repository Secrets settings and add your secret. FYI: [Encrypted secrets
](https://docs.github.com/en/actions/security-guides/encrypted-secrets) sample images see below.
    [![GitHub Actions Secrets](image-url)](link)

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
