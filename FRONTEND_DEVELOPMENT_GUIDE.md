# Frontend Development Guide

## 🚀 **AffiliateFlow Frontend Architecture**

This guide covers the complete frontend architecture, component structure, and development patterns used in the AffiliateFlow SaaS platform.

## 🏗️ **Technology Stack**

### **Core Technologies**

- **React 19.1.0**: Modern React with hooks and latest features
- **Vite 6.3.5**: Lightning-fast build tool and development server
- **Tailwind CSS v4.1.7**: Utility-first CSS framework with latest features
- **TypeScript Ready**: Full TypeScript support configured
- **pnpm**: Fast, efficient package manager

### **UI Component Library**

- **Radix UI**: Headless, accessible UI primitives
- **Lucide React**: Beautiful icon library with 500+ icons
- **Recharts**: Professional charting library for analytics
- **Framer Motion**: Advanced animations and transitions
- **React Router Dom**: Client-side routing and navigation

### **Design System**

- **Custom Gradients**: Professional gradient color schemes
- **Shadow System**: Multi-layered shadows for depth
- **Animation Library**: Smooth transitions and hover effects
- **Responsive Design**: Mobile-first responsive breakpoints
- **Dark/Light Mode**: Theme system ready for implementation

## 📁 **Project Structure**

```
frontend/affiliate-marketing-dashboard/
├── src/
│   ├── components/           # Main application components
│   │   ├── Dashboard.jsx    # Analytics dashboard with charts
│   │   ├── ContentGenerator.jsx # AI content creation interface
│   │   ├── SocialMediaManager.jsx # Multi-platform social management
│   │   ├── Analytics.jsx    # Advanced analytics with insights
│   │   ├── TutorialSystem.jsx # Interactive tutorial system
│   │   ├── DemoBot.jsx      # Contextual help system
│   │   ├── AffiliateLinks.jsx # Link management (planned)
│   │   ├── Settings.jsx     # User settings (planned)
│   │   ├── Subscription.jsx # Billing management (planned)
│   │   └── ui/              # Reusable UI components
│   │       ├── card.jsx     # Card component variants
│   │       ├── button.jsx   # Button component with variants
│   │       ├── input.jsx    # Form input components
│   │       └── [...]        # Other UI primitives
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and helpers
│   ├── assets/              # Static assets and images
│   └── App.jsx              # Main application component
├── tailwind.config.js       # Tailwind CSS v4 configuration
├── vite.config.js          # Vite build configuration
└── package.json            # Dependencies and scripts
```

## 🎨 **Design System**

### **Color Palette**

```css
/* Primary Colors */
--blue-500: #3B82F6;      /* Primary blue */
--blue-600: #2563EB;      /* Darker blue */
--purple-500: #8B5CF6;    /* Secondary purple */
--purple-600: #7C3AED;    /* Darker purple */

/* Gradient Combinations */
from-blue-600 to-purple-600    /* Primary gradient */
from-green-600 to-emerald-600  /* Success gradient */
from-orange-500 to-red-500     /* Warning gradient */
from-gray-50 to-gray-100       /* Subtle background */
```

### **Typography Scale**

```css
text-3xl font-bold    /* Main headings (30px) */
text-2xl font-bold    /* Section headings (24px) */
text-xl font-semibold /* Card titles (20px) */
text-lg              /* Descriptions (18px) */
text-base            /* Body text (16px) */
text-sm              /* Secondary text (14px) */
```

### **Spacing System**

```css
space-y-8    /* Section spacing (32px) */
space-y-6    /* Card spacing (24px) */
space-y-4    /* Component spacing (16px) */
p-6          /* Card padding (24px) */
p-4          /* Component padding (16px) */
```

### **Shadow Levels**

```css
shadow-lg           /* Card shadows */
shadow-xl           /* Hover effects */
shadow-2xl          /* Modal/popup shadows */
hover:shadow-xl     /* Interactive hover states */
```

## 🧩 **Component Architecture**

### **1. Dashboard Component**

**File**: `src/components/Dashboard.jsx`
**Purpose**: Main analytics dashboard with key metrics and charts

**Features**:

- Real-time analytics with professional charts
- Revenue, traffic, and conversion metrics
- Quick action buttons for content creation
- Responsive grid layout with gradient cards

**Key Dependencies**:

- Recharts for data visualization
- Lucide React for icons
- Custom UI components (Card, Button, Badge)

**Usage**:

```jsx
import Dashboard from "@/components/Dashboard";

<Dashboard user={currentUser} />;
```

### **2. Content Generator Component**

**File**: `src/components/ContentGenerator.jsx`
**Purpose**: AI-powered content creation interface

**Features**:

- Multi-tab interface (Generate, Library, Templates)
- AI content generation with OpenAI integration
- SEO optimization and keyword management
- Affiliate link integration and tracking
- Content library with performance metrics

**Key Dependencies**:

- React hooks for state management
- Form handling with controlled inputs
- Tabbed interface with professional styling

**Usage**:

```jsx
import ContentGenerator from "@/components/ContentGenerator";

<ContentGenerator user={currentUser} />;
```

### **3. Social Media Manager Component**

**File**: `src/components/SocialMediaManager.jsx`
**Purpose**: Multi-platform social media management

**Features**:

- Platform selection and account management
- Content scheduling with visual calendar
- Post composition with platform-specific formatting
- Analytics and engagement tracking
- Bulk operations for multiple platforms

**Key Dependencies**:

- Multi-platform API integrations
- Calendar component for scheduling
- Rich text editor for content creation

### **4. Tutorial System Component**

**File**: `src/components/TutorialSystem.jsx`
**Purpose**: Interactive onboarding and help system

**Features**:

- Step-by-step guided tutorials
- Feature-specific walkthroughs
- Progress tracking and completion states
- Contextual help integration

**Key Dependencies**:

- State management for tutorial progress
- Overlay system for guided tours
- Modal components for tutorial content

### **5. Analytics Component**

**File**: `src/components/Analytics.jsx`
**Purpose**: Advanced analytics with detailed insights

**Features**:

- Comprehensive analytics dashboard
- Interactive charts and visualizations
- Traffic source analysis and conversion funnels
- Revenue tracking and goal monitoring
- Content performance analysis

**Key Dependencies**:

- Recharts for advanced visualizations
- Professional chart components
- Data aggregation and filtering

## 🎯 **Development Patterns**

### **Component Structure**

```jsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "lucide-react";

const ComponentName = ({ user, ...props }) => {
  const [state, setState] = useState(initialState);

  // Event handlers
  const handleAction = () => {
    // Implementation
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Component Title
          </h1>
          <p className="text-lg text-gray-600">Component description</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            Secondary Action
          </Button>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Primary Action
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle>Section Title</CardTitle>
        </CardHeader>
        <CardContent>{/* Component content */}</CardContent>
      </Card>
    </div>
  );
};

export default ComponentName;
```

### **Styling Conventions**

**Card Components**:

```jsx
<Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
  <CardHeader className="pb-6">
    <CardTitle className="text-2xl font-bold text-gray-900">Title</CardTitle>
    <CardDescription className="text-lg text-gray-600">
      Description
    </CardDescription>
  </CardHeader>
  <CardContent>{/* Card content */}</CardContent>
</Card>
```

**Button Variants**:

```jsx
{
  /* Primary gradient button */
}
<Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
  Primary Action
</Button>;

{
  /* Secondary outline button */
}
<Button variant="outline" className="bg-white hover:bg-gray-50">
  Secondary Action
</Button>;
```

**Grid Layouts**:

```jsx
{
  /* Responsive grid */
}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>;

{
  /* Stats grid */
}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Stat cards */}
</div>;
```

### **State Management Patterns**

**Local State with useState**:

```jsx
const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);
```

**Form State Management**:

```jsx
const [formData, setFormData] = useState({
  title: "",
  content: "",
  keywords: [],
});

const handleInputChange = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};
```

**API Integration Pattern**:

```jsx
const fetchData = async () => {
  setIsLoading(true);
  try {
    const response = await fetch("/api/endpoint");
    const data = await response.json();
    setData(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, []);
```

## 📱 **Responsive Design**

### **Breakpoint System**

```css
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
2xl: 1536px  /* 2X large devices */
```

### **Responsive Patterns**

```jsx
{/* Mobile-first responsive grid */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

{/* Responsive flex layout */}
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">

{/* Responsive spacing */}
<div className="space-y-4 lg:space-y-6">

{/* Responsive text sizes */}
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
```

## 🔧 **Development Commands**

### **Development Server**

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
pnpm run lint         # Run ESLint
```

### **Package Management**

```bash
pnpm install          # Install dependencies
pnpm add package      # Add new package
pnpm remove package   # Remove package
pnpm update           # Update all packages
```

### **Debugging**

```bash
# Enable debug mode
VITE_DEBUG=true pnpm run dev

# Check bundle analysis
pnpm run build --analyze

# View build stats
pnpm run build --stats
```

## 🚀 **Performance Optimization**

### **Code Splitting**

```jsx
// Lazy load components
const Analytics = lazy(() => import('@/components/Analytics'))

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Analytics />
</Suspense>
```

### **Bundle Optimization**

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          charts: ["recharts"],
          ui: ["@radix-ui/react-tabs", "@radix-ui/react-dialog"],
        },
      },
    },
  },
};
```

### **Image Optimization**

```jsx
// Optimized image loading
<img
  src="/image.jpg"
  loading="lazy"
  className="w-full h-auto"
  alt="Description"
/>
```

## 🧪 **Testing Strategy**

### **Component Testing**

```jsx
// Test component rendering
import { render, screen } from "@testing-library/react";
import Dashboard from "@/components/Dashboard";

test("renders dashboard with analytics", () => {
  render(<Dashboard user={mockUser} />);
  expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument();
});
```

### **Integration Testing**

```jsx
// Test user interactions
import { fireEvent, waitFor } from "@testing-library/react";

test("generates content when button clicked", async () => {
  render(<ContentGenerator />);
  fireEvent.click(screen.getByText("Generate Content"));
  await waitFor(() => {
    expect(screen.getByText("Generated content")).toBeInTheDocument();
  });
});
```

## 📚 **Additional Resources**

### **Documentation**

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/guide)
- [Vite Documentation](https://vitejs.dev/guide/)

### **Design References**

- [Design System Guidelines](./DESIGN_SYSTEM.md)
- [Component Storybook](http://localhost:6006) (when configured)
- [Style Guide Examples](./STYLE_GUIDE.md)

### **Development Workflow**

- [Git Workflow Guidelines](./GIT_WORKFLOW.md)
- [Code Review Checklist](./CODE_REVIEW.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

**🎯 Ready to contribute to the AffiliateFlow frontend?**  
**This guide provides everything you need to understand and extend the platform!**
