import { ContentAnalyzer } from '../services/content-analyzer';
import { EmailService } from '../services/email';
import { TwitterService } from '../services/twitter';
import cron from 'node-cron';

export async function generateDigest() {
  const twitter = new TwitterService();
  const analyzer = new ContentAnalyzer();
  const emailService = new EmailService();

  try {
    // Obter bookmarks
    const bookmarks = await twitter.getRecentBookmarks();
    
    // Analisar URLs
    const articlePromises = bookmarks.flatMap(bookmark => 
      bookmark.urls.map(url => analyzer.analyzeUrl(url, bookmark.id))
    );
    
    const articles = (await Promise.all(articlePromises)).filter(article => article !== null);

    // Enviar email se houver artigos
    if (articles.length > 0) {
      await emailService.sendDigest(articles);
    }
  } catch (error) {
    console.error('Erro ao gerar digest:', error);
  }
}

// Executar todos os dias às 9:00
cron.schedule('0 9 * * *', generateDigest);

// Executar imediatamente na primeira vez
generateDigest(); 