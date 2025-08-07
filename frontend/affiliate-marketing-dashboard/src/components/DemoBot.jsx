import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  X,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import TourSelectionModal from "./TourSelectionModal";

const DemoBot = ({ isOpen, onClose, currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTour, setCurrentTour] = useState(null);
  const [showTourSelection, setShowTourSelection] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);

  // Handle external isOpen prop (from App.jsx when onboarding completes)
  useEffect(() => {
    if (isOpen) {
      setShowTourSelection(true); // Show tour selection modal when opened from onboarding
    }
  }, [isOpen]);

  // Handle location changes to ensure tutorial visibility is maintained
  useEffect(() => {
    // If a tour is active and we are on the right page, ensure visibility
    if (isTourActive && currentTour && tours[currentTour]) {
      const tour = tours[currentTour];
      if (
        tour.page &&
        location.pathname === tour.page &&
        currentStep !== "completed"
      ) {
        // Longer delay to ensure page is fully rendered
        setTimeout(() => {
          if (!isVisible) {
            setIsVisible(true);
          }
        }, 500);
      }
    }
  }, [location.pathname, currentTour, currentStep, isVisible, isTourActive]);

  const tours = {
    dashboard: {
      name: "Dashboard Tour",
      page: "/dashboard",
      steps: [
        {
          target:
            "[data-testid='stats-cards'], .stats-cards, .grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-4",
          title: "Overview Cards",
          content:
            "These cards show your key performance metrics at a glance - revenue, visitors, content count, and conversion rates.",
          position: "bottom",
        },
        {
          target: ".bg-gradient-to-br.from-green-50, [class*='from-green-50']",
          title: "Revenue Tracking",
          content:
            "Monitor your affiliate earnings and revenue trends. This shows your total earnings and percentage growth.",
          position: "bottom",
        },
        {
          target: ".bg-gradient-to-br.from-blue-50, [class*='from-blue-50']",
          title: "Visitor Analytics",
          content:
            "Track how many people are visiting your content and engaging with your affiliate links.",
          position: "left",
        },
        {
          target:
            ".recent-activities, [class*='activity'], .bg-gradient-to-br.from-purple-50, [class*='from-purple-50']",
          title: "Recent Activity",
          content:
            "Stay updated with your latest affiliate activities, clicks, and conversions.",
          position: "top",
        },
      ],
    },
    contentGenerator: {
      name: "Content Generator Tour",
      page: "/dashboard/content",
      steps: [
        {
          target: "[data-tour-id='content-type']",
          title: "Choose Content Type",
          content:
            "Select what type of content you want to create - blog posts, social media posts, emails, or product reviews.",
          position: "bottom",
        },
        {
          target: "[data-tour-id='topic']",
          title: "Content Topic",
          content:
            "Enter the main topic or subject for your content. Be specific to get better AI-generated results.",
          position: "right",
        },
        {
          target: "[data-tour-id='audience']",
          title: "Target Audience",
          content:
            "Define who you're writing for. This helps the AI tailor the tone and style of the content.",
          position: "left",
        },
        {
          target: "[data-tour-id='generate-button']",
          title: "Generate Content",
          content:
            "Click here to let AI create your affiliate marketing content based on your inputs.",
          position: "top",
        },
      ],
    },
    socialMedia: {
      name: "Social Media Manager Tour",
      page: "/dashboard/social",
      steps: [
        {
          target: ".social-accounts, [class*='social-account']",
          title: "Connect Your Accounts",
          content:
            "Link your social media accounts (Facebook, Instagram, Twitter, LinkedIn) to manage them all from one place.",
          position: "bottom",
        },
        {
          target: ".post-scheduler, [class*='schedule']",
          title: "Schedule Posts",
          content:
            "Plan and schedule your content to be posted automatically at optimal times for maximum engagement.",
          position: "left",
        },
        {
          target: ".analytics, [class*='analytic']",
          title: "Performance Analytics",
          content:
            "Track engagement, clicks, and performance across all your social media platforms.",
          position: "top",
        },
      ],
    },
    affiliateLinks: {
      name: "Affiliate Links Tour",
      page: "/dashboard/affiliates",
      steps: [
        {
          target: ".affiliate-programs, [class*='program']",
          title: "Affiliate Programs",
          content:
            "Manage all your affiliate programs and partnerships in one centralized location.",
          position: "bottom",
        },
        {
          target: ".link-generator, [class*='link']",
          title: "Link Management",
          content:
            "Create, track, and optimize your affiliate links for better conversion rates.",
          position: "right",
        },
        {
          target: ".performance-metrics, [class*='performance']",
          title: "Performance Tracking",
          content:
            "Monitor clicks, conversions, and earnings for each affiliate link and program.",
          position: "top",
        },
      ],
    },
    analytics: {
      name: "Analytics Tour",
      page: "/dashboard/analytics",
      steps: [
        {
          target: ".analytics-overview, [class*='overview']",
          title: "Analytics Overview",
          content:
            "Get comprehensive insights into your affiliate marketing performance across all channels.",
          position: "bottom",
        },
        {
          target: ".conversion-funnel, [class*='funnel']",
          title: "Conversion Funnel",
          content:
            "Analyze your customer journey from first click to final conversion.",
          position: "left",
        },
        {
          target: ".revenue-breakdown, [class*='revenue']",
          title: "Revenue Analysis",
          content:
            "Deep dive into your earnings by source, time period, and affiliate program.",
          position: "top",
        },
      ],
    },
  };

  useEffect(() => {
    if (isVisible && currentTour && tours[currentTour]) {
      // Add a longer delay to ensure DOM elements are available after page navigation
      const timer = setTimeout(() => {
        highlightElement();
      }, 300); // Increased delay from 100ms to 300ms

      return () => {
        clearTimeout(timer);
        removeHighlight();
      };
    }

    return () => {
      removeHighlight();
    };
  }, [isVisible, currentStep, currentTour]);

  const highlightElement = () => {
    removeHighlight();

    if (!tours[currentTour] || !tours[currentTour].steps[currentStep]) return;

    const targetSelector = tours[currentTour].steps[currentStep].target;

    // Debug: Log all possible selectors we're trying
    console.log("Trying to find element with selectors:", targetSelector);

    // Try multiple selectors if the target has multiple options (separated by commas)
    const selectors = targetSelector.split(",").map((s) => s.trim());
    let element = null;

    for (const selector of selectors) {
      console.log("Trying selector:", selector); // Debug each selector
      element = document.querySelector(selector);
      if (element) {
        console.log("Found element with selector:", selector, element); // Debug success
        break;
      }
    }

    if (element) {
      // Add subtle glow to the element
      element.style.position = "relative";
      element.style.zIndex = "1001";
      element.style.boxShadow = "0 0 20px rgba(59, 130, 246, 0.8)";
      element.style.borderRadius = "8px";
      element.style.transition = "all 0.3s ease";
      element.dataset.highlighted = "true";

      // Add animated blue dot indicator
      const rect = element.getBoundingClientRect();
      const indicator = document.createElement("div");
      indicator.className = "tutorial-indicator";
      indicator.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        z-index: 1003;
        pointer-events: none;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
        animation: pulse 2s infinite;
        top: ${rect.top + rect.height / 2 - 10}px;
        left: ${rect.left + rect.width / 2 - 10}px;
      `;

      // Add CSS animation if not already added
      if (!document.querySelector("#tutorial-styles")) {
        const style = document.createElement("style");
        style.id = "tutorial-styles";
        style.textContent = `
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(indicator);
    } else {
      console.warn("Target element not found:", targetSelector);
      // Debug: Log what elements ARE available
      console.log("Available elements with similar classes:");
      console.log(
        "- content-type elements:",
        document.querySelectorAll("[class*='content']")
      );
      console.log(
        "- generate elements:",
        document.querySelectorAll("[class*='generate']")
      );
      console.log(
        "- topic elements:",
        document.querySelectorAll("[id*='topic'], [name*='topic']")
      );
      console.log("- buttons:", document.querySelectorAll("button"));
    }
  };

  const removeHighlight = () => {
    const highlightedElements = document.querySelectorAll(
      '[data-highlighted="true"]'
    );
    highlightedElements.forEach((element) => {
      element.style.boxShadow = "";
      element.style.zIndex = "";
      element.removeAttribute("data-highlighted");
    });

    // Remove animated indicators
    const indicators = document.querySelectorAll(".tutorial-indicator");
    indicators.forEach((indicator) => indicator.remove());
  };

  const startTour = (tourKey = "dashboard") => {
    console.log("Starting tour:", tourKey); // Debug log
    console.log("Available tours:", Object.keys(tours)); // Debug log
    console.log("Tour exists?", !!tours[tourKey]); // Debug log

    const tour = tours[tourKey];
    if (!tour) {
      console.error("Tour not found:", tourKey);
      return;
    }

    // Set tour state first
    setCurrentTour(tourKey);
    setCurrentStep(0);
    setShowTourSelection(false);

    // Navigate to the tour's page if specified
    if (tour.page && location.pathname !== tour.page) {
      console.log("Navigating to page:", tour.page);
      navigate(tour.page);

      // Wait a moment for the page to load before making tutorial visible
      setTimeout(() => {
        console.log("Setting isVisible to true after navigation"); // Debug log
        setIsVisible(true);
      }, 1200); // Increased delay further for page load
    } else {
      // Start tour immediately if already on the correct page
      console.log("Setting isVisible to true immediately"); // Debug log
      setIsVisible(true);
    }
  };

  const nextStep = () => {
    if (currentStep < tours[currentTour].steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    removeHighlight();

    // Mark tour as completed
    const completedTours = JSON.parse(
      localStorage.getItem("completedTours") || "[]"
    );
    if (!completedTours.includes(currentTour)) {
      completedTours.push(currentTour);
      localStorage.setItem("completedTours", JSON.stringify(completedTours));
    }

    // Set to a special "completed" step to show completion message
    setCurrentStep("completed");
    // Keep the tutorial widget visible (don't set isVisible to false)
  };

  const closeTour = () => {
    removeHighlight();
    setIsVisible(false);
    setShowTourSelection(false);
    if (onClose) {
      onClose(); // Call external onClose if provided
    }
  };

  const showTourSelectionModal = () => {
    setShowTourSelection(true);
  };

  const handleTourSelect = (tourKey) => {
    console.log("Selected tour key:", tourKey); // Debug log
    // Map TourSelectionModal tour IDs to DemoBot tour keys
    const tourKeyMap = {
      "dashboard-overview": "dashboard",
      "onboarding-basics": "dashboard",
      "content-generator": "contentGenerator",
      "content-optimization": "contentGenerator",
      "affiliate-links": "affiliateLinks",
      "conversion-tracking": "analytics",
      "social-posting": "socialMedia",
      "engagement-tracking": "socialMedia",
      "email-campaigns": "contentGenerator", // Could be content generator for email content
      "list-management": "affiliateLinks", // Could be affiliate links management
      "analytics-setup": "analytics",
      "performance-tracking": "analytics",
      "account-settings": "dashboard", // placeholder until we have settings tour
      "notification-setup": "dashboard", // placeholder
    };

    const mappedTourKey = tourKeyMap[tourKey] || "dashboard"; // fallback to dashboard
    console.log("Mapped tour key:", mappedTourKey); // Debug log
    startTour(mappedTourKey);
  };

  const getCurrentStep = () => {
    // Handle completion state
    if (currentStep === "completed") {
      return {
        title: "🎉 Tour Completed!",
        content: `Great job! You've completed the ${
          tours[currentTour]?.name || "tutorial"
        }. You can now explore more tours or continue using the platform.`,
        position: "center",
      };
    }

    if (!tours[currentTour] || !tours[currentTour].steps[currentStep]) {
      console.log("No valid step found for:", {
        currentTour,
        currentStep,
        tourExists: !!tours[currentTour],
      }); // Debug log
      return null;
    }
    const step = tours[currentTour].steps[currentStep];
    console.log("Current step:", step); // Debug log
    return step;
  };

  const getTourPosition = () => {
    const step = getCurrentStep();
    if (!step) return { top: "50%", left: "50%" };

    // Center the completion message
    if (currentStep === "completed") {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    // Try to find the target element using multiple selectors
    const selectors = step.target.split(",").map((s) => s.trim());
    let targetElement = null;

    for (const selector of selectors) {
      targetElement = document.querySelector(selector);
      if (targetElement) break;
    }

    if (!targetElement) {
      console.warn("Target element not found for positioning:", step.target);
      // Position on the right side when element not found to avoid interference
      return {
        top: "50%",
        right: "20px",
        transform: "translateY(-50%)",
      };
    }

    const rect = targetElement.getBoundingClientRect();
    const position = step.position || "bottom";
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Smart positioning to avoid going off-screen and interfering with other elements
    switch (position) {
      case "top":
        return {
          top: `${Math.max(20, rect.top - 20)}px`,
          left: `${Math.min(
            windowWidth - 400,
            Math.max(20, rect.left + rect.width / 2)
          )}px`,
          transform: "translate(-50%, -100%)",
        };
      case "bottom":
        return {
          top: `${Math.min(windowHeight - 200, rect.bottom + 20)}px`,
          left: `${Math.min(
            windowWidth - 400,
            Math.max(20, rect.left + rect.width / 2)
          )}px`,
          transform: "translate(-50%, 0)",
        };
      case "left":
        return {
          top: `${Math.min(
            windowHeight - 200,
            Math.max(20, rect.top + rect.height / 2)
          )}px`,
          left: `${Math.max(20, rect.left - 20)}px`,
          transform: "translate(-100%, -50%)",
        };
      case "right":
        return {
          top: `${Math.min(
            windowHeight - 200,
            Math.max(20, rect.top + rect.height / 2)
          )}px`,
          left: `${Math.min(windowWidth - 400, rect.right + 20)}px`,
          transform: "translate(0, -50%)",
        };
      default:
        return {
          top: `${Math.min(windowHeight - 200, rect.bottom + 20)}px`,
          left: `${Math.min(
            windowWidth - 400,
            Math.max(20, rect.left + rect.width / 2)
          )}px`,
          transform: "translate(-50%, 0)",
        };
    }
  };

  const currentStepData = getCurrentStep();

  console.log("DemoBot state:", {
    isVisible,
    showTourSelection,
    isOpen,
    currentTour,
    currentStep,
    currentStepData: !!currentStepData,
    locationPathname: location.pathname,
  }); // Debug log

  console.log("DemoBot render condition:", {
    shouldRender: !(!isVisible && !showTourSelection && !isOpen),
    isVisible,
    showTourSelection,
    isOpen,
  }); // Debug log

  if (!isVisible && !showTourSelection && !isOpen) return null;

  return (
    <>
      {/* Tour Selection Modal */}
      {(showTourSelection || isOpen) && (
        <TourSelectionModal
          onSelectTour={handleTourSelect}
          onClose={() => {
            setShowTourSelection(false);
            if (onClose) {
              onClose(); // Call external onClose if provided
            }
          }}
        />
      )}

      {/* Tour Tooltip */}
      {isVisible && currentStepData && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-sm w-full"
          style={{
            ...getTourPosition(),
            zIndex: 1002,
          }}
        >
          {console.log("Rendering Tour Tooltip:", {
            isVisible,
            currentStepData,
            position: getTourPosition(),
          })}
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentStepData.title}
            </h3>
            <button
              onClick={closeTour}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <p className="text-gray-600 mb-6">{currentStepData.content}</p>

          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            {currentStep === "completed" ? (
              <span className="text-sm text-green-600 font-medium">
                ✅ Tour Complete
              </span>
            ) : (
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {tours[currentTour].steps.length}
              </span>
            )}
            <div className="flex space-x-1">
              {tours[currentTour].steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    currentStep === "completed" || index <= currentStep
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
              {currentStep === "completed" && (
                <div className="w-2 h-2 rounded-full bg-green-500 ml-1" />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            {currentStep === "completed" ? (
              // Completion state actions
              <div className="flex space-x-2 w-full">
                <button
                  onClick={showTourSelectionModal}
                  className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <HelpCircle size={16} className="mr-1" />
                  Browse More Tours
                </button>
                <button
                  onClick={closeTour}
                  className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <X size={16} className="mr-1" />
                  Close Tutorial
                </button>
              </div>
            ) : (
              // Regular step actions
              <>
                <div className="flex space-x-2">
                  <button
                    onClick={previousStep}
                    disabled={currentStep === 0}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Previous
                  </button>

                  <button
                    onClick={showTourSelectionModal}
                    className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <HelpCircle size={16} className="mr-1" />
                    Back to Tours
                  </button>
                </div>

                <button
                  onClick={nextStep}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {currentStep === tours[currentTour].steps.length - 1 ? (
                    <>
                      <CheckCircle size={16} className="mr-1" />
                      Complete
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight size={16} className="ml-1" />
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay - removed blur for better visibility */}
      {isVisible && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 999,
            backgroundColor: "transparent", // Completely transparent now
          }}
        />
      )}
    </>
  );
};

// Export functions to be used by other components
export const startDashboardTour = () => {
  const event = new CustomEvent("startTour", { detail: { tour: "dashboard" } });
  window.dispatchEvent(event);
};

export const startOnboardingTour = () => {
  const event = new CustomEvent("startTour", {
    detail: { tour: "dashboard", onboarding: true },
  });
  window.dispatchEvent(event);
};

export const showTourSelection = () => {
  const event = new CustomEvent("showTourSelection");
  window.dispatchEvent(event);
};

// Add event listeners for the exported functions
if (typeof window !== "undefined") {
  window.addEventListener("startTour", (event) => {
    const demoBot = document.querySelector("[data-demo-bot]");
    if (demoBot && demoBot._demoBot) {
      if (event.detail.onboarding) {
        demoBot._demoBot.setIsOnboardingMode(true);
      }
      demoBot._demoBot.startTour(event.detail.tour);
    }
  });

  window.addEventListener("showTourSelection", () => {
    const demoBot = document.querySelector("[data-demo-bot]");
    if (demoBot && demoBot._demoBot) {
      demoBot._demoBot.showTourSelectionModal();
    }
  });
}

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
                  onComplete(); // This will close onboarding and show TourSelectionModal
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
