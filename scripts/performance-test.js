const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Performance benchmarks based on Milestone 1 requirements
const PERFORMANCE_BENCHMARKS = {
  'first-contentful-paint': { max: 1500, unit: 'ms' },
  'largest-contentful-paint': { max: 2500, unit: 'ms' },
  'interactive': { max: 3000, unit: 'ms' }, // Time to Interactive
  'cumulative-layout-shift': { max: 0.1, unit: 'score' },
  'total-blocking-time': { max: 300, unit: 'ms' },
  'speed-index': { max: 3000, unit: 'ms' }
};

const URLS_TO_TEST = [
  'http://localhost:3000',
  'http://localhost:3000/dashboard',
  'http://localhost:3000/goals/create'
];

class PerformanceTestRunner {
  constructor() {
    this.results = [];
    this.failedBenchmarks = [];
  }

  async runTests() {
    console.log('🚀 Starting Performance Tests for Milestone 1');
    console.log('==================================================\n');

    // Check if Lighthouse CI is installed
    try {
      await this.checkLighthouseCLI();
    } catch (error) {
      console.error('❌ Lighthouse CI not found. Installing...');
      await this.installLighthouseCLI();
    }

    // Run Lighthouse CI tests
    console.log('📊 Running Lighthouse CI performance tests...\n');
    
    try {
      await this.runLighthouseCI();
      await this.parseResults();
      this.displayResults();
      this.identifyBottlenecks();
      
      // Exit with appropriate code
      process.exit(this.failedBenchmarks.length > 0 ? 1 : 0);
    } catch (error) {
      console.error('❌ Error running performance tests:', error);
      process.exit(1);
    }
  }

