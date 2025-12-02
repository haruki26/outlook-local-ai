# 意味拡張検索機能 実装計画（FastAPI ローカル + Chroma 前提）

## 1. 目的とスコープ
- docs/new_feature.md で定義された Semantic Expansion Search（関連概念チップ表示・ヒット理由表示）を、**ローカル FastAPI サーバー上**で完結させる。
- 既存の **Chroma ベクターストア**を検索基盤とし、必要に応じてコレクション分割・再構築を行う。
- Add-in からの検索体験に影響するバックエンド処理フロー・API・UI を段階的に整備し、LLM 生成を使わずに ruri v3 70M embedding のみで要件を満たす。

## 2. 前提・依存関係
1. FastAPI アプリは `server/app/main.py` でローカル起動し、Add-in から HTTP 経由でアクセスできる。
2. Chroma はローカルで稼働済み（永続パス：`server/database/vector_store/` 想定）。コレクションの追加・分割は開発チームで実施可能。
3. ruri v3 70M embedding 推論はローカル OpenVINO 実装で 50–150ms 程度を維持できる。
4. 概念ベクトルセットは静的資産として用意し、必要に応じて Chroma 内の専用コレクション or SQLite/JSON で管理する。
5. ユーザーが登録したメールのみを対象にし、メール本文の自動取得は行わない。
6. ヒット理由文はテンプレート差し込みのみで生成。

## 3. アーキテクチャ方針
1. **データ層**
   - メール本文 embedding: 既存 Chroma コレクション（例: `mail_messages`）。
   - 概念ベクトル: `concept_vectors` コレクションを新設し label/embedding を格納。高速アクセスが必要ならメモリキャッシュ併用。
2. **アプリ層 (FastAPI)**
   - ルーター: `routers/ai.py` または新規 `routers/semantic.py` に `POST /semantic-search` を追加。
   - サービス: `services/semantic_search.py` で embedding → 概念抽出 → クエリ生成 → Chroma 検索を統合。
   - 設定: `app_conf.py` に Chroma コレクション名、TopN、重み付け方式を追加。
3. **フロント層 (Add-in)**
   - `taskpane/apiClient` に semantic search 呼び出しを追加。
   - `components/ConceptChips.tsx`（新規）などで関連概念 UI を実装し、クリックで再検索。
   - 結果カードにヒット理由 1 行を表示。

## 4. 設計論点
| 論点 | 方針案 |
|------|--------|
| 概念ベクトル永続化 | 初期は JSON + メモリロード。将来的に Chroma `concept_vectors` コレクションへ移行。 |
| 検索拡張方式 | デフォルトは「ユーザーベクトル + 関連概念ベクトル加重平均」。A/B テスト用に OR クエリも実装しフラグで切り替え。 |
| コレクション分割 | メール種別や権限で分割が必要な場合に備え、`collection_resolver` を実装して検索リクエストごとにコレクション名を決定。 |
| キャッシュ | 同一検索語の短期キャッシュ（例: 5 分）で embedding 計算を節約。 |
| モニタリング | FastAPI でリクエスト単位の所要時間/Top 概念をログ出力、パフォーマンス確認に活用。 |

## 5. フェーズ別タスク

### Phase 0: 現状調査と詳細設計 (1日) ✅完了（2025-12-02）
- [x] 既存 FastAPI ルート/サービスで検索を行っている箇所を洗い出し、再利用可能なコンポーネントを特定。
- [x] Chroma コレクション構造（スキーマ、メタデータ）を確認し、概念ベクトル用コレクション追加要否を決定。
- [x] ruri embedding 実行コードの性能を計測し、キャッシュ要件を定義。
- 成果物: 詳細設計メモ、Chroma コレクション設計図、API I/F 草案（`docs/log/phase0_20251202.md` に記録）。

- [x] **概念ラベル確定**: 初期セットは以下 5 件で固定し、日本語ラベルのみ登録。`請求・支払い` / `契約関連` / `進捗・状況` / `障害・問題` / `日程・会議` を `concept_collection` 用の独立モデルとして扱う（既存 Tag とは統合しない）。
- [ ] **データモデル整理**: `ConceptVector` はサーバー内部専用モデルとし、`concept_id`・`label`・`embedding`・`metadata(type="concept")` 等を保持。embedding は外部（API/フロント）に返さないポリシーをドキュメント化。
- [ ] **生成フロー計画**: 上記ラベルを入力に ruri embedding を生成するバッチ手順を `scripts/generate_concept_vectors.py` の仕様として整理。出力先（JSON or `concept_collection`）と再生成手順を明記。
- [ ] **ロード/同期設計**: FastAPI 起動時に概念データをロード→メモリキャッシュ→`concept_collection` と同期する流れを決定し、`app_conf.py` 設定値（概念データパス、コレクション名）を定義予定としてまとめる。
- 成果物: 概念ラベル仕様、ConceptVector データモデル、生成/同期手順メモ、Tag と概念モデルを分離する方針ドキュメント。

### Phase 2: 検索拡張サービス実装 (2日)
- [ ] `services/semantic_search.py` を新設し、以下を担当させる：
  1. ユーザー検索語 embedding（キャッシュ対応）。
  2. 概念ベクトルとの cosine 類似度計算と TopN 抽出。
  3. 加重平均ベクトル or OR クエリベクトルの生成。
  4. Chroma クエリ実行（必要なら複数コレクションを順次 or 並列検索）。
