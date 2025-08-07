import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  Play,
  CheckCircle,
  Clock,
  Users,
  BookOpen,
} from "lucide-react";
import "./TourSelectionModal.css";

const TourSelectionModal = ({
  tours,
  onSelectTour,
  onClose,
  completedTours = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Tour categories with comprehensive coverage
  const tourCategories = {
    "Getting Started": [
      {
        id: "dashboard-overview",
        title: "Dashboard Overview",
        description:
          "Learn how to navigate your AffiliateFlow dashboard and understand key metrics",
        icon: "📊",
        steps: 4,
        time: "3 minutes",
        difficulty: "Beginner",
      },
      {
        id: "onboarding-basics",
        title: "Platform Basics",
        description:
          "Get familiar with the core features and navigation of AffiliateFlow",
        icon: "🚀",
        steps: 5,
        time: "4 minutes",
        difficulty: "Beginner",
      },
    ],
    "Content Creation": [
      {
        id: "content-generator",
        title: "AI Content Generator",
        description:
          "Master AI-powered content creation for blogs, social media, and email campaigns",
        icon: "✨",
        steps: 6,
        time: "5 minutes",
        difficulty: "Intermediate",
      },
      {
        id: "content-templates",
        title: "Content Templates",
        description:
          "Use pre-built templates to create high-converting affiliate content",
        icon: "📝",
        steps: 4,
        time: "3 minutes",
        difficulty: "Beginner",
      },
    ],
    "Affiliate Marketing": [
      {
        id: "affiliate-links",
        title: "Affiliate Link Management",
        description:
          "Create, track, and optimize your affiliate links for maximum conversions",
        icon: "🔗",
        steps: 5,
        time: "4 minutes",
        difficulty: "Intermediate",
      },
      {
        id: "conversion-tracking",
        title: "Conversion Tracking",
        description:
          "Set up advanced tracking to monitor your affiliate performance",
        icon: "📈",
        steps: 7,
        time: "6 minutes",
        difficulty: "Advanced",
      },
    ],
    "Social Media": [
      {
        id: "social-media-posting",
        title: "Social Media Automation",
        description:
          "Automate your social media presence across multiple platforms",
        icon: "📱",
        steps: 6,
        time: "5 minutes",
        difficulty: "Intermediate",
      },
      {
        id: "social-scheduling",
        title: "Content Scheduling",
        description:
          "Schedule and optimize your social media posts for maximum engagement",
        icon: "📅",
        steps: 5,
        time: "4 minutes",
        difficulty: "Beginner",
      },
    ],
    "Email Marketing": [
      {
        id: "email-campaigns",
        title: "Email Campaign Creation",
        description:
          "Design and send high-converting email campaigns to your subscribers",
        icon: "📧",
        steps: 6,
        time: "5 minutes",
        difficulty: "Intermediate",
      },
      {
        id: "email-automation",
        title: "Email Automation",
        description: "Set up automated email sequences for better conversions",
        icon: "⚡",
        steps: 8,
        time: "7 minutes",
        difficulty: "Advanced",
      },
    ],
    Analytics: [
      {
        id: "analytics-overview",
        title: "Analytics Dashboard",
        description: "Understand your performance metrics and key analytics",
        icon: "📊",
        steps: 5,
        time: "4 minutes",
        difficulty: "Beginner",
      },
      {
        id: "advanced-analytics",
        title: "Advanced Analytics",
        description: "Deep dive into advanced analytics and reporting features",
        icon: "🔍",
        steps: 7,
        time: "6 minutes",
        difficulty: "Advanced",
      },
    ],
    "Settings & Configuration": [
      {
        id: "account-setup",
        title: "Account Configuration",
        description: "Configure your account settings and preferences",
        icon: "⚙️",
        steps: 4,
        time: "3 minutes",
        difficulty: "Beginner",
      },
      {
        id: "integrations",
        title: "Third-party Integrations",
        description:
          "Connect external services and APIs to enhance functionality",
        icon: "🔌",
        steps: 6,
        time: "5 minutes",
        difficulty: "Advanced",
      },
    ],
  };

  // Filter tours based on category and search
  const getFilteredTours = () => {
    let allTours = [];

    if (selectedCategory === "all") {
      Object.values(tourCategories).forEach((categoryTours) => {
        allTours = [...allTours, ...categoryTours];
      });
    } else {
      allTours = tourCategories[selectedCategory] || [];
    }

    if (searchTerm) {
      allTours = allTours.filter(
        (tour) =>
          tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allTours;
  };

  // Calculate completion statistics
  const getCompletionStats = () => {
    const totalTours = Object.values(tourCategories).flat().length;
    const completedCount = completedTours.length;
    const completionPercentage =
      totalTours > 0 ? Math.round((completedCount / totalTours) * 100) : 0;

    return { totalTours, completedCount, completionPercentage };
  };

  const stats = getCompletionStats();

  // Handle tour selection
  const handleTourSelect = (tourId) => {
    console.log("Starting tour:", tourId);
    onSelectTour(tourId);
    onClose();
  };

  // Handle modal close
  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="tour-selection-modal-overlay" onClick={handleClose}>
      <div className="tour-selection-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="header-content">
            <h2>AffiliateFlow Tutorial Center</h2>
            <p>Choose from comprehensive tutorials to master every feature</p>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Progress Overview */}
        <div className="progress-overview">
          <div className="progress-stats">
            <div className="stat-item">
              <div className="stat-number">{stats.totalTours}</div>
              <div className="stat-label">Total Tutorials</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.completedCount}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.completionPercentage}%</div>
              <div className="stat-label">Progress</div>
            </div>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="category-filter">
            <button
              className={`filter-btn ${
                selectedCategory === "all" ? "active" : ""
              }`}
              onClick={() => setSelectedCategory("all")}
            >
              All Tutorials
            </button>
            {Object.keys(tourCategories).map((category) => (
              <button
                key={category}
                className={`filter-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tours Grid */}
        <div className="tours-grid">
          {selectedCategory === "all" ? (
            // Show all categories
            Object.entries(tourCategories).map(
              ([categoryName, categoryTours]) => (
                <div key={categoryName} className="tour-category-section">
                  <h3 className="category-title">{categoryName}</h3>
                  <div className="tours-row">
                    {categoryTours
                      .filter(
                        (tour) =>
                          !searchTerm ||
                          tour.title
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          tour.description
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                      )
                      .map((tour) => (
                        <TourCard
                          key={tour.id}
                          tour={tour}
                          isCompleted={completedTours.includes(tour.id)}
                          onSelect={() => handleTourSelect(tour.id)}
                        />
                      ))}
                  </div>
                </div>
              )
            )
          ) : (
            // Show filtered tours
            <div className="tour-category-section">
              <h3 className="category-title">{selectedCategory}</h3>
              <div className="tours-row">
                {getFilteredTours().map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    isCompleted={completedTours.includes(tour.id)}
                    onSelect={() => handleTourSelect(tour.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="footer-info">
            <p>
              Complete tutorials to unlock achievement badges and track your
              learning progress
            </p>
          </div>
          <button className="secondary-btn" onClick={onClose}>
            Close Tutorial Center
          </button>
        </div>
      </div>
    </div>
  );
};

// Tour Card Component
const TourCard = ({ tour, isCompleted, onSelect }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "#10b981";
      case "Intermediate":
        return "#f59e0b";
      case "Advanced":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className={`tour-card ${isCompleted ? "completed" : ""}`}>
      <div className="tour-card-header">
        <div className="tour-icon">{tour.icon}</div>
        {isCompleted && (
          <div className="completion-badge">
            <CheckCircle size={16} />
          </div>
        )}
      </div>

      <div className="tour-card-content">
        <h4 className="tour-title">{tour.title}</h4>
        <p className="tour-description">{tour.description}</p>

        <div className="tour-meta">
          <span className="tour-steps">
            <BookOpen size={12} />
            {tour.steps} steps
          </span>
          <span className="tour-time">
            <Clock size={12} />
            {tour.time}
          </span>
          <span
            className="tour-difficulty"
            style={{ color: getDifficultyColor(tour.difficulty) }}
          >
            {tour.difficulty}
          </span>
        </div>
      </div>

      <div className="tour-card-actions">
        <button
          className={`tour-action-btn ${
            isCompleted ? "restart-btn" : "start-btn"
          }`}
          onClick={onSelect}
        >
          <Play size={14} />
          {isCompleted ? "Restart Tour" : "Start Tour"}
        </button>
      </div>
    </div>
  );
};

export default TourSelectionModal;
