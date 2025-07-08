export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-6 animate-fade-up">
        <h1 className="text-6xl font-bold text-gradient">
          RAGDP-UI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Retrieval-Augmented Generation Dashboard Platform
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Get Started
          </button>
          <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors">
            Learn More
          </button>
        </div>
        <div className="mt-12 text-sm text-muted-foreground">
          ✅ Setup successful! Your RAGDP-UI is ready for development.
        </div>
      </div>
    </main>
  )
}