"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { articleApi } from "@/lib/api";
import { Article } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  FileText,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Fetch articles
  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const data = await articleApi.getArticles();
      setArticles(data);
      setFilteredArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to load articles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredArticles(
        articles.filter(
          (article) =>
            article.title.toLowerCase().includes(query) ||
            article.slug.toLowerCase().includes(query) ||
            article.excerpt?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, articles]);

  // Toggle publish status
  const handleTogglePublish = async (article: Article) => {
    setTogglingId(article.id);
    try {
      await articleApi.togglePublish(article.id);
      setArticles((prev) =>
        prev.map((a) =>
          a.id === article.id ? { ...a, published: !a.published } : a
        )
      );
      toast.success(
        article.published ? "Article unpublished" : "Article published"
      );
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast.error("Failed to update article status");
    } finally {
      setTogglingId(null);
    }
  };

  // Delete article
  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await articleApi.deleteArticle(deleteId);
      setArticles((prev) => prev.filter((a) => a.id !== deleteId));
      toast.success("Article deleted successfully");
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchArticles}
            disabled={isLoading}
            className="cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Link href="/articles/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Total Articles</p>
          <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-2xl font-bold text-emerald-600">
            {articles.filter((a) => a.published).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Drafts</p>
          <p className="text-2xl font-bold text-orange-500">
            {articles.filter((a) => !a.published).length}
          </p>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FileText className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No articles found</p>
            <p className="text-sm">
              {searchQuery
                ? "Try a different search term"
                : "Create your first article to get started"}
            </p>
            {!searchQuery && (
              <Link href="/Adminarticles/newpage" className="mt-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Article
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[400px]">Article</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.map((article) => (
                <TableRow key={article.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {article.featured_image ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${article.featured_image}`}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      {/* Title */}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate max-w-[280px]">
                          {article.title}
                        </p>
                        {article.excerpt && (
                          <p className="text-sm text-gray-500 truncate max-w-[280px]">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {article.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    {article.published ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(article.created_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/articles/${article.slug}`} target="_blank">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Article
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/articles/${article.id}/edit`}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleTogglePublish(article)}
                          disabled={togglingId === article.id}
                        >
                          {togglingId === article.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : article.published ? (
                            <EyeOff className="w-4 h-4 mr-2" />
                          ) : (
                            <Eye className="w-4 h-4 mr-2" />
                          )}
                          {article.published ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteId(article.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}