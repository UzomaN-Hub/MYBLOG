"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { articleApi } from "@/lib/api";
import { ArticleEditor } from "@/components/dashboard/article-editor";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function NewArticlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await articleApi.createArticle(formData);
      toast.success("Article created successfully!");
      router.push("/Adminarticles");
    } catch (error) {
      console.error("Error creating article:", error);
      const axiosError = error as AxiosError<{ detail: string }>;
      toast.error(
        axiosError.response?.data?.detail || "Failed to create article"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ArticleEditor
      mode="create"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}



