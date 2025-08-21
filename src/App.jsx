import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import SEO from './components/SEO'

function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen">
        <SEO />
        <Suspense
          fallback={
            <div className="h-screen w-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </HelmetProvider>
  )
}

export default App
