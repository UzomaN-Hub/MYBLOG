"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { articleApi } from "@/lib/api";
import { Article } from "@/types";
import { ArticleEditor } from "@/components/dashboard/article-editor";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = Number(params.id);

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await articleApi.getArticle(articleId);
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
        toast.error("Article not found");
        router.push("/articles");
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId, router]);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await articleApi.updateArticle(articleId, formData);
      toast.success("Article updated successfully!");
      router.push("/articles");
    } catch (error) {
      console.error("Error updating article:", error);
      const axiosError = error as AxiosError<{ detail: string }>;
      toast.error(
        axiosError.response?.data?.detail || "Failed to update article"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <ArticleEditor
      mode="edit"
      article={article}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
