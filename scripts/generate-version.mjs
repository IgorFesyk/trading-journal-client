import { readFileSync, writeFileSync } from 'fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

writeFileSync('./dist/version.json', JSON.stringify({ version }))