  checkLighthouseCLI() {
    return new Promise((resolve, reject) => {
      const check = spawn('npx', ['lhci', '--version'], { shell: true });
      check.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('Lighthouse CI not installed'));
        }
      });
    });
  }

  installLighthouseCLI() {
    return new Promise((resolve, reject) => {
      console.log('Installing @lhci/cli...');
      const install = spawn('npm', ['install', '-D', '@lhci/cli'], { 
        stdio: 'inherit',
        shell: true 
      });
      
      install.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Lighthouse CI installed successfully\n');
          resolve();
        } else {
          reject(new Error('Failed to install Lighthouse CI'));
        }
      });
    });
  }

  runLighthouseCI() {
    return new Promise((resolve, reject) => {
      const lhci = spawn('npx', ['lhci', 'autorun', '--collect.numberOfRuns=3'], {
        stdio: 'inherit',
        shell: true,
        env: { ...process.env }
      });

      lhci.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Lighthouse CI exited with code ${code}`));
        }
      });
    });
  }

  async parseResults() {
    // Find the most recent Lighthouse report
    const lhciDir = path.join(process.cwd(), '.lighthouseci');
    
    if (!fs.existsSync(lhciDir)) {
      throw new Error('No Lighthouse CI results found');
    }

    const files = fs.readdirSync(lhciDir)
      .filter(f => f.startsWith('lhr-') && f.endsWith('.json'))
      .sort()
      .reverse();

    if (files.length === 0) {
      throw new Error('No Lighthouse reports found');
    }

    // Parse results for each URL
    for (const url of URLS_TO_TEST) {
      const urlResults = {
        url,
        metrics: {},
        passed: true
      };

      // Find reports for this URL
      const urlFiles = files.filter(f => {
        const content = JSON.parse(fs.readFileSync(path.join(lhciDir, f), 'utf8'));
        return content.finalUrl === url || content.requestedUrl === url;
      });

      if (urlFiles.length > 0) {
        // Get the most recent report for this URL
        const reportPath = path.join(lhciDir, urlFiles[0]);
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

        // Extract performance metrics
        const metrics = report.audits;
        
        // Map Lighthouse metrics to our benchmarks
        urlResults.metrics['first-contentful-paint'] = {
          value: metrics['first-contentful-paint']?.numericValue || 0,
          score: metrics['first-contentful-paint']?.score || 0
        };
        
        urlResults.metrics['largest-contentful-paint'] = {
          value: metrics['largest-contentful-paint']?.numericValue || 0,
          score: metrics['largest-contentful-paint']?.score || 0
        };
        
        urlResults.metrics['interactive'] = {
          value: metrics['interactive']?.numericValue || 0,
          score: metrics['interactive']?.score || 0
        };
        
        urlResults.metrics['cumulative-layout-shift'] = {
          value: metrics['cumulative-layout-shift']?.numericValue || 0,
          score: metrics['cumulative-layout-shift']?.score || 0
        };
        
        urlResults.metrics['total-blocking-time'] = {
          value: metrics['total-blocking-time']?.numericValue || 0,
          score: metrics['total-blocking-time']?.score || 0
        };
        
        urlResults.metrics['speed-index'] = {
          value: metrics['speed-index']?.numericValue || 0,
          score: metrics['speed-index']?.score || 0
        };

        // Overall performance score
        urlResults.performanceScore = report.categories?.performance?.score || 0;
      }

      this.results.push(urlResults);
    }
  }

  displayResults() {
    console.log('\n📊 Performance Test Results');
    console.log('==================================================\n');

    for (const result of this.results) {
      console.log(`📍 URL: ${result.url}`);
      console.log(`📈 Overall Performance Score: ${(result.performanceScore * 100).toFixed(0)}%\n`);

      console.log('Metrics:');
      console.log('--------');

      for (const [metric, data] of Object.entries(result.metrics)) {
        const benchmark = PERFORMANCE_BENCHMARKS[metric];
        const value = benchmark.unit === 'ms' ? data.value : data.value;
        const displayValue = benchmark.unit === 'ms' 
          ? `${value.toFixed(0)}ms`
          : value.toFixed(3);
        
        const passed = benchmark.unit === 'ms' 
          ? value <= benchmark.max
          : value <= benchmark.max;

        const status = passed ? '✅' : '❌';
        const comparison = passed ? '✓' : `(exceeds ${benchmark.max}${benchmark.unit})`;

        console.log(`${status} ${this.formatMetricName(metric)}: ${displayValue} ${comparison}`);

        if (!passed) {
          this.failedBenchmarks.push({
            url: result.url,
            metric,
            value: displayValue,
            benchmark: `${benchmark.max}${benchmark.unit}`,
            difference: benchmark.unit === 'ms' 
              ? `+${(value - benchmark.max).toFixed(0)}ms`
              : `+${(value - benchmark.max).toFixed(3)}`
          });
        }
      }

      console.log('\n');
    }
  }

  formatMetricName(metric) {
    const names = {
      'first-contentful-paint': 'First Contentful Paint (FCP)',
      'largest-contentful-paint': 'Largest Contentful Paint (LCP)',
      'interactive': 'Time to Interactive (TTI)',
      'cumulative-layout-shift': 'Cumulative Layout Shift (CLS)',
      'total-blocking-time': 'Total Blocking Time (TBT)',
      'speed-index': 'Speed Index'
    };
    return names[metric] || metric;
  }

  identifyBottlenecks() {
    if (this.failedBenchmarks.length === 0) {
      console.log('✨ All performance benchmarks passed! The application meets Milestone 1 requirements.\n');
      return;
    }

    console.log('⚠️  Performance Bottlenecks Identified');
    console.log('==================================================\n');

    console.log(`Found ${this.failedBenchmarks.length} benchmark(s) that need improvement:\n`);

    for (const failure of this.failedBenchmarks) {
      console.log(`❌ ${failure.url}`);
      console.log(`   ${this.formatMetricName(failure.metric)}: ${failure.value} (benchmark: ${failure.benchmark})`);
      console.log(`   Exceeds benchmark by: ${failure.difference}\n`);
    }

    console.log('🔍 Recommended Optimizations:');
    console.log('--------------------------------\n');

    // Analyze specific bottlenecks and provide recommendations
    const hasLCPIssue = this.failedBenchmarks.some(f => f.metric === 'largest-contentful-paint');
    const hasFCPIssue = this.failedBenchmarks.some(f => f.metric === 'first-contentful-paint');
    const hasTTIIssue = this.failedBenchmarks.some(f => f.metric === 'interactive');
    const hasCLSIssue = this.failedBenchmarks.some(f => f.metric === 'cumulative-layout-shift');
    const hasTBTIssue = this.failedBenchmarks.some(f => f.metric === 'total-blocking-time');

    if (hasLCPIssue || hasFCPIssue) {
      console.log('🖼️  Render Performance Issues:');
      console.log('   • Optimize image loading (use next/image with priority for above-fold images)');
      console.log('   • Implement resource hints (preconnect, prefetch, preload)');
      console.log('   • Reduce server response time');
      console.log('   • Minimize render-blocking resources\n');
    }

    if (hasTTIIssue || hasTBTIssue) {
      console.log('⚡ JavaScript Performance Issues:');
      console.log('   • Code-split large bundles');
      console.log('   • Defer non-critical JavaScript');
      console.log('   • Minimize main thread work');
      console.log('   • Remove unused JavaScript\n');
    }

    if (hasCLSIssue) {
      console.log('📐 Layout Stability Issues:');
      console.log('   • Set explicit dimensions for images and videos');
      console.log('   • Avoid inserting content above existing content');
      console.log('   • Use CSS transforms instead of position changes\n');
    }

    console.log('💡 Next Steps:');
    console.log('   1. Run "npm run build && npm run analyze" to check bundle sizes');
    console.log('   2. Use Chrome DevTools Performance tab for detailed analysis');
    console.log('   3. Consider implementing Progressive Web App features');
    console.log('   4. Review and optimize critical rendering path\n');
  }
}

// Run the performance tests
const runner = new PerformanceTestRunner();
runner.runTests().catch(error => {
  console.error('Failed to run performance tests:', error);
  process.exit(1);
});