保存するPDFの命名記法
・日本語および全角文字の入力は禁止（表示はされるが，メタデータは読み込めない）
・アルファベットでも途中の半角空白文字は許容されない
・受け付ける命名記法の例（a.pdf, apple.pdf, appleBanana.pdf・・・）

開発中の注意点
・src配下が基本的な開発環境
・mainがバックエンド，rendererがフロントエンド（Reactベース）を担当する．
・commonでは，共通の型（TypeScriptのため）を設定できる．

・rendererにはcomponentとpagesが存在する．基本的に画面遷移用の全体画面はpagesにある．
componentではpagesで直書きし過ぎないようにUIを部品的に保管している．

・mainにはfunctionsという特定のバックエンドの処理（Djangoとかならサービス？）を記述している．最終的にmain.tsがエントリーポイントとなっているため，そこに展開していく．

・ipc通信（よくわかっていないけど，mainとrendererを繋ぐ処理のこと）の設定はpreload.tsに記述されている．そこまで難しい書き方はされてない．だいたいJSONに近い書き方で書いていくようである．

・rendererのエントリーポイントはindex.tsx

・App.tsxがindexの一番上に書いてある．（ここはReactと同じ）

・デスクトップアプリのアイコンや名前などはindex.ejsに記載する．

2023/12/01

### 現状の改善すべき点について

- 自動保存機能がないこと．
- 論文メモのUIがくそなこと．（保存とMDプレビューの切り替え/見栄え/横線の撤廃）
- HOMEで直接ファイル操作が出来ないこと（Deleteボタンだけ用意してるけど）
- 上記に加えて，ファイルを直接アップロードできる機能（ドラックアンドドロップで）
- 作業ディレクトリを切り替える機能（Settingsにはあるけど．HOMEにはない）
- 検索機能
- リスト化（index作成）の機能
- ファイル操作に関連して，PDFをアプリ内もしくは，ブラウザ側で開く機能．
- アプリからファイルエクスプローラーを開く機能（MEMO・PDFを直接触れるように）
- WordCloud
- 共有機能（ログインはなしかな，もしくはGoogleアカウントのみ）
- ハンバーガーメニューの表示位置がおかしい（z-indexで調整？）

-

### 実装できている機能について

- 作業ディレクトリを複数保存しておける機能
- メモのテンプレートを一つだけ登録しておける機能
- 作業ディレクトリの初回起動時（HOMEに遷移時）にMemoディレクトリを作成すること．
- 上記と同時にすべてのPDFファイルに対応した.txtファイルを作成すること
- 論文メモの簡易保存機能

-

### 解決した項目

- 論文メモを変更後，別の項目にアクセスしてもメモが切り替わらないこと．
