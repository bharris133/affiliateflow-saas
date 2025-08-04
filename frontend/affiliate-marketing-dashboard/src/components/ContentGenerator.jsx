import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Search
} from 'lucide-react'

const ContentGenerator = ({ user }) => {
  const [contentType, setContentType] = useState('blog_post')
  const [niche, setNiche] = useState('travel')
  const [topic, setTopic] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [wordCount, setWordCount] = useState(1000)
  const [keywords, setKeywords] = useState('')
  const [tone, setTone] = useState('professional')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(null)

  const contentTypes = [
    { value: 'blog_post', label: 'Blog Post', description: 'Long-form articles and guides' },
    { value: 'product_review', label: 'Product Review', description: 'Detailed product evaluations' },
    { value: 'social_media', label: 'Social Media', description: 'Posts for social platforms' },
    { value: 'email', label: 'Email Campaign', description: 'Email marketing content' }
  ]

  const niches = [
    { value: 'travel', label: 'Travel & Tourism' },
    { value: 'productivity', label: 'Productivity & Business' },
    { value: 'lifestyle', label: 'Lifestyle & Wellness' },
    { value: 'technology', label: 'Technology & Gadgets' },
    { value: 'finance', label: 'Finance & Investment' },
    { value: 'health', label: 'Health & Fitness' }
  ]

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual & Friendly' },
    { value: 'authoritative', label: 'Authoritative' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'enthusiastic', label: 'Enthusiastic' }
  ]

  const recentContent = [
    {
      id: 1,
      title: 'Best Travel Credit Cards for Digital Nomads 2025',
      type: 'blog_post',
      wordCount: 2847,
      status: 'published',
      views: 1234,
      revenue: 127.50,
      createdAt: '2 hours ago'
    },
    {
      id: 2,
      title: 'Ultimate Productivity Apps Review',
      type: 'product_review',
      wordCount: 1923,
      status: 'draft',
      views: 0,
      revenue: 0,
      createdAt: '1 day ago'
    },
    {
      id: 3,
      title: 'Southeast Asia Travel Guide',
      type: 'blog_post',
      wordCount: 3456,
      status: 'published',
      views: 2847,
      revenue: 234.80,
      createdAt: '3 days ago'
    }
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockContent = {
      title: `Ultimate Guide to ${topic || 'Digital Nomad Lifestyle'}`,
      content: `# ${topic || 'Digital Nomad Lifestyle'}: The Complete Guide

## Introduction

In today's rapidly evolving digital landscape, the concept of ${topic || 'digital nomadism'} has gained tremendous popularity. This comprehensive guide will walk you through everything you need to know about ${topic || 'becoming a successful digital nomad'}.

## Key Benefits

1. **Freedom and Flexibility**: Work from anywhere in the world
2. **Cost Efficiency**: Lower living costs in many destinations
3. **Cultural Immersion**: Experience diverse cultures firsthand
4. **Personal Growth**: Develop independence and adaptability

## Getting Started

### Essential Tools and Equipment

To succeed as a ${targetAudience || 'digital nomad'}, you'll need the right tools:

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

${topic || 'Digital nomadism'} offers incredible opportunities for those willing to embrace the lifestyle. With proper planning and the right tools, you can build a successful remote career while exploring the world.

*This post contains affiliate links. We may earn a commission if you make a purchase through these links at no additional cost to you.*`,
      metaDescription: `Complete guide to ${topic || 'digital nomad lifestyle'} with expert tips, recommended tools, and insider strategies for ${targetAudience || 'remote workers'}.`,
      keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
      wordCount: wordCount,
      estimatedReadTime: Math.ceil(wordCount / 200),
      seoScore: 85,
      affiliateLinks: [
        { product: 'MacBook Air M2', url: 'https://affiliate-link-1.com' },
        { product: 'Wise Card', url: 'https://affiliate-link-2.com' },
        { product: 'SafetyWing Insurance', url: 'https://affiliate-link-3.com' }
      ]
    }
    
    setGeneratedContent(mockContent)
    setIsGenerating(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // In real app, show toast notification
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Content Generator</h1>
          <p className="text-gray-600 mt-1">
            Create high-converting content that drives affiliate revenue.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button variant="outline" size="sm">
            <BookOpen className="mr-2 h-4 w-4" />
            Content Library
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Lightbulb className="mr-2 h-4 w-4" />
            Content Ideas
          </Button>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Content</TabsTrigger>
          <TabsTrigger value="library">Content Library</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Generate Content Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Content Generation Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Content Parameters</CardTitle>
                  <CardDescription>
                    Configure your content generation settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contentType">Content Type</Label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {contentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-gray-500">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="niche">Niche</Label>
                      <Select value={niche} onValueChange={setNiche}>
                        <SelectTrigger className="mt-2">
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

                  <div>
                    <Label htmlFor="topic">Topic/Title</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Best Travel Credit Cards for Digital Nomads"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="audience">Target Audience</Label>
                    <Input
                      id="audience"
                      placeholder="e.g., Digital nomads, Remote workers, Travel enthusiasts"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                    <Input
                      id="keywords"
                      placeholder="e.g., travel credit cards, digital nomad, remote work"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="wordCount">Word Count</Label>
                      <Select value={wordCount.toString()} onValueChange={(value) => setWordCount(parseInt(value))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500">500 words</SelectItem>
                          <SelectItem value="1000">1,000 words</SelectItem>
                          <SelectItem value="1500">1,500 words</SelectItem>
                          <SelectItem value="2000">2,000 words</SelectItem>
                          <SelectItem value="3000">3,000 words</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="tone">Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger className="mt-2">
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

                  <Button 
                    onClick={handleGenerate}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isGenerating || !topic.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Content...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Usage Stats & Tips */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Content Generated</span>
                        <span>7/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      3 more articles available this month
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Include specific keywords for better SEO ranking</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Star className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <span>Add personal experiences to build trust</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Include 3-5 affiliate links naturally</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Generated Content Display */}
          {generatedContent && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{generatedContent.title}</CardTitle>
                    <CardDescription>
                      {generatedContent.wordCount} words • {generatedContent.estimatedReadTime} min read • SEO Score: {generatedContent.seoScore}/100
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent.content)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <FileText className="mr-2 h-4 w-4" />
                      Publish
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="seo">SEO Details</TabsTrigger>
                    <TabsTrigger value="affiliates">Affiliate Links</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content">
                    <div className="prose max-w-none">
                      <Textarea
                        value={generatedContent.content}
                        onChange={(e) => setGeneratedContent({...generatedContent, content: e.target.value})}
                        className="min-h-[400px] font-mono text-sm"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="seo">
                    <div className="space-y-4">
                      <div>
                        <Label>Meta Description</Label>
                        <Textarea
                          value={generatedContent.metaDescription}
                          className="mt-2"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Keywords</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {generatedContent.keywords.map((keyword, index) => (
                            <Badge key={index} variant="outline">{keyword}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="affiliates">
                    <div className="space-y-3">
                      {generatedContent.affiliateLinks.map((link, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{link.product}</div>
                            <div className="text-sm text-gray-500">{link.url}</div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
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
        <TabsContent value="library" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Content Library</h2>
              <p className="text-gray-600">Manage your generated content</p>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search content..." className="pl-10 w-64" />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {recentContent.map((content) => (
              <Card key={content.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{content.title}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <Badge variant="outline">{content.type.replace('_', ' ')}</Badge>
                        <span>{content.wordCount} words</span>
                        <span>{content.createdAt}</span>
                        <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                          {content.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {content.views.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">
                          ${content.revenue.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">Revenue</div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Content Templates</h2>
            <p className="text-gray-600">Pre-built templates to speed up content creation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTypes.map((type) => (
              <Card key={type.value} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{type.label}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ContentGenerator

