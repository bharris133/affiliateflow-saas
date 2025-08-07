import React, { useState, useEffect, useRef } from "react";
import {
  X,
  RotateCcw,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const DemoBot = ({ isOpen, onClose, currentPage = "dashboard" }) => {
  const [currentTour, setCurrentTour] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightBounds, setHighlightBounds] = useState(null);

  // Demo tours for different pages
  const demoTours = {
    dashboard: {
      title: "Dashboard Overview",
      description: "Learn how to navigate your AffiliateFlow dashboard",
      steps: [
        {
          target: ".sidebar",
          title: "Navigation Sidebar",
          content:
            "Use the sidebar to navigate between different sections of your dashboard. Each icon represents a different feature.",
          highlight: true,
        },
        {
          target: "[data-testid='stats-cards']",
          title: "Performance Overview",
          content:
            "These cards show your key metrics at a glance - revenue, clicks, conversions, and growth rates.",
          highlight: true,
        },
        {
          target: ".chart-container",
          title: "Revenue Analytics",
          content:
            "Track your earnings over time with detailed revenue analytics and forecasting.",
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
    setCurrentTour(demoTours[tourKey]);
    setCurrentStep(0);
    // Highlight first element after a brief delay
    setTimeout(() => {
      if (demoTours[tourKey].steps[0]?.target) {
        highlightElement(demoTours[tourKey].steps[0].target);
      }
    }, 200);
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

  const resetTour = () => {
    setCurrentStep(0);
    setHighlightBounds(null);
    // Highlight first element
    if (currentTour?.steps[0]?.target) {
      setTimeout(() => highlightElement(currentTour.steps[0].target), 100);
    }
  };

  const closeTour = () => {
    setCurrentTour(null);
    setHighlightBounds(null);
    setCurrentStep(0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Compact Demo Bot Panel - Only show when no active tour */}
      {!currentTour && (
        <div className="fixed right-4 top-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">
                AffiliateFlow Guide
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Choose a guided tour:
              </h4>
              <div className="space-y-2">
                {Object.entries(demoTours).map(([key, tour]) => (
                  <button
                    key={key}
                    onClick={() => startTour(key)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">
                      {tour.title}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {tour.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Tour Controls - Show during active tour */}
      {currentTour && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 px-4 py-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <HelpCircle className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium text-gray-900 text-sm">
                {currentTour.title}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full px-3 py-1">
                <div className="flex items-center justify-between text-xs text-blue-800">
                  <span>
                    Step {currentStep + 1} of {currentTour.steps.length}
                  </span>
                  <div className="ml-3 w-16 bg-blue-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          ((currentStep + 1) / currentTour.steps.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={resetTour}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Restart Tour"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={closeTour}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Exit Tour"
                >
                  <X className="w-4 h-4" />
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
              className="absolute bg-black/30 backdrop-blur-[1px]"
              style={{
                top: 0,
                left: 0,
                right: 0,
                height: `${highlightBounds.top}px`,
              }}
            />

            {/* Left overlay */}
            <div
              className="absolute bg-black/30 backdrop-blur-[1px]"
              style={{
                top: `${highlightBounds.top}px`,
                left: 0,
                width: `${highlightBounds.left}px`,
                height: `${highlightBounds.height}px`,
              }}
            />

            {/* Right overlay */}
            <div
              className="absolute bg-black/30 backdrop-blur-[1px]"
              style={{
                top: `${highlightBounds.top}px`,
                left: `${highlightBounds.left + highlightBounds.width}px`,
                right: 0,
                height: `${highlightBounds.height}px`,
              }}
            />

            {/* Bottom overlay */}
            <div
              className="absolute bg-black/30 backdrop-blur-[1px]"
              style={{
                top: `${highlightBounds.top + highlightBounds.height}px`,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />

            {/* Highlight border around element */}
            <div
              className="absolute border-4 border-blue-400 rounded-lg shadow-lg animate-pulse"
              style={{
                top: `${highlightBounds.top - 4}px`,
                left: `${highlightBounds.left - 4}px`,
                width: `${highlightBounds.width + 8}px`,
                height: `${highlightBounds.height + 8}px`,
              }}
            >
              {/* Pulsing indicator */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
            </div>

            {/* Tooltip pointing to element */}
            {currentTour.steps[currentStep] && (
              <div
                className="absolute bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm z-50"
                style={{
                  top: `${highlightBounds.top + highlightBounds.height + 20}px`,
                  left: `${Math.max(
                    20,
                    Math.min(window.innerWidth - 320, highlightBounds.left)
                  )}px`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {currentTour.steps[currentStep].title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500 ml-2">
                    Step {currentStep + 1} of {currentTour.steps.length}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {currentTour.steps[currentStep].content}
                </p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`px-3 py-1 text-xs rounded-md flex items-center space-x-1 ${
                      currentStep === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <ChevronLeft className="w-3 h-3" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={nextStep}
                    disabled={currentStep === currentTour.steps.length - 1}
                    className={`px-3 py-1 text-xs rounded-md flex items-center space-x-1 ${
                      currentStep === currentTour.steps.length - 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100"
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Arrow pointing to highlighted element */}
                <div
                  className="absolute w-3 h-3 bg-white border-t border-l border-gray-200 transform rotate-45"
                  style={{
                    top: "-6px",
                    left: "50%",
                    marginLeft: "-6px",
                  }}
                />
              </div>
            )}
          </div>
        </>
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

export default DemoBot;
