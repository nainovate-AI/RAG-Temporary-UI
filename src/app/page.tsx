'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Zap, 
  Database, 
  Brain,
  ArrowRight,
  Check,
  Upload,
  Settings,
  Rocket,
  BarChart3,
  Shield,
  Clock,
  Users,
  Sparkles,
  ChevronRight,
  Play,
  X,
  TrendingUp,
  MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Animated counter hook
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration])
  
  return count
}

export default function Home() {
  const documentsCount = useCounter(50000)
  const queriesCount = useCounter(2000000)
  const uptimeCount = useCounter(99.9, 1000)
  
  const features = [
    {
      icon: FileText,
      title: 'Universal Document Support',
      description: 'PDF, DOCX, CSV, JSON, HTML, Markdown and more. Process any document type effortlessly.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      badge: 'Production Ready',
      badgeColor: 'bg-blue-500/20 text-blue-600'
    },
    {
      icon: Brain,
      title: 'Smart Chunking',
      description: 'Intelligent text splitting that preserves context and meaning for better retrieval.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      badge: 'Production Ready',
      badgeColor: 'bg-purple-500/20 text-purple-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Sub-100ms query responses with optimized vector search and caching.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      badge: 'Production Ready',
      badgeColor: 'bg-yellow-500/20 text-yellow-600'
    },
    {
      icon: Database,
      title: 'Multi-Vector Support',
      description: 'Connect Pinecone, Qdrant, Weaviate, Chroma, or any vector database.',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      badge: 'Production Ready',
      badgeColor: 'bg-green-500/20 text-green-600'
    },
    {
      icon: MessageSquare,
      title: 'Advanced Prompts',
      description: 'Template library, dynamic variables, and context-aware prompt engineering.',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      badge: 'Production Ready',
      badgeColor: 'bg-indigo-500/20 text-indigo-600'
    },
    {
      icon: Brain,
      title: 'Memory & Caching',
      description: 'Session memory, conversation history, and intelligent response caching.',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      badge: 'In Development',
      badgeColor: 'bg-yellow-500/20 text-yellow-600'
    }
  ]

  const stats = [
    { label: 'Documents Processed', value: documentsCount.toLocaleString() + '+' },
    { label: 'Queries Handled', value: (queriesCount / 1000000).toFixed(1) + 'M+' },
    { label: 'Uptime', value: uptimeCount.toFixed(1) + '%' },
    { label: 'Setup Time', value: '< 5 min' }
  ]

  const comparisonData = [
    { feature: 'No-code Interface', ours: true, others: false },
    { feature: 'Real-time Monitoring', ours: true, others: false },
    { feature: 'Multi-model Support', ours: true, others: true },
    { feature: 'Custom Embeddings', ours: true, others: true },
    { feature: 'Visual Pipeline Builder', ours: true, others: false },
    { feature: 'One-click Deploy', ours: true, others: false },
    { feature: 'Built-in Analytics', ours: true, others: false },
    { feature: 'Free Tier', ours: true, others: false }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo-dark.png"
                alt="Logo"
                width={150}
                height={40}
                className="hidden dark:block"
              />
              <Image
                src="/logo-light.png"
                alt="Logo"
                width={150}
                height={40}
                className="block dark:hidden"
              />
            </div>
            
            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Get Started
                </button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-8 animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Trusted by 500+ developers</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              RAG made{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                simple
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Build production-ready Retrieval-Augmented Generation systems in minutes, not months. 
              No complex setup, just powerful results.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/documents">
                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2 group">
                  Start Building
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-all flex items-center gap-2">
                <Play className="h-4 w-4" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to deploy RAG at scale
            </h2>
            <p className="text-lg text-muted-foreground">
              From raw documents to production-ready Q&A systems, we handle the entire pipeline so you can ship faster
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl border border-border bg-card/50 backdrop-blur hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Background gradient effect */}
                <div className={cn("absolute inset-0 opacity-5", feature.bgColor)} />
                
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className={cn("text-xs font-medium", feature.badgeColor)}>
                    {feature.badge}
                  </Badge>
                </div>
                
                {/* Content */}
                <div className="relative">
                  <div className={cn("p-3 rounded-lg w-fit mb-4", feature.bgColor)}>
                    <feature.icon className={cn("h-6 w-6", feature.color)} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Dashboard Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              See it in action
            </h2>
            <p className="text-lg text-muted-foreground">
              Real-time monitoring and analytics at your fingertips
            </p>
          </div>
          
          {/* Dashboard Preview Card */}
          <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-muted/30 border-b border-border px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-muted-foreground">Live Analytics Dashboard</span>
              <Badge variant="secondary" className="text-xs">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Live
              </Badge>
            </div>
            
            {/* Dashboard Content */}
            <div className="p-8">
              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="text-3xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground mt-1">Active Pipelines</div>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-3xl font-bold text-green-600">48.5K</div>
                  <div className="text-sm text-muted-foreground mt-1">Documents</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-3xl font-bold text-blue-600">87ms</div>
                  <div className="text-sm text-muted-foreground mt-1">Avg Latency</div>
                </div>
                <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="text-3xl font-bold text-purple-600">99.2%</div>
                  <div className="text-sm text-muted-foreground mt-1">Success Rate</div>
                </div>
              </div>
              
              {/* Advanced Chart Area */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Performance Chart */}
                <div className="bg-muted/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium">Query Performance</h4>
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +18.2%
                    </span>
                  </div>
                  <div className="space-y-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                      <div key={day} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-8">{day}</span>
                        <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                            style={{ width: `${[65, 78, 72, 85, 92, 60, 55][idx]}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-12 text-right">
                          {[6.5, 7.8, 7.2, 8.5, 9.2, 6.0, 5.5][idx]}k
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pipeline Status */}
                <div className="bg-muted/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium">Pipeline Status</h4>
                    <span className="text-xs text-muted-foreground">Real-time</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Customer Support</span>
                      </div>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Technical Docs</span>
                      </div>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                        <span className="text-sm font-medium">Legal Analysis</span>
                      </div>
                      <span className="text-xs text-yellow-600">Processing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section - Card Based */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why choose our platform?
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything included, nothing to build from scratch
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">No-code Interface</h3>
              <p className="text-sm text-muted-foreground">Build complex RAG systems without writing code</p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-sm text-muted-foreground">Monitor performance and optimize on the fly</p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">One-click Deploy</h3>
              <p className="text-sm text-muted-foreground">From prototype to production in seconds</p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Enterprise Security</h3>
              <p className="text-sm text-muted-foreground">Production-grade security and compliance</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to build your RAG system?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of developers who are already building with us
          </p>
          <Link href="/documents">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all hover:scale-105 text-lg">
              Create Your First Pipeline
              <ChevronRight className="inline-block ml-2 h-5 w-5" />
            </button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required • Free forever for small projects
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Nainovate AI. Building the future of accessible AI.</p>
        </div>
      </footer>
    </div>
  )
}