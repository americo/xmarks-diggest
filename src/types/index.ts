export interface Bookmark {
  id: string;
  text: string;
  urls: string[];
  created_at: string;
}

export interface ArticleSummary {
  url: string;
  summary: string;
  tweetUrl: string;
} 