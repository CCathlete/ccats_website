import React, { useEffect, useState } from 'react'
import './App.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'

import Carousel from './carousel'
import RedirectLink from './redirect'
import CopyToClipboard from './copy_to_clipboard'
import Card from './card'

import Papa from 'papaparse'

// env
const LINKS_CSV = import.meta.env.VITE_LINKS_CSV
const GITHUB_URL = import.meta.env.VITE_GITHUB_PROFILE
const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_PROFILE
const EMAIL = import.meta.env.VITE_EMAIL
const PHONE = import.meta.env.VITE_PHONE

const App: React.FC = () => {
  const [cards, setCards] = useState<React.ReactNode[]>([])

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(LINKS_CSV)
        const csvText = await res.text()

        Papa.parse(csvText, {
          header: false,
          skipEmptyLines: true,
          complete: (result) => {
            const parsedCards = (result.data as any[][]).map((row, i) => (
              <Card key={i} data={{ links: row.map(cell => String(cell).trim()) }} />
            ))
            setCards(parsedCards)
          },
          error: (err) => {
            console.error('CSV parse error:', err)
          },
        })
      } catch (err) {
        console.error('Fetch error:', err)
      }
    }

    fetchCards()
  }, [])

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Top Ribbon */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '48px',
          backgroundColor: '#0057B7',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          zIndex: 1000,
        }}
      >
        <div style={{ flex: 1, fontWeight: 600 }}>Ken</div>

        <div
          style={{
            flex: 4,
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <RedirectLink url={GITHUB_URL}>
            <FontAwesomeIcon icon={faGithub} size="lg" />
          </RedirectLink>

          <RedirectLink url={LINKEDIN_URL}>
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </RedirectLink>

          <CopyToClipboard text={EMAIL}>
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
          </CopyToClipboard>

          <CopyToClipboard text={PHONE}>
            <FontAwesomeIcon icon={faPhone} size="lg" />
          </CopyToClipboard>
        </div>
      </header>

      {/* Carousel */}
      <div style={{ paddingTop: '48px', height: '100%' }}>
        <Carousel cards={cards} />
      </div>
    </div>
  )
}

export default App
