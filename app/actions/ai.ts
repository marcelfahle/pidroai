"use server";

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import type { GameStateForAI, Move } from "@/types/player";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function getAIMove(
  provider: "openai" | "anthropic",
  gameState: GameStateForAI,
  legalMoves: string[]
): Promise<Move> {
  const prompt = `You are playing a card game called Pidro. Here's the current game state:
${JSON.stringify(gameState, null, 2)}

Legal moves available: ${legalMoves.join(", ")}

Choose one card to play from the legal moves. Respond with just the card value, nothing else.`;

  console.log(`\n🤖 AI Request (${provider}):`, {
    prompt,
    legalMoves,
    gameState: {
      ...gameState,
      position: gameState.position,
      team: gameState.team,
      trumpSuit: gameState.trumpSuit,
      currentBid: gameState.currentBid,
    },
  });

  if (provider === "openai") {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 10,
    });

    const move = response.choices[0].message.content?.trim() || legalMoves[0];
    console.log("📤 OpenAI Response:", response, {
      response: response.choices[0].message.content,
      selectedMove: move,
    });
    return { type: "play", value: move };
  } else {
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 10,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    const move = content.type === "text" ? content.text : legalMoves[0];
    console.log("📤 Anthropic Response:", response, {
      response: content.type === "text" ? content.text : null,
      selectedMove: move,
    });
    return { type: "play", value: move };
  }
}
