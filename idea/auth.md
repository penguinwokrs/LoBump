

WebでのVCを実装計画を立ててください。
コミット単位は要件を単位としてコミットしてください。
テストはそれぞれ書くこと。

## 前提
技術スタック
メインはcloudflare

- Store機能: Cloudflare Workers KV

## 要件

### サイトのログイン機能実装
ユーザーを識別するためにRiot Sign-On を使って実装してください。


#### 詳細
- clientID        = "oujzg5jiibvzo",
- clientSecret    = "",
- provider        = "https://auth.riotgames.com",
- authorizeUrl    = provider + "/authorize",
- tokenUrl        = provider + "/token";