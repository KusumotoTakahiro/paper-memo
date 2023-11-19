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
