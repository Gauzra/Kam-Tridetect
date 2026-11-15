import {
  FiGrid,
  FiFilePlus,
  FiClock,
  FiBarChart2,
  FiInfo,
} from 'react-icons/fi'
import './Navbar.css'

export default function Navbar({ activeTab, onSelectTab }) {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <FiGrid />,
    },
    {
      id: 'analisis',
      label: 'Analisis Baru',
      icon: <FiFilePlus />,
    },
    {
      id: 'riwayat',
      label: 'Riwayat Analisis',
      icon: <FiClock />,
    },
    {
      id: 'komparasi',
      label: 'Komparasi Emiten',
      badge: 'Direncanakan',
      icon: <FiBarChart2 />,
    },
    {
      id: 'tentang',
      label: 'Tentang Sistem',
      icon: <FiInfo />,
    },
  ]

  return (
    <header className="app-header">
      <div className="header-container">
        <div
          className="header-brand"
          onClick={() => onSelectTab('overview')}
          title="Beranda KAM-TRIDETECT"
        >
          <img src="/logo.png" alt="KAM-TRIDETECT" className="brand-logo-img" />
        </div>

        <nav className="header-nav" aria-label="Navigasi Utama">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                className={`nav-item-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => onSelectTab(tab.id)}
              >
                <span className="nav-item-icon">{tab.icon}</span>
                <span className="nav-item-text">{tab.label}</span>
                {tab.badge && <span className="nav-item-badge">{tab.badge}</span>}
              </button>
            )
          })}
        </nav>

        <div className="header-status">
          <span className="status-dot-live"></span>
          <span className="status-label">Audit Engine Active</span>
        </div>
      </div>
    </header>
  )
}
