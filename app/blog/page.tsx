"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { articleApi } from "@/lib/api";
import { Article } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";
import { 
  Search, 
  Loader2, 
  Calendar,
  Heart,
  ArrowRight,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleApi.getArticles({ published_only: true });
        setArticles(data);
        setFilteredArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

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
            article.excerpt?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, articles]);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 to-emerald-800 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Health Articles & Resources
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Expert insights on health, wellness, and medical advice to help you live your best life
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-white"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-10">
        <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{articles.length}</p>
            <p className="text-sm text-gray-600">Total Articles</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">10+</p>
            <p className="text-sm text-gray-600">Expert Writers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">50K+</p>
            <p className="text-sm text-gray-600">Monthly Readers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">5★</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? "No articles found" : "No articles published yet"}
            </h3>
            <p className="text-gray-500">
              {searchQuery ? "Try a different search term" : "Check back soon for new content"}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search Results (${filteredArticles.length})` : "All Articles"}
                </h2>
                <p className="text-gray-600 mt-1">
                  Discover health tips and medical insights
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/articles/${article.slug}`}>
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group">
                      {/* Image */}
                      <div className="h-56 relative bg-gradient-to-br from-green-600 to-emerald-700 overflow-hidden">
                        {article.featured_image ? (
                          <Image
                            src={`${backendUrl}${article.featured_image}`}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Heart className="w-20 h-20 text-white/30" />
                          </div>
                        )}
                      </div>

                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                            Health
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(article.created_at), "MMM dd")}</span>
                          </div>
                        </div>

                        <CardTitle className="text-xl group-hover:text-green-600 transition-colors line-clamp-2">
                          {article.title}
                        </CardTitle>

                        {article.excerpt && (
                          <CardDescription className="line-clamp-3 mt-2">
                            {article.excerpt}
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardFooter className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">5 min read</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:text-green-700 group-hover:translate-x-1 transition-transform"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Health Tips
          </h2>
          <p className="text-green-100 text-lg mb-6">
            Subscribe to our newsletter for weekly health insights
          </p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
            Subscribe Now
          </Button>
        </div>
      </section>
    </main>
  );
}