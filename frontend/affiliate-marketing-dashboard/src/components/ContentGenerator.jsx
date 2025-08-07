import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Zap,
  Download,
  Copy,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Clock,
  Target,
  Lightbulb,
  BookOpen,
  Star,
  Search,
  Mail,
  Share2,
} from "lucide-react";

const ContentGenerator = ({ user }) => {
  const [contentType, setContentType] = useState("blog_post");
  const [niche, setNiche] = useState("travel");
  const [topic, setTopic] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [wordCount, setWordCount] = useState(1000);
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const contentTypes = [
    {
      value: "blog_post",
      label: "Blog Post",
      description: "Long-form articles and guides",
    },
    {
      value: "product_review",
      label: "Product Review",
      description: "Detailed product evaluations",
    },
    {
      value: "social_media",
      label: "Social Media",
      description: "Posts for social platforms",
    },
    {
      value: "email",
      label: "Email Campaign",
      description: "Email marketing content",
    },
  ];

  const niches = [
    { value: "travel", label: "Travel & Tourism" },
    { value: "productivity", label: "Productivity & Business" },
    { value: "lifestyle", label: "Lifestyle & Wellness" },
    { value: "technology", label: "Technology & Gadgets" },
    { value: "finance", label: "Finance & Investment" },
    { value: "health", label: "Health & Fitness" },
  ];

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual & Friendly" },
    { value: "authoritative", label: "Authoritative" },
    { value: "conversational", label: "Conversational" },
    { value: "enthusiastic", label: "Enthusiastic" },
  ];

  const recentContent = [
    {
      id: 1,
      title: "Best Travel Credit Cards for Digital Nomads 2025",
      type: "blog_post",
      wordCount: 2847,
      status: "published",
      views: 1234,
      revenue: 127.5,
      createdAt: "2 hours ago",
    },
    {
      id: 2,
      title: "Ultimate Productivity Apps Review",
      type: "product_review",
      wordCount: 1923,
      status: "draft",
      views: 0,
      revenue: 0,
      createdAt: "1 day ago",
    },
    {
      id: 3,
      title: "Southeast Asia Travel Guide",
      type: "blog_post",
      wordCount: 3456,
      status: "published",
      views: 2847,
      revenue: 234.8,
      createdAt: "3 days ago",
    },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockContent = {
      title: `Ultimate Guide to ${topic || "Digital Nomad Lifestyle"}`,
      content: `# ${topic || "Digital Nomad Lifestyle"}: The Complete Guide

## Introduction

In today's rapidly evolving digital landscape, the concept of ${
        topic || "digital nomadism"
      } has gained tremendous popularity. This comprehensive guide will walk you through everything you need to know about ${
        topic || "becoming a successful digital nomad"
      }.

## Key Benefits

1. **Freedom and Flexibility**: Work from anywhere in the world
2. **Cost Efficiency**: Lower living costs in many destinations
3. **Cultural Immersion**: Experience diverse cultures firsthand
4. **Personal Growth**: Develop independence and adaptability

## Getting Started

### Essential Tools and Equipment

To succeed as a ${
        targetAudience || "digital nomad"
      }, you'll need the right tools:

- **Laptop**: A reliable, lightweight laptop is crucial
- **Internet Connection**: Portable WiFi hotspot for backup
- **Travel Insurance**: Comprehensive coverage for health and equipment
- **Banking Solutions**: International-friendly bank accounts

### Recommended Products

Based on extensive research and personal experience, here are the top-rated products:

1. **MacBook Air M2** - Perfect balance of performance and portability
2. **Wise Multi-Currency Card** - Best rates for international transactions
3. **SafetyWing Travel Insurance** - Comprehensive coverage for nomads

## Conclusion

${
  topic || "Digital nomadism"
} offers incredible opportunities for those willing to embrace the lifestyle. With proper planning and the right tools, you can build a successful remote career while exploring the world.

*This post contains affiliate links. We may earn a commission if you make a purchase through these links at no additional cost to you.*`,
      metaDescription: `Complete guide to ${
        topic || "digital nomad lifestyle"
      } with expert tips, recommended tools, and insider strategies for ${
        targetAudience || "remote workers"
      }.`,
      keywords: keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k),
      wordCount: wordCount,
      estimatedReadTime: Math.ceil(wordCount / 200),
      seoScore: 85,
      affiliateLinks: [
        { product: "MacBook Air M2", url: "https://affiliate-link-1.com" },
        { product: "Wise Card", url: "https://affiliate-link-2.com" },
        {
          product: "SafetyWing Insurance",
          url: "https://affiliate-link-3.com",
        },
      ],
    };

    setGeneratedContent(mockContent);
    setIsGenerating(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // In real app, show toast notification
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Content Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create high-converting content that drives affiliate revenue with
            the power of AI.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="lg" className="bg-white">
            <BookOpen className="mr-2 h-5 w-5" />
            Content Library
          </Button>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
          >
            <Lightbulb className="mr-2 h-5 w-5" />
            Content Ideas
          </Button>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 rounded-xl p-1">
          <TabsTrigger
            value="generate"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md"
          >
            Generate Content
          </TabsTrigger>
          <TabsTrigger
            value="library"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md"
          >
            Content Library
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md"
          >
            Templates
          </TabsTrigger>
        </TabsList>

        {/* Generate Content Tab */}
        <TabsContent value="generate" className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Content Generation Form */}
            <div className="xl:col-span-2">
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 content-type-selector">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Content Parameters
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    Configure your content generation settings for optimal
                    results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2" data-tour-id="content-type">
                      <Label
                        htmlFor="contentType"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Content Type
                      </Label>
                      <Select
                        value={contentType}
                        onValueChange={setContentType}
                      >
                        <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {contentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="py-2">
                                <div className="font-medium">{type.label}</div>
                                <div className="text-sm text-gray-500">
                                  {type.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="niche"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Niche
                      </Label>
                      <Select value={niche} onValueChange={setNiche}>
                        <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {niches.map((n) => (
                            <SelectItem key={n.value} value={n.value}>
                              {n.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2" data-tour-id="topic">
                    <Label
                      htmlFor="topic"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Topic/Title
                    </Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Best Travel Credit Cards for Digital Nomads"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors text-lg"
                    />
                  </div>

                  <div className="space-y-2" data-tour-id="audience">
                    <Label
                      htmlFor="audience"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Target Audience
                    </Label>
                    <Input
                      id="audience"
                      placeholder="e.g., Digital nomads, Remote workers, Travel enthusiasts"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2" data-tour-id="keywords">
                    <Label
                      htmlFor="keywords"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Keywords (comma-separated)
                    </Label>
                    <Input
                      id="keywords"
                      placeholder="e.g., travel credit cards, digital nomad, remote work"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors"
                    />
                    <p className="text-sm text-gray-500">
                      Add 3-5 relevant keywords for better SEO optimization
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="wordCount"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Word Count
                      </Label>
                      <Select
                        value={wordCount.toString()}
                        onValueChange={(value) => setWordCount(parseInt(value))}
                      >
                        <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500">
                            500 words (Quick read)
                          </SelectItem>
                          <SelectItem value="1000">
                            1,000 words (Standard)
                          </SelectItem>
                          <SelectItem value="1500">
                            1,500 words (Detailed)
                          </SelectItem>
                          <SelectItem value="2000">
                            2,000 words (Comprehensive)
                          </SelectItem>
                          <SelectItem value="3000">
                            3,000 words (Ultimate guide)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="tone"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Tone
                      </Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4" data-tour-id="generate-button">
                    <Button
                      onClick={handleGenerate}
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isGenerating || !topic.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          Generating Amazing Content...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-3 h-6 w-6" />
                          Generate Content with AI
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Stats & Tips */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Usage This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-gray-700">Content Generated</span>
                        <span className="text-blue-600">7/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full shadow-sm"
                          style={{ width: "70%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 bg-white p-3 rounded-lg shadow-sm">
                      💡 <strong>3 more articles</strong> available this month.
                      Upgrade for unlimited content generation.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Pro Content Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
                      <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Include specific keywords for better SEO ranking and
                        organic traffic
                      </span>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
                      <Star className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Add personal experiences and stories to build trust with
                        readers
                      </span>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Include 3-5 affiliate links naturally throughout the
                        content
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-gray-700">
                        Avg. Revenue per Article
                      </span>
                      <span className="font-bold text-green-600">$127.50</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-gray-700">
                        Best Performing Niche
                      </span>
                      <span className="font-bold text-blue-600">Travel</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-gray-700">Optimal Word Count</span>
                      <span className="font-bold text-purple-600">
                        1,500 words
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Generated Content Display */}
          {generatedContent && (
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {generatedContent.title}
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="flex items-center">
                          <FileText className="mr-1 h-4 w-4" />
                          {generatedContent.wordCount} words
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {generatedContent.estimatedReadTime} min read
                        </span>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          SEO Score: {generatedContent.seoScore}/100
                        </Badge>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.content)}
                      className="hover:bg-blue-50"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-green-50"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Publish
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="content" className="space-y-6">
                  <TabsList className="grid grid-cols-3 h-12 bg-gray-100 rounded-xl p-1">
                    <TabsTrigger
                      value="content"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md"
                    >
                      Content
                    </TabsTrigger>
                    <TabsTrigger
                      value="seo"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md"
                    >
                      SEO Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="affiliates"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md"
                    >
                      Affiliate Links
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content">
                    <div className="prose max-w-none">
                      <Textarea
                        value={generatedContent.content}
                        onChange={(e) =>
                          setGeneratedContent({
                            ...generatedContent,
                            content: e.target.value,
                          })
                        }
                        className="min-h-[500px] font-mono text-sm border-2 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-lg"
                        placeholder="Your generated content will appear here..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="seo">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Meta Description
                        </Label>
                        <Textarea
                          value={generatedContent.metaDescription}
                          className="border-2 hover:border-blue-300 focus:border-blue-500 transition-colors rounded-lg"
                          rows={3}
                          placeholder="SEO meta description..."
                        />
                        <p className="text-sm text-gray-500">
                          Recommended length: 150-160 characters
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">
                          Keywords
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.keywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4 bg-green-50 border-green-200">
                          <div className="text-2xl font-bold text-green-600">
                            {generatedContent.seoScore}/100
                          </div>
                          <div className="text-sm text-green-700">
                            SEO Score
                          </div>
                        </Card>
                        <Card className="p-4 bg-blue-50 border-blue-200">
                          <div className="text-2xl font-bold text-blue-600">
                            {generatedContent.keywords.length}
                          </div>
                          <div className="text-sm text-blue-700">Keywords</div>
                        </Card>
                        <Card className="p-4 bg-purple-50 border-purple-200">
                          <div className="text-2xl font-bold text-purple-600">
                            {generatedContent.estimatedReadTime}min
                          </div>
                          <div className="text-sm text-purple-700">
                            Read Time
                          </div>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="affiliates">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Affiliate Links
                        </h3>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Add Link
                        </Button>
                      </div>
                      {generatedContent.affiliateLinks.map((link, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1">
                              {link.product}
                            </div>
                            <div className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                              {link.url}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-red-50 hover:border-red-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Content Library Tab */}
        <TabsContent value="library" className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Content Library
              </h2>
              <p className="text-lg text-gray-600">
                Manage and track performance of your generated content
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search content..."
                  className="pl-10 w-64 h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors"
                />
              </div>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg">
                Export All
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {recentContent.map((content) => (
              <Card
                key={content.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className={`
                          w-3 h-3 rounded-full
                          ${
                            content.status === "published"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }
                        `}
                        ></div>
                        <h3 className="font-semibold text-xl text-gray-900 group-hover:text-blue-700 transition-colors">
                          {content.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {content.type.replace("_", " ")}
                        </Badge>
                        <span className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">
                            {content.wordCount}
                          </span>
                          <span>words</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{content.createdAt}</span>
                        </span>
                        <Badge
                          variant={
                            content.status === "published"
                              ? "default"
                              : "secondary"
                          }
                          className={`
                          ${
                            content.status === "published"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }
                        `}
                        >
                          {content.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-lg font-bold text-blue-600">
                          <Eye className="h-5 w-5" />
                          <span>{content.views.toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-gray-500">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ${content.revenue.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">Revenue</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-blue-50 hover:border-blue-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-red-50 hover:border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {recentContent.length}
                </div>
                <div className="text-blue-700 font-medium">Total Articles</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {recentContent.filter((c) => c.status === "published").length}
                </div>
                <div className="text-green-700 font-medium">Published</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {recentContent
                    .reduce((sum, c) => sum + c.views, 0)
                    .toLocaleString()}
                </div>
                <div className="text-purple-700 font-medium">Total Views</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  $
                  {recentContent
                    .reduce((sum, c) => sum + c.revenue, 0)
                    .toFixed(2)}
                </div>
                <div className="text-orange-700 font-medium">Total Revenue</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Content Templates
            </h2>
            <p className="text-lg text-gray-600">
              Pre-built templates to speed up content creation and ensure
              consistency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {contentTypes.map((type, index) => (
              <Card
                key={type.value}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-purple-50"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className={`
                      w-12 h-12 rounded-xl flex items-center justify-center text-white
                      ${
                        index === 0
                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                          : index === 1
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : index === 2
                          ? "bg-gradient-to-r from-purple-500 to-purple-600"
                          : "bg-gradient-to-r from-orange-500 to-orange-600"
                      }
                    `}
                    >
                      {index === 0 ? (
                        <FileText className="h-6 w-6" />
                      ) : index === 1 ? (
                        <Star className="h-6 w-6" />
                      ) : index === 2 ? (
                        <Share2 className="h-6 w-6" />
                      ) : (
                        <Mail className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl group-hover:text-blue-700 transition-colors">
                        {type.label}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {type.description}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>SEO optimized structure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Conversion-focused layout</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Affiliate link optimization</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    className={`
                    w-full h-12 font-semibold transition-all duration-300 shadow-md hover:shadow-lg
                    ${
                      index === 0
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        : index === 1
                        ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        : index === 2
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                        : "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                    }
                    text-white
                  `}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Popular Templates Section */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Popular Templates
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Ultimate Guide Template
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Perfect for comprehensive, authoritative content that
                      ranks well and converts visitors.
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-blue-700">
                      <span>✓ 2000+ words</span>
                      <span>✓ High conversion</span>
                      <span>✓ SEO optimized</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 p-6 bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Product Review Template
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Detailed review structure that builds trust and drives
                      affiliate sales effectively.
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-green-700">
                      <span>✓ Trust building</span>
                      <span>✓ Comparison tables</span>
                      <span>✓ Call-to-actions</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentGenerator;
