import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Link as LinkIcon, 
  Plus, 
  Copy, 
  Edit, 
  Trash2, 
  ExternalLink,
  TrendingUp,
  DollarSign,
  MousePointer,
  Eye,
  BarChart3,
  Settings,
  Search,
  Filter
} from 'lucide-react'

const AffiliateLinks = ({ user }) => {
  const [newLink, setNewLink] = useState({
    originalUrl: '',
    productName: '',
    category: '',
    program: '',
    commissionRate: ''
  })

  const affiliatePrograms = [
    { id: 'travelpayouts', name: 'TravelPayouts', commission: '3-7%', category: 'Travel' },
    { id: 'clickbank', name: 'ClickBank', commission: '50-75%', category: 'Digital Products' },
    { id: 'amazon', name: 'Amazon Associates', commission: '1-10%', category: 'Physical Products' },
    { id: 'booking', name: 'Booking.com', commission: '4%', category: 'Hotels' },
    { id: 'wise', name: 'Wise', commission: '$50', category: 'Financial Services' }
  ]

  const affiliateLinks = [
    {
      id: 1,
      productName: 'Chase Sapphire Preferred Credit Card',
      originalUrl: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred',
      affiliateUrl: 'https://affiliate.chase.com/refer/12345',
      shortUrl: 'https://bit.ly/chase-sapphire',
      program: 'Chase',
      category: 'Credit Cards',
      commissionRate: '$95',
      clicks: 1247,
      conversions: 23,
      revenue: 2185.00,
      conversionRate: 1.8,
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      productName: 'Wise Multi-Currency Card',
      originalUrl: 'https://wise.com/us/card/',
      affiliateUrl: 'https://wise.com/invite/12345',
      shortUrl: 'https://bit.ly/wise-card',
      program: 'Wise',
      category: 'Financial Services',
      commissionRate: '$50',
      clicks: 892,
      conversions: 34,
      revenue: 1700.00,
      conversionRate: 3.8,
      status: 'active',
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      productName: 'Notion Productivity Suite',
      originalUrl: 'https://notion.so',
      affiliateUrl: 'https://affiliate.notion.so/12345',
      shortUrl: 'https://bit.ly/notion-pro',
      program: 'Notion',
      category: 'Productivity',
      commissionRate: '50%',
      clicks: 654,
      conversions: 12,
      revenue: 480.00,
      conversionRate: 1.8,
      status: 'active',
      createdAt: '2024-01-08'
    }
  ]

  const topPerformers = affiliateLinks
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3)

  const totalStats = {
    totalClicks: affiliateLinks.reduce((sum, link) => sum + link.clicks, 0),
    totalConversions: affiliateLinks.reduce((sum, link) => sum + link.conversions, 0),
    totalRevenue: affiliateLinks.reduce((sum, link) => sum + link.revenue, 0),
    avgConversionRate: affiliateLinks.reduce((sum, link) => sum + link.conversionRate, 0) / affiliateLinks.length
  }

  const handleCreateLink = () => {
    // In real app, this would make API call
    console.log('Creating affiliate link:', newLink)
    setNewLink({
      originalUrl: '',
      productName: '',
      category: '',
      program: '',
      commissionRate: ''
    })
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
          <h1 className="text-2xl font-bold text-gray-900">Affiliate Links</h1>
          <p className="text-gray-600 mt-1">
            Manage and optimize your affiliate marketing links for maximum revenue.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Link Settings
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add New Link
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalConversions}</div>
            <p className="text-xs text-muted-foreground">
              {totalStats.avgConversionRate.toFixed(1)}% avg conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +23% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliateLinks.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {affiliatePrograms.length} programs
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="links" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="links">My Links</TabsTrigger>
          <TabsTrigger value="create">Create Link</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* My Links Tab */}
        <TabsContent value="links" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search links..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {affiliateLinks.map((link) => (
              <Card key={link.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">{link.productName}</h3>
                        <Badge variant={link.status === 'active' ? 'default' : 'secondary'}>
                          {link.status}
                        </Badge>
                        <Badge variant="outline">{link.category}</Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">Program:</span>
                          <span>{link.program}</span>
                          <span className="font-medium">Commission:</span>
                          <span className="text-green-600">{link.commissionRate}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Short URL:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">{link.shortUrl}</code>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard(link.shortUrl)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{link.clicks.toLocaleString()}</div>
                        <div className="text-gray-500">Clicks</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{link.conversions}</div>
                        <div className="text-gray-500">Conversions</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">${link.revenue.toFixed(2)}</div>
                        <div className="text-gray-500">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{link.conversionRate}%</div>
                        <div className="text-gray-500">CVR</div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4" />
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

        {/* Create Link Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Affiliate Link</CardTitle>
                <CardDescription>
                  Add a new product or service to your affiliate portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Chase Sapphire Preferred Credit Card"
                    value={newLink.productName}
                    onChange={(e) => setNewLink({...newLink, productName: e.target.value})}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="originalUrl">Original URL</Label>
                  <Input
                    id="originalUrl"
                    placeholder="https://example.com/product"
                    value={newLink.originalUrl}
                    onChange={(e) => setNewLink({...newLink, originalUrl: e.target.value})}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="program">Affiliate Program</Label>
                    <Select value={newLink.program} onValueChange={(value) => setNewLink({...newLink, program: value})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {affiliatePrograms.map((program) => (
                          <SelectItem key={program.id} value={program.name}>
                            {program.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newLink.category} onValueChange={(value) => setNewLink({...newLink, category: value})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="productivity">Productivity</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="commissionRate">Commission Rate</Label>
                  <Input
                    id="commissionRate"
                    placeholder="e.g., 5% or $50"
                    value={newLink.commissionRate}
                    onChange={(e) => setNewLink({...newLink, commissionRate: e.target.value})}
                    className="mt-2"
                  />
                </div>

                <Button 
                  onClick={handleCreateLink}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!newLink.productName || !newLink.originalUrl}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Affiliate Link
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Links</CardTitle>
                <CardDescription>Your highest earning affiliate links</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((link, index) => (
                    <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{link.productName}</div>
                          <div className="text-xs text-gray-500">{link.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">${link.revenue.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{link.conversions} conversions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Available Affiliate Programs</h2>
            <p className="text-gray-600">Connect with top affiliate programs to maximize your earnings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {affiliatePrograms.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <CardDescription>{program.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Commission:</span>
                      <span className="font-medium text-green-600">{program.commission}</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      Connect Program
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Link Performance Analytics</h2>
            <p className="text-gray-600">Detailed insights into your affiliate link performance</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Credit Cards', 'Financial Services', 'Productivity'].map((category) => {
                    const categoryLinks = affiliateLinks.filter(link => link.category === category)
                    const categoryRevenue = categoryLinks.reduce((sum, link) => sum + link.revenue, 0)
                    const categoryClicks = categoryLinks.reduce((sum, link) => sum + link.clicks, 0)
                    
                    return (
                      <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{category}</div>
                          <div className="text-sm text-gray-500">{categoryLinks.length} links</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${categoryRevenue.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">{categoryClicks} clicks</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {affiliateLinks.map((link) => (
                    <div key={link.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{link.productName}</span>
                        <span>{link.conversionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(link.conversionRate * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AffiliateLinks

