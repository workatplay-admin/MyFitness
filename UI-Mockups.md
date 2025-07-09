# UI Mockups - MyFitness v1.0

**Document Version**: 1.0  
**Last Updated**: January 8, 2025  
**Design System**: Tailwind CSS + shadcn/ui  
**Responsive Breakpoints**: Mobile (320-768px), Tablet (769-1024px), Desktop (1025px+)

## Table of Contents
1. [Design System](#design-system)
2. [Landing Page](#landing-page)
3. [Dashboard](#dashboard)
4. [Goal Creation](#goal-creation)
5. [Progress Entry](#progress-entry)
6. [Progress Chart](#progress-chart)
7. [Component Library](#component-library)
8. [Responsive Considerations](#responsive-considerations)

---

## Design System

### Color Palette
```css
/* Primary Colors */
--primary: #3b82f6      /* Blue 500 */
--primary-foreground: #ffffff
--primary-dark: #2563eb  /* Blue 600 */

/* Secondary Colors */
--secondary: #f1f5f9     /* Slate 100 */
--secondary-foreground: #0f172a

/* Neutral Colors */
--background: #ffffff
--foreground: #0f172a
--muted: #f8fafc        /* Slate 50 */
--muted-foreground: #64748b

/* Accent Colors */
--success: #10b981      /* Emerald 500 */
--warning: #f59e0b      /* Amber 500 */
--destructive: #ef4444   /* Red 500 */
```

### Typography
```css
/* Font Stack */
font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem     /* 12px */
--text-sm: 0.875rem    /* 14px */
--text-base: 1rem      /* 16px */
--text-lg: 1.125rem    /* 18px */
--text-xl: 1.25rem     /* 20px */
--text-2xl: 1.5rem     /* 24px */
--text-3xl: 1.875rem   /* 30px */
```

### Spacing Scale (4px base unit)
```css
--spacing-1: 0.25rem   /* 4px */
--spacing-2: 0.5rem    /* 8px */
--spacing-3: 0.75rem   /* 12px */
--spacing-4: 1rem      /* 16px */
--spacing-6: 1.5rem    /* 24px */
--spacing-8: 2rem      /* 32px */
--spacing-12: 3rem     /* 48px */
```

---

## Landing Page

### Mobile Layout (320-768px)
```
┌─────────────────────────────────────┐
│ [🏃‍♂️ MyFitness]                      │
├─────────────────────────────────────┤
│                                     │
│         🎯 Define. Track.          │
│            Achieve.                 │
│                                     │
│   The simplest way to reach        │
│   your fitness goals.               │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Start Your Fitness Goal   │   │
│   └─────────────────────────────┘   │
│                                     │
│   ✅ Set SMART goals               │
│   📊 Track progress visually       │
│   🔥 Maintain motivation          │
│                                     │
│   ┌─────────────────────────────┐   │
│   │     No account needed      │   │
│   │      Start tracking        │   │
│   └─────────────────────────────┘   │
│                                     │
│   Privacy • Terms • Support        │
└─────────────────────────────────────┘
```

### Key Elements
- **Hero Section**: Centered value proposition with tagline
- **Primary CTA**: Large, prominent "Start Your Fitness Goal" button
- **Benefits**: 3 key benefits with icons
- **Secondary CTA**: "No account needed" for friction-free start
- **Minimal Footer**: Essential links only

### Component Specifications
```tsx
// Primary CTA Button
<Button 
  size="lg" 
  className="w-full bg-primary hover:bg-primary-dark text-white py-4 text-lg font-semibold rounded-lg shadow-lg"
>
  Start Your Fitness Goal
</Button>

// Benefits List
<div className="space-y-4">
  <div className="flex items-center space-x-3">
    <CheckCircle className="text-success w-6 h-6" />
    <span className="text-base text-foreground">Set SMART goals</span>
  </div>
  {/* ... more benefits */}
</div>
```

---

## Dashboard

### Mobile Layout (320-768px)
```
┌─────────────────────────────────────┐
│ MyFitness           [👤] [⚙️]       │
├─────────────────────────────────────┤
│                                     │
│ 🔥 Current Streak: 7 days          │
│                                     │
│ Active Goals (2/5)                  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 💪 Bench Press 100kg           │ │
│ │ ████████░░ 80% (80kg)          │ │
│ │ Target: Feb 15 • 3x/week       │ │
│ │                    [📊] [✏️]   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏃‍♂️ Run 5K                      │ │
│ │ ████░░░░░░ 40% (2km)           │ │
│ │ Target: Mar 1 • 5x/week        │ │
│ │                    [📊] [✏️]   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │        + Add Progress          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │       + Create New Goal        │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│   [🎯] [📊] [📤] [⚙️]              │
└─────────────────────────────────────┘
```

### Key Features
- **Streak Counter**: Prominent display of current streak
- **Goal Cards**: Progress bars with percentage and current value
- **Quick Actions**: Large buttons for common actions
- **Bottom Navigation**: Essential app sections

### Component Specifications
```tsx
// Goal Card
<Card className="p-4 space-y-3">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <span className="text-lg">💪</span>
      <h3 className="font-semibold text-base">Bench Press 100kg</h3>
    </div>
    <div className="flex space-x-2">
      <Button size="sm" variant="outline">📊</Button>
      <Button size="sm" variant="outline">✏️</Button>
    </div>
  </div>
  
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span>Progress</span>
      <span className="font-medium">80% (80kg)</span>
    </div>
    <Progress value={80} className="h-2" />
    <div className="text-xs text-muted-foreground">
      Target: Feb 15 • 3x/week
    </div>
  </div>
</Card>

// Streak Display
<div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg text-center">
  <div className="text-2xl font-bold">🔥 7 days</div>
  <div className="text-sm opacity-90">Current Streak</div>
</div>
```

---

## Goal Creation

### Mobile Layout (320-768px)
```
┌─────────────────────────────────────┐
│ [←] Create New Goal            1/4   │
├─────────────────────────────────────┤
│                                     │
│ What type of goal?                  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 💪 Strength                    │ │
│ │ Build muscle, lift heavier     │ │
│ │                           [✓] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏃‍♂️ Cardio                      │ │
│ │ Run faster, go further         │ │
│ │                           [ ] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📏 Body                        │ │
│ │ Weight, measurements           │ │
│ │                           [ ] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🎯 Habit                       │ │
│ │ Daily routines, consistency    │ │
│ │                           [ ] │ │
│ └─────────────────────────────────┘ │
│                                     │
│                                     │
│            [Back] [Next]            │
└─────────────────────────────────────┘
```

### Step-by-Step Flow
1. **Goal Type Selection**: Choose from 4 categories
2. **Goal Description**: Specific, measurable goal
3. **Target & Frequency**: Date and workout frequency
4. **Review & Confirm**: Final goal summary

### Component Specifications
```tsx
// Goal Type Card
<Card className="p-4 cursor-pointer hover:bg-muted transition-colors">
  <div className="flex items-center justify-between">
    <div>
      <div className="flex items-center space-x-2 mb-1">
        <span className="text-xl">💪</span>
        <h3 className="font-semibold">Strength</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Build muscle, lift heavier
      </p>
    </div>
    <div className="w-6 h-6 rounded-full border-2 border-primary bg-primary">
      <Check className="w-4 h-4 text-white m-0.5" />
    </div>
  </div>
</Card>

// Progress Indicator
<div className="flex justify-center space-x-2">
  <div className="w-8 h-2 bg-primary rounded-full"></div>
  <div className="w-8 h-2 bg-muted rounded-full"></div>
  <div className="w-8 h-2 bg-muted rounded-full"></div>
  <div className="w-8 h-2 bg-muted rounded-full"></div>
</div>
```

---

## Progress Entry

### Mobile Layout (320-768px)
```
┌─────────────────────────────────────┐
│ [←] Add Progress                    │
├─────────────────────────────────────┤
│                                     │
│ Goal: Bench Press 100kg             │
│                                     │
│ Today's Progress                    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │              85                │ │
│ │        ─────────────           │ │
│ │                                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Unit: [kg  ▼]                      │
│                                     │
│ Add a note (optional)               │
│ ┌─────────────────────────────────┐ │
│ │ Felt strong today, good form   │ │
│ │                                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Recent entries:                     │
│ • Jan 6: 82kg "Good session"       │
│ • Jan 4: 80kg                      │
│ • Jan 2: 78kg "Tough day"          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │         Save Progress          │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### Key Features
- **Large Numeric Input**: Easy to tap and adjust
- **Unit Selector**: Dropdown with relevant units
- **Optional Notes**: 140 character limit
- **Recent Entries**: Context for current progress
- **Auto-save**: Progress saves automatically

### Component Specifications
```tsx
// Large Numeric Input
<div className="relative">
  <Input 
    type="number" 
    value={value}
    onChange={handleChange}
    className="text-4xl font-bold text-center py-8 border-2 border-primary focus:border-primary-dark"
    placeholder="0"
  />
  <div className="absolute inset-y-0 right-4 flex items-center">
    <Select value={unit} onValueChange={setUnit}>
      <SelectTrigger className="w-16 border-none bg-transparent">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="kg">kg</SelectItem>
        <SelectItem value="lbs">lbs</SelectItem>
        <SelectItem value="reps">reps</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>

// Recent Entries
<div className="space-y-2">
  <h4 className="font-medium text-sm">Recent entries:</h4>
  {recentEntries.map((entry) => (
    <div key={entry.id} className="flex justify-between text-sm">
      <span className="text-muted-foreground">{entry.date}</span>
      <div>
        <span className="font-medium">{entry.value}{entry.unit}</span>
        {entry.note && <span className="text-muted-foreground ml-2">"{entry.note}"</span>}
      </div>
    </div>
  ))}
</div>
```

---

## Progress Chart

### Mobile Layout (320-768px)
```
┌─────────────────────────────────────┐
│ [←] Bench Press 100kg               │
├─────────────────────────────────────┤
│                                     │
│ Progress Chart                      │
│                                     │
│ [7D] [1M] [3M] [All]               │
│                                     │
│ 100 ┌─────────────────────────────┐ │
│  kg │                    Target─  │ │
│  90 │                 ••••••••••• │ │
│     │              •••            │ │
│  80 │           •••               │ │
│     │        •••                  │ │
│  70 │     •••                     │ │
│     │  •••                        │ │
│  60 └─────────────────────────────┘ │
│     Dec  Jan       Feb       Mar    │
│                                     │
│ Current: 85kg (85%)                 │
│ Target: 100kg by Feb 15             │
│ Trend: +2.5kg/week                  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │         Export Data            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │        Add Progress            │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### Key Features
- **Time Range Selector**: 7D, 1M, 3M, All buttons
- **Target Line**: Visual goal target
- **Trend Line**: Progress trajectory
- **Key Metrics**: Current value, target, trend
- **Quick Actions**: Export data, add progress

### Component Specifications
```tsx
// Chart Implementation (using Recharts)
<ResponsiveContainer width="100%" height={250}>
  <LineChart data={progressData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <ReferenceLine y={targetValue} stroke="red" strokeDasharray="5 5" />
    <Line 
      type="monotone" 
      dataKey="value" 
      stroke="#3b82f6" 
      strokeWidth={2}
      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
    />
  </LineChart>
</ResponsiveContainer>

// Time Range Selector
<div className="flex space-x-2 mb-4">
  {['7D', '1M', '3M', 'All'].map((range) => (
    <Button 
      key={range}
      variant={selectedRange === range ? "default" : "outline"}
      size="sm"
      onClick={() => setSelectedRange(range)}
    >
      {range}
    </Button>
  ))}
</div>

// Progress Stats
<div className="grid grid-cols-1 gap-2 text-sm">
  <div className="flex justify-between">
    <span className="text-muted-foreground">Current:</span>
    <span className="font-semibold">85kg (85%)</span>
  </div>
  <div className="flex justify-between">
    <span className="text-muted-foreground">Target:</span>
    <span>100kg by Feb 15</span>
  </div>
  <div className="flex justify-between">
    <span className="text-muted-foreground">Trend:</span>
    <span className="text-success">+2.5kg/week</span>
  </div>
</div>
```

---

## Component Library

### Buttons
```tsx
// Primary Button
<Button className="bg-primary hover:bg-primary-dark text-white">
  Primary Action
</Button>

// Secondary Button
<Button variant="outline" className="border-primary text-primary">
  Secondary Action
</Button>

// Destructive Button
<Button variant="destructive">
  Delete
</Button>

// Large CTA Button
<Button size="lg" className="w-full py-4 text-lg font-semibold">
  Call to Action
</Button>
```

### Cards
```tsx
// Goal Card
<Card className="p-4 hover:shadow-md transition-shadow">
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <span className="text-xl">💪</span>
      <span>Goal Title</span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <Progress value={75} className="h-2 mb-2" />
    <div className="text-sm text-muted-foreground">
      Target: Feb 15 • 3x/week
    </div>
  </CardContent>
</Card>

// Stats Card
<Card className="p-4 text-center">
  <div className="text-2xl font-bold text-primary">7</div>
  <div className="text-sm text-muted-foreground">Days Streak</div>
</Card>
```

### Forms
```tsx
// Form Field
<div className="space-y-2">
  <Label htmlFor="goal-description">Goal Description</Label>
  <Input 
    id="goal-description"
    placeholder="e.g., Bench press 100kg for 5 reps"
    maxLength={200}
  />
  <div className="text-xs text-muted-foreground text-right">
    {description.length}/200
  </div>
</div>

// Select Field
<div className="space-y-2">
  <Label>Goal Type</Label>
  <Select value={goalType} onValueChange={setGoalType}>
    <SelectTrigger>
      <SelectValue placeholder="Select goal type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="strength">💪 Strength</SelectItem>
      <SelectItem value="cardio">🏃‍♂️ Cardio</SelectItem>
      <SelectItem value="body">📏 Body</SelectItem>
      <SelectItem value="habit">🎯 Habit</SelectItem>
    </SelectContent>
  </Select>
</div>
```

---

## Responsive Considerations

### Mobile-First Approach
- All layouts designed for mobile (320px) first
- Touch-friendly tap targets (minimum 44px)
- Large text inputs for easy data entry
- Thumb-friendly navigation placement

### Tablet Adaptations (769-1024px)
- Increased spacing and padding
- Side-by-side layout for form fields
- Larger chart displays
- More prominent goal cards

### Desktop Enhancements (1025px+)
- Multi-column layouts
- Sidebar navigation
- Larger charts with more data points
- Hover states and interactions

### Key Responsive Patterns
```tsx
// Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Goal cards */}
</div>

// Responsive Spacing
<div className="p-4 md:p-6 lg:p-8">
  {/* Content */}
</div>

// Responsive Text
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Title
</h1>

// Responsive Navigation
<nav className="fixed bottom-0 md:static md:top-0 w-full">
  {/* Navigation items */}
</nav>
```

---

## Implementation Notes

### Performance Optimizations
- Use React.memo() for expensive components
- Implement virtual scrolling for large progress lists
- Lazy load chart components
- Optimize images and icons

### Accessibility Features
- Proper ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

### Progressive Enhancement
- Core functionality works without JavaScript
- Charts gracefully degrade to data tables
- Form validation on both client and server
- Offline support for basic operations

### Testing Considerations
- Cross-browser compatibility testing
- Touch device testing
- Performance testing on slow networks
- Accessibility testing with screen readers

---

**Related Documents:**
- [Product Requirements Document](./ProductRequirementsDocument.md) - UI requirements and specifications
- [Architectural Decision Record](./ArchitecturalDecisionRecord.md) - Technical implementation decisions
- [Opportunity Brief](./OpportunityBrief.md) - User needs and constraints

**Next Steps:**
1. Create interactive prototypes using these mockups
2. Conduct user testing with target personas
3. Refine designs based on feedback
4. Begin component implementation with shadcn/ui