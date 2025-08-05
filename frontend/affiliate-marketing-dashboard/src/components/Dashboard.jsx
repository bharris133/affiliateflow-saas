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
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Share2,
  Eye,
  MousePointer,
  Calendar,
  Clock,
  ArrowUpRight,
  Zap,
  Target,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = ({ user }) => {
  const [timeRange, setTimeRange] = useState("7d");

  // Mock data - in real app this would come from API
  const stats = {
    revenue: { current: 1247.5, previous: 892.3, change: 39.8 },
    visitors: { current: 12543, previous: 9876, change: 27.0 },
    content: { current: 47, previous: 32, change: 46.9 },
    conversion: { current: 3.2, previous: 2.8, change: 14.3 },
  };

  const revenueData = [
    { date: "Jan 25", revenue: 120, clicks: 450 },
    { date: "Jan 26", revenue: 180, clicks: 520 },
    { date: "Jan 27", revenue: 95, clicks: 380 },
    { date: "Jan 28", revenue: 240, clicks: 680 },
    { date: "Jan 29", revenue: 165, clicks: 590 },
    { date: "Jan 30", revenue: 310, clicks: 820 },
    { date: "Jan 31", revenue: 275, clicks: 750 },
  ];

  const contentPerformance = [
    { name: "Blog Posts", value: 45, color: "#3B82F6" },
    { name: "Social Media", value: 30, color: "#8B5CF6" },
    { name: "Email Campaigns", value: 25, color: "#10B981" },
  ];

  const topContent = [
    {
      title: "Best Travel Credit Cards for Digital Nomads",
      views: 2847,
      revenue: 127.5,
      ctr: 4.2,
    },
    {
      title: "Ultimate Guide to Remote Work Tools",
      views: 1923,
      revenue: 89.3,
      ctr: 3.8,
    },
    {
      title: "Southeast Asia Travel Itinerary",
      views: 1654,
      revenue: 76.2,
      ctr: 3.1,
    },
    {
      title: "Productivity Apps for Entrepreneurs",
      views: 1432,
      revenue: 68.9,
      ctr: 2.9,
    },
  ];

  const recentActivity = [
    {
      type: "content",
      message: 'New blog post published: "Travel Insurance Guide"',
      time: "2 hours ago",
    },
    {
      type: "social",
      message: "Instagram post reached 5K impressions",
      time: "4 hours ago",
    },
    {
      type: "revenue",
      message: "Affiliate commission earned: $45.20",
      time: "6 hours ago",
    },
    {
      type: "email",
      message: "Email campaign sent to 1,247 subscribers",
      time: "8 hours ago",
    },
  ];

  const getStatIcon = (type) => {
    switch (type) {
      case "revenue":
        return <DollarSign className="h-4 w-4" />;
      case "visitors":
        return <Users className="h-4 w-4" />;
      case "content":
        return <FileText className="h-4 w-4" />;
      case "conversion":
        return <Target className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Here's what's happening with your affiliate business today.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="lg" className="bg-white">
            <Calendar className="mr-2 h-5 w-5" />
            Last 7 days
          </Button>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Zap className="mr-2 h-5 w-5" />
            Generate Content
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 stats-cards">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-800">
              Total Revenue
            </CardTitle>
            <div className="p-2 bg-green-200 rounded-lg">
              {getStatIcon("revenue")}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 mb-1">
              {formatCurrency(stats.revenue.current)}
            </div>
            <div className="flex items-center text-sm text-green-700">
              <TrendingUp className="mr-1 h-4 w-4" />+{stats.revenue.change}%
              from last period
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-800">
              Visitors
            </CardTitle>
            <div className="p-2 bg-blue-200 rounded-lg">
              {getStatIcon("visitors")}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-1">
              {formatNumber(stats.visitors.current)}
            </div>
            <div className="flex items-center text-sm text-blue-700">
              <TrendingUp className="mr-1 h-4 w-4" />+{stats.visitors.change}%
              from last period
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-800">
              Content Pieces
            </CardTitle>
            <div className="p-2 bg-purple-200 rounded-lg">
              {getStatIcon("content")}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-1">
              {stats.content.current}
            </div>
            <div className="flex items-center text-sm text-purple-700">
              <TrendingUp className="mr-1 h-4 w-4" />+{stats.content.change}%
              from last period
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-orange-800">
              Conversion Rate
            </CardTitle>
            <div className="p-2 bg-orange-200 rounded-lg">
              {getStatIcon("conversion")}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 mb-1">
              {stats.conversion.current}%
            </div>
            <div className="flex items-center text-sm text-orange-700">
              <TrendingUp className="mr-1 h-4 w-4" />+{stats.conversion.change}%
              from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 revenue-chart">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">
              Revenue & Clicks
            </CardTitle>
            <CardDescription className="text-gray-600">
              Daily performance over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" fontSize={12} />
                <YAxis yAxisId="left" stroke="#666" fontSize={12} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#666"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="clicks"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content Performance */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">
              Content Performance
            </CardTitle>
            <CardDescription className="text-gray-600">
              Distribution of content types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={contentPerformance}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                  fontSize={12}
                >
                  {contentPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance Table */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">
            Top Performing Content
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your highest earning content pieces this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContent.map((content, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-200 transition-all duration-300 group"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                      ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : index === 2
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }
                    `}
                    >
                      #{index + 1}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {content.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">
                        {formatNumber(content.views)}
                      </span>
                      <span>views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MousePointer className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{content.ctr}%</span>
                      <span>CTR</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatCurrency(content.revenue)}
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <Award className="mr-1 h-3 w-3" />
                    Top Performer
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 recent-activity">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-600">
              Latest updates from your affiliate business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                >
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                    ${
                      activity.type === "revenue"
                        ? "bg-green-500"
                        : activity.type === "content"
                        ? "bg-blue-500"
                        : activity.type === "social"
                        ? "bg-purple-500"
                        : "bg-orange-500"
                    }
                  `}
                  >
                    {activity.type === "revenue" ? (
                      <DollarSign className="h-5 w-5" />
                    ) : activity.type === "content" ? (
                      <FileText className="h-5 w-5" />
                    ) : activity.type === "social" ? (
                      <Share2 className="h-5 w-5" />
                    ) : (
                      <Users className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">
              Quick Actions
            </CardTitle>
            <CardDescription className="text-gray-600">
              Common tasks to boost your earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                className="w-full justify-start h-14 text-left bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                variant="outline"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Generate New Blog Post</div>
                    <div className="text-xs opacity-90">
                      Create AI-powered content
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="ml-auto h-5 w-5" />
              </Button>

              <Button
                className="w-full justify-start h-14 text-left bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
                variant="outline"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      Schedule Social Media Posts
                    </div>
                    <div className="text-xs opacity-90">
                      Automate your social presence
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="ml-auto h-5 w-5" />
              </Button>

              <Button
                className="w-full justify-start h-14 text-left bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                variant="outline"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Send Email Campaign</div>
                    <div className="text-xs opacity-90">
                      Engage your subscribers
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="ml-auto h-5 w-5" />
              </Button>

              <Button
                className="w-full justify-start h-14 text-left bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg"
                variant="outline"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">View Analytics Report</div>
                    <div className="text-xs opacity-90">
                      Deep dive into performance
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="ml-auto h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl font-bold text-gray-900">
            Monthly Goals
          </CardTitle>
          <CardDescription className="text-gray-600">
            Track your progress towards this month's targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Revenue Goal
                </span>
                <span className="text-lg font-bold text-green-600">
                  $1,247 / $2,000
                </span>
              </div>
              <Progress value={62} className="h-3 bg-gray-200" />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">62% complete</p>
                <p className="text-sm font-semibold text-green-600">
                  $753 to go
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Content Goal
                </span>
                <span className="text-lg font-bold text-blue-600">47 / 60</span>
              </div>
              <Progress value={78} className="h-3 bg-gray-200" />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">78% complete</p>
                <p className="text-sm font-semibold text-blue-600">
                  13 pieces to go
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Visitor Goal
                </span>
                <span className="text-lg font-bold text-purple-600">
                  12.5K / 15K
                </span>
              </div>
              <Progress value={83} className="h-3 bg-gray-200" />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">83% complete</p>
                <p className="text-sm font-semibold text-purple-600">
                  2.5K visitors to go
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
