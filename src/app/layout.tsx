import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReduxProvider } from '@/providers/redux-provider'
import { AppStateProvider } from '@/providers/app-state-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RAGDP-UI - Retrieval-Augmented Generation Dashboard',
  description: 'Enterprise-grade platform for building and managing RAG pipelines',
  keywords: 'RAG, AI, LLM, retrieval, augmented generation, dashboard',
  authors: [{ name: 'RAGDP Team' }],
  openGraph: {
    title: 'RAGDP-UI - RAG Dashboard Platform',
    description: 'Build production-ready RAG systems with ease',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.toggle('dark', theme === 'dark');
              } catch (e) {}
            `,
          }}
        />
        <ReduxProvider>
          <AppStateProvider>
            <div className="min-h-screen bg-background">
              {children}
            </div>
          </AppStateProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}