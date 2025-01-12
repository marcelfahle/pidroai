import type { AIPlayer, GameStateForAI, Move } from '../types/player'

export class PidroAIInterface {
  private config: AIPlayer['config']
  private systemPrompt: string

  constructor(config: AIPlayer['config']) {
    this.config = config
    this.systemPrompt = this.generateSystemPrompt()
  }

  private generateSystemPrompt(): string {
    return `You are an AI player in a game of Pidro. You will receive game states and should respond with your next move.
    Rules summary:
    - Each suit has 14 points (A=1, J=1, 10=1, both 5s=5 each, 2=1)
    - Bidding phase: Bid between 6-14 points or pass
    - Playing phase: Must follow suit if possible
    - Team needs to make their bid to score points
    
    Respond in the following JSON format:
    {
      "move": {
        "type": "bid" | "play",
        "value": number | string
      },
      "reasoning": "Brief explanation of your decision"
    }`
  }

  private generatePrompt(gameState: GameStateForAI, legalMoves: Array<number | string>): string {
    return `Current game state:
    Phase: ${gameState.phase}
    Your position: ${gameState.position}
    Your team: ${gameState.team}
    Your hand: ${JSON.stringify(gameState.visibleCards.hand)}
    Current trick: ${JSON.stringify(gameState.currentTrick)}
    Trump suit: ${gameState.trumpSuit}
    Current bid: ${gameState.currentBid}
    Legal moves: ${JSON.stringify(legalMoves)}
    
    What is your next move? Respond with a valid move from the legal moves provided.`
  }

  private async callAIAPI(prompt: string): Promise<Move> {
    const apiUrl = this.config.provider === 'anthropic'
      ? 'https://api.anthropic.com/v1/messages'
      : 'https://api.openai.com/v1/chat/completions'

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`
    }

    if (this.config.provider === 'anthropic') {
      headers['anthropic-version'] = '2023-06-01'
    }

    const body = this.config.provider === 'anthropic'
      ? JSON.stringify({
          model: this.config.model || 'claude-3',
          max_tokens: this.config.maxTokens || 1000,
          temperature: this.config.temperature || 0.7,
          system: this.systemPrompt,
          messages: [{ role: 'user', content: prompt }]
        })
      : JSON.stringify({
          model: this.config.model || 'gpt-4',
          messages: [
            { role: 'system', content: this.systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: this.config.temperature || 0.7,
          max_tokens: this.config.maxTokens || 1000
        })

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body
      })

      const data = await response.json()
      return JSON.parse(this.config.provider === 'anthropic' ? data.content[0].text : data.choices[0].message.content)
    } catch (error) {
      console.error(`Error calling ${this.config.provider} API:`, error)
      throw error
    }
  }

  async getNextMove(gameState: GameStateForAI, legalMoves: Array<number | string>): Promise<Move> {
    const prompt = this.generatePrompt(gameState, legalMoves)

    try {
      return await this.callAIAPI(prompt)
    } catch (error) {
      console.error('Error getting AI move:', error)
      // Fallback to a random legal move in case of API failure
      const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)]
      return {
        type: gameState.phase === 'bidding' ? 'bid' : 'play',
        value: randomMove
      }
    }
  }
}

