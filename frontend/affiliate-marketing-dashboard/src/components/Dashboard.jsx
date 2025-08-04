import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  Award
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const Dashboard = ({ user }) => {
  const [timeRange, setTimeRange] = useState('7d')
  
  // Mock data - in real app this would come from API
  const stats = {
    revenue: { current: 1247.50, previous: 892.30, change: 39.8 },
    visitors: { current: 12543, previous: 9876, change: 27.0 },
    content: { current: 47, previous: 32, change: 46.9 },
    conversion: { current: 3.2, previous: 2.8, change: 14.3 }
  }

  const revenueData = [
    { date: 'Jan 25', revenue: 120, clicks: 450 },
    { date: 'Jan 26', revenue: 180, clicks: 520 },
    { date: 'Jan 27', revenue: 95, clicks: 380 },
    { date: 'Jan 28', revenue: 240, clicks: 680 },
    { date: 'Jan 29', revenue: 165, clicks: 590 },
    { date: 'Jan 30', revenue: 310, clicks: 820 },
    { date: 'Jan 31', revenue: 275, clicks: 750 }
  ]

  const contentPerformance = [
    { name: 'Blog Posts', value: 45, color: '#3B82F6' },
    { name: 'Social Media', value: 30, color: '#8B5CF6' },
    { name: 'Email Campaigns', value: 25, color: '#10B981' }
  ]

  const topContent = [
    { title: 'Best Travel Credit Cards for Digital Nomads', views: 2847, revenue: 127.50, ctr: 4.2 },
    { title: 'Ultimate Guide to Remote Work Tools', views: 1923, revenue: 89.30, ctr: 3.8 },
    { title: 'Southeast Asia Travel Itinerary', views: 1654, revenue: 76.20, ctr: 3.1 },
    { title: 'Productivity Apps for Entrepreneurs', views: 1432, revenue: 68.90, ctr: 2.9 }
  ]

  const recentActivity = [
    { type: 'content', message: 'New blog post published: "Travel Insurance Guide"', time: '2 hours ago' },
    { type: 'social', message: 'Instagram post reached 5K impressions', time: '4 hours ago' },
    { type: 'revenue', message: 'Affiliate commission earned: $45.20', time: '6 hours ago' },
    { type: 'email', message: 'Email campaign sent to 1,247 subscribers', time: '8 hours ago' }
  ]

  const getStatIcon = (type) => {
    switch (type) {
      case 'revenue': return <DollarSign className="h-4 w-4" />
      case 'visitors': return <Users className="h-4 w-4" />
      case 'content': return <FileText className="h-4 w-4" />
      case 'conversion': return <Target className="h-4 w-4" />
      default: return <TrendingUp className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your affiliate business today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 7 days
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Zap className="mr-2 h-4 w-4" />
            Generate Content
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            {getStatIcon('revenue')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue.current)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +{stats.revenue.change}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
            {getStatIcon('visitors')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.visitors.current)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +{stats.visitors.change}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Pieces</CardTitle>
            {getStatIcon('content')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.content.current}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +{stats.content.change}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            {getStatIcon('conversion')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversion.current}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +{stats.conversion.change}% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Clicks</CardTitle>
            <CardDescription>Daily performance over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
            <CardDescription>Distribution of content types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentPerformance}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {contentPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription>Your highest earning content pieces this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContent.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{content.title}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Eye className="mr-1 h-4 w-4" />
                      {formatNumber(content.views)} views
                    </div>
                    <div className="flex items-center">
                      <MousePointer className="mr-1 h-4 w-4" />
                      {content.ctr}% CTR
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    {formatCurrency(content.revenue)}
                  </div>
                  <Badge variant="outline" className="mt-1">
                    <Award className="mr-1 h-3 w-3" />
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your affiliate business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`
                    w-2 h-2 rounded-full mt-2
                    ${activity.type === 'revenue' ? 'bg-green-500' : 
                      activity.type === 'content' ? 'bg-blue-500' :
                      activity.type === 'social' ? 'bg-purple-500' : 'bg-orange-500'}
                  `} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to boost your earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate New Blog Post
                <ArrowUpRight className="ml-auto h-4 w-4" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Schedule Social Media Posts
                <ArrowUpRight className="ml-auto h-4 w-4" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Send Email Campaign
                <ArrowUpRight className="ml-auto h-4 w-4" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics Report
                <ArrowUpRight className="ml-auto h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Goals</CardTitle>
          <CardDescription>Track your progress towards this month's targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Revenue Goal</span>
                <span className="text-sm text-gray-600">$1,247 / $2,000</span>
              </div>
              <Progress value={62} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">62% complete</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Content Goal</span>
                <span className="text-sm text-gray-600">47 / 60</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">78% complete</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Visitor Goal</span>
                <span className="text-sm text-gray-600">12.5K / 15K</span>
              </div>
              <Progress value={83} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">83% complete</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

