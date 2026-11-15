import { useState } from 'react'
import { NotificationProvider } from './context/NotificationContext'
import Navbar from './components/Navbar'
import OverviewPage from './components/OverviewPage'
import NewAnalysisPage from './components/NewAnalysisPage'
import HistoryPage from './components/HistoryPage'
import ComparisonPage from './components/ComparisonPage'
import AboutSystemPage from './components/AboutSystemPage'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  // selectedDocId: when user clicks a row in Overview → opens HistoryPage with that doc's modal
  const [selectedDocId, setSelectedDocId] = useState(null)

  const navigateTo = (tab, docId = null) => {
    setActiveTab(tab)
    if (docId !== null) setSelectedDocId(docId)
    else setSelectedDocId(null)
  }

  return (
    <NotificationProvider>
      <div className="app-root">
        <Navbar activeTab={activeTab} onSelectTab={(tab) => navigateTo(tab)} />

        <main className="main-viewport">
          {activeTab === 'overview' && (
            <OverviewPage
              onNavigate={navigateTo}
              onSelectDocument={(docId) => navigateTo('riwayat', docId)}
            />
          )}

          {activeTab === 'analisis' && (
            <NewAnalysisPage
              onGoToHistory={() => navigateTo('riwayat')}
            />
          )}

          {activeTab === 'riwayat' && (
            <HistoryPage
              onGoToAnalyze={() => navigateTo('analisis')}
              initialSelectedId={selectedDocId}
              onModalClosed={() => setSelectedDocId(null)}
            />
          )}

          {activeTab === 'komparasi' && (
            <ComparisonPage
              onGoToAnalyze={() => navigateTo('analisis')}
              onGoToHistory={() => navigateTo('riwayat')}
            />
          )}

          {activeTab === 'tentang' && <AboutSystemPage />}
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-left">
              <strong>KAM-TRIDETECT</strong> &mdash; Professional Audit Intelligence Platform
            </div>
            <div className="footer-right">
              <span>Triple Earnings Management Detection</span>
              <span className="dot-sep">&bull;</span>
              <span>SA 701 &bull; DSR</span>
            </div>
          </div>
        </footer>
      </div>
    </NotificationProvider>
  )
}
