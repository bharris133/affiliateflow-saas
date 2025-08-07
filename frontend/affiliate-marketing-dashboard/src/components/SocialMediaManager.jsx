import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  Send,
  Image,
  Video,
  Link,
  Hash,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Settings,
  Zap,
  Target,
  Globe,
  Smartphone,
  Monitor,
  PlayCircle,
  Camera,
  FileText,
  CheckCircle,
  Clock3,
  AlertCircle,
} from "lucide-react";

const SocialMediaManager = ({ user }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    "facebook",
    "twitter",
    "linkedin",
  ]);
  const [postContent, setPostContent] = useState("");
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  // Social media platforms data
  const platforms = [
    {
      id: "facebook",
      name: "Facebook",
      icon: "📘",
      color: "#1877f2",
      followers: 12540,
      engagement: 4.2,
      posts: 127,
      connected: true,
    },
    {
      id: "twitter",
      name: "Twitter/X",
      icon: "𝕏",
      color: "#000000",
      followers: 8932,
      engagement: 6.8,
      posts: 234,
      connected: true,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "💼",
      color: "#0077b5",
      followers: 3456,
      engagement: 8.1,
      posts: 89,
      connected: true,
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📷",
      color: "#e4405f",
      followers: 15670,
      engagement: 5.9,
      posts: 156,
      connected: false,
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: "📺",
      color: "#ff0000",
      followers: 4567,
      engagement: 7.3,
      posts: 45,
      connected: false,
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: "🎵",
      color: "#000000",
      followers: 23450,
      engagement: 12.4,
      posts: 78,
      connected: false,
    },
  ];

  // Recent posts data
  const recentPosts = [
    {
      id: 1,
      content:
        "🚀 Just launched our new affiliate marketing guide! Check out the top strategies that are working in 2024...",
      platforms: ["facebook", "twitter", "linkedin"],
      scheduled: "2024-08-05T14:30:00",
      status: "published",
      engagement: { likes: 245, comments: 32, shares: 18, views: 1250 },
      performance: "high",
    },
    {
      id: 2,
      content:
        "💡 Pro tip: The best time to post on social media varies by platform. Here's what we've learned from our data...",
      platforms: ["twitter", "linkedin"],
      scheduled: "2024-08-05T18:00:00",
      status: "scheduled",
      engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
      performance: "pending",
    },
    {
      id: 3,
      content:
        "📊 This week's analytics show a 40% increase in engagement! Thanks to everyone who's been supporting our content.",
      platforms: ["facebook", "instagram"],
      scheduled: "2024-08-04T12:00:00",
      status: "published",
      engagement: { likes: 189, comments: 24, shares: 12, views: 980 },
      performance: "medium",
    },
    {
      id: 4,
      content:
        "🎯 New video tutorial: 'How to Create High-Converting Affiliate Content in Under 30 Minutes'",
      platforms: ["youtube", "twitter", "linkedin"],
      scheduled: "2024-08-06T10:00:00",
      status: "draft",
      engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
      performance: "pending",
    },
  ];

  // Content templates
  const contentTemplates = [
    {
      id: 1,
      title: "Product Review Post",
      content:
        "Just tried [PRODUCT NAME] and here's my honest review... 🤔\n\n✅ What I loved:\n❌ What could be better:\n💭 My verdict:\n\n[AFFILIATE LINK] #affiliate #review",
      category: "review",
    },
    {
      id: 2,
      title: "Tips & Tricks",
      content:
        "💡 [NUMBER] game-changing tips for [TOPIC]:\n\n1. [TIP 1]\n2. [TIP 2]\n3. [TIP 3]\n\nWhich one will you try first? Let me know below! 👇\n\n#tips #[NICHE]",
      category: "educational",
    },
    {
      id: 3,
      title: "Behind the Scenes",
      content:
        "🎬 Behind the scenes of my [ACTIVITY]...\n\nIt's not always glamorous, but it's always worth it! Here's what really goes into [PROCESS].\n\n#behindthescenes #authentic #journey",
      category: "personal",
    },
    {
      id: 4,
      title: "Question Post",
      content:
        "❓ Quick question for my amazing community:\n\n[YOUR QUESTION]\n\nA) [OPTION A]\nB) [OPTION B]\nC) [OPTION C]\n\nComment your answer below! 👇 #community #engagement",
      category: "engagement",
    },
  ];

  // Analytics data
  const analyticsData = {
    totalReach: 45670,
    totalEngagement: 3456,
    avgEngagementRate: 6.2,
    topPerformingPlatform: "TikTok",
    weeklyGrowth: 12.5,
    clickThroughRate: 2.8,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-500";
      case "scheduled":
        return "bg-blue-500";
      case "draft":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case "high":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const PlatformCard = ({ platform }) => (
    <Card
      className={`relative overflow-hidden ${
        platform.connected ? "border-green-200" : "border-gray-200"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{platform.icon}</div>
            <div>
              <CardTitle className="text-lg">{platform.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    platform.connected ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  {platform.connected ? "Connected" : "Not connected"}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            {platform.connected ? (
              <Settings className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">
              {platform.followers.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{platform.engagement}%</div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{platform.posts}</div>
            <div className="text-xs text-muted-foreground">Posts</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PostCard = ({ post }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(
                  post.status
                )}`}
              />
              <Badge variant="secondary" className="text-xs">
                {post.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(post.scheduled)}
              </span>
            </div>
            <p className="text-sm line-clamp-3">{post.content}</p>
          </div>
          <div className="flex items-center space-x-1 ml-4">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Platforms:</span>
            <div className="flex space-x-1">
              {post.platforms.map((platformId) => {
                const platform = platforms.find((p) => p.id === platformId);
                return (
                  <span key={platformId} className="text-lg">
                    {platform?.icon}
                  </span>
                );
              })}
            </div>
          </div>

          {post.status === "published" && (
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="flex items-center justify-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span className="text-sm font-medium">
                    {post.engagement.likes}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1">
                  <MessageCircle className="h-3 w-3" />
                  <span className="text-sm font-medium">
                    {post.engagement.comments}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1">
                  <Share2 className="h-3 w-3" />
                  <span className="text-sm font-medium">
                    {post.engagement.shares}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span className="text-sm font-medium">
                    {post.engagement.views}
                  </span>
                </div>
              </div>
            </div>
          )}

          {post.status === "published" && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Performance:
              </span>
              <Badge
                variant="outline"
                className={`${getPerformanceColor(
                  post.performance
                )} border-current`}
              >
                {post.performance}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Social Media Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all your social media platforms from one central hub
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Create and schedule content across multiple social media
                  platforms
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="content">Post Content</Label>
                  <Textarea
                    id="content"
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <div>
                  <Label>Select Platforms</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {platforms
                      .filter((p) => p.connected)
                      .map((platform) => (
                        <div
                          key={platform.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={platform.id}
                            checked={selectedPlatforms.includes(platform.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPlatforms([
                                  ...selectedPlatforms,
                                  platform.id,
                                ]);
                              } else {
                                setSelectedPlatforms(
                                  selectedPlatforms.filter(
                                    (p) => p !== platform.id
                                  )
                                );
                              }
                            }}
                          />
                          <label htmlFor={platform.id} className="text-sm">
                            {platform.icon} {platform.name}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Schedule Date</Label>
                    <Input type="date" id="date" />
                  </div>
                  <div>
                    <Label htmlFor="time">Schedule Time</Label>
                    <Input type="time" id="time" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatePostOpen(false)}
                >
                  Save as Draft
                </Button>
                <Button onClick={() => setIsCreatePostOpen(false)}>
                  Schedule Post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reach
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalReach.toLocaleString()}
            </div>
            <div className="flex items-center space-x-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">
                +{analyticsData.weeklyGrowth}% from last week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Engagement
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalEngagement.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {analyticsData.avgEngagementRate}% avg. rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Platform
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.topPerformingPlatform}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Highest engagement rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Click-Through Rate
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.clickThroughRate}%
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Affiliate link performance
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Your latest posts and their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(
                          post.status
                        )}`}
                      />
                      <div className="flex-1">
                        <p className="text-sm line-clamp-2">{post.content}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>{formatDate(post.scheduled)}</span>
                          <span>{post.platforms.length} platforms</span>
                          {post.status === "published" && (
                            <span>
                              {post.engagement.likes +
                                post.engagement.comments +
                                post.engagement.shares}{" "}
                              interactions
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Upcoming Posts</span>
                </CardTitle>
                <CardDescription>
                  Scheduled content for the next few days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts
                    .filter((post) => post.status === "scheduled")
                    .map((post) => (
                      <div
                        key={post.id}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50"
                      >
                        <Clock3 className="h-4 w-4 text-blue-500 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm line-clamp-2">{post.content}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>{formatDate(post.scheduled)}</span>
                            <div className="flex space-x-1">
                              {post.platforms.map((platformId) => {
                                const platform = platforms.find(
                                  (p) => p.id === platformId
                                );
                                return (
                                  <span key={platformId}>{platform?.icon}</span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">All Posts</h3>
              <p className="text-sm text-muted-foreground">
                Manage your content across all platforms
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Content Templates</h3>
              <p className="text-sm text-muted-foreground">
                Pre-built templates to speed up content creation
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contentTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap font-sans">
                        {template.content}
                      </pre>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm">
                        <Send className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Connected Platforms</h3>
              <p className="text-sm text-muted-foreground">
                Manage your social media account connections
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Connect Platform
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Common tasks to boost your social media presence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
            >
              <Calendar className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Bulk Schedule</div>
                <div className="text-sm text-muted-foreground">
                  Schedule multiple posts at once
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
            >
              <BarChart3 className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Performance Report</div>
                <div className="text-sm text-muted-foreground">
                  Generate detailed analytics
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
            >
              <Settings className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Automation Rules</div>
                <div className="text-sm text-muted-foreground">
                  Set up posting automation
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaManager;
