/**
 * Build the Vastu knowledge base embeddings.
 * Run with: npm run kb:build
 *
 * Clears all existing VASTU_ARTICLE embeddings and re-embeds the full
 * knowledge base using OpenAI text-embedding-3-small (1536 dimensions).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config(); // also load .env as fallback
import OpenAI from "openai";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { KNOWLEDGE_CHUNKS } from "../lib/vaastu/knowledge-base";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function randomId() {
  return crypto.randomUUID().replace(/-/g, "");
}

async function main() {
  console.log("Building Vastu knowledge base...\n");

  // Clear existing embeddings for a clean rebuild
  const deleted = await prisma.$executeRawUnsafe(
    `DELETE FROM embeddings WHERE "sourceType" = 'VASTU_ARTICLE'::"EmbeddingSource"`
  );
  console.log(`Cleared ${deleted} existing chunk(s).\n`);

  for (let i = 0; i < KNOWLEDGE_CHUNKS.length; i++) {
    const chunk = KNOWLEDGE_CHUNKS[i];
    process.stdout.write(
      `[${String(i + 1).padStart(2, "0")}/${KNOWLEDGE_CHUNKS.length}] ${chunk.title} ... `
    );

    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk.content,
    });

    const vec = embeddingRes.data[0].embedding; // 1536 floats
    const vectorLiteral = `[${vec.join(",")}]`;
    const id = randomId();

    const sql = `
      INSERT INTO embeddings (id, "sourceType", "sourceId", "chunkIndex", content, embedding, metadata, "createdAt")
      VALUES ($1, 'VASTU_ARTICLE'::"EmbeddingSource", $2, $3, $4, '${vectorLiteral}'::vector, $5::jsonb, NOW())
    `;

    await prisma.$executeRawUnsafe(
      sql,
      id,
      chunk.sourceId,
      i,
      chunk.content,
      JSON.stringify({ title: chunk.title })
    );

    console.log("done");
  }

  console.log(`\nKnowledge base ready: ${KNOWLEDGE_CHUNKS.length} chunks embedded.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect().then(() => pool.end()));
