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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MousePointer,
  Eye,
  Share2,
  FileText,
  Calendar,
  Clock,
  Target,
  Zap,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

const Analytics = ({ user }) => {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  // Advanced analytics data
  const revenueData = [
    { date: "Jan", revenue: 1200, commissions: 840, expenses: 200 },
    { date: "Feb", revenue: 1450, commissions: 1015, expenses: 180 },
    { date: "Mar", revenue: 1680, commissions: 1176, expenses: 220 },
    { date: "Apr", revenue: 1920, commissions: 1344, expenses: 240 },
    { date: "May", revenue: 2100, commissions: 1470, expenses: 260 },
    { date: "Jun", revenue: 2380, commissions: 1666, expenses: 280 },
    { date: "Jul", revenue: 2650, commissions: 1855, expenses: 300 },
    { date: "Aug", revenue: 2920, commissions: 2044, expenses: 320 },
  ];

  const trafficData = [
    { date: "01", organic: 4200, social: 1800, direct: 900, referral: 600 },
    { date: "08", organic: 4800, social: 2100, direct: 1100, referral: 750 },
    { date: "15", organic: 5200, social: 2400, direct: 1300, referral: 850 },
    { date: "22", organic: 5800, social: 2700, direct: 1500, referral: 950 },
    { date: "29", organic: 6400, social: 3000, direct: 1700, referral: 1100 },
  ];

  const conversionFunnelData = [
    { stage: "Visitors", value: 12543, color: "#3b82f6" },
    { stage: "Content Views", value: 8765, color: "#6366f1" },
    { stage: "Email Signups", value: 2341, color: "#8b5cf6" },
    { stage: "Affiliate Clicks", value: 1567, color: "#a855f7" },
    { stage: "Conversions", value: 423, color: "#c084fc" },
  ];

  const topContentData = [
    {
      title: "Ultimate Guide to Affiliate Marketing",
      views: 3245,
      revenue: 892.5,
      ctr: 12.4,
    },
    {
      title: "Best Productivity Tools 2024",
      views: 2876,
      revenue: 743.2,
      ctr: 9.8,
    },
    {
      title: "Email Marketing Automation Guide",
      views: 2543,
      revenue: 654.3,
      ctr: 8.9,
    },
    {
      title: "Social Media Strategy for Business",
      views: 2234,
      revenue: 567.8,
      ctr: 7.6,
    },
    {
      title: "SEO Optimization Techniques",
      views: 1987,
      revenue: 456.9,
      ctr: 6.8,
    },
  ];

  const deviceData = [
    { name: "Desktop", value: 45, color: "#3b82f6" },
    { name: "Mobile", value: 35, color: "#10b981" },
    { name: "Tablet", value: 20, color: "#f59e0b" },
  ];

  const timeToConvertData = [
    { period: "0-1 days", conversions: 120, percentage: 28.4 },
    { period: "2-7 days", conversions: 95, percentage: 22.5 },
    { period: "8-14 days", conversions: 78, percentage: 18.4 },
    { period: "15-30 days", conversions: 65, percentage: 15.4 },
    { period: "30+ days", conversions: 65, percentage: 15.3 },
  ];

  const keyMetrics = {
    totalRevenue: { value: 18420.75, change: 24.5, trend: "up" },
    avgOrderValue: { value: 43.56, change: 8.2, trend: "up" },
    conversionRate: { value: 3.37, change: -2.1, trend: "down" },
    clickThroughRate: { value: 12.8, change: 15.4, trend: "up" },
    customerLifetimeValue: { value: 156.8, change: 18.9, trend: "up" },
    returnOnAdSpend: { value: 4.2, change: -5.3, trend: "down" },
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const StatCard = ({
    title,
    value,
    change,
    trend,
    icon: Icon,
    suffix = "",
  }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === "number" && value > 1000
            ? `$${value.toLocaleString()}`
            : value}
          {suffix}
        </div>
        <div className="flex items-center space-x-1 mt-2">
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span
            className={`text-xs ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {Math.abs(change)}% from last period
          </span>
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
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your affiliate marketing performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Calendar className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value={keyMetrics.totalRevenue.value}
          change={keyMetrics.totalRevenue.change}
          trend={keyMetrics.totalRevenue.trend}
          icon={DollarSign}
        />
        <StatCard
          title="Average Order Value"
          value={keyMetrics.avgOrderValue.value}
          change={keyMetrics.avgOrderValue.change}
          trend={keyMetrics.avgOrderValue.trend}
          icon={Target}
          suffix=""
        />
        <StatCard
          title="Conversion Rate"
          value={keyMetrics.conversionRate.value}
          change={keyMetrics.conversionRate.change}
          trend={keyMetrics.conversionRate.trend}
          icon={Zap}
          suffix="%"
        />
        <StatCard
          title="Click-Through Rate"
          value={keyMetrics.clickThroughRate.value}
          change={keyMetrics.clickThroughRate.change}
          trend={keyMetrics.clickThroughRate.trend}
          icon={MousePointer}
          suffix="%"
        />
        <StatCard
          title="Customer LTV"
          value={keyMetrics.customerLifetimeValue.value}
          change={keyMetrics.customerLifetimeValue.change}
          trend={keyMetrics.customerLifetimeValue.trend}
          icon={Users}
        />
        <StatCard
          title="Return on Ad Spend"
          value={keyMetrics.returnOnAdSpend.value}
          change={keyMetrics.returnOnAdSpend.change}
          trend={keyMetrics.returnOnAdSpend.trend}
          icon={Award}
          suffix="x"
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        {/* Revenue Analytics */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Revenue Trends</span>
                </CardTitle>
                <CardDescription>
                  Monthly revenue, commissions, and expenses breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="revenue"
                      fill="#3b82f6"
                      name="Total Revenue"
                    />
                    <Bar
                      dataKey="commissions"
                      fill="#10b981"
                      name="Commissions"
                    />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Revenue Growth</span>
                </CardTitle>
                <CardDescription>
                  Progressive revenue growth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      fill="url(#colorRevenue)"
                    />
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Traffic Analytics */}
        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Traffic Sources</span>
              </CardTitle>
              <CardDescription>
                Breakdown of traffic by source over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="organic"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                  />
                  <Area
                    type="monotone"
                    dataKey="social"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                  />
                  <Area
                    type="monotone"
                    dataKey="direct"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                  />
                  <Area
                    type="monotone"
                    dataKey="referral"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversion Analytics */}
        <TabsContent value="conversion" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Conversion Funnel</span>
                </CardTitle>
                <CardDescription>
                  Track your conversion funnel performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionFunnelData.map((stage, index) => (
                    <div
                      key={stage.stage}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: stage.color }}
                        />
                        <span className="font-medium">{stage.stage}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {stage.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {index > 0
                            ? `${(
                                (stage.value /
                                  conversionFunnelData[index - 1].value) *
                                100
                              ).toFixed(1)}%`
                            : "100%"}
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
                  <span>Time to Convert</span>
                </CardTitle>
                <CardDescription>
                  How long it takes visitors to convert
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeToConvertData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="period" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="conversions" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Analytics */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Top Performing Content</span>
              </CardTitle>
              <CardDescription>
                Your highest converting content pieces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Content Title</th>
                      <th className="text-right py-2">Views</th>
                      <th className="text-right py-2">Revenue</th>
                      <th className="text-right py-2">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topContentData.map((content, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3">
                          <div className="font-medium">{content.title}</div>
                        </td>
                        <td className="text-right py-3">
                          {content.views.toLocaleString()}
                        </td>
                        <td className="text-right py-3">
                          ${content.revenue.toFixed(2)}
                        </td>
                        <td className="text-right py-3">
                          <Badge variant="secondary">{content.ctr}%</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Analytics */}
        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Device Breakdown</span>
                </CardTitle>
                <CardDescription>
                  How your audience accesses your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Engagement Metrics</span>
                </CardTitle>
                <CardDescription>
                  Key audience engagement indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        Avg. Session Duration
                      </span>
                      <span className="text-sm text-muted-foreground">
                        4m 32s
                      </span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        Pages per Session
                      </span>
                      <span className="text-sm text-muted-foreground">3.2</span>
                    </div>
                    <Progress value={64} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Bounce Rate</span>
                      <span className="text-sm text-muted-foreground">42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        Return Visitors
                      </span>
                      <span className="text-sm text-muted-foreground">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Analytics Actions</span>
          </CardTitle>
          <CardDescription>
            Quick actions to optimize your performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
            >
              <Share2 className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Optimize Top Content</div>
                <div className="text-sm text-muted-foreground">
                  Improve your highest performing pieces
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
            >
              <Target className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">A/B Test Campaigns</div>
                <div className="text-sm text-muted-foreground">
                  Test different strategies
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
            >
              <ArrowUpRight className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Scale High Performers</div>
                <div className="text-sm text-muted-foreground">
                  Increase investment in winners
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
