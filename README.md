# Nextion

Pick a page at random in Notion by using Table View.

[![Nextion-logo](image-url)](link)

# How to use

1. `$ cp .env.example .env`
1. click [here](https://developers.notion.com/) to get a Notion API key.

## When using on Local
1. set environment value
   1. to `.env` when running on your local environment.
   1. to your GitHub Repository Secrets settings when running on GitHub Actions.
      - FYI: https://docs.github.com/en/actions/security-guides/encrypted-secrets
# Notes

## Spec

### Select Next

1. get all pages from database
1. group by status in use case
1. Randomly select one of the pages with empty Status and set its status to NEXT.
### Card Profile

1. Periodic execution by cron
1. Make the icon_url of the async user (or the first if there are more than one) the cover of the page.

### Monitor if all are DONE

1. Periodic execution by cron
1. fetch all pages from database
1. group by status in use case
1. check if all Status are DONE or NoStatus
1. delete the status of DONE pages if any

# FYI
