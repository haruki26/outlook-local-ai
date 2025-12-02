# 検索エンジン処理仕様書  
Version: 1.0  
Last Updated: 2025-12-02  

本ドキュメントは、Outlook Add-in 内で動作する  
**意味拡張型検索エンジン（Semantic Expansion Search Engine）** の  
内部処理仕様を記述する。

---

## 1. 概要

本検索エンジンは、ユーザーが入力した検索語に対し、  
埋め込みモデル（ruri v3 70M）を用いて  
**意味的に近い概念方向を自動補完した検索ベクトル**を生成し、  
ベクターストア上のメールデータを検索する。

特徴：

- テキスト検索 + 意味検索（埋め込み）のハイブリッド  
- 生成 AI 不使用（埋め込みのみ）  
- 関連概念を抽出して検索範囲を自然に拡張  
- 各メールのヒット理由を説明可能  
- Add-in のパフォーマンス制約に対応した軽量構成  

---

## 2. 入力 / 出力

### 2.1 入力

| フィールド | 型 | 説明 |
|----------|------|------|
| query_text | string | ユーザーが入力した検索語 |
| k_neighbors | number | 近接する関連概念の抽出数（例: 3〜5） |
| top_n | number | 返却する検索結果数 |
| filter_tags (任意) | string[] | タグによるメタデータフィルタ |

---

### 2.2 出力

| フィールド | 型 | 説明 |
|----------|------|------|
| results | ResultItem[] | 類似メールの配列 |
| expanded_concepts | string[] | 抽出された関連概念ラベル |
| search_vector | float[] | 最終的に使用した検索ベクトル |
| note | string | 「意味拡張を行いました」等の説明文 |

#### ResultItem

| フィールド | 型 | 説明 |
|----------|--------|------|
| mail_id | string | メールのID |
| subject | string | 件名 |
| summary | string | 本文要約（既存機能） |
| score | number | 類似度（0〜1） |
| reason | string | ヒット理由（1行） |

---

## 3. 処理フロー（全体）

```

┌──────────────┐
│ 1. query_text を embedding │
└──────────────┘
↓
┌─────────────────────────────┐
│ 2. 概念ベクトル群との類似度を計算 │
└─────────────────────────────┘
↓
┌────────────────────────────┐
│ 3. 上位 k_neighbors の概念を抽出 │
└────────────────────────────┘
↓
┌──────────────────────────────┐
│ 4. 概念ベクトルを加重して検索ベクトル生成 │
└──────────────────────────────┘
↓
┌──────────────────────────┐
│ 5. ベクターストアにクエリ実行 │
└──────────────────────────┘
↓
┌──────────────────────────────┐
│ 6. 各メールに「理由」を自動生成 │
└──────────────────────────────┘
↓
┌──────────────┐
│ 7. 結果を返す │
└──────────────┘

```

---

## 4. 処理詳細仕様

---

### 4.1 Step 1: 検索語の embedding

```

query_vec = embedding(query_text)

```

- モデル：ruri v3 70M  
- 正規化（L2 norm）を行う  

---

### 4.2 Step 2: 概念ベクトル集合との類似度計算

```

for each concept_vector in concept_vectors:
compute cosine_similarity(query_vec, concept_vector)

```

- 概念ベクトルは 50〜200 個程度を想定  
- 上位 k 個を抽出（例：5）  

```

expanded_concepts = top_k(concept_vectors, k_neighbors)

```

---

### 4.3 Step 3: 検索ベクトル生成

以下のいずれかの方法を選択可能（推奨は方式 A）

#### 方式 A: 加重平均方式

```

weights = [0.7 (query), 0.3/k * concept]
search_vec = normalize(
query_vec * 0.7 + sum(concept_vecs * (0.3/k))
)

```

#### 方式 B: 複数ベクトルで上限重複ヒット方式

```

candidate_results = union(
vector_search(query_vec),
vector_search(concept_vec1),
vector_search(concept_vec2),
...
)

```

---

### 4.4 Step 4: ベクターストア検索

```

results = vectorDB.similarity_search(search_vec, top_n, filter=filter_tags)

```

- DB：CosmosDB / Chroma  
- filter_tags を同時適用可能  
- 類似度（cosine）も返却される  

---

### 4.5 Step 5: ヒット理由自動生成

埋め込み由来の関連概念からテンプレで生成。

```

reason = "「{concept1}」「{concept2}」に意味的に近いためヒットしました"

```

生成処理は「テンプレ挿入のみ」で LLM は使わない。

---

### 4.6 Step 6: 出力整形

- results  
- expanded_concepts（UI に表示するチップ）  
- search_vector（デバッグ用）  
- note（検索拡張の有無）

```

return {
results,
expanded_concepts,
search_vector,
note: "意味拡張検索を行いました"
}

```

---

## 5. パフォーマンス要件

| 処理 | 目標時間 |
|--------|----------|
| embedding(query) | 50〜150ms |
| 概念ベクトルとの類似度計算 | <10ms |
| 加重ベクトル生成 | <1ms |
| ベクターストア検索 | 200〜500ms |
| 結果整形 | <5ms |
| **トータル** | **300〜700ms** |

Add-in で十分許容可能。

---

## 6. エラー処理

### 6.1 検索語が空の場合
```

return empty

```

### 6.2 embedding 生成失敗
```

fallback → テキスト検索だけ実行

```

### 6.3 ベクターストア接続エラー
```

エラーメッセージを返す

```
