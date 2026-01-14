// src/App.tsx

import React, { useEffect, useState } from 'react'
import './App.css'
import Carousel from './carousel'
import Card from './card'
import Papa, { type ParseConfig, type ParseResult } from 'papaparse'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

const LINKS_CSV_URL: string = import.meta.env.VITE_LINKS_CSV

const App: React.FC = () => {
  const [cards, setCards] = useState<React.ReactNode[]>([])

  // Helper to convert Google Sheets "View" URL to "Export CSV" URL
  const getCsvExportUrl = (url: string): string => {
    if (url.includes('docs.google.com/spreadsheets')) {
      return url.replace(/\/edit.*$/, '/export?format=csv')
    }
    return url
  }

  const fetchCsv = (): TE.TaskEither<Error, string> =>
    TE.tryCatch(
      async (): Promise<string> => {
        const exportUrl: string = getCsvExportUrl(LINKS_CSV_URL)
        const response: Response = await fetch(exportUrl)
        if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`)
        return response.text()
      },
      (reason: unknown): Error => new Error(String(reason))
    )

  const parseCsv = (csvString: string): TE.TaskEither<Error, string[][]> =>
    () => new Promise((resolve: (value: E.Either<Error, string[][]>) => void) => {
      const config: ParseConfig<string[]> = {
        header: false,
        skipEmptyLines: true,
        complete: (results: ParseResult<string[]>): void => {
          results.errors.length > 0
            ? resolve(E.left(new Error(results.errors[0].message)))
            : resolve(E.right(results.data))
        }
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
      pipe(
        result,
        E.match(
          (err: Error): void => console.error(err.message),
          (renderedCards: React.ReactNode[]): void => setCards(renderedCards)
        )
      )
    })
  }, [])

  return (
    <div className="app-layout">
      <main className="content-area">
        {cards.length > 0 ? <Carousel>{cards}</Carousel> : <div>Loading cards...</div>}
      </main>
    </div>
  )
}

export default App
