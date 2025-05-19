// 🤘 Welcome to Stagehand!
// This file is from the [Stagehand docs](https://docs.stagehand.dev/sections/examples/nextjs).

'use server'

import { Browserbase } from '@browserbasehq/sdk'
import { Stagehand } from '@browserbasehq/stagehand'
import { z } from 'zod'

/**
 * Run the main Stagehand script
 */
async function main(stagehand: Stagehand) {
  // You can use the `page` instance to write any Playwright code
  // For more info: https://playwright.dev/docs/pom
  const page = stagehand.page

  // In this example, we'll get the title of the Stagehand quickstart page
  await page.goto('https://aim-hack.com/')
  await page.act('会社情報が含まれるページに移動して、情報を確認する')
  const companyInfo = await page.extract({
    instruction: '会社名、事業内容、会社規模、住所、代表者名を抽出してください',
    schema: z.object({
      companyName: z.string().describe('会社名'),
      business: z.string().describe('事業内容'),
      size: z.string().describe('会社規模'),
      address: z.string().describe('住所'),
      representative: z.string().describe('代表者名'),
    }),
  })

  console.log(companyInfo)

  return companyInfo
}

/**
 * Initialize and run the main() function
 */
export async function runStagehand(sessionId?: string) {
  console.log(process.env.BROWSERBASE_API_KEY)
  console.log(process.env.BROWSERBASE_PROJECT_ID)

  const stagehand = new Stagehand({
    env: 'BROWSERBASE',
    apiKey: process.env.BROWSERBASE_API_KEY,
    projectId: process.env.BROWSERBASE_PROJECT_ID,
    verbose: 1,
    logger: console.log,
    browserbaseSessionID: sessionId,
    disablePino: true,
    modelName: 'gemini-2.0-flash',
    modelClientOptions: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  })
  await stagehand.init()
  await main(stagehand)
  await stagehand.close()
}

/**
 * Start a Browserbase session
 */
export async function startBBSSession() {
  const browserbase = new Browserbase()
  const session = await browserbase.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
  })
  const debugUrl = await browserbase.sessions.debug(session.id)
  return {
    sessionId: session.id,
    debugUrl: debugUrl.debuggerFullscreenUrl,
  }
}
