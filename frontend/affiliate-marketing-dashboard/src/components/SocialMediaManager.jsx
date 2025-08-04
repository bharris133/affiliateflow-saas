import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Linkedin,
  Calendar as CalendarIcon,
  Clock,
  Send,
  Image,
  Video,
  Hash,
  Users,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share,
  BarChart3,
  Zap,
  Plus,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'

const SocialMediaManager = ({ user }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'facebook'])
  const [postContent, setPostContent] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [scheduledDate, setScheduledDate] = useState(null)
  const [scheduledTime, setScheduledTime] = useState('12:00')
  const [isScheduled, setIsScheduled] = useState(false)
  const [activeTab, setActiveTab] = useState('create')

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500', connected: true },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600', connected: true },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500', connected: false },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-500', connected: false },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700', connected: false },
    { id: 'tiktok', name: 'TikTok', icon: Video, color: 'bg-black', connected: false },
    { id: 'pinterest', name: 'Pinterest', icon: Image, color: 'bg-red-600', connected: false }
  ]

  const recentPosts = [
    {
      id: 1,
      content: "🌟 Just discovered the best travel credit card for digital nomads! Earning 3x points on travel and no foreign transaction fees. Perfect for remote workers! #DigitalNomad #TravelHacks",
      platforms: ['instagram', 'facebook'],
      status: 'published',
      publishedAt: '2 hours ago',
      metrics: { likes: 127, comments: 23, shares: 8, reach: 2847 }
    },
    {
      id: 2,
      content: "💡 Productivity tip: Use the Pomodoro Technique with these amazing apps to boost your focus by 40%! Which productivity method works best for you? 🤔",
      platforms: ['instagram', 'twitter'],
      status: 'scheduled',
      scheduledFor: 'Today at 3:00 PM',
      metrics: { likes: 0, comments: 0, shares: 0, reach: 0 }
    },
    {
      id: 3,
      content: "🏝️ Southeast Asia travel guide is live! 15 countries, budget breakdowns, and insider tips. Link in bio! #TravelGuide #SoutheastAsia #Backpacking",
      platforms: ['instagram', 'facebook', 'twitter'],
      status: 'published',
      publishedAt: '1 day ago',
      metrics: { likes: 342, comments: 67, shares: 45, reach: 5234 }
    }
  ]

  const contentTemplates = [
    {
      category: 'Product Review',
      templates: [
        "🌟 Just tried [PRODUCT] and I'm blown away! Here's my honest review: [BENEFITS]. Perfect for [TARGET AUDIENCE]. #ProductReview #Affiliate",
        "💡 Looking for [SOLUTION]? I've been using [PRODUCT] for [TIME] and here's what I discovered... [REVIEW]. Link in bio! #Review #Recommendation"
      ]
    },
    {
      category: 'Educational',
      templates: [
        "📚 Did you know [FACT]? Here are [NUMBER] tips to [ACHIEVE GOAL]: [TIPS]. Which one will you try first? #Education #Tips",
        "🎯 Master [SKILL] with these proven strategies: [STRATEGIES]. Save this post for later! #Learning #Growth"
      ]
    },
    {
      category: 'Engagement',
      templates: [
        "🤔 Quick question: What's your biggest challenge with [TOPIC]? Drop a comment below and I'll share my best tips! #Community #Help",
        "💭 Unpopular opinion: [OPINION]. What do you think? Agree or disagree? Let's discuss! #Opinion #Discussion"
      ]
    }
  ]

  const analytics = {
    totalReach: 45672,
    totalEngagement: 3421,
    avgEngagementRate: 7.5,
    topPerformingPlatform: 'Instagram',
    bestPostingTime: '2:00 PM',
    weeklyGrowth: 12.3
  }

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const handleSchedulePost = () => {
    // In real app, this would make API call
    console.log('Scheduling post:', {
      content: postContent,
      hashtags: hashtags,
      platforms: selectedPlatforms,
      scheduledDate: scheduledDate,
      scheduledTime: scheduledTime
    })
    
    // Reset form
    setPostContent('')
    setHashtags('')
    setScheduledDate(null)
    setIsScheduled(false)
  }

  const generateHashtags = () => {
    const suggestedHashtags = [
      '#DigitalNomad', '#TravelTips', '#ProductivityHacks', '#AffiliateMarketing',
      '#RemoteWork', '#Entrepreneur', '#TravelBlogger', '#WorkFromAnywhere'
    ]
    setHashtags(suggestedHashtags.slice(0, 5).join(' '))
  }

  const getPlatformIcon = (platformId) => {
    const platform = platforms.find(p => p.id === platformId)
    if (!platform) return null
    const Icon = platform.icon
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Media Manager</h1>
          <p className="text-gray-600 mt-1">
            Create, schedule, and manage your social media content across all platforms.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Platform Settings
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Zap className="mr-2 h-4 w-4" />
            AI Generate Post
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create Post</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Create Post Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Post Creation Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Post</CardTitle>
                  <CardDescription>
                    Compose your post and select platforms to publish or schedule
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="content">Post Content</Label>
                    <Textarea
                      id="content"
                      placeholder="What's on your mind? Share valuable content with your audience..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="min-h-[120px] mt-2"
                    />
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                      <span>{postContent.length} characters</span>
                      <Button variant="ghost" size="sm" onClick={generateHashtags}>
                        <Hash className="mr-1 h-4 w-4" />
                        Generate Hashtags
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="hashtags">Hashtags</Label>
                    <Input
                      id="hashtags"
                      placeholder="#hashtag1 #hashtag2 #hashtag3"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="schedule"
                      checked={isScheduled}
                      onCheckedChange={setIsScheduled}
                    />
                    <Label htmlFor="schedule">Schedule for later</Label>
                  </div>

                  {isScheduled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal mt-2">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={scheduledDate}
                              onSelect={setScheduledDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleSchedulePost}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={!postContent.trim() || selectedPlatforms.length === 0}
                    >
                      {isScheduled ? (
                        <>
                          <Clock className="mr-2 h-4 w-4" />
                          Schedule Post
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Publish Now
                        </>
                      )}
                    </Button>
                    <Button variant="outline">
                      <Image className="mr-2 h-4 w-4" />
                      Add Media
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Selection & Templates */}
            <div className="space-y-6">
              {/* Platform Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Platforms</CardTitle>
                  <CardDescription>Choose where to publish your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {platforms.map((platform) => {
                      const Icon = platform.icon
                      const isSelected = selectedPlatforms.includes(platform.id)
                      const isConnected = platform.connected
                      
                      return (
                        <div
                          key={platform.id}
                          className={`
                            flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors
                            ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                            ${!isConnected ? 'opacity-50' : ''}
                          `}
                          onClick={() => isConnected && handlePlatformToggle(platform.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{platform.name}</div>
                              <div className="text-xs text-gray-500">
                                {isConnected ? 'Connected' : 'Not connected'}
                              </div>
                            </div>
                          </div>
                          {isConnected ? (
                            isSelected ? (
                              <CheckCircle className="h-5 w-5 text-blue-500" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                            )
                          ) : (
                            <Button size="sm" variant="outline">
                              Connect
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Content Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Templates</CardTitle>
                  <CardDescription>Quick templates to get started</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentTemplates.map((category, index) => (
                      <div key={index}>
                        <h4 className="font-medium text-sm text-gray-900 mb-2">{category.category}</h4>
                        <div className="space-y-2">
                          {category.templates.map((template, templateIndex) => (
                            <Button
                              key={templateIndex}
                              variant="outline"
                              size="sm"
                              className="w-full text-left justify-start h-auto p-2 text-xs"
                              onClick={() => setPostContent(template)}
                            >
                              {template.substring(0, 60)}...
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Scheduled Posts Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Posts</CardTitle>
              <CardDescription>Manage your upcoming social media posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.filter(post => post.status === 'scheduled').map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 mb-2">{post.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.scheduledFor}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {post.platforms.map(platformId => (
                              <span key={platformId} className="flex items-center">
                                {getPlatformIcon(platformId)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Published Posts Tab */}
        <TabsContent value="published" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Published Posts</CardTitle>
              <CardDescription>View performance of your published content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.filter(post => post.status === 'published').map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 mb-2">{post.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{post.publishedAt}</span>
                          <div className="flex items-center space-x-1">
                            {post.platforms.map(platformId => (
                              <span key={platformId} className="flex items-center">
                                {getPlatformIcon(platformId)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Published
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 pt-3 border-t">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Eye className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="text-sm font-medium">{post.metrics.reach.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Reach</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Heart className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="text-sm font-medium">{post.metrics.likes}</div>
                        <div className="text-xs text-gray-500">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <MessageCircle className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="text-sm font-medium">{post.metrics.comments}</div>
                        <div className="text-xs text-gray-500">Comments</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Share className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="text-sm font-medium">{post.metrics.shares}</div>
                        <div className="text-xs text-gray-500">Shares</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalReach.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.weeklyGrowth}% from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalEngagement.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.avgEngagementRate}% avg rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.topPerformingPlatform}</div>
                <p className="text-xs text-muted-foreground">
                  Best performing this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.bestPostingTime}</div>
                <p className="text-xs text-muted-foreground">
                  Optimal posting time
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Compare performance across different platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platforms.filter(p => p.connected).map((platform) => {
                  const Icon = platform.icon
                  const reach = Math.floor(Math.random() * 10000) + 1000
                  const engagement = Math.floor(Math.random() * 500) + 50
                  const engagementRate = ((engagement / reach) * 100).toFixed(1)
                  
                  return (
                    <div key={platform.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{platform.name}</div>
                          <div className="text-sm text-gray-500">{reach.toLocaleString()} reach</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{engagement} engagements</div>
                        <div className="text-sm text-gray-500">{engagementRate}% rate</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SocialMediaManager

