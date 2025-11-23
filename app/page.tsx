"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { articleApi } from "@/lib/api";
import { Article } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/navbar";
import { 
  Heart, 
  Brain, 
  Activity, 
  Apple, 
  Users, 
  Calendar,
  ArrowRight,
  CheckCircle2,
  Star,
  TrendingUp,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);

  // Fetch articles from database
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articles = await articleApi.getArticles({ published_only: true, limit: 3 });
        setFeaturedArticles(articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoadingArticles(false);
      }
    };

    fetchArticles();
  }, []);

  const healthTopics = [
    {
      icon: Heart,
      title: "Heart Health",
      description: "Learn about cardiovascular wellness and prevention",
      color: "bg-red-50 text-red-600",
      articles: 45,
    },
    {
      icon: Brain,
      title: "Mental Health",
      description: "Explore mental wellness and stress management",
      color: "bg-purple-50 text-purple-600",
      articles: 38,
    },
    {
      icon: Apple,
      title: "Nutrition",
      description: "Discover healthy eating habits and diet tips",
      color: "bg-green-50 text-green-600",
      articles: 52,
    },
    {
      icon: Activity,
      title: "Fitness",
      description: "Get workout plans and exercise guidance",
      color: "bg-blue-50 text-blue-600",
      articles: 41,
    },
  ];

  const stats = [
    { icon: Users, label: "Patients Helped", value: "10,000+" },
    { icon: Heart, label: "Health Articles", value: "500+" },
    { icon: Calendar, label: "Years Experience", value: "15+" },
    { icon: Star, label: "Success Rate", value: "98%" },
  ];


  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('/heroimg.webp')] bg-cover bg-center">
        <div className="container mx-auto place-content-center h-screen">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-white text-green-700 hover:bg-green-200 cursor-pointer">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trusted by thousands
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-100 leading-tight">
              Your Health Journey <br />
              <span className="text-green-600">Starts Here</span>
            </h1>

            <p className="text-xl text-white mb-8 leading-relaxed">
              Expert health advice, trusted information, and personalized care 
              to help you live your healthiest life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-700 hover:bg-green-800 text-lg px-8">
                Frequently Asked Questions
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link href="/blog">Explore Articles <ArrowRight className="w-5 h-5 ml-2" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-green-700 py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <stat.icon className="w-10 h-10 mx-auto mb-3" />
                <p className="text-4xl font-bold mb-1">{stat.value}</p>
                <p className="text-green-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Topics Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Explore Health Topics</h2>
          <p className="text-xl text-gray-600">
            Find trusted information on the topics that matter to you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthTopics.map((topic, index) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="h-full hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-200">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-lg ${topic.color} flex items-center justify-center mb-4`}>
                    <topic.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl">{topic.title}</CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <p className="text-sm text-gray-500">{topic.articles} articles</p>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Articles */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Latest Articles</h2>
              <p className="text-lg text-gray-600">
                Stay informed with expert health advice
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/blog">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {isLoadingArticles ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
          ) : featuredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No articles published yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/articles/${article.slug}`}>
                    <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer overflow-hidden">
                      <div className="h-48 relative bg-gradient-to-br from-green-600 to-emerald-700">
                        {article.featured_image ? (
                          <Image
                            src={`${backendUrl}${article.featured_image}`}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                            
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Heart className="w-16 h-16 text-white/30" />
                          </div>
                        )}
                      </div>
                      
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Health</Badge>
                          <span className="text-sm text-gray-500">5 min read</span>
                        </div>
                        <CardTitle className="text-xl hover:text-green-600 transition-colors line-clamp-2">
                          {article.title}
                        </CardTitle>
                        {article.excerpt && (
                          <CardDescription className="line-clamp-2">
                            {article.excerpt}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardFooter className="flex items-center justify-between text-sm text-gray-600">
                        <span>PrimeHealthCare</span>
                        <span>{format(new Date(article.created_at), "MMM dd, yyyy")}</span>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose PrimeHealthCare?</h2>
            <p className="text-xl text-gray-600">
              Your trusted partner in health and wellness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Expert medical professionals",
              "Evidence-based information",
              "Personalized health guidance",
              "24/7 support available",
              "Comprehensive health resources",
              "Free consultations",
            ].map((benefit, index) => (
              <motion.div
                key={benefit}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                <p className="text-lg text-gray-700">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter*/}
      <section className="bg-gradient-to-r from-green-600 to-green-700 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated on Health Tips
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Subscribe to our newsletter for weekly health insights
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white text-gray-900 flex-1"
              />
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}