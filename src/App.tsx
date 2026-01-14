// src/App.tsx

import React, { useEffect, useState } from 'react'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import Carousel from './carousel'
import Card from './card'
import Papa, { type ParseConfig, type ParseResult } from 'papaparse'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

const LINKS_CSV_URL: string = import.meta.env.VITE_LINKS_CSV
const GITHUB_URL: string = import.meta.env.VITE_GITHUB_PROFILE
const LINKEDIN_URL: string = import.meta.env.VITE_LINKEDIN_PROFILE
const EMAIL: string = import.meta.env.VITE_EMAIL
const PHONE: string = import.meta.env.VITE_PHONE

const App: React.FC = () => {
  const [cards, setCards] = useState<React.ReactNode[]>([])

  const getCsvExportUrl = (url: string): string => 
    url.includes('docs.google.com/spreadsheets') 
      ? url.replace(/\/edit.*$/, '/export?format=csv') 
      : url

  const fetchCsv = (): TE.TaskEither<Error, string> =>
    TE.tryCatch(
      async (): Promise<string> => {
        const response: Response = await fetch(getCsvExportUrl(LINKS_CSV_URL))
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`)
        return response.text()
      },
      (reason: unknown): Error => new Error(String(reason))
    )

  const parseCsv = (csvString: string): TE.TaskEither<Error, string[][]> =>
    () => new Promise((resolve: (value: E.Either<Error, string[][]>) => void) => {
      const config: ParseConfig<string[]> = {
        header: false,
        skipEmptyLines: true,
        complete: (results: ParseResult<string[]>): void => resolve(E.right(results.data))
      }
      Papa.parse<string[]>(csvString, config)
    })

  useEffect(() => {
    const program: TE.TaskEither<Error, React.ReactNode[]> = pipe(
      fetchCsv(),
      TE.chain(parseCsv),
      TE.map((data: string[][]): React.ReactNode[] =>
        data.map((row: string[], i: number): React.ReactNode => (
          <Card key={i} data={{ links: row }} />
        ))
      )
    )

    program().then((result: E.Either<Error, React.ReactNode[]>) => {
      if (E.isRight(result)) setCards(result.right)
    })
  }, [])

  return (
    <div className="app-layout">
      <nav className="top-ribbon">
        <span className="name-brand">Ken</span>
        <div className="social-icons">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faGithub} /></a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
          <a href={`mailto:${EMAIL}`}><FontAwesomeIcon icon={faEnvelope} /></a>
          <a href={`tel:${PHONE}`}><FontAwesomeIcon icon={faPhone} /></a>
        </div>
      </nav>

      <main className="content-area">
        {cards.length > 0 ? <Carousel>{cards}</Carousel> : <div className="loader">Loading...</div>}
      </main>
    </div>
  )
}

export default App
