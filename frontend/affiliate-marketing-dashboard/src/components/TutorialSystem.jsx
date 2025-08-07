import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
} from "lucide-react";

const TutorialSystem = ({ isOpen, onClose, category = "getting-started" }) => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(category);

  // Tutorial categories and content
  const tutorialCategories = {
    "getting-started": {
      title: "Getting Started",
      icon: <BookOpen className="w-5 h-5" />,
      tutorials: [
        {
          id: "welcome",
          title: "Welcome to AffiliateFlow",
          duration: "3:45",
          type: "video",
          description: "Get an overview of the platform and its key features",
          videoUrl: "/tutorials/welcome.mp4",
          transcript: `Welcome to AffiliateFlow, the most powerful AI-driven affiliate marketing platform...`,
          resources: [
            {
              title: "Quick Start Guide",
              type: "pdf",
              url: "/resources/quickstart.pdf",
            },
            {
              title: "Platform Overview",
              type: "article",
              url: "/help/overview",
            },
          ],
        },
        {
          id: "dashboard-tour",
          title: "Dashboard Tour",
          duration: "5:20",
          type: "video",
          description:
            "Learn to navigate your dashboard and understand key metrics",
          videoUrl: "/tutorials/dashboard-tour.mp4",
          transcript: `Your dashboard is the command center for all your affiliate marketing activities...`,
          resources: [
            {
              title: "Dashboard Guide",
              type: "pdf",
              url: "/resources/dashboard.pdf",
            },
          ],
        },
        {
          id: "account-setup",
          title: "Account Setup",
          duration: "4:12",
          type: "video",
          description: "Complete your profile and connect your accounts",
          videoUrl: "/tutorials/account-setup.mp4",
          transcript: `Setting up your account properly is crucial for maximizing your success...`,
          resources: [
            {
              title: "Account Setup Checklist",
              type: "pdf",
              url: "/resources/setup-checklist.pdf",
            },
          ],
        },
      ],
    },
    "content-creation": {
      title: "Content Creation",
      icon: <FileText className="w-5 h-5" />,
      tutorials: [
        {
          id: "ai-content-basics",
          title: "AI Content Generation Basics",
          duration: "6:30",
          type: "video",
          description:
            "Learn how to create compelling content with AI assistance",
          videoUrl: "/tutorials/ai-content-basics.mp4",
          transcript: `AI content generation is at the heart of AffiliateFlow...`,
          resources: [
            {
              title: "Content Templates",
              type: "download",
              url: "/templates/content-templates.zip",
            },
            {
              title: "Writing Best Practices",
              type: "article",
              url: "/help/writing-tips",
            },
          ],
        },
        {
          id: "seo-optimization",
          title: "SEO Optimization",
          duration: "8:15",
          type: "video",
          description:
            "Optimize your content for search engines and better rankings",
          videoUrl: "/tutorials/seo-optimization.mp4",
          transcript: `SEO optimization is crucial for driving organic traffic...`,
          resources: [
            {
              title: "SEO Checklist",
              type: "pdf",
              url: "/resources/seo-checklist.pdf",
            },
            {
              title: "Keyword Research Guide",
              type: "article",
              url: "/help/keyword-research",
            },
          ],
        },
        {
          id: "content-calendar",
          title: "Content Calendar Planning",
          duration: "5:45",
          type: "video",
          description: "Plan and schedule your content for maximum impact",
          videoUrl: "/tutorials/content-calendar.mp4",
          transcript: `A well-planned content calendar is essential for consistent success...`,
          resources: [
            {
              title: "Content Calendar Template",
              type: "download",
              url: "/templates/calendar-template.xlsx",
            },
          ],
        },
      ],
    },
    "social-media": {
      title: "Social Media",
      icon: <Video className="w-5 h-5" />,
      tutorials: [
        {
          id: "platform-setup",
          title: "Connecting Social Platforms",
          duration: "4:30",
          type: "video",
          description: "Connect and configure your social media accounts",
          videoUrl: "/tutorials/platform-setup.mp4",
          transcript: `Connecting your social media platforms enables automated posting...`,
          resources: [
            {
              title: "Platform Setup Guide",
              type: "pdf",
              url: "/resources/platform-setup.pdf",
            },
          ],
        },
        {
          id: "automated-posting",
          title: "Automated Posting",
          duration: "7:20",
          type: "video",
          description:
            "Set up automated posting schedules across all platforms",
          videoUrl: "/tutorials/automated-posting.mp4",
          transcript: `Automated posting saves time and ensures consistent presence...`,
          resources: [
            {
              title: "Posting Schedule Templates",
              type: "download",
              url: "/templates/posting-schedules.zip",
            },
          ],
        },
        {
          id: "engagement-optimization",
          title: "Engagement Optimization",
          duration: "6:10",
          type: "video",
          description: "Maximize engagement and reach on social media",
          videoUrl: "/tutorials/engagement-optimization.mp4",
          transcript: `Optimizing for engagement increases your reach and conversions...`,
          resources: [
            {
              title: "Engagement Strategies",
              type: "article",
              url: "/help/engagement-strategies",
            },
          ],
        },
      ],
    },
    "affiliate-links": {
      title: "Affiliate Links",
      icon: <ExternalLink className="w-5 h-5" />,
      tutorials: [
        {
          id: "link-creation",
          title: "Creating Trackable Links",
          duration: "5:00",
          type: "video",
          description:
            "Create and customize your affiliate links for better tracking",
          videoUrl: "/tutorials/link-creation.mp4",
          transcript: `Proper link creation and tracking is essential for measuring success...`,
          resources: [
            {
              title: "Link Tracking Guide",
              type: "pdf",
              url: "/resources/link-tracking.pdf",
            },
          ],
        },
        {
          id: "link-optimization",
          title: "Link Optimization",
          duration: "6:45",
          type: "video",
          description: "Optimize link placement and performance",
          videoUrl: "/tutorials/link-optimization.mp4",
          transcript: `Link optimization can significantly improve your conversion rates...`,
          resources: [
            {
              title: "Optimization Checklist",
              type: "pdf",
              url: "/resources/optimization-checklist.pdf",
            },
          ],
        },
      ],
    },
    analytics: {
      title: "Analytics & Reporting",
      icon: <BookOpen className="w-5 h-5" />,
      tutorials: [
        {
          id: "analytics-overview",
          title: "Analytics Overview",
          duration: "7:30",
          type: "video",
          description: "Understand your analytics dashboard and key metrics",
          videoUrl: "/tutorials/analytics-overview.mp4",
          transcript: `Analytics provide insights into your performance and growth opportunities...`,
          resources: [
            {
              title: "Analytics Guide",
              type: "pdf",
              url: "/resources/analytics-guide.pdf",
            },
          ],
        },
        {
          id: "custom-reports",
          title: "Custom Reports",
          duration: "5:15",
          type: "video",
          description: "Create custom reports for deeper insights",
          videoUrl: "/tutorials/custom-reports.mp4",
          transcript: `Custom reports help you focus on the metrics that matter most...`,
          resources: [
            {
              title: "Report Templates",
              type: "download",
              url: "/templates/report-templates.zip",
            },
          ],
        },
      ],
    },
  };

  const currentCategory = tutorialCategories[selectedCategory];

  // Auto-select first tutorial when component opens
  useEffect(() => {
    if (isOpen && !currentVideo && currentCategory?.tutorials?.length > 0) {
      setCurrentVideo(currentCategory.tutorials[0]);
    }
  }, [isOpen, currentCategory, currentVideo]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVideoSelect = (tutorial) => {
    setCurrentVideo(tutorial);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    setCurrentTime(newTime);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            AffiliateFlow Tutorials
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            {/* Category Navigation */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-1">
                {Object.entries(tutorialCategories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === key
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category.icon}
                    <span className="font-medium">{category.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tutorial List */}
            <div className="flex-1 overflow-y-auto p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                {currentCategory.title}
              </h4>
              <div className="space-y-2">
                {currentCategory.tutorials.map((tutorial) => (
                  <button
                    key={tutorial.id}
                    onClick={() => handleVideoSelect(tutorial)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      currentVideo?.id === tutorial.id
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 mt-1">
                        <Play className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 text-sm">
                          {tutorial.title}
                        </h5>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {tutorial.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {tutorial.duration}
                          </span>
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span className="text-xs text-gray-500 capitalize">
                            {tutorial.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {currentVideo ? (
              <>
                {/* Video Player */}
                <div className="relative bg-black flex-1">
                  {/* Simulated Video Player */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                        {isPlaying ? (
                          <Pause className="w-12 h-12 text-white" />
                        ) : (
                          <Play className="w-12 h-12 text-white ml-1" />
                        )}
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-2">
                        {currentVideo.title}
                      </h3>
                      <p className="text-gray-300">
                        {currentVideo.description}
                      </p>
                    </div>
                  </div>

                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={togglePlayPause}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6" />
                        )}
                      </button>

                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="w-6 h-6" />
                        ) : (
                          <Volume2 className="w-6 h-6" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div
                          className="w-full h-2 bg-gray-600 rounded-full cursor-pointer"
                          onClick={handleSeek}
                        >
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{
                              width: `${(currentTime / duration) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {currentVideo.duration}
                      </span>

                      <button className="text-white hover:text-gray-300 transition-colors">
                        <Maximize className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video Info & Resources */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Video Description */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        About this tutorial
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {currentVideo.description}
                      </p>

                      {currentVideo.transcript && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">
                            Transcript
                          </h5>
                          <div className="bg-white rounded-lg p-3 text-sm text-gray-600 max-h-32 overflow-y-auto">
                            {currentVideo.transcript}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Resources
                      </h4>
                      <div className="space-y-2">
                        {currentVideo.resources?.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              {resource.type === "pdf" && (
                                <FileText className="w-4 h-4 text-red-600" />
                              )}
                              {resource.type === "download" && (
                                <BookOpen className="w-4 h-4 text-green-600" />
                              )}
                              {resource.type === "article" && (
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {resource.title}
                              </div>
                              <div className="text-xs text-gray-500 capitalize">
                                {resource.type}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* No Video Selected */
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a Tutorial
                  </h3>
                  <p className="text-gray-600">
                    Choose a tutorial from the sidebar to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tutorial Progress Tracker
export const TutorialProgress = ({ userId }) => {
  const [progress, setProgress] = useState({});
  const [totalTutorials, setTotalTutorials] = useState(0);
  const [completedTutorials, setCompletedTutorials] = useState(0);

  useEffect(() => {
    // Load user's tutorial progress
    // This would typically come from your backend
    const mockProgress = {
      welcome: true,
      "dashboard-tour": true,
      "account-setup": false,
      "ai-content-basics": false,
      // ... more tutorials
    };
    setProgress(mockProgress);
    setTotalTutorials(15); // Total number of tutorials
    setCompletedTutorials(Object.values(mockProgress).filter(Boolean).length);
  }, [userId]);

  const progressPercentage =
    totalTutorials > 0 ? (completedTutorials / totalTutorials) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">Tutorial Progress</h4>
        <span className="text-sm text-gray-500">
          {completedTutorials}/{totalTutorials}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600">
        {progressPercentage === 100
          ? "🎉 All tutorials completed!"
          : `${Math.round(progressPercentage)}% complete`}
      </p>
    </div>
  );
};

export default TutorialSystem;
