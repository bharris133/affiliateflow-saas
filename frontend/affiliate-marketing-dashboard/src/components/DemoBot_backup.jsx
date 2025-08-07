import React, { useState, useEffect, useRef } from "react";
import {
  X,
  RotateCcw,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import TourSelectionModal from "./TourSelectionModal";

const DemoBot = ({ isOpen, onClose, currentPage = "dashboard" }) => {
  const [currentTour, setCurrentTour] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightBounds, setHighlightBounds] = useState(null);
  const [showTourSelection, setShowTourSelection] = useState(false);
  const [completedTours, setCompletedTours] = useState([]);

  // Start dashboard tour automatically when opened
  useEffect(() => {
    if (isOpen && !currentTour) {
      startTour("dashboard");
    }
  }, [isOpen]);

  // Load completed tours from localStorage
  useEffect(() => {
    const completed = JSON.parse(localStorage.getItem('completedTours') || '[]');
    setCompletedTours(completed);
  }, []);

  // Demo tours for different pages
  const demoTours = {
    dashboard: {
      title: "Dashboard Overview",
      description: "Learn how to navigate your AffiliateFlow dashboard",
      steps: [
        {
          target: ".stats-cards",
          title: "Performance Overview",
          content:
            "These cards show your key metrics at a glance - revenue, clicks, conversions, and growth rates.",
          highlight: true,
        },
        {
          target: ".revenue-chart",
          title: "Revenue Analytics",
          content:
            "Track your earnings over time with detailed revenue analytics and forecasting.",
          highlight: true,
        },
        {
          target: ".sidebar",
          title: "Navigation Sidebar",
          content:
            "Use the sidebar to navigate between different sections of your dashboard. Each icon represents a different feature.",
          highlight: true,
        },
        {
          target: ".recent-activity",
          title: "Recent Activity",
          content:
            "Stay updated with your latest affiliate activities, clicks, and conversions.",
          highlight: true,
        },
      ],
    },
    contentGenerator: {
      title: "AI Content Generation",
      description: "Create high-converting affiliate content with AI",
      steps: [
        {
          target: ".content-type-selector",
          title: "Content Types",
          content:
            "Choose from various content types: blog posts, product reviews, social media posts, and email campaigns.",
          highlight: true,
        },
        {
          target: ".ai-prompt-input",
          title: "AI Prompt",
          content:
            "Describe what you want to create. Be specific about your target audience, product, and desired tone.",
          highlight: true,
        },
        {
          target: ".keywords-input",
          title: "SEO Keywords",
          content:
            "Add relevant keywords to optimize your content for search engines and better rankings.",
          highlight: true,
        },
        {
          target: ".template-selector",
          title: "Template System",
          content:
            "Pre-built templates for different niches and industries to jumpstart your content creation.",
          highlight: true,
        },
        {
          target: ".generate-button",
          title: "Generate Content",
          content:
            "Click to generate AI-powered content. The system will create optimized, engaging content in seconds.",
          highlight: true,
        },
        {
          target: ".content-preview",
          title: "Live Preview",
          content:
            "Review your generated content with markdown support and make edits before publishing.",
          highlight: true,
        },
      ],
    },
    socialMedia: {
      title: "Social Media Manager",
      description: "Automate your social media presence across 10+ platforms",
      steps: [
        {
          target: ".platform-cards",
          title: "Platform Selection",
          content:
            "Connect and manage multiple social media platforms from one dashboard. Each platform has specific optimization settings.",
          highlight: true,
        },
        {
          target: ".post-composer",
          title: "Post Creation",
          content:
            "Create posts with text, images, and hashtags. The system adapts content for each platform automatically.",
          highlight: true,
        },
        {
          target: ".scheduling-calendar",
          title: "Visual Scheduling",
          content:
            "Schedule posts across all platforms simultaneously with calendar-based posting and optimal timing suggestions.",
          highlight: true,
        },
        {
          target: ".content-calendar",
          title: "Content Calendar",
          content:
            "View and manage your content calendar. Drag and drop to reschedule posts or see upcoming content.",
          highlight: true,
        },
        {
          target: ".engagement-analytics",
          title: "Engagement Analytics",
          content:
            "Track engagement metrics across all platforms. See which content performs best and optimize your strategy.",
          highlight: true,
        },
      ],
    },
    analytics: {
      title: "Advanced Analytics",
      description: "Deep dive into your affiliate marketing performance",
      steps: [
        {
          target: ".revenue-tracking",
          title: "Revenue Tracking",
          content:
            "Monitor your revenue streams, commission rates, and payment schedules across all affiliate programs.",
          highlight: true,
        },
        {
          target: ".traffic-sources",
          title: "Traffic Analysis",
          content:
            "Understand where your traffic comes from and which sources convert best for optimization.",
          highlight: true,
        },
        {
          target: ".conversion-funnel",
          title: "Conversion Funnel",
          content:
            "Analyze your conversion funnel to identify bottlenecks and opportunities for improvement.",
          highlight: true,
        },
        {
          target: ".audience-insights",
          title: "Audience Insights",
          content:
            "Understand your audience demographics, behavior patterns, and preferences for better targeting.",
          highlight: true,
        },
        {
          target: ".competitor-analysis",
          title: "Competitor Analysis",
          content:
            "Benchmark your performance against industry standards and competitor strategies.",
          highlight: true,
        },
        {
          target: ".performance-charts",
          title: "Interactive Charts",
          content:
            "Beautiful charts showing revenue, traffic, and performance with detailed trend analysis.",
          highlight: true,
        },
      ],
    },
    affiliateLinks: {
      title: "Affiliate Link Management",
      description: "Create, track, and optimize your affiliate links",
      steps: [
        {
          target: ".link-creator",
          title: "Link Creation",
          content:
            "Easy affiliate link generation and customization with UTM parameters and tracking codes.",
          highlight: true,
        },
        {
          target: ".link-shortener",
          title: "Link Shortening",
          content:
            "Generate shortened, trackable links that are perfect for social media and email campaigns.",
          highlight: true,
        },
        {
          target: ".click-tracking",
          title: "Click Tracking",
          content:
            "Monitor click-through rates and conversion metrics in real-time with detailed analytics.",
          highlight: true,
        },
        {
          target: ".ab-testing",
          title: "A/B Testing",
          content:
            "Test different link placements and formats to optimize your conversion rates.",
          highlight: true,
        },
        {
          target: ".revenue-attribution",
          title: "Revenue Attribution",
          content:
            "Track commission earnings and payout schedules with detailed revenue attribution.",
          highlight: true,
        },
      ],
    },
    emailMarketing: {
      title: "Email Marketing",
      description: "Manage email campaigns and subscriber lists",
      steps: [
        {
          target: ".email-list-manager",
          title: "List Management",
          content:
            "Import and segment your email subscribers for targeted campaigns.",
          highlight: true,
        },
        {
          target: ".campaign-builder",
          title: "Campaign Creation",
          content:
            "Build professional email campaigns with drag-and-drop editor and templates.",
          highlight: true,
        },
        {
          target: ".automation-flows",
          title: "Automation Flows",
          content:
            "Set up automated email sequences for onboarding, nurturing, and sales.",
          highlight: true,
        },
        {
          target: ".email-analytics",
          title: "Email Analytics",
          content:
            "Track open rates, click rates, and conversions to optimize your email performance.",
          highlight: true,
        },
      ],
    },
    subscription: {
      title: "Subscription Management",
      description: "Manage your AffiliateFlow subscription and billing",
      steps: [
        {
          target: ".current-plan",
          title: "Current Plan",
          content:
            "View your current subscription plan details, features, and usage limits.",
          highlight: true,
        },
        {
          target: ".usage-metrics",
          title: "Usage Tracking",
          content:
            "Monitor your usage of AI content generation, social posts, and email sends.",
          highlight: true,
        },
        {
          target: ".upgrade-options",
          title: "Upgrade Options",
          content:
            "Explore higher tier plans with more features, higher limits, and advanced capabilities.",
          highlight: true,
        },
        {
          target: ".billing-history",
          title: "Billing History",
          content:
            "View your payment history, invoices, and manage payment methods.",
          highlight: true,
        },
      ],
    },
    settings: {
      title: "Settings & Configuration",
      description: "Customize your AffiliateFlow experience",
      steps: [
        {
          target: ".profile-settings",
          title: "Profile Settings",
          content:
            "Update your profile information, contact details, and preferences.",
          highlight: true,
        },
        {
          target: ".api-integrations",
          title: "API Integrations",
          content:
            "Configure integrations with OpenAI, Stripe, and social media platforms.",
          highlight: true,
        },
        {
          target: ".notification-preferences",
          title: "Notifications",
          content:
            "Customize your notification preferences for emails, alerts, and updates.",
          highlight: true,
        },
        {
          target: ".security-settings",
          title: "Security",
          content:
            "Manage your password, two-factor authentication, and account security.",
          highlight: true,
        },
      ],
    },
    onboarding: {
      title: "Complete Onboarding",
      description: "Get started with AffiliateFlow step by step",
      steps: [
        {
          target: ".welcome-message",
          title: "Welcome to AffiliateFlow",
          content:
            "Let's get you set up with everything you need to start earning with affiliate marketing.",
          highlight: true,
        },
        {
          target: ".profile-completion",
          title: "Complete Your Profile",
          content:
            "Add your name, email, and profile picture to personalize your experience.",
          highlight: true,
        },
        {
          target: ".connect-accounts",
          title: "Connect Social Media",
          content:
            "Link your social media platforms for automated posting and content sharing.",
          highlight: true,
        },
        {
          target: ".first-content",
          title: "Generate First Content",
          content:
            "Create your first piece of AI-powered affiliate content to get started.",
          highlight: true,
        },
        {
          target: ".setup-tracking",
          title: "Set Up Tracking",
          content:
            "Configure your affiliate links and tracking parameters for accurate attribution.",
          highlight: true,
        },
      ],
    },
  };

  // Enhanced highlighting logic
  const highlightElement = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setHighlightBounds({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });

      // Auto-scroll element into view
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });

      return true;
    }
    return false;
  };

  // Update highlight when step changes
  useEffect(() => {
    if (currentTour && currentTour.steps[currentStep]) {
      const step = currentTour.steps[currentStep];
      if (step.target && step.highlight) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          highlightElement(step.target);
        }, 100);
      } else {
        setHighlightBounds(null);
      }
    }
  }, [currentStep, currentTour]);

  const startTour = (tourKey) => {
    const tour = demoTours[tourKey];
    if (tour) {
      setCurrentTour(tour);
      setCurrentStep(0);
      // Highlight first element after a brief delay
      setTimeout(() => {
        if (tour.steps[0]?.target) {
          highlightElement(tour.steps[0].target);
        }
      }, 200);
    }
  };

  const nextStep = () => {
    if (currentTour && currentStep < currentTour.steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      // Highlight next element
      const nextStepData = currentTour.steps[newStep];
      if (nextStepData?.target) {
        setTimeout(() => highlightElement(nextStepData.target), 100);
      }
    } else if (currentTour && currentStep === currentTour.steps.length - 1) {
      // Tour completed - mark as complete
      markTourComplete(currentTour);
      closeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      // Highlight previous element
      const prevStepData = currentTour.steps[newStep];
      if (prevStepData?.target) {
        setTimeout(() => highlightElement(prevStepData.target), 100);
      }
    }
  };

  const closeTour = () => {
    setCurrentTour(null);
    setHighlightBounds(null);
    setCurrentStep(0);
    onClose();
  };

  // Show tour selection modal
  const showTourSelectionModal = () => {
    setShowTourSelection(true);
  };

  // Handle tour selection from modal
  const handleTourSelect = (tourId) => {
    setShowTourSelection(false);
    startTour(tourId);
  };

  // Mark tour as completed
  const markTourComplete = (tourId) => {
    const updated = [...completedTours, tourId];
    setCompletedTours(updated);
    localStorage.setItem('completedTours', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Full-Screen Interactive Tour Modal - Show during active tour */}
      {currentTour && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  AffiliateFlow Guide
                </h3>
              </div>
              <button
                onClick={closeTour}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Tour Title and Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentTour.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {currentTour.description}
                </p>
              </div>

              {/* Step Progress Indicator */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep + 1} of {currentTour.steps.length}
                </span>
                <div className="flex items-center space-x-2">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <RotateCcw className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        ((currentStep + 1) / currentTour.steps.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Current Step Content */}
              {currentTour.steps[currentStep] && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {currentTour.steps[currentStep].title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {currentTour.steps[currentStep].content}
                  </p>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`px-6 py-2 text-sm rounded-lg flex items-center space-x-2 transition-colors border ${
                    currentStep === 0
                      ? "text-gray-400 cursor-not-allowed border-gray-200"
                      : "text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={nextStep}
                  className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <span>
                    {currentStep === currentTour.steps.length - 1
                      ? "Finish"
                      : "Next"}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Back to tour selection */}
              <div className="text-center">
                <button
                  onClick={showTourSelectionModal}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1 mx-auto"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>Back to tour selection</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Highlight Overlay */}
      {currentTour && highlightBounds && (
        <>
          {/* Dark overlay with cutout for highlighted element */}
          <div className="fixed inset-0 z-40 pointer-events-none">
            {/* Top overlay */}
            <div
              className="absolute bg-black/50"
              style={{
                top: 0,
                left: 0,
                right: 0,
                height: `${highlightBounds.top}px`,
              }}
            />

            {/* Left overlay */}
            <div
              className="absolute bg-black/50"
              style={{
                top: `${highlightBounds.top}px`,
                left: 0,
                width: `${highlightBounds.left}px`,
                height: `${highlightBounds.height}px`,
              }}
            />

            {/* Right overlay */}
            <div
              className="absolute bg-black/50"
              style={{
                top: `${highlightBounds.top}px`,
                left: `${highlightBounds.left + highlightBounds.width}px`,
                right: 0,
                height: `${highlightBounds.height}px`,
              }}
            />

            {/* Bottom overlay */}
            <div
              className="absolute bg-black/50"
              style={{
                top: `${highlightBounds.top + highlightBounds.height}px`,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />

            {/* Blue highlight border around element */}
            <div
              className="absolute border-4 border-blue-400 rounded-lg shadow-lg"
              style={{
                top: `${highlightBounds.top - 4}px`,
                left: `${highlightBounds.left - 4}px`,
                width: `${highlightBounds.width + 8}px`,
                height: `${highlightBounds.height + 8}px`,
              }}
            >
              {/* Pulsing blue indicator ball */}
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tour Selection Modal */}
      {showTourSelection && (
        <TourSelectionModal
          tours={demoTours}
          completedTours={completedTours}
          onSelectTour={handleTourSelect}
          onClose={() => setShowTourSelection(false)}
        />
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
      id: "profile",
      title: "Complete Your Profile",
      description: "Add your name, email, and profile picture",
      action: "Go to Profile",
      completed: false,
    },
    {
      id: "connect-accounts",
      title: "Connect Social Media Accounts",
      description: "Link your social media platforms for automated posting",
      action: "Connect Accounts",
      completed: false,
    },
    {
      id: "first-content",
      title: "Generate Your First Content",
      description: "Create AI-powered affiliate content",
      action: "Create Content",
      completed: false,
    },
    {
      id: "affiliate-links",
      title: "Add Affiliate Links",
      description: "Set up tracking for your affiliate programs",
      action: "Add Links",
      completed: false,
    },
    {
      id: "first-post",
      title: "Schedule Your First Post",
      description: "Share content across your social media platforms",
      action: "Schedule Post",
      completed: false,
    },
  ];

  const toggleStep = (stepId) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId]
    );
  };

  const completionPercentage =
    (completedSteps.length / onboardingSteps.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Get Started with AffiliateFlow
          </h3>
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
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
              <span className="text-sm text-gray-500">
                {completedSteps.length}/{onboardingSteps.length}
              </span>
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
                className={`border rounded-lg p-4 transition-colors ${
                  completedSteps.includes(step.id)
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleStep(step.id)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      completedSteps.includes(step.id)
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {completedSteps.includes(step.id) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{step.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {step.description}
                    </p>
                    {!completedSteps.includes(step.id) && (
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 transition-colors">
                        {step.action} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {completedSteps.length === onboardingSteps.length && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-green-900">
                    Congratulations!
                  </h4>
                  <p className="text-sm text-green-700">
                    You've completed the onboarding process.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onComplete(); // This will close onboarding and show original TutorialSystem
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Start Dashboard Tour</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoBot;
