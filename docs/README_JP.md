# Nextion

Notion Database で、ランダムに次のページを選択する Notion Integration です。

[![Github issues](https://img.shields.io/github/issues/75asa/Nextion)](https://github.com/75asa/Nextion/issues)
[![Github forks](https://img.shields.io/github/forks/75asa/Nextion)](https://github.com/75asa/Nextion/network/members)
[![Github stars](https://img.shields.io/github/stars/75asa/Nextion)](https://github.com/75asa/Nextion/stargazers)
[![Github top language](https://img.shields.io/github/languages/top/75asa/Nextion)](https://github.com/75asa/Nextion/)
[![Github license](https://img.shields.io/github/license/75asa/Nextion)](https://github.com/75asa/Nextion/)

![Nextion-logo](images/Nextion-log.png)

[README: US 🇺🇸](../README.md)

# 使用方法

1. [Notion Developers](https://developers.notion.com/) で Integration を作成して API キーを取得し、対象のデータベースを Integration に共有します。
1. 環境変数を設定します（下記参照）。ローカルと GitHub Actions のどちらでも使えます。
1. Notion データベースのプロパティを確認します。デフォルトのプロパティ名は `Name`（タイトル）、`Status`（セレクト）、`Assign`（ユーザー）です。環境変数で変更できます。
1. `.github/workflows/{chooseNext,watchDone,fetchIcon}.yaml` の cron 設定を確認します（時刻は UTC）。
    - chooseNext: `30 1 * * 1`（毎週月曜 10:30 JST）
    - watchDone: `*/10 * * * *`
    - fetchIcon: `*/10 * * * *`

    現在、スケジュールはコメントアウトして停止中です（#65 参照）。各 workflow は Actions タブから手動実行（`workflow_dispatch`）もできます。

## 必要な環境

- Node.js 24（`.nvmrc` 参照）
- pnpm（バージョンは `package.json` の `packageManager` で固定。`corepack enable` するか pnpm を各自インストールしてください）

## 環境変数

| 名前 | 必須 | デフォルト | 説明 |
|---|---|---|---|
| `NOTION_KEY` | ✅ | | Notion Integration の API キー |
| `NOTION_DATABASE_ID` | ✅ | | 対象データベースの ID |
| `NOTION_DATA_SOURCE_ID` | | | データソース ID。データベースに複数のデータソースがある場合のみ必要（Notion API 2025-09-03 以降） |
| `NOTION_NAME_PROP` | | `Name` | タイトルプロパティ名 |
| `NOTION_STATUS_PROP` | | `Status` | ステータスのセレクトプロパティ名（`Next` / `Done` / `NoTarget` / 空） |
| `NOTION_ASSIGN_PROP` | | `Assign` | ユーザープロパティ名 |
| `NOTION_NO_IMAGE_URL` | | [NO_IMAGE.png](images/NO_IMAGE.png) | 担当者にアバターがないときのカバー画像 |

### ローカルで使用する場合

1. `cp .env.example .env` して各値を設定します。
1. `pnpm install`
1. いずれかのモードで実行します。
    - `pnpm dev:chooseNext` / `pnpm dev:watchDone` / `pnpm dev:fetchIcon`（tsx で TypeScript を直接実行）
    - または `pnpm build` のあと `pnpm start:chooseNext` など

### GitHub Actions で使用する場合

1. このリポジトリをフォーク（強く推奨）またはクローンします。
1. リポジトリの Secrets 設定で `NOTION_KEY` と `NOTION_DATABASE_ID` を追加します。
1. （任意）プロパティ名やアバターなし時の画像を変えたい場合は、上の任意の環境変数を同じ名前で Secrets に追加します。すべての workflow に渡され、未設定のものはデフォルト値になります。

参考: [GitHub Actions でのシークレットの使用](https://docs.github.com/ja/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)

![GitHub Actions Secrets](images/github-setttings-Secrets.png)

注意: リポジトリに 60 日間動きがないと、GitHub がスケジュール実行の workflow を自動で無効化します。必要に応じて Actions タブから再度有効化してください。

# 開発

| コマンド | 内容 |
|---|---|
| `pnpm lint` / `pnpm lint:fix` | Biome による lint・フォーマットチェック（`:fix` は安全な修正を適用） |
| `pnpm typecheck` | TypeScript の型チェック |
| `pnpm test` | Vitest でテスト実行 |
| `pnpm build` | `dist/` にビルド |

# 備考

## Spec

### Choose Next

1. データベースから全ページを取得する。
1. ステータスでグループ化する。
1. Status が空のページがなければ、何もしない。
1. Status が空のページをランダムに1つ選び、そのステータスを `Next` にする。

### Watch Done

1. データベースから全ページを取得する。
1. ステータスでグループ化する。
1. Status が空のページが1つでもあれば、何もしない。
1. `Done` のページすべてのステータスを空にする。

### Fetch Icon

1. データベースから全ページを取得する。
1. 担当者（Notion のユーザープロパティ）のアイコン URL を取得する。
1. ページカバーにそのアイコン URL を設定する。

# 参考

- [Notion Developers](https://developers.notion.com/)
- [GitHub Actions](https://github.com/features/actions)

# Contributors

- [75asa](https://github.com/75asa)
- [k-gen](https://github.com/k-gen)
