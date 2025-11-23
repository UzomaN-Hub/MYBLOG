"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { articleApi } from "@/lib/api";
import { Article } from "@/types";
import { Loader2, Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await articleApi.getArticleBySlug(slug);
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">Article not found</h1>
        <Link href="/" className="text-emerald-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Featured Image */}
        {article.featured_image && (
          <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${article.featured_image}`}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Title & Meta */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-4">{article.excerpt}</p>
          )}
          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(article.created_at), "MMMM dd, yyyy")}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg prose-emerald max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </article>
  );
}