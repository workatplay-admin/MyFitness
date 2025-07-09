// Sample data for the prototype
const sampleData = {
    user: {
        id: 'user123',
        streak: 7
    },
    goals: [
        {
            id: 'goal1',
            type: 'strength',
            icon: '💪',
            title: 'Bench Press 100kg',
            description: 'Bench press 100kg for 5 reps',
            target: '100kg',
            targetDate: 'Feb 15, 2025',
            frequency: '3x/week',
            progress: 80, // percentage
            currentValue: '80kg',
            lastEntry: '2 days ago',
            urgent: false
        },
        {
            id: 'goal2',
            type: 'cardio',
            icon: '🏃‍♂️',
            title: 'Run 5K',
            description: 'Complete a 5K run in under 30 minutes',
            target: '5km',
            targetDate: 'Mar 1, 2025',
            frequency: '5x/week',
            progress: 40, // percentage
            currentValue: '2km',
            lastEntry: 'Today',
            urgent: true
        }
    ],
    progressEntries: {
        'goal1': [
            { date: 'Jan 6, 2025', value: 82, unit: 'kg', note: 'Good session' },
            { date: 'Jan 4, 2025', value: 80, unit: 'kg', note: '' },
            { date: 'Jan 2, 2025', value: 78, unit: 'kg', note: 'Tough day' }
        ],
        'goal2': [
            { date: 'Jan 8, 2025', value: 2, unit: 'km', note: 'Felt great' },
            { date: 'Jan 6, 2025', value: 1.8, unit: 'km', note: 'Windy day' },
            { date: 'Jan 4, 2025', value: 1.5, unit: 'km', note: 'Started slow' }
        ]
    },
    chartData: {
        'goal1': {
            labels: ['Dec 1', 'Dec 8', 'Dec 15', 'Dec 22', 'Dec 29', 'Jan 5'],
            values: [60, 65, 70, 72, 75, 80],
            target: 100
        },
        'goal2': {
            labels: ['Dec 1', 'Dec 8', 'Dec 15', 'Dec 22', 'Dec 29', 'Jan 5'],
            values: [0.5, 0.8, 1.2, 1.5, 1.8, 2.0],
            target: 5
        }
    }
};

// Current state
let currentState = {
    screen: 'landing',
    goalCreation: {
        step: 1,
        type: 'strength',
        description: '',
        targetDate: '',
        frequency: ''
    },
    selectedGoal: 'goal1'
};

// DOM Elements
const screens = document.querySelectorAll('.screen');

// Navigation functions
function showScreen(screenId) {
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    currentState.screen = screenId;
    
    // Special initialization for certain screens
    if (screenId === 'dashboard') {
        renderDashboard();
    } else if (screenId === 'progressEntry') {
        initProgressEntry();
    } else if (screenId === 'progressChart') {
        initProgressChart();
    }
}

// Landing Page
document.getElementById('startGoalBtn').addEventListener('click', () => {
    showScreen('goalCreation1');
});

document.getElementById('tryDemoBtn').addEventListener('click', () => {
    showScreen('dashboard');
});

// Goal Creation Step 1
document.getElementById('backToLanding').addEventListener('click', () => {
    showScreen('landing');
});

document.getElementById('backFromGoal1').addEventListener('click', () => {
    showScreen('landing');
});

const goalTypeCards = document.querySelectorAll('.goal-type-card');
goalTypeCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove selection from all cards
        goalTypeCards.forEach(c => {
            c.classList.remove('selected');
            c.querySelector('.checkmark').classList.add('hidden');
            c.querySelector('.w-6').classList.remove('bg-blue-600');
            c.querySelector('.w-6').classList.add('border-gray-300');
        });
        
        // Add selection to clicked card
        card.classList.add('selected');
        card.querySelector('.checkmark').classList.remove('hidden');
        card.querySelector('.w-6').classList.add('bg-blue-600');
        card.querySelector('.w-6').classList.remove('border-gray-300');
        
        // Update state
        currentState.goalCreation.type = card.dataset.type;
        
        // Enable next button
        const nextBtn = document.getElementById('nextFromGoal1');
        nextBtn.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
        nextBtn.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700');
        nextBtn.disabled = false;
    });
});

