import { BlogPostsResponse } from '@/models/BlogPost';
import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const response = await fetch("https://dummyjson.com/posts");
    const { posts }: BlogPostsResponse = await response.json();

    const postEntries: MetadataRoute.Sitemap = posts.map(({ id }) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${id}`,
        // lastModified: new Date(post.updatedAt),
        // changeFrequency:,
        // priority:
    }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    ...postEntries,
  ]
}
