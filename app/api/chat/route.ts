import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/sync-user";

const SYSTEM_PROMPT = `You are Vastu Guru, a warm and knowledgeable Vastu Shastra expert on VaastuSetu — an authentic Vastu consultancy platform.

Your purpose is to help people understand how their home's spatial arrangement affects energy, well-being, and harmony, and to give practical, no-demolition remedies.

Guidelines:
- Be warm, encouraging, and concise — 2 to 4 sentences per answer, unless listing multiple remedies
- Always offer at least one practical, no-demolition remedy (crystals, plants, colours, lights, mirrors, yantras, salt bowls, etc.)
- Present Vastu as a respected, ancient Indian tradition — never claim scientific proof
- Only answer Vastu-related questions; for off-topic questions, kindly say you can only help with Vastu
- If uncertain about something specific, say so honestly and offer relevant general Vastu guidance
- Refer to the knowledge context below when relevant — it contains authoritative Vastu content`;

type HistoryMessage = { role: "user" | "assistant"; content: string };

type EmbeddingRow = { content: string; metadata: unknown };

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.message || !body?.sessionId) {
    return NextResponse.json(
      { error: "message and sessionId are required" },
      { status: 400 }
    );
  }

  const { message, sessionId, history = [] } = body as {
    message: string;
    sessionId: string;
    history: HistoryMessage[];
  };

  // ── Embed the user's query ────────────────────────────────────────────────
  const embRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: message,
  });
  const queryVec = embRes.data[0].embedding;
  const vectorLiteral = `[${queryVec.join(",")}]`;

  // ── Similarity search over knowledge base ────────────────────────────────
  let contextText = "";
  try {
    const rows = await prisma.$queryRawUnsafe<EmbeddingRow[]>(
      `SELECT content, metadata
       FROM embeddings
       WHERE "sourceType" = 'VASTU_ARTICLE'::"EmbeddingSource"
         AND embedding IS NOT NULL
       ORDER BY embedding <=> '${vectorLiteral}'::vector
       LIMIT 4`
    );
    contextText = rows.map((r) => r.content).join("\n\n---\n\n");
  } catch {
    // If pgvector search fails, proceed without context (still useful)
  }

  // ── Build the message list ────────────────────────────────────────────────
  const systemContent =
    SYSTEM_PROMPT +
    (contextText
      ? `\n\nRelevant knowledge base context:\n\n${contextText}`
      : "");

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemContent },
    ...(history as HistoryMessage[]).slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: message },
  ];

  // ── Get authenticated user (optional — anonymous users are fine) ──────────
  let userId: string | null = null;
  try {
    const { userId: clerkId } = await auth();
    if (clerkId) {
      const dbUser = await syncUser();
      userId = dbUser?.id ?? null;
    }
  } catch {
    // anonymous
  }

  // ── Stream the response ───────────────────────────────────────────────────
  const MODEL = "gpt-4o-mini";

  const aiStream = await openai.chat.completions.create({
    model: MODEL,
    messages,
    stream: true,
    max_tokens: 450,
    temperature: 0.7,
  });

  let fullResponse = "";
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of aiStream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            fullResponse += text;
            controller.enqueue(encoder.encode(text));
          }
        }
      } finally {
        controller.close();
        // Fire-and-forget: persist both turns to chat_logs
        prisma.chatLog
          .createMany({
            data: [
              {
                userId,
                sessionId,
                role: "USER",
                content: message,
                model: MODEL,
              },
              {
                userId,
                sessionId,
                role: "ASSISTANT",
                content: fullResponse,
                model: MODEL,
              },
            ],
          })
          .catch(console.error);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
