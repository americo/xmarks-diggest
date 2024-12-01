import * as cheerio from 'cheerio';

import { ArticleSummary } from '../types';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export class ContentAnalyzer {
  private perplexity: any;

  constructor() {
    this.perplexity = createOpenAI({
      name: 'perplexity',
      apiKey: process.env.PERPLEXITY_API_KEY ?? '',
      baseURL: 'https://api.perplexity.ai/v1',
    });
  }

  async analyzeUrl(url: string, tweetId: string): Promise<ArticleSummary | null> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      // Verificar se parece ser um artigo
      const articleContent = $('article').text() || $('main').text() || $('body').text();
      if (!this.looksLikeArticle(articleContent)) {
        return null;
      }

      const summary = await this.generateSummary(articleContent);
      
      return {
        url,
        summary,
        tweetUrl: `https://twitter.com/i/web/status/${tweetId}`,
      };
    } catch (error) {
      console.error(`Erro ao analisar URL ${url}:`, error);
      return null;
    }
  }

  private looksLikeArticle(content: string): boolean {
    return content.length > 500 && content.split(' ').length > 100;
  }

  private async generateSummary(content: string): Promise<string> {
    const { text } = await generateText({
      model: this.perplexity('llama-3.1-sonar-large-32k-online'),
      prompt: `Escreva um resumo de um parágrafo do seguinte texto: ${content.substring(0, 2000)}...`,
    });

    return text;
  }
} 