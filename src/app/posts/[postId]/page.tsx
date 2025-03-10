import ClapButton from "@/components/ClapButton";
import { delay } from "@/lib/utils";
import { BlogPost, BlogPostsResponse } from "@/models/BlogPost";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: { postId: string };
}

export async function generateStaticParams() {
  const response = await fetch("https://dummyjson.com/posts");
  const { posts }: BlogPostsResponse = await response.json();

  return posts.map(({ id }) => id);

  // This would only catche the first five posts. The rest will be rendered & cached at first access.
  //return posts.map(({ id }) => id).slice(0, 5);
}

// Manually deduplicate requests if not using fetch
// const getPost = cache(async (postId: string) => {
//   const post = await prisma.post.findUnique(postId);
//   return post;
// })

export async function generateMetadata({ params: { postId } } : BlogPostPageProps):Promise<Metadata> {
  const response = await fetch(`https://dummyjson.com/posts/${postId}`); // i were manually deduplicating "const response = await getPost()"
  const post: BlogPost = await response.json();
  return {
    title: post.title,
    description: post.body,
    
    // openGraph: {
    //   images: [
    //     {
    //       url: post.imageUrl
    //     }
    //   ]
    // } // I would use this if the blog post has an image to generate an openGraph image for this dynamic page.
  }
}  

export default async function BlogPostPage({ params: { postId } }: BlogPostPageProps) {
  const response = await fetch(`https://dummyjson.com/posts/${postId}`);
  const { title, body }: BlogPost = await response.json();

  if (response.status === 404) {
    notFound();
  }

  await delay(1000);

  return (
    <article className="max-w-prose m-auto space-y-5">
      <h1 className="text-3xl text-center font-bold">{title}</h1>
      <p className="text-lg">{body}</p>

      <ClapButton />
    </article>
  );
}
