import { Bookmark } from '../types';
import { TwitterApi } from 'twitter-api-v2';

export class TwitterService {
  private client: TwitterApi;

  constructor() {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });
  }

  async getRecentBookmarks(): Promise<Bookmark[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookmarks = await this.client.v1.get('favorites/list.json', {
      count: 100,
      include_entities: true
    });

    return bookmarks
      .filter((tweet) => new Date(tweet.created_at) >= yesterday)
      .map((tweet) => ({
        id: tweet.id_str,
        text: tweet.text,
        urls: tweet.entities?.urls?.map((url) => url.expanded_url) || [],
        created_at: tweet.created_at,
      }));
  }
} 