import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  LayoutDashboard, 
  FileText, 
  Share2, 
  Link as LinkIcon, 
  BarChart3, 
  CreditCard, 
  Settings, 
  ChevronLeft,
  Zap,
  Crown,
  TrendingUp
} from 'lucide-react'

const Sidebar = ({ open, setOpen, user }) => {
  const location = useLocation()
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Content Generator', href: '/dashboard/content', icon: FileText },
    { name: 'Social Media', href: '/dashboard/social', icon: Share2 },
    { name: 'Affiliate Links', href: '/dashboard/affiliates', icon: LinkIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings }
  ]

  // Mock usage data - in real app this would come from API
  const usageData = {
    content: { used: 7, limit: 10, percentage: 70 },
    social: { used: 32, limit: 50, percentage: 64 },
    emails: { used: 45, limit: 100, percentage: 45 },
    revenue: { current: 127.50, target: 500 }
  }

  const isCurrentPath = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-20"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AffiliateFlow</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="lg:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const current = isCurrentPath(item.href)
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${current 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`mr-3 h-5 w-5 ${current ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Usage Stats */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Monthly Usage</h3>
                <Badge variant="outline" className="text-xs">
                  {user?.subscription?.tier || 'Free'}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Content Generated</span>
                    <span>{usageData.content.used}/{usageData.content.limit}</span>
                  </div>
                  <Progress value={usageData.content.percentage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Social Posts</span>
                    <span>{usageData.social.used}/{usageData.social.limit}</span>
                  </div>
                  <Progress value={usageData.social.percentage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Emails Sent</span>
                    <span>{usageData.emails.used}/{usageData.emails.limit}</span>
                  </div>
                  <Progress value={usageData.emails.percentage} className="h-2" />
                </div>
              </div>
              
              {user?.subscription?.tier === 'free' && (
                <Link to="/dashboard/subscription">
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Revenue Tracker */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-green-900">This Month</h3>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-900">
                ${usageData.revenue.current.toFixed(2)}
              </div>
              <div className="text-xs text-green-700">
                Goal: ${usageData.revenue.target}
              </div>
              <Progress 
                value={(usageData.revenue.current / usageData.revenue.target) * 100} 
                className="h-2 mt-2" 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar

