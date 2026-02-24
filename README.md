# DISC SHELF 🎵

3Dバイナルレコード風UIの**ポータルサイト**。  
自分が作ったWebアプリを「ディスク」として棚に並べ、クリックで起動できます。

🔗 **Live**: <https://junia2009.github.io/disc-shelf/>  
📦 **Repo**: <https://github.com/junia2009/disc-shelf>

---

## 特徴

| 機能 | 説明 |
|------|------|
| **3D カルーセル** | Three.js で描画されたバイナルレコードが棚を回転 |
| **モーダル確認** | ディスクをクリックすると同一ページ内で起動確認モーダルを表示 |
| **オーロラ背景** | CSS グラデーションアニメーションで幻想的な光 |
| **きらめく星** | 500個のマルチカラー星が個別に明滅（Additive Blending） |
| **流れ星** | 2〜6秒間隔でランダムに出現、尾を引いてフェードアウト |
| **PWA 対応** | iPhone ホーム画面にアプリとして追加可能 |

---

## 技術スタック

- **Three.js** r128（CDN）— 3D レンダリング
- **Vanilla JS**（フレームワークなし）
- **Google Fonts** — Orbitron / Noto Sans JP
- **GitHub Pages** — ホスティング

---

## ディスク（アプリ）の追加方法

新しいWebアプリを作ったら、`app.js` の **`DISCS` 配列**にオブジェクトを1つ追加するだけです。

### 手順

1. `app.js` を開く
2. `DISCS` 配列の末尾（`// --- 今後アプリを作るたびに追加 ---` の直前）に以下を追加:

```js
{
  id: 'my-new-app',           // 一意のID（英数字・ハイフン）
  name: 'アプリ名',            // 表示名
  description: 'アプリの説明',  // モーダルに表示される説明文
  color: '#FF9F43',           // ディスクのテーマカラー（HEX）
  url: 'https://〜',          // アプリの公開URL
  repo: 'https://github.com/〜', // GitHubリポジトリURL
  tags: ['HTML', 'tool'],     // タグ（配列）
},
```

3. コミット＆プッシュ

```bash
git add -A
git commit -m "feat: 〇〇アプリ追加"
git push
```

### 現在のディスク一覧

| ディスク | 色 | タグ |
|---------|-----|------|
| DISC SHELF | `#6C63FF` 🟣 | Three.js, Portal, PWA |
| My タイマー | `#FF6584` 🩷 | JS, tool |
| GROWモデルシート | `#00C9A7` 🟢 | HTML, tool |

### 色の選び方のコツ

既存ディスクと被らない色を選ぶと見栄えが良くなります。参考:

- 🟣 紫系: `#6C63FF` （使用済み）
- 🩷 ピンク系: `#FF6584` （使用済み）
- 🟢 エメラルド: `#00C9A7` （使用済み）
- 🟠 オレンジ: `#FF9F43`
- 🟡 イエロー: `#FFC312`
- 🔵 シアン: `#00D2FF`
- 🔴 レッド: `#EE5A24`

---

## ファイル構成

```
message_folder/
├── index.html      … メインHTML
├── styles.css      … スタイルシート（オーロラ背景含む）
├── app.js          … Three.js + ロジック（DISCS配列もここ）
├── manifest.json   … PWAマニフェスト
├── icon.png        … アプリアイコン
└── README.md       … このファイル
```

---

## ローカルで動かす

```bash
npx serve .
# → http://localhost:3000 で開く
```

---

## ライセンス

MIT
