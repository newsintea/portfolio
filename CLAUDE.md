# Portfolio Project

## プロジェクト概要

Next.js 製のポートフォリオサイト。visited（旅行記録）、blog、profile セクションを持つ。

## Supabase 設定

- **env変数**:
  - `NEXT_PUBLIC_SUPABASE_URL` — Supabase プロジェクト URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — 公開キー（クライアント用）
  - `SUPABASE_SERVICE_ROLE_KEY` — サービスロールキー（書き込み・スクリプト用）
- **Storage バケット**: `trip-photos`
- **Storage パス形式**: `trips/{trip-id}/{filename}.jpg`
- **公開URL形式**: `{SUPABASE_URL}/storage/v1/object/public/trip-photos/trips/{trip-id}/{filename}.jpg`

## DB スキーマ（Visited）

```
trips
  id          text PK         例: "hakata-saga-2025"
  title       text            例: "博多・佐賀"
  started_at  date
  ended_at    date nullable
  color       text            hex color 例: "#6B7280"
  prefectures text[] nullable 例: ["福岡県", "佐賀県"]
  companions  text[] nullable
  memo        text nullable

locations
  id           uuid PK
  name         text
  lat          float8
  lng          float8
  prefecture   text nullable
  category_ids uuid[]         → categories.id の配列

categories
  id    uuid PK
  name  text
  color text nullable
  icon  text nullable

visits
  id          uuid PK
  location_id uuid → locations.id
  trip_id     text → trips.id
  visited_at  date nullable
  memo        text nullable
  rating      int  nullable
  is_public   bool
  sort_order  int

photos
  id         uuid PK
  visit_id   uuid → visits.id
  url        text            Storage 公開URL
  caption    text nullable
  sort_order int
```

## カテゴリ UUID マスタ

| カテゴリ | UUID |
|---------|------|
| 自然    | b355f055-9537-4b0f-9e16-4751e943b3df |
| グルメ  | 7cf403fd-31d7-408a-b000-597e500963bf |
| ホテル  | 338ff88c-a8c8-4abe-b86e-808a7bde72b8 |
| 寺・神社 | 3c140546-df39-448e-9922-892524469610 |
| 観光   | 0d7ba138-bdb6-49ee-b7af-c01f25954db2 |
| 温泉   | a904c33f-d8a9-4243-a4d4-cb7c1fcb9dc1 |

## 写真変換

- **形式**: HEIC → JPEG（Storage には JPEG のみアップロード）
- **変換コマンド**: `sips -s format jpeg {input} --out {output}.jpg`（macOS 標準）

## スキル

- `/register-trip` — 新規旅行を写真EXIFから一括登録（Insert専用）
- `/edit-trip` — 既存データの編集・写真追加（Update/Insert）

## 単純な1行修正について

場所名・日付・色などの単純フィールド修正は Supabase MCP の `execute_sql` を直接使えばよい。
スキルを使わなくてよい。

```sql
-- 例: 場所名を修正
UPDATE locations SET name = '正しい名前' WHERE id = 'uuid';

-- 例: tripの色を変更
UPDATE trips SET color = '#FF6B6B' WHERE id = 'hakata-saga-2025';
```
