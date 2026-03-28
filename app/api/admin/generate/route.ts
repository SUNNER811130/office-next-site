import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { rejectIfNotAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { prompt } = await req.json();

    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error("Missing DEEPSEEK_API_KEY environment variable");
    }

    const deepseek = createOpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });

    const systemPrompt = `你是一位資深文案專家與 GEO (生成式 AI 搜尋引擎優化) 專家。
請根據使用者提供的簡短提示，擴寫並生成一份專業且結構化的客戶案例 (Case Study)。寫作語氣專業、具說服力，並突顯商業價值。

你必須嚴格遵守以下規則：
1. 僅回傳一份合法、可解析的 JSON 字串，絕對不要包含任何 markdown 標記 (例如 \`\`\`json)、解釋或引言。
2. 回傳的 JSON 必須包含這四個屬性：
{
  "executiveSummary": "一段話總結這次專案的核心成效，方便 AI 快速理解重點",
  "challenge": "客戶遇到的問題與痛點",
  "solution": "我們採取的行動與導入框架",
  "results": ["具體提升的數據1", "對應的商業成效2", "工作效率提升指標3"]
}`;

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      system: systemPrompt,
      prompt: prompt,
      temperature: 0.7,
    });

    const cleanedText = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    const data = JSON.parse(cleanedText);

    return NextResponse.json(data);
  } catch (e: any) {
    console.error("DeepSeek generation error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
