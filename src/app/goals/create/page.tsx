'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GOAL_CATEGORIES, GOAL_TYPES } from '@/lib/constants';

export default function CreateGoalPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'numeric' as 'numeric' | 'boolean',
    targetValue: '',
    currentValue: '',
    unit: '',
    deadline: '',
    reminderFrequency: 'daily' as 'daily' | 'weekly' | 'none'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      console.log('Creating goal:', formData);
      
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create goal');
      }
      
      const result = await response.json();
      console.log('Goal created successfully:', result);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating goal:', error);
      // TODO: Add proper error handling UI
      alert('Failed to create goal. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">What's your fitness goal?</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Goal Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Lose 10 pounds, Run 5K under 25 minutes"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Add more details about your goal..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose a category</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {GOAL_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    className={`p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors ${
                      formData.category === category.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('category', category.id)}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="font-medium text-sm">{category.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Set your target</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Goal Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      className={`p-3 border rounded-lg text-center ${
                        formData.type === 'numeric' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200'
                      }`}
                      onClick={() => handleInputChange('type', 'numeric')}
                    >
                      <div className="font-medium">📊 Numeric</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Track numbers (weight, time, reps)
                      </div>
                    </button>
                    <button
                      className={`p-3 border rounded-lg text-center ${
                        formData.type === 'boolean' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200'
                      }`}
                      onClick={() => handleInputChange('type', 'boolean')}
                    >
                      <div className="font-medium">✅ Habit</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Daily yes/no tracking
                      </div>
                    </button>
                  </div>
                </div>

                {formData.type === 'numeric' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Current Value</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="0"
                          value={formData.currentValue}
                          onChange={(e) => handleInputChange('currentValue', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Target Value</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="10"
                          value={formData.targetValue}
                          onChange={(e) => handleInputChange('targetValue', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Unit</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., lbs, minutes, reps"
                        value={formData.unit}
                        onChange={(e) => handleInputChange('unit', e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Timeline & Reminders</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Target Deadline</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reminder Frequency</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'daily', label: 'Daily', icon: '📅' },
                      { value: 'weekly', label: 'Weekly', icon: '📆' },
                      { value: 'none', label: 'None', icon: '🔕' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        className={`p-3 border rounded-lg text-center ${
                          formData.reminderFrequency === option.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200'
                        }`}
                        onClick={() => handleInputChange('reminderFrequency', option.value)}
                      >
                        <div className="text-xl mb-1">{option.icon}</div>
                        <div className="font-medium text-sm">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Goal Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Goal Summary</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Title:</strong> {formData.title}</div>
                <div><strong>Category:</strong> {GOAL_CATEGORIES.find(c => c.id === formData.category)?.name}</div>
                <div><strong>Type:</strong> {formData.type === 'numeric' ? 'Numeric Goal' : 'Habit Goal'}</div>
                {formData.type === 'numeric' && (
                  <div><strong>Target:</strong> {formData.currentValue} → {formData.targetValue} {formData.unit}</div>
                )}
                <div><strong>Deadline:</strong> {formData.deadline ? new Date(formData.deadline).toLocaleDateString() : 'Not set'}</div>
                <div><strong>Reminders:</strong> {formData.reminderFrequency}</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title.trim().length > 0;
      case 2:
        return formData.category.length > 0;
      case 3:
        if (formData.type === 'numeric') {
          return formData.targetValue && formData.unit;
        }
        return true;
      case 4:
        return formData.deadline.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">🏃‍♂️</span>
            <span className="text-xl font-bold">MyFitness</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Goal</h1>
          <p className="text-muted-foreground">
            Let's set up a SMART fitness goal to help you succeed
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of 4</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Goal Details"}
              {step === 2 && "Category Selection"}
              {step === 3 && "Target Setting"}
              {step === 4 && "Timeline & Review"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 4 ? (
            <Button 
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={!isStepValid()}
            >
              Create Goal
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}