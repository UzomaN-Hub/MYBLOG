"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authstore";
import { articleApi } from "@/lib/api";
import { Article } from "@/types";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Eye,
  FilePlus,
  TrendingUp,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleApi.getArticles();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Calculate stats
  const totalArticles = articles.length;
  const publishedCount = articles.filter((a) => a.published).length;
  const draftCount = articles.filter((a) => !a.published).length;
  const recentArticles = articles.slice(0, 5);

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user?.username || "Admin"}! 👋
        </h2>
        <p className="text-emerald-100 mb-4">
          Here&apos;s what&apos;s happening with your blog today.
        </p>
        <Link href="/articles/new">
          <Button className="bg-white text-emerald-700 hover:bg-emerald-50">
            <FilePlus className="w-4 h-4 mr-2" />
            Create New Article
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Articles */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm">Total Articles</span>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {isLoading ? "-" : totalArticles}
          </p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>

        {/* Published */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm">Published</span>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {isLoading ? "-" : publishedCount}
          </p>
          <p className="text-xs text-emerald-600 mt-1">Live on site</p>
        </div>

        {/* Drafts */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm">Drafts</span>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {isLoading ? "-" : draftCount}
          </p>
          <p className="text-xs text-orange-600 mt-1">Pending review</p>
        </div>

        {/* Views Placeholder */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm">Total Views</span>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">-</p>
          <p className="text-xs text-gray-500 mt-1">Coming soon</p>
        </div>
      </div>

      {/* Recent Articles & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <div className="lg:col-span-2 bg-white rounded-xl border">
          <div className="flex items-center justify-between p-5 border-b">
            <h3 className="font-semibold text-gray-900">Recent Articles</h3>
            <Link href="/articles">
              <Button variant="ghost" size="sm" className="text-emerald-600">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
            </div>
          ) : recentArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FileText className="w-10 h-10 text-gray-300 mb-3" />
              <p>No articles yet</p>
              <Link href="/Adminarticles/newpage" className="mt-2">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  Create your first article
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {formatDate(article.created_at)}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          article.published
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {article.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <Link href={`/Adminarticles/${article.id}/editpage`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/Adminarticles/newpage" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 hover:border-emerald-500 hover:text-emerald-600"
              >
                <FilePlus className="w-5 h-5" />
                Create New Article
              </Button>
            </Link>
            <Link href="/articles" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 hover:border-emerald-500 hover:text-emerald-600"
              >
                <FileText className="w-5 h-5" />
                Manage Articles
              </Button>
            </Link>
            {user?.is_super_admin && (
              <Link href="/register" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 hover:border-emerald-500 hover:text-emerald-600"
                >
                  <Eye className="w-5 h-5" />
                  Manage Admins
                </Button>
              </Link>
            )}
          </div>

          {/* User Info Card */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Logged in as</p>
            <p className="font-medium text-gray-900">{user?.username}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}