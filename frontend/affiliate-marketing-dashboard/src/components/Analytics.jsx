import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  MousePointer, 
  Eye,
  BarChart3,
  Calendar,
  Download,
  Filter,
  Target,
  Award
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

const Analytics = ({ user }) => {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  // Mock analytics data
  const overviewStats = {
    revenue: { current: 4247.50, previous: 3892.30, change: 9.1 },
    clicks: { current: 15643, previous: 12876, change: 21.5 },
    conversions: { current: 127, previous: 98, change: 29.6 },
    conversionRate: { current: 0.81, previous: 0.76, change: 6.6 }
  }

  const revenueData = [
    { date: 'Jan 1', revenue: 120, clicks: 450, conversions: 8 },
    { date: 'Jan 8', revenue: 180, clicks: 520, conversions: 12 },
    { date: 'Jan 15', revenue: 95, clicks: 380, conversions: 6 },
    { date: 'Jan 22', revenue: 240, clicks: 680, conversions: 15 },
    { date: 'Jan 29', revenue: 165, clicks: 590, conversions: 11 },
    { date: 'Feb 5', revenue: 310, clicks: 820, conversions: 18 },
    { date: 'Feb 12', revenue: 275, clicks: 750, conversions: 16 }
  ]

  const trafficSources = [
    { name: 'Organic Search', value: 45, color: '#3B82F6' },
    { name: 'Social Media', value: 30, color: '#8B5CF6' },
    { name: 'Direct Traffic', value: 15, color: '#10B981' },
    { name: 'Email Marketing', value: 10, color: '#F59E0B' }
  ]

  const topContent = [
    { title: 'Best Travel Credit Cards for Digital Nomads', views: 2847, clicks: 234, conversions: 12, revenue: 1127.50 },
    { title: 'Ultimate Guide to Remote Work Tools', views: 1923, clicks: 189, conversions: 8, revenue: 789.30 },
    { title: 'Southeast Asia Travel Itinerary', views: 1654, clicks: 156, conversions: 6, revenue: 576.20 },
    { title: 'Productivity Apps for Entrepreneurs', views: 1432, clicks: 134, conversions: 5, revenue: 468.90 }
  ]

  const deviceBreakdown = [
    { device: 'Desktop', sessions: 8234, percentage: 52.6 },
    { device: 'Mobile', sessions: 6123, percentage: 39.1 },
    { device: 'Tablet', sessions: 1298, percentage: 8.3 }
  ]

  const conversionFunnel = [
    { stage: 'Page Views', count: 15643, percentage: 100 },
    { stage: 'Link Clicks', count: 1247, percentage: 8.0 },
    { stage: 'Product Views', count: 456, percentage: 2.9 },
    { stage: 'Conversions', count: 127, percentage: 0.8 }
  ]

  const getStatIcon = (type) => {
    switch (type) {
      case 'revenue': return <DollarSign className="h-4 w-4" />
      case 'clicks': return <MousePointer className="h-4 w-4" />
      case 'conversions': return <Target className="h-4 w-4" />
      case 'conversionRate': return <TrendingUp className="h-4 w-4" />
      default: return <BarChart3 className="h-4 w-4" />
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

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getChangeIcon = (change) => {
    return change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your affiliate marketing performance and optimize for better results.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
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
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(overviewStats).map(([key, stat]) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {key === 'conversionRate' ? 'Conversion Rate' : key}
              </CardTitle>
              {getStatIcon(key)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {key === 'revenue' ? formatCurrency(stat.current) :
                 key === 'conversionRate' ? `${stat.current}%` :
                 formatNumber(stat.current)}
              </div>
              <div className={`flex items-center text-xs ${getChangeColor(stat.change)}`}>
                {getChangeIcon(stat.change)}
                <span className="ml-1">
                  {stat.change > 0 ? '+' : ''}{stat.change}% from last period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficSources}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>Sessions by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceBreakdown.map((device) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium">{device.device}</div>
                      <Badge variant="outline">{device.percentage}%</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-600 w-16 text-right">
                        {formatNumber(device.sessions)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Performance Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Your highest converting content pieces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{content.title}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Eye className="mr-1 h-4 w-4" />
                            {formatNumber(content.views)} views
                          </div>
                          <div className="flex items-center">
                            <MousePointer className="mr-1 h-4 w-4" />
                            {content.clicks} clicks
                          </div>
                          <div className="flex items-center">
                            <Target className="mr-1 h-4 w-4" />
                            {content.conversions} conversions
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(content.revenue)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {((content.conversions / content.clicks) * 100).toFixed(1)}% CVR
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Analysis Tab */}
        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic vs Clicks</CardTitle>
                <CardDescription>Relationship between page views and affiliate clicks</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} name="Clicks" />
                    <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} name="Conversions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources Performance</CardTitle>
                <CardDescription>Revenue by traffic source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficSources.map((source) => {
                    const revenue = (source.value / 100) * overviewStats.revenue.current
                    return (
                      <div key={source.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: source.color }}
                          ></div>
                          <div>
                            <div className="font-medium">{source.name}</div>
                            <div className="text-sm text-gray-500">{source.value}% of traffic</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(revenue)}</div>
                          <div className="text-sm text-gray-500">Revenue</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conversions Tab */}
        <TabsContent value="conversions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Track user journey from view to conversion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionFunnel.map((stage, index) => (
                    <div key={stage.stage} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{stage.stage}</span>
                        <span className="text-sm text-gray-600">{stage.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-8 relative">
                        <div 
                          className="bg-blue-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" 
                          style={{ width: `${stage.percentage}%` }}
                        >
                          {formatNumber(stage.count)}
                        </div>
                      </div>
                      {index < conversionFunnel.length - 1 && (
                        <div className="flex justify-center mt-2">
                          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate Trends</CardTitle>
                <CardDescription>Daily conversion rates over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                    <Line 
                      type="monotone" 
                      dataKey={(data) => ((data.conversions / data.clicks) * 100).toFixed(2)} 
                      stroke="#10B981" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Analysis Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Performance across different product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { category: 'Credit Cards', revenue: 2185 },
                    { category: 'Travel', revenue: 1247 },
                    { category: 'Productivity', revenue: 815 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Goals</CardTitle>
                <CardDescription>Track progress towards monthly targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Monthly Goal</span>
                      <span className="text-sm text-gray-600">$4,247 / $5,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">85% complete • $753 remaining</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Quarterly Goal</span>
                      <span className="text-sm text-gray-600">$11,234 / $15,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">75% complete • $3,766 remaining</p>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Projected Monthly</span>
                      <span className="text-lg font-bold text-green-600">$4,890</span>
                    </div>
                    <p className="text-sm text-gray-500">Based on current trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Analytics

