export interface VideoItem {
  guid: string;
  title?: string;
  subtitle?: string;
  imageUrl: string;
  isLive: boolean;
  streamUrl: string;
  genre?: string;
}