document.getElementById('nextFromGoal1').addEventListener('click', () => {
    // Update UI for step 2 based on selected goal type
    updateGoalCreationStep2();
    showScreen('goalCreation2');
});

// Goal Creation Step 2
function updateGoalCreationStep2() {
    const typeIcons = {
        'strength': '💪',
        'cardio': '🏃‍♂️',
        'body': '📏',
        'habit': '🎯'
    };
    
    const typeText = {
        'strength': 'Strength',
        'cardio': 'Cardio',
        'body': 'Body',
        'habit': 'Habit'
    };
    
    const examples = {
        'strength': [
            '"Deadlift 2x my body weight (160kg)"',
            '"Complete 20 pull-ups in a row"',
            '"Squat 120kg for 10 reps"'
        ],
        'cardio': [
            '"Run 5K in under 30 minutes"',
            '"Complete a half marathon"',
            '"Cycle 20km without stopping"'
        ],
        'body': [
            '"Lose 10kg by summer"',
            '"Reduce body fat to 15%"',
            '"Increase muscle mass by 5kg"'
        ],
        'habit': [
            '"Exercise 5 days per week"',
            '"Complete 30 days of yoga"',
            '"Take 10,000 steps daily"'
        ]
    };
    
    // Update UI
    document.getElementById('goalTypeIcon').textContent = typeIcons[currentState.goalCreation.type];
    document.getElementById('goalTypeText').textContent = typeText[currentState.goalCreation.type];
    document.getElementById('exampleGoalType').textContent = typeText[currentState.goalCreation.type];
    
    // Update examples
    const examplesList = document.getElementById('examplesList');
    examplesList.innerHTML = '';
    examples[currentState.goalCreation.type].forEach(example => {
        const li = document.createElement('li');
        li.className = 'cursor-pointer hover:text-blue-600 example-item';
        li.textContent = example;
        li.addEventListener('click', () => {
            document.getElementById('goalDescription').value = example.replace(/"/g, '');
            updateCharCount();
            validateGoalDescription();
        });
        examplesList.appendChild(li);
    });
}

document.getElementById('backToGoal1').addEventListener('click', () => {
    showScreen('goalCreation1');
});

document.getElementById('backFromGoal2').addEventListener('click', () => {
    showScreen('goalCreation1');
});

const goalDescription = document.getElementById('goalDescription');
const charCount = document.getElementById('charCount');

function updateCharCount() {
    const count = goalDescription.value.length;
    charCount.textContent = `${count}/200`;
    currentState.goalCreation.description = goalDescription.value;
}

function validateGoalDescription() {
    const nextBtn = document.getElementById('nextFromGoal2');
    if (goalDescription.value.length >= 10) {
        nextBtn.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
        nextBtn.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700');
        nextBtn.disabled = false;
    } else {
        nextBtn.classList.add('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
        nextBtn.classList.remove('bg-blue-600', 'text-white', 'hover:bg-blue-700');
        nextBtn.disabled = true;
    }
}

goalDescription.addEventListener('input', () => {
    updateCharCount();
    validateGoalDescription();
});

document.getElementById('nextFromGoal2').addEventListener('click', () => {
    // In a full implementation, we would go to step 3
    // For this prototype, we'll skip to the dashboard
    showScreen('dashboard');
    
    // Show a success toast
    showToast('Goal created successfully!');
});

// Dashboard
function renderDashboard() {
    // Update streak
    document.getElementById('streakDays').textContent = sampleData.user.streak;
    
    // Update active goals count
    document.getElementById('activeGoalsCount').textContent = sampleData.goals.length;
    
    // Render goal cards
    const goalsList = document.getElementById('goalsList');
    goalsList.innerHTML = '';
    
    sampleData.goals.forEach(goal => {
        const goalCard = document.createElement('div');
        goalCard.className = 'goal-card bg-white p-6 rounded-lg shadow-sm hover:shadow-md';
        goalCard.dataset.goalId = goal.id;
        
        // Add urgent class if needed
        if (goal.urgent) {
            goalCard.classList.add('border-l-4', 'border-yellow-500');
        }
        
        goalCard.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="flex items-center space-x-2">
                    <span class="text-2xl">${goal.icon}</span>
                    <h3 class="font-semibold">${goal.title}</h3>
                </div>
                <div class="flex space-x-2">
                    <button class="view-chart-btn p-2 text-gray-600 hover:text-blue-600" data-goal-id="${goal.id}">
                        📊
                    </button>
                    <button class="edit-goal-btn p-2 text-gray-600 hover:text-blue-600" data-goal-id="${goal.id}">
                        ✏️
                    </button>
                    <button class="complete-goal-btn p-2 text-gray-600 hover:text-green-600" data-goal-id="${goal.id}">
                        ✓
                    </button>
                </div>
            </div>
            
            <div class="space-y-2">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Progress</span>
                    <span class="font-medium">${goal.progress}% (${goal.currentValue}/${goal.target})</span>
                </div>
                <div class="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div class="progress-bar bg-blue-600 h-2" style="width: ${goal.progress}%"></div>
                </div>
                <div class="flex justify-between text-xs text-gray-500">
                    <span>Target: ${goal.targetDate} • ${goal.frequency}</span>
                    <span>Last entry: ${goal.lastEntry}</span>
                </div>
                ${goal.urgent ? '<div class="text-yellow-600 text-xs mt-2">⚠️ Deadline approaching</div>' : ''}
            </div>
        `;
        
        goalsList.appendChild(goalCard);
    });
    
    // Add event listeners to goal card buttons
    document.querySelectorAll('.view-chart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentState.selectedGoal = btn.dataset.goalId;
            showScreen('progressChart');
        });
    });
    
    document.querySelectorAll('.edit-goal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            showToast('Edit goal functionality would open here');
        });
    });
    
    document.querySelectorAll('.complete-goal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            showToast('Goal marked as complete!');
            // In a full implementation, we would update the goal status
        });
    });
    
    // Add event listeners to dashboard buttons
    document.getElementById('createGoalBtn').addEventListener('click', () => {
        showScreen('goalCreation1');
    });
    
    document.getElementById('addProgressBtn').addEventListener('click', () => {
        showScreen('progressEntry');
    });
    
    document.getElementById('exportDataBtn').addEventListener('click', () => {
        showToast('Data exported successfully!');
    });
}

// Progress Entry
function initProgressEntry() {
    const goal = sampleData.goals.find(g => g.id === currentState.selectedGoal) || sampleData.goals[0];
    
    // Update UI
    document.getElementById('currentGoalTitle').textContent = goal.title;
    document.getElementById('currentGoalTarget').textContent = `${goal.target} by ${goal.targetDate}`;
    
    // Set default unit based on goal type
    const unitSelect = document.getElementById('progressUnit');
    if (goal.type === 'strength') {
        unitSelect.value = 'kg';
    } else if (goal.type === 'cardio') {
        unitSelect.value = 'km';
    } else if (goal.type === 'body') {
        unitSelect.value = 'kg';
    }
    
    // Render recent entries
    const recentEntries = document.getElementById('recentEntries');
    recentEntries.innerHTML = '';
    
    sampleData.progressEntries[goal.id].forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'flex justify-between';
        
        entryDiv.innerHTML = `
            <span class="text-gray-600">${entry.date}:</span>
            <div>
                <span class="font-medium">${entry.value}${entry.unit}</span>
                ${entry.note ? `<span class="text-gray-500 ml-2">"${entry.note}"</span>` : ''}
            </div>
        `;
        
        recentEntries.appendChild(entryDiv);
    });
    
    // Reset form
    document.getElementById('progressValue').value = '';
    document.getElementById('progressNote').value = '';
    document.getElementById('noteCharCount').textContent = '0/140';
    
    // Validate form
    validateProgressForm();
}

document.getElementById('backToDashboard').addEventListener('click', () => {
    showScreen('dashboard');
});

const progressValue = document.getElementById('progressValue');
const progressNote = document.getElementById('progressNote');
const noteCharCount = document.getElementById('noteCharCount');

progressValue.addEventListener('input', validateProgressForm);

progressNote.addEventListener('input', () => {
    const count = progressNote.value.length;
    noteCharCount.textContent = `${count}/140`;
    validateProgressForm();
});

function validateProgressForm() {
    const saveBtn = document.getElementById('saveProgressBtn');
    if (progressValue.value && !isNaN(progressValue.value) && parseFloat(progressValue.value) >= 0) {
        saveBtn.disabled = false;
        saveBtn.classList.remove('bg-gray-300', 'cursor-not-allowed');
        saveBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
    } else {
        saveBtn.disabled = true;
        saveBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
        saveBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    }
}

document.getElementById('saveProgressBtn').addEventListener('click', () => {
    // In a full implementation, we would save the progress
    // For this prototype, we'll just show a success message and return to dashboard
    showToast('Progress saved successfully!');
    
    // Update the goal progress (for demo purposes)
    const goal = sampleData.goals.find(g => g.id === currentState.selectedGoal);
    if (goal) {
        // Update last entry
        goal.lastEntry = 'Just now';
        
        // Update progress value
        const newValue = parseFloat(progressValue.value);
        const targetValue = parseFloat(goal.target);
        goal.currentValue = `${newValue}${document.getElementById('progressUnit').value}`;
        
        // Calculate new progress percentage
        goal.progress = Math.min(Math.round((newValue / targetValue) * 100), 100);
        
        // Add to progress entries
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        sampleData.progressEntries[goal.id].unshift({
            date: today,
            value: newValue,
            unit: document.getElementById('progressUnit').value,
            note: progressNote.value
        });
        
        // Increment streak if it's a new day
        sampleData.user.streak++;
    }
    
    showScreen('dashboard');
});

// Progress Chart
function initProgressChart() {
    const goal = sampleData.goals.find(g => g.id === currentState.selectedGoal) || sampleData.goals[0];
    
    // Update UI
    document.getElementById('chartGoalTitle').textContent = goal.title;
    
    // Initialize chart
    const ctx = document.getElementById('progressChartCanvas').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.progressChart) {
        window.progressChart.destroy();
    }
    
    // Create new chart
    window.progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sampleData.chartData[goal.id].labels,
            datasets: [
                {
                    label: 'Progress',
                    data: sampleData.chartData[goal.id].values,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Target',
                    data: Array(sampleData.chartData[goal.id].labels.length).fill(sampleData.chartData[goal.id].target),
                    borderColor: '#ef4444',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Add event listeners to time range buttons
    document.querySelectorAll('.time-range-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.time-range-btn').forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white');
                b.classList.add('border-gray-300', 'hover:bg-gray-50');
            });
            
            // Add active class to clicked button
            btn.classList.add('bg-blue-600', 'text-white');
            btn.classList.remove('border-gray-300', 'hover:bg-gray-50');
            
            // Update chart data based on range
            // In a full implementation, we would fetch data for the selected range
            // For this prototype, we'll just show a message
            showToast(`Showing ${btn.dataset.range} data range`);
        });
    });
}

document.getElementById('backFromChart').addEventListener('click', () => {
    showScreen('dashboard');
});

document.getElementById('exportFromChart').addEventListener('click', () => {
    showToast('Data exported successfully!');
});

document.getElementById('addProgressFromChart').addEventListener('click', () => {
    showScreen('progressEntry');
});

// Utility functions
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in';
    toast.textContent = message;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Initialize the prototype
document.addEventListener('DOMContentLoaded', () => {
    // Start on landing page
    showScreen('landing');
});