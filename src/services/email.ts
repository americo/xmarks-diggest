import { ArticleSummary } from '../types';
import { Resend } from 'resend';

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendDigest(articles: ArticleSummary[]) {
    const htmlContent = this.generateEmailHtml(articles);

    await this.resend.emails.send({
      from: 'Digest <digest@americojunior.com>',
      to: 'eu@americojunior.com',
      subject: 'Seu Resumo Diário de Bookmarks do Twitter',
      html: htmlContent,
    });
  }

  private generateEmailHtml(articles: ArticleSummary[]): string {
    return `
      <h1>Seu Resumo Diário de Bookmarks</h1>
      ${articles.map(article => `
        <div style="margin-bottom: 20px;">
          <p><strong>URL:</strong> <a href="${article.url}">${article.url}</a></p>
          <p><strong>Resumo:</strong> ${article.summary}</p>
          <p><strong>Tweet Original:</strong> <a href="${article.tweetUrl}">Ver no Twitter</a></p>
        </div>
      `).join('')}
    `;
  }
} 