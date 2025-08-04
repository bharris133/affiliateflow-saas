import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Crown, 
  Check, 
  X, 
  Zap, 
  Star,
  CreditCard,
  Calendar,
  TrendingUp,
  Users,
  Shield,
  Headphones
} from 'lucide-react'

const Subscription = ({ user }) => {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [selectedPlan, setSelectedPlan] = useState(user?.subscription?.tier || 'free')

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        '10 AI-generated articles per month',
        '50 social media posts per month',
        '100 emails per month',
        '25 affiliate links',
        'Instagram & Facebook integration',
        'Basic analytics',
        'Email support'
      ],
      limitations: [
        'No advanced AI features',
        'Limited social platforms',
        'Basic templates only',
        'No priority support'
      ],
      popular: false,
      color: 'border-gray-200'
    },
    {
      id: 'starter',
      name: 'Starter',
      price: { monthly: 29, yearly: 290 },
      description: 'For serious content creators',
      features: [
        '100 AI-generated articles per month',
        '500 social media posts per month',
        '1,000 emails per month',
        '100 affiliate links',
        'All social platform integrations',
        'Advanced analytics & reporting',
        'Content scheduling',
        'SEO optimization tools',
        'Priority email support'
      ],
      limitations: [
        'No white-label options',
        'Limited API access'
      ],
      popular: true,
      color: 'border-blue-500'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: { monthly: 79, yearly: 790 },
      description: 'For growing affiliate businesses',
      features: [
        'Unlimited AI-generated content',
        'Unlimited social media posts',
        'Unlimited emails',
        'Unlimited affiliate links',
        'All integrations + API access',
        'Advanced automation workflows',
        'A/B testing capabilities',
        'Custom templates',
        'Team collaboration (5 users)',
        'Phone & chat support',
        'Revenue optimization tools'
      ],
      limitations: [
        'No white-label options'
      ],
      popular: false,
      color: 'border-purple-500'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 199, yearly: 1990 },
      description: 'For large-scale operations',
      features: [
        'Everything in Professional',
        'White-label solution',
        'Custom integrations',
        'Dedicated account manager',
        'Unlimited team members',
        'Custom training & onboarding',
        'SLA guarantee',
        'Advanced security features',
        'Custom reporting',
        'Priority feature requests'
      ],
      limitations: [],
      popular: false,
      color: 'border-green-500'
    }
  ]

  const currentPlan = plans.find(plan => plan.id === selectedPlan)
  const savings = billingCycle === 'yearly' ? 20 : 0

  const handleUpgrade = (planId) => {
    // In real app, this would integrate with Stripe
    console.log('Upgrading to plan:', planId)
    setSelectedPlan(planId)
  }

  const formatPrice = (price) => {
    if (price === 0) return 'Free'
    return `$${price}`
  }

  const getYearlyPrice = (monthlyPrice) => {
    return monthlyPrice * 12 * (1 - savings / 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="text-gray-600 mt-2">
          Scale your affiliate marketing business with the right tools and features.
        </p>
      </div>

      {/* Current Plan Status */}
      {user?.subscription && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Crown className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Current Plan: {currentPlan?.name}</h3>
                  <p className="text-gray-600">
                    {currentPlan?.price.monthly === 0 ? 'Free forever' : 
                     `$${currentPlan?.price.monthly}/month • Renews on March 15, 2024`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="bg-white">
                  {user.subscription.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-sm ${billingCycle === 'monthly' ? 'font-medium' : 'text-gray-500'}`}>
          Monthly
        </span>
        <Switch
          checked={billingCycle === 'yearly'}
          onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
        />
        <span className={`text-sm ${billingCycle === 'yearly' ? 'font-medium' : 'text-gray-500'}`}>
          Yearly
        </span>
        {billingCycle === 'yearly' && (
          <Badge className="bg-green-100 text-green-800">Save 20%</Badge>
        )}
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">
                  <Star className="mr-1 h-3 w-3" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <div className="text-3xl font-bold">
                  {formatPrice(billingCycle === 'yearly' ? Math.round(getYearlyPrice(plan.price.monthly) / 12) : plan.price.monthly)}
                </div>
                {plan.price.monthly > 0 && (
                  <div className="text-sm text-gray-500">
                    per month{billingCycle === 'yearly' && ', billed annually'}
                  </div>
                )}
                {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                  <div className="text-xs text-green-600 mt-1">
                    Save ${(plan.price.monthly * 12) - getYearlyPrice(plan.price.monthly)} per year
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <X className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-500">{limitation}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className={`w-full ${
                  plan.id === selectedPlan 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                }`}
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.id === selectedPlan}
              >
                {plan.id === selectedPlan ? 'Current Plan' : 
                 plan.price.monthly === 0 ? 'Get Started' : 'Upgrade Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
          <CardDescription>Compare features across all plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  {plans.map(plan => (
                    <th key={plan.id} className="text-center py-3 px-4">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'AI Content Generation', values: ['10/month', '100/month', 'Unlimited', 'Unlimited'] },
                  { feature: 'Social Media Posts', values: ['50/month', '500/month', 'Unlimited', 'Unlimited'] },
                  { feature: 'Email Campaigns', values: ['100/month', '1,000/month', 'Unlimited', 'Unlimited'] },
                  { feature: 'Affiliate Links', values: ['25', '100', 'Unlimited', 'Unlimited'] },
                  { feature: 'Analytics & Reporting', values: ['Basic', 'Advanced', 'Advanced', 'Custom'] },
                  { feature: 'Team Members', values: ['1', '1', '5', 'Unlimited'] },
                  { feature: 'API Access', values: ['❌', '❌', '✅', '✅'] },
                  { feature: 'White Label', values: ['❌', '❌', '❌', '✅'] },
                  { feature: 'Support', values: ['Email', 'Priority Email', 'Phone & Chat', 'Dedicated Manager'] }
                ].map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                    {row.values.map((value, valueIndex) => (
                      <td key={valueIndex} className="py-3 px-4 text-center text-sm">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Usage</CardTitle>
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
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Social Posts</span>
                  <span>32/50</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Emails Sent</span>
                  <span>45/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Billing Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-sm">•••• •••• •••• 4242</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Next billing: March 15, 2024</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Update Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Headphones className="h-4 w-4 text-blue-600" />
                <span className="text-sm">24/7 Support Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm">30-day Money Back Guarantee</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Can I change my plan anytime?</h4>
              <p className="text-sm text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing differences.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">What happens if I exceed my limits?</h4>
              <p className="text-sm text-gray-600">
                We'll notify you when you're approaching your limits. You can upgrade your plan or 
                wait until the next billing cycle for your limits to reset.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Is there a free trial?</h4>
              <p className="text-sm text-gray-600">
                Our Free plan gives you access to core features forever. For paid plans, 
                we offer a 14-day free trial with full access to all features.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">How does billing work?</h4>
              <p className="text-sm text-gray-600">
                You're billed monthly or annually based on your chosen plan. All payments are 
                processed securely through Stripe, and you can cancel anytime.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Subscription

