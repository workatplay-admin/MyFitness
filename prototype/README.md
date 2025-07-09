# MyFitness Interactive Prototype

## 🚀 Quick Start

1. **Start the server:**
   ```bash
   python3 -m http.server 8000
   ```

2. **Open in browser:**
   Navigate to `http://localhost:8000`

## 📱 Testing the Prototype

### **User Flows to Test:**

#### 1. **Landing Page → Goal Creation**
- Click "Start Your Fitness Goal" 
- Select a goal type (Strength, Cardio, Body, or Habit)
- Fill in goal description (minimum 10 characters)
- Click example suggestions to auto-fill

#### 2. **Dashboard Experience**
- Click "Try Demo" from landing page
- View active goals with progress bars
- Check streak counter animation
- Click chart icons (📊) to view progress charts
- Click edit (✏️) and complete (✓) buttons

#### 3. **Progress Entry**
- Click "Add Progress" from dashboard
- Enter a numeric value
- Select appropriate unit (kg, lbs, reps, km, etc.)
- Add optional notes
- Save progress and see updated dashboard

#### 4. **Progress Visualization**
- Click chart icon on any goal card
- View interactive Chart.js visualization
- Test time range buttons (7D, 1M, 3M, All)
- Check progress vs target lines

### **Key Features to Verify:**

✅ **Responsive Design** - Test on different screen sizes  
✅ **Form Validation** - Try submitting empty/invalid forms  
✅ **Animations** - Hover effects, progress bars, streak flame  
✅ **Navigation** - Back buttons, screen transitions  
✅ **Data Persistence** - Progress updates reflect in dashboard  
✅ **Toast Notifications** - Success messages for actions  

### **Sample Data Included:**
- 2 active goals (Bench Press, 5K Run)
- Progress entries with dates and notes
- 7-day streak counter
- Chart data for visualization

### **Browser Compatibility:**
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## 🎯 Target User Testing

Test with these personas in mind:
- **Busy Professional** - Quick goal creation and progress tracking
- **Fitness Enthusiast** - Detailed progress charts and data export
- **Beginner** - Simple interface and guided goal setup

## 📊 Technical Stack

- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript
- **Charts:** Chart.js for data visualization
- **Icons:** Unicode emojis for lightweight design
- **Fonts:** Inter from Google Fonts