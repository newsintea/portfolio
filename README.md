# newsintea Portfolio

Next.js + TypeScript で構築した個人ポートフォリオ & ブログサイトです。

## Tech Stack

| カテゴリ | 技術 |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Blog | MDX (next-mdx-remote + gray-matter) |
| Dark Mode | next-themes |
| Font | Geist (next/font) |

## Directory Structure

```
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # ルートレイアウト (Header/Footer/ThemeProvider)
│   │   ├── page.tsx                  # トップページ (プロフィール/スキル/最新記事)
│   │   ├── globals.css               # グローバルスタイル + shadcn CSS変数
│   │   └── blog/
│   │       ├── page.tsx              # ブログ一覧 (Tech/Poem タブ切り替え)
│   │       └── [slug]/page.tsx       # ブログ記事ページ (MDX レンダリング)
│   │
│   ├── components/
│   │   ├── Header.tsx                # ナビゲーションヘッダー
│   │   ├── Footer.tsx                # フッター (GitHub/X リンク)
│   │   ├── SkillCard.tsx             # スキルカテゴリ表示カード
│   │   ├── BlogCard.tsx              # ブログ記事プレビューカード
│   │   ├── BlogTabs.tsx              # Tech/Poem タブ切り替え
│   │   ├── ThemeProvider.tsx         # ダークモード Provider
│   │   ├── ThemeToggle.tsx           # テーマ切り替えボタン
│   │   └── ui/                       # shadcn/ui コンポーネント
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── separator.tsx
│   │       └── tabs.tsx
│   │
│   └── lib/
│       ├── blog.ts                   # MDX ファイル読み込み・メタデータ解析
│       ├── blog-types.ts             # ブログ関連の型定義・カテゴリ定数
│       └── utils.ts                  # cn() ユーティリティ
│
├── content/
│   └── blog/                         # ブログ記事 (MDX)
│       ├── hello-world.mdx
│       ├── react-hooks-tips.mdx
│       └── why-i-code.mdx
│
├── public/                           # 静的ファイル
├── next.config.ts                    # Next.js 設定 (画像リモートパターン等)
├── components.json                   # shadcn/ui 設定
├── tsconfig.json
└── package.json
```

## Getting Started

```bash
npm install
npm run dev
```

http://localhost:3000 で開発サーバーが起動します。

## Blog

`content/blog/` に MDX ファイルを追加するだけで記事が公開されます。

```mdx
---
title: "記事タイトル"
date: "2026-02-24"
description: "記事の概要"
category: "tech"       # "tech" または "poem"
---

本文を Markdown で記述...
```

- ファイル名がそのまま URL のスラッグになります (`hello-world.mdx` → `/blog/hello-world`)
- `category` で Tech / Poem タブの振り分けが決まります

## Deploy

Vercel へのデプロイを推奨します。

```bash
# GitHub にリポジトリを作成して push
gh repo create newsintea/portfolio --public --source=. --push
```

Vercel でリポジトリを連携すれば、`main` ブランチへの push で自動デプロイされます。
