import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, SkipForward, RotateCcw, HelpCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const DemoBot = ({ isOpen, onClose, currentPage = 'dashboard' }) => {
  const [currentTour, setCurrentTour] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const intervalRef = useRef(null);

  // Demo tours for different pages
  const demoTours = {
    dashboard: {
      title: "Dashboard Overview",
      description: "Learn how to navigate your AffiliateFlow dashboard",
      steps: [
        {
          target: ".sidebar",
          title: "Navigation Sidebar",
          content: "Use the sidebar to navigate between different sections of your dashboard. Each icon represents a different feature.",
          position: "right",
          highlight: true
        },
        {
          target: ".stats-cards",
          title: "Performance Overview",
          content: "These cards show your key metrics at a glance - revenue, clicks, conversions, and growth rates.",
          position: "bottom",
          highlight: true
        },
        {
          target: ".revenue-chart",
          title: "Revenue Analytics",
          content: "Track your earnings over time with detailed revenue analytics and forecasting.",
          position: "top",
          highlight: true
        },
        {
          target: ".recent-activity",
          title: "Recent Activity",
          content: "Stay updated with your latest affiliate activities, clicks, and conversions.",
          position: "left",
          highlight: true
        }
      ]
    },
    contentGenerator: {
      title: "AI Content Generation",
      description: "Create high-converting affiliate content with AI",
      steps: [
        {
          target: ".content-type-selector",
          title: "Content Types",
          content: "Choose from various content types: blog posts, product reviews, social media posts, and email campaigns.",
          position: "bottom",
          highlight: true
        },
        {
          target: ".ai-prompt-input",
          title: "AI Prompt",
          content: "Describe what you want to create. Be specific about your target audience, product, and desired tone.",
          position: "top",
          highlight: true
        },
        {
          target: ".keywords-input",
          title: "SEO Keywords",
          content: "Add relevant keywords to optimize your content for search engines and better rankings.",
          position: "right",
          highlight: true
        },
        {
          target: ".generate-button",
          title: "Generate Content",
          content: "Click to generate AI-powered content. The system will create optimized, engaging content in seconds.",
          position: "top",
          highlight: true
        }
      ]
    },
    socialMedia: {
      title: "Social Media Automation",
      description: "Automate your social media presence across 10+ platforms",
      steps: [
        {
          target: ".platform-selector",
          title: "Platform Selection",
          content: "Choose which social media platforms to post to. You can select multiple platforms for cross-posting.",
          position: "bottom",
          highlight: true
        },
        {
          target: ".content-editor",
          title: "Content Editor",
          content: "Create or edit your social media content. The editor adapts content for each platform's requirements.",
          position: "left",
          highlight: true
        },
        {
          target: ".scheduling-calendar",
          title: "Smart Scheduling",
          content: "Schedule posts for optimal engagement times. AI suggests the best times based on your audience.",
          position: "top",
          highlight: true
        },
        {
          target: ".analytics-preview",
          title: "Performance Analytics",
          content: "Monitor engagement, reach, and conversions across all your social media platforms.",
          position: "right",
          highlight: true
        }
      ]
    },
    affiliateLinks: {
      title: "Affiliate Link Management",
      description: "Track and optimize your affiliate links for maximum conversions",
      steps: [
        {
          target: ".link-creator",
          title: "Link Creation",
          content: "Create trackable affiliate links with custom parameters and UTM codes for better attribution.",
          position: "bottom",
          highlight: true
        },
        {
          target: ".link-analytics",
          title: "Link Analytics",
          content: "Monitor clicks, conversions, and revenue for each affiliate link in real-time.",
          position: "top",
          highlight: true
        },
        {
          target: ".ab-testing",
          title: "A/B Testing",
          content: "Test different link placements, descriptions, and call-to-actions to optimize conversions.",
          position: "right",
          highlight: true
        },
        {
          target: ".fraud-protection",
          title: "Fraud Protection",
          content: "Advanced fraud detection protects your links from invalid clicks and ensures accurate tracking.",
          position: "left",
          highlight: true
        }
      ]
    },
    analytics: {
      title: "Advanced Analytics",
      description: "Deep insights into your affiliate marketing performance",
      steps: [
        {
          target: ".revenue-dashboard",
          title: "Revenue Dashboard",
          content: "Comprehensive revenue tracking with forecasting and trend analysis across all your campaigns.",
          position: "bottom",
          highlight: true
        },
        {
          target: ".conversion-funnel",
          title: "Conversion Funnel",
          content: "Visualize your customer journey from first click to final conversion to identify optimization opportunities.",
          position: "top",
          highlight: true
        },
        {
          target: ".audience-insights",
          title: "Audience Insights",
          content: "Understand your audience demographics, behavior patterns, and preferences for better targeting.",
          position: "right",
          highlight: true
        },
        {
          target: ".competitor-analysis",
          title: "Competitor Analysis",
          content: "Benchmark your performance against industry standards and competitor strategies.",
          position: "left",
          highlight: true
        }
      ]
    }
  };

  // Feature demonstrations
  const featureDemo = {
    aiContentGeneration: {
      title: "AI Content Generation Demo",
      steps: [
        "Select 'Blog Post' as content type",
        "Enter prompt: 'Write a review for wireless headphones targeting fitness enthusiasts'",
        "Add keywords: 'wireless headphones, fitness, workout, bluetooth'",
        "Click Generate and watch AI create optimized content",
        "Review and edit the generated content",
        "Publish directly to your website or save as draft"
      ]
    },
    socialMediaPosting: {
      title: "Multi-Platform Social Media Demo",
      steps: [
        "Select platforms: Instagram, Facebook, Twitter, LinkedIn",
        "Upload or generate an image for your post",
        "Write your caption with hashtags and mentions",
        "AI optimizes content for each platform automatically",
        "Schedule for optimal posting times",
        "Monitor engagement and performance in real-time"
      ]
    },
    affiliateLinkTracking: {
      title: "Affiliate Link Tracking Demo",
      steps: [
        "Paste your original affiliate link",
        "Add custom parameters and UTM codes",
        "Generate shortened, trackable link",
        "Embed link in your content",
        "Monitor clicks and conversions in real-time",
        "Analyze performance and optimize placement"
      ]
    }
  };

  useEffect(() => {
    if (currentPage && demoTours[currentPage]) {
      setCurrentTour(demoTours[currentPage]);
      setCurrentStep(0);
    }
  }, [currentPage]);

  useEffect(() => {
    if (isPlaying && currentTour) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= currentTour.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000); // 4 seconds per step
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentTour]);

  const startTour = (tourKey) => {
    setCurrentTour(demoTours[tourKey]);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const nextStep = () => {
    if (currentTour && currentStep < currentTour.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetTour = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Demo Bot Panel */}
      <div className="fixed right-4 top-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">AffiliateFlow Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {!currentTour ? (
            // Tour Selection
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Choose a guided tour:</h4>
              <div className="space-y-2">
                {Object.entries(demoTours).map(([key, tour]) => (
                  <button
                    key={key}
                    onClick={() => startTour(key)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{tour.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{tour.description}</div>
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Feature Demos:</h4>
                <div className="space-y-2">
                  {Object.entries(featureDemo).map(([key, demo]) => (
                    <button
                      key={key}
                      className="w-full text-left p-2 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors text-sm"
                    >
                      <div className="font-medium text-gray-900">{demo.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Active Tour
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">{currentTour.title}</h4>
                <p className="text-sm text-gray-600">{currentTour.description}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Step {currentStep + 1} of {currentTour.steps.length}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={togglePlayPause}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Play className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={resetTour}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / currentTour.steps.length) * 100}%` }}
                  ></div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-gray-900">
                    {currentTour.steps[currentStep]?.title}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {currentTour.steps[currentStep]?.content}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm">Previous</span>
                </button>

                <button
                  onClick={nextStep}
                  disabled={currentStep >= currentTour.steps.length - 1}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="text-sm">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setCurrentTour(null)}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to tour selection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Highlight Overlay */}
      {currentTour && currentTour.steps[currentStep]?.highlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 pointer-events-none">
          <div
            className="absolute border-2 border-blue-400 rounded-lg shadow-lg"
            style={{
              // This would be calculated based on the target element's position
              top: '100px',
              left: '200px',
              width: '300px',
              height: '200px',
            }}
          >
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="fixed bg-gray-900 text-white text-sm rounded-lg px-3 py-2 z-50 pointer-events-none"
          style={{
            top: tooltipPosition.y,
            left: tooltipPosition.x,
          }}
        >
          Click here to continue the tour
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </>
  );
};

// Help Button Component
export const HelpButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
      title="Get Help & Tutorials"
    >
      <HelpCircle className="w-6 h-6" />
    </button>
  );
};

// Onboarding Checklist Component
export const OnboardingChecklist = ({ isOpen, onClose, onComplete }) => {
  const [completedSteps, setCompletedSteps] = useState([]);

  const onboardingSteps = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Add your name, email, and profile picture',
      action: 'Go to Profile',
      completed: false
    },
    {
      id: 'connect-accounts',
      title: 'Connect Social Media Accounts',
      description: 'Link your social media platforms for automated posting',
      action: 'Connect Accounts',
      completed: false
    },
    {
      id: 'first-content',
      title: 'Generate Your First Content',
      description: 'Create AI-powered affiliate content',
      action: 'Create Content',
      completed: false
    },
    {
      id: 'affiliate-links',
      title: 'Add Affiliate Links',
      description: 'Set up tracking for your affiliate programs',
      action: 'Add Links',
      completed: false
    },
    {
      id: 'first-post',
      title: 'Schedule Your First Post',
      description: 'Share content across your social media platforms',
      action: 'Schedule Post',
      completed: false
    }
  ];

  const toggleStep = (stepId) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const completionPercentage = (completedSteps.length / onboardingSteps.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Get Started with AffiliateFlow</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{completedSteps.length}/{onboardingSteps.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            {onboardingSteps.map((step) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  completedSteps.includes(step.id)
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleStep(step.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                      completedSteps.includes(step.id)
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {completedSteps.includes(step.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      completedSteps.includes(step.id) ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      completedSteps.includes(step.id) ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </p>
                    {!completedSteps.includes(step.id) && (
                      <button className="text-sm text-blue-600 hover:text-blue-700 mt-2 font-medium">
                        {step.action} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {completionPercentage === 100 && (
            <div className="mt-6 p-4 bg-green-100 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">🎉 Congratulations!</h4>
              <p className="text-sm text-green-700 mb-3">
                You've completed the onboarding process. You're ready to start earning with AffiliateFlow!
              </p>
              <button
                onClick={onComplete}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Using AffiliateFlow
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoBot;

