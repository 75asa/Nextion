# Nextion

Pick a page at random in Notion.

# How to use

# Notes

# Spec

## Next 選出

1. データベースから全ページ取得
2. ユースケースで、ステータスごとにグループバイ
3. Status が空のページからランダムに一つを選出し、ステータスを NEXT に

## カードのプロフィール

1. cron で定期実行
2. アサイニーのユーザ（複数いたら最初）の icon_url をページの cover にする

## すべて DONE になったか監視

1. cron で定期実行
2. データベースから全ページ取得
3. ユースケースで、ステータスごとにグループバイ
4. Status が全て DONE もしくは UNCHOOSABLE になっているかチェック
5. なっていたら DONE のページのステータスを消す

# FYI
