# Nextion

Notion Databaseのボードビューで、ランダムに次のページを選択するNotion Integrationです。

[![Nextion-logo](https://github.com/tam-bourine/Nextion/blob/main/docs/images/Nextion-log.png)](https://github.com/tam-bourine/Nextion/blob/main/docs/images/Nextion-log.png)

[README: US 🇺🇸 ](https://github.com/tam-bourine/Nextion/blob/main/READMEP.md)

# 使用方法

1. [こちら](https://developers.notion.com/)をクリックして、 Notion の API キーを取得します。
1. 各ユースケースに応じた環境値を設定します。次のセクションでは、ローカルとGitHub Actions で動かす場合の環境変数の設定方法を記述しています。
1. Notion データベースのプロパティ設定を確認します。デフォルトでは、`src/Config.ts`に定数が定義されています。変更したい場合はお好きにどうぞ。
1. cronジョブの設定を確認します。デフォルトでは、`github/workflows/{chooseNext, watchDone, fetchIcon}.yaml` に以下の Cron 値が定義されている。
    - chooseNext: '*/1 * * * *'
    - watchDone: '*/10 * * * *'
    - fetchIcon: '*/1 * * * *'

## 環境変数の設定方法

### ローカルで使用する場合

1. `$ cp .env.example .env`
1. 各環境値を設定する。
### GitHub Actions で使用する場合

1. このリポジトリをフォークまたはクローンします(フォークを強く推奨)
1. リポジトリの Secrets 設定に移動し、シークレットを追加します。参考：[暗号化された秘密](https://docs.github.com/en/actions/security-guides/encrypted-secrets) サンプル画像は以下をご覧ください。
    [![GitHub Actionsの秘密](https://github.com/tam-bourine/Nextion/blob/main/docs/images/github-setttings-Secrets.png)](https://github.com/tam-bourine/Nextion/blob/main/docs/images/github-setttings-Secrets.png)

# 注意事項

## Spec

### Choose Next

1. データベースから全ページを取得する
1. ユースケースでステータスでグループ化する
1. Status が空の人がいなければ、何もしない。
1. Status が空のページをランダムに1つ選び、そのページをNEXTに設定する。

### Watch Done

1. データベースから全ページを取得
1. ユースケースのステータスでグループ化する
1. 少なくとも一つの空 Status が存在する場合、何もしない。
1. 完了したすべてのページのステータスを空にする

### Fetch Icon

1. データベースから全ページを取得する
割り当て（Notion の person プロパティタイプ）から、アイコンの URL を取得する。
1. ページカバーにアイコン url を設定する


# 参考

- [Notion API BETAで構築開始](https://developers.notion.com/)
- [GitHub Actions](https://github.co.jp/features/actions)