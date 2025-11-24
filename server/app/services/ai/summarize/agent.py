from __future__ import annotations

from typing import TYPE_CHECKING, override

from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import END, START
from pydantic import BaseModel, Field

from app.app_resource import app_resource
from app.services.ai.shared import BaseGraph, BaseState

if TYPE_CHECKING:
    from langgraph.graph import StateGraph


class SummarizeAgentState(BaseState[str]):
    source_text: str


class Output(BaseModel):
    target_language: str = Field(..., description="language of the summary")
    result: str = Field(..., description="result of summarization", min_length=1, max_length=500)


system_message = """# Instruction
Summarize the user message in its original language.

- Structure: Conclusion → Reason → Supplement
- Include purpose, key point, and important facts (dates, numbers, results)
- Remove polite wording, repetition, and unnecessary background"""


class SummarizeAgent(BaseGraph[SummarizeAgentState, str]):
    @override
    def __init__(self) -> None:
        self.state_type = SummarizeAgentState
        super().__init__()

    @override
    def create_graph(self, builder: StateGraph[SummarizeAgentState]) -> StateGraph[SummarizeAgentState]:
        builder.add_node("summarize", self._summarize)

        builder.add_edge(START, "summarize")
        builder.add_edge("summarize", END)

        return builder

    def _summarize(self, state: SummarizeAgentState) -> SummarizeAgentState:
        model = app_resource.chat_model

        with model.use_model() as chat_model:
            messages = [SystemMessage(content=system_message), HumanMessage(content=state["source_text"])]
            resp = chat_model.with_structured_output(Output).invoke(messages)

        result: str
        if isinstance(resp, Output):
            result = resp.result
        elif isinstance(resp, dict) and (r := resp.get("result")) is not None and isinstance(r, str):
            result = r
        else:
            msg = "Unexpected response format from the model."
            raise TypeError(msg)

        # Phi 4 mini がやたら'}'を入れたがるので削除
        if result.endswith("}"):
            result = result.removesuffix("}").strip()

        return {**state, "result": result}


if __name__ == "__main__":
    import time

    sample_mail = """株式会社Hoge
営業部 foo様

いつも大変お世話になっております。Fuga株式会社のbarです。

先日の打ち合わせでは貴重なお時間をいただき、誠にありがとうございました。
ご相談していた新商品の共同プロモーションの件ですが、次回の詳細打ち合わせを以下の日程で実施できればと考えております。

候補日: 9月12日（木）14:00〜15:00、または 9月13日（金）10:00〜11:00

開催方法: オンライン（Zoom予定）

また、当日議論をスムーズに進めるため、御社側でご検討いただいた施策案がありましたら、9月10日（火）までにご共有いただけますと幸いです。

なお、弊社からは参考資料を別途添付しておりますので、ご確認ください。

どうぞよろしくお願いいたします。

―――――――――――
Fuga株式会社　bar
"""  # noqa: RUF001
    app_resource.chat_model.load_model()
    graph = SummarizeAgent()
    state = SummarizeAgentState(source_text=sample_mail)
    start = time.time()
    result = graph.invoke(state)
    end = time.time()
    print(result)  # noqa: T201
    print(f"Elapsed time: {end - start:.2f} seconds")  # noqa: T201