- [ ] 設定値（TopN、重み、Chroma コレクション名）を `app_conf.py` に追加し、.env から調整できるようにする。
- 成果物: Python 単体テストで概念抽出結果が期待通りになることを確認。

### Phase 3: FastAPI ルートとレスポンス整形 (1.5日)
- [ ] `routers/semantic.py` に `POST /semantic-search` を実装。入力: `query`, `collection_hint`, `top_k`, `expansion_mode` 等。
- [ ] レスポンスに `related_concepts`, `results[{subject, summary, reason}]`, `profiling{embedding_ms, chroma_ms}` を含め、クライアントで UI 制御しやすい形に整える。
- [ ] 例外時のハンドリング（Chroma ダウン、embedding 失敗）を 4xx/5xx で明示。
- 成果物: OpenAPI 更新、ルート単体テスト。

### Phase 4: フロントエンド統合 (2.5日)
- [ ] `taskpane/apiClient/semanticSearch.ts` を追加し、リトライ/タイムアウトを考慮した呼び出しを実装。
- [ ] 検索ページで関連概念チップ・説明文 UI を追加。クリック時は `query` に概念ラベルを付与して再度 API 呼び出し。
- [ ] ローディング、エラー表示、ヒット理由テンプレ差し込み（例: `理由: 「{X}」「{Y}」に意味的に近いためヒットしました`）。
- 成果物: Add-in 上で semantic search をトリガーできる状態。

### Phase 5: パフォーマンス／QA (2日)
- [ ] ベンチマークスクリプトで FastAPI（embedding + 検索）合計時間を測定し、ログを `logs/semantic_search.log` に記録。
- [ ] 代表的な検索語で E2E テストを実施し、関連概念・ヒット理由の妥当性をレビュー。
- [ ] Chroma コレクション分割案（例: `mail_messages_default`, `mail_messages_finance`）を検証し、必要ならマイグレーション手順をまとめる。
- 成果物: 計測レポート、QA チェックリスト、コレクション構成案。

### Phase 6: ドキュメント／リリース準備 (1日)
- [ ] `docs/new_feature.md` への追記または新設資料で API I/F、利用手順、既知制約を整理。
- [ ] `.env.sample` に semantic search 用の設定値を追加。
- [ ] ローカル FastAPI + Chroma 起動手順を README に明記し、チームが再現できるようにする。

## 6. WBS 風タスク一覧
| # | フェーズ | タスク | 担当 | 目安 |
|---|---------|--------|------|------|
| 1 | P0 | FastAPI 既存検索実装調査 | Backend | 0.5d |
| 2 | P0 | Chroma 構成確認・分割方針策定 | Backend | 0.5d |
| 3 | P1 | 概念ベクトル生成スクリプト | Backend/Data | 0.5d |
| 4 | P1 | 概念データロード/キャッシュ | Backend | 1d |
| 5 | P2 | 類似度計算 + 拡張ベクトル生成 | Backend | 1d |
| 6 | P2 | Chroma クエリ統合 & 設定化 | Backend | 1d |
| 7 | P3 | `/semantic-search` ルート実装 | Backend | 1d |
| 8 | P4 | API クライアント追加 | Frontend | 0.5d |
| 9 | P4 | 関連概念チップ UI | Frontend | 1d |
|10 | P4 | ヒット理由表示 & UX | Frontend | 1d |
|11 | P5 | パフォーマンス測定/ログ | QA/Backend | 1d |
|12 | P5 | コレクション分割検証 | Backend | 1d |
|13 | P6 | ドキュメント & .env 更新 | PM/Dev | 1d |

## 7. リスクと対策
- **Chroma コレクション肥大化**: コレクション分割やメタデータフィルタを用意し、用途別に最適化。
- **ローカル環境差異**: FastAPI/Chroma の起動スクリプトと依存バージョンを明文化し、`make semantic-search` 等のコマンドを整備。
- **embedding レイテンシ増**: キャッシュとバッチ化を検討。必要に応じて OpenVINO スレッド数を調整できる設定を expose。
- **UI 認知負荷**: 概念チップの説明テキストやツールチップで補足し、誤解を避ける。
- **データ鮮度不足**: メール登録後に確実に Chroma へ同期されるよう既存フローを確認、必要ならバッチ同期ジョブを整備。

## 8. 成果物チェックリスト
1. FastAPI: 概念ベクトルロード機構、semantic search サービス、API ルート、テスト。
2. Chroma: メールコレクションと概念コレクションの構成ドキュメント、分割方針。
3. Add-in: 関連概念 UI、ヒット理由表示、検索再実行フロー。
4. ドキュメント: API I/F、ベンチマーク結果、環境構築手順。

## 9. 次アクション
1. ConceptVector データモデル仕様（内部限定フィールド、メタデータ構造、保存フォーマット）のドラフトをまとめる。
2. 概念生成フロー（スクリプト仕様・入出力形式・再生成手順）を docs/log などに記述し、レビューを受ける。
3. 概念データロード/同期の設計メモを作成し、`concept_collection` の設定値案（コレクション名、保存パス）を `app_conf.py` 更新計画に反映する。
