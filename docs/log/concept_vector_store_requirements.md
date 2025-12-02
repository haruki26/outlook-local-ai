# Concept Vector Store 要件整理 (2025-12-03)

## 1. 目的・スコープ
- Semantic Expansion Search の関連概念抽出を **mail_collection と独立した concept_collection** で完結させる。
- 概念 embedding はサーバー内部のみで扱い、フロントや外部 API には露出しない。
- 初期概念ラベル（請求・支払い／契約関連／進捗・状況／障害・問題／日程・会議）を確実に検索に反映できるよう、ロード〜検索〜再生成フローを定義する。

## 2. データモデル要件
| フィールド | 型 | 必須 | 説明 |
|------------|----|------|------|
| `concept_id` | str | ✅ | 内部キー。`payment`, `contract` など英字固定長を推奨。 |
| `label` | str | ✅ | UI 表示用（日本語）。例: `請求・支払い`。 |
| `embedding` | list[float] | ✅(内部) | ruri v3 70M の埋め込み。API では非公開。 |
| `metadata` | dict | 任意 | `{"type": "concept", "category": "finance"}` など。将来の分類や色指定に利用。 |
| `priority` | float | 任意 | 関連概念表示順を制御したい場合に使用。 |
| `created_at` / `updated_at` | datetime | 任意 | 再生成タイミングの追跡用。 |

- 永続化先は `concept_collection` (Chroma) を第一候補とし、同時に JSON スナップショット（例: `server/database/vector_store/concepts.json`）を保持して再生成や差分管理に使う。
- `Tag` モデルとは完全に別物とし、ID 衝突を避けるため命名規則 (`concept:<name>`) を推奨。

## 3. 機能要件
1. **ロード**: FastAPI 起動時に概念データを読み込み、`ConceptVectorRepository` でメモリキャッシュ化。コンフィグでリロード可否を制御。
2. **検索**: ユーザー検索語 embedding と概念ベクトルとの cosine 類似度を計算し、TopN（デフォルト 3〜5）を返す。
3. **補助API**: 内部向けに `GET /concept-vectors` などを用意し、現在登録済みラベルを確認できるようにする（外部公開は不要）。
4. **リビルド**: スクリプト `scripts/generate_concept_vectors.py` で概念リストから embedding を生成し、`concept_collection` を再構築。再生成時にはバックアップ→新規コレクション作成→スワップの順で実施。
5. **メトリクス**: ロード時間、検索時間、概念数をログ出力し、Semantic 拡張のデバッグに利用。

## 4. 非機能要件
- **一貫性**: 概念数が少ないためフルリロードで良いが、スクリプト実行中に検索が失敗しないよう二重化（新規コレクション作成後にハンドルを切り替える）。
- **性能**: 概念数 5〜30 の想定。検索は `numpy.dot` 等でミリ秒オーダーを維持。embedding キャッシュは `ConceptVectorRepository` に保持。
- **セキュリティ**: 概念データはサーバー限定なので、API レスポンスでは ID/label/score のみ返却。

## 5. 実装要件（抜粋）
1. `server/app/services/vector_store/concept/vector_store.py` を新設し、`MailVectorStore` と同様に `VectorStore(CONCEPT_COLLECTION)` をラップ。
2. `ConceptVector` データモデル（Pydantic or dataclass）を `app/dtos/vector_store.py` とは別に `app/services/semantic/concept.py` などで定義。
3. `app_conf.py` に `CONCEPT_COLLECTION` などの設定が既に追加済みのため、`.env.sample` でも設定名を周知。
4. `ConceptVectorRepository`
   - 役割: JSON or Chroma からロードし、`list[ConceptVector]` を返却。
   - 更新: 生成スクリプト実行後に `POST /admin/concept-vectors/reload`（仮）でキャッシュ更新。
5. 生成スクリプト
   - 入力: `concept_seed.yaml`（concept_id, label, metadata を列挙）。
   - 処理: ruri embedding 生成 → concept_collection へ upsert → JSON スナップショット更新。
   - 出力: `concept_collection`（Chroma）、`concept_snapshot.json`。
6. Search API / Semantic Service
   - ConceptVectorRepository から TopN を取得し、`related_concepts` として `concept_id`, `label`, `score` を返す。
   - ヒット理由生成で使用する概念ラベルはここから供給。

## 6. 未確定事項 / ToDo
- JSON スナップショットの保管場所 (`server/database/vector_store/concepts.json` or `docs/data/concepts.json`) を最終決定。
- Concept ベクトル再生成を CI で自動化するか、手動運用にするか。
- `concept_collection` のメタデータ設計（例: `{ "type": "concept", "version": "v1" }`）。
