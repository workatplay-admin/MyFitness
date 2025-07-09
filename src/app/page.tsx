import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  console.log('[MyFitness Debug] HomePage component rendering');
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4 border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏃‍♂️</span>
            <h1 className="text-xl font-bold text-gray-900">MyFitness</h1>
          </div>
          <div className="hidden md:flex space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
              🎯 Define. Track. <span className="text-primary">Achieve.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The simplest way to reach your fitness goals. Set SMART objectives, track progress visually, and stay motivated with streak tracking.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-4" asChild>
              <Link href="/dashboard">
                Start Your Fitness Goal
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
              <Link href="/demo">
                Try Demo
              </Link>
            </Button>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="font-semibold text-lg mb-2">SMART Goals</h3>
                <p className="text-muted-foreground text-sm">
                  Set specific, measurable, achievable targets with guided goal creation
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="font-semibold text-lg mb-2">Visual Progress</h3>
                <p className="text-muted-foreground text-sm">
                  Track your journey with beautiful, interactive progress charts
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="font-semibold text-lg mb-2">Streak Tracking</h3>
                <p className="text-muted-foreground text-sm">
                  Stay motivated with consistency rewards and milestone celebrations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features Preview */}
          <div className="bg-muted/50 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-semibold mb-6">Everything you need to succeed</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Goal Creation Wizard</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Progress Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Interactive Charts</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Data Export</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Mobile Responsive</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>No App Download</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Privacy Focused</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Free to Use</span>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Join thousands of people achieving their fitness goals
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl">💪</div>
              <div className="text-2xl">🏃‍♂️</div>
              <div className="text-2xl">📏</div>
              <div className="text-2xl">🎯</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🏃‍♂️</span>
                <span className="text-xl font-bold">MyFitness</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                The simplest way to reach your fitness goals. Built with privacy and simplicity in mind.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="/demo" className="hover:text-foreground">Demo</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 MyFitness. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}