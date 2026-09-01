import { BlogPost } from '../../types';
import { WPPostRaw } from './types';
import { initialBlogPosts } from '../../data/blog';

/**
 * Isolated WordPress Headless API Client
 * Facilitates integration with WordPress REST API (`/wp-json/wp/v2/posts?_embed`)
 */
class WordPressClient {
  private endpoint: string | null;

  constructor() {
    this.endpoint = (typeof process !== 'undefined' && process.env?.VITE_WP_API_URL) || null;
  }

  /**
   * Transforms raw WordPress REST API post object into application BlogPost model
   */
  private transformWPPost(post: WPPostRaw): BlogPost {
    const author = post._embedded?.author?.[0];
    const media = post._embedded?.['wp:featuredmedia']?.[0];
    const terms = post._embedded?.['wp:term']?.[0] || [];
    const categoryName = terms[0]?.name || 'Technology';

    return {
      id: String(post.id),
      slug: post.slug,
      title: post.title.rendered.replace(/&#8217;/g, "'").replace(/&amp;/g, '&'),
      excerpt: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').trim(),
      contentHtml: post.content.rendered,
      category: (['Technology', 'Development', 'Business', 'Guides', 'Design', 'Culture'].includes(
        categoryName
      )
        ? categoryName
        : 'Technology') as BlogPost['category'],
      readTime: '5 min read',
      date: post.date,
      author: {
        name: author?.name || 'Sarah Jenkins',
        role: author?.description || 'Lead Architect',
        avatarUrl:
          author?.avatar_urls?.['96'] ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBI1q3UvSneKna_9hbUathxFuEYr6LXiF0KOCxvD0QrhyorK8dJTVHF4OEXWdTp6GlFfKL3cMJftBiJqNmXTJ1Ks4oSO5_c4GaRFXcethPAt_7k5ZSptyUNTI9ukxXEeq1bfygCEbIZNmhbG9_z0xsTbVwnmpvRNRh-Orab8Zy5TL0upvdqQwQM4GRd3Bdd7HRxWIbOGCygT7lvTHNWR1wojDA_dcp78W7QiZEpLkyP-7FARXKZ47Qp',
      },
      featuredImage:
        media?.source_url ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBbLtMLPCHoyQ6aa2Sk7TDDC-gO1EsuravjG8w1bJD7TKcU7Yh-jAAQX3fzQMXUeyo3j_gq_f2_ynSvUOeJ5biv9DIWiepIKTaHxcQZi0V0yH5f9GiW2-XAUgcSm6gUVsDIqSD6xOThJxpIC5S0UoOFlYi4aWk6Wpvh2B8Bw0xPH6XPHA2U7-p0c6W7Yk6tZFSm-X_vWI1_7kD9WiNs6bJ4nnibCV5Y-bBPJ_RTBT4DTMhnO_RdprTB',
      tags: terms.map((t) => t.name),
    };
  }

  /**
   * Fetch all posts from WordPress Headless or fallback to static verified dataset
   */
  async getPosts(): Promise<BlogPost[]> {
    if (!this.endpoint) {
      return initialBlogPosts;
    }

    try {
      const res = await fetch(`${this.endpoint}/wp-json/wp/v2/posts?_embed&per_page=20`);
      if (!res.ok) {
        throw new Error(`WordPress API returned ${res.status}`);
      }
      const data: WPPostRaw[] = await res.json();
      return data.map((item) => this.transformWPPost(item));
    } catch (err) {
      console.warn('Falling back to static blog posts due to WordPress fetch error:', err);
      return initialBlogPosts;
    }
  }

  /**
   * Fetch single post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = await this.getPosts();
    return posts.find((p) => p.slug === slug) || null;
  }
}

export const wordPressClient = new WordPressClient();
