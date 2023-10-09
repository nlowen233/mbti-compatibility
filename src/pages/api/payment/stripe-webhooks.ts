// pages/api/stripe-webhook.js

import { Convert } from '@/misc/Convert'
import { OpenAI } from '@/misc/OpenAI'
import { SQL } from '@/misc/SQL'
import { SQLQueries } from '@/misc/SQLQueries'
import { SQLUserWithTestResults, TestUpgradeStatus } from '@/types/SQLTypes'
import { ErrorSeverity, StripeMetadata } from '@/types/misc'
import { VercelPoolClient, db } from '@vercel/postgres'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  apiVersion: '2023-08-16',
})

const SIGNING_SECRET = process.env.STRIPE_WEBHOOK_SIGNING_SECRET

if (!SIGNING_SECRET) {
  throw new Error('Missing stripe signing secret env variable')
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const signature = req.headers['stripe-signature']
  if (typeof signature !== 'string') {
    return res.status(401).end()
  }
  let event: Stripe.Event | undefined
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, SIGNING_SECRET as string)
  } catch (err) {
    return res.send(400)
  }
  const { testID } = event.data.object as StripeMetadata
  if (event.type === 'payment_intent.succeeded') {
    let client: VercelPoolClient | undefined
    let error: string | undefined
    try {
      client = await db.connect()
    } catch (err) {
      error = err as string
    }
    if (error || !client) {
      return res.status(500).send({ err: true, message: error as string, res: null })
    } else {
      //if we are able to access the db then we can save errors on our side and send back 200
      res.status(200).end()
    }
    const userWRRes = await SQL.query<SQLUserWithTestResults>(client, SQLQueries.getUserByTestID(testID))
    if (userWRRes.err) {
      SQL.query(
        client,
        SQLQueries.insertError(
          `Error occurred trying to get user by test ID for upgrade. Failed to upgrade test results. Test ID was ${testID}. Error: ${userWRRes.message}`,
          ErrorSeverity.Critical,
        ),
      )
      client.release()
      return
    }
    const userWithResults = userWRRes.res?.length ? Convert.sqlToUserWithTestResults(userWRRes.res[0]) : undefined
    if (!userWithResults) {
      SQL.query(
        client,
        SQLQueries.insertError(
          `SQL returned no error, but user was undefined. Failed to upgrade test results. Test ID was ${testID}`,
          ErrorSeverity.Critical,
        ),
      )
      client.release()
      return
    }
    const gptResponse = await OpenAI.getAnalystFullExplanation(userWithResults, userWithResults.functionScores, userWithResults.results)
    if (gptResponse.err) {
      SQL.query(
        client,
        SQLQueries.insertError(
          `There was an error getting a full analysis from GPT. User affected was: ${userWithResults.id}. Error: ${gptResponse.message}`,
          ErrorSeverity.Critical,
        ),
      )
      client.release()
      return
    }
    const updateRes = await SQL.updateTest(client, {
      upgradedResponse1: gptResponse.res?.aboutTopMatch,
      upgradedResponse2: gptResponse.res?.topCognitiveFunction,
      upgradedResponse3: gptResponse.res?.whatYouExpected,
      upgradedResponse4: gptResponse.res?.whereToFind,
      upgradedResponse5: gptResponse.res?.conclusion,
      isUpgraded: TestUpgradeStatus.upgraded,
    })
    if (updateRes.err) {
      SQL.query(
        client,
        SQLQueries.insertError(
          `There was an error updating the test with full analysis. User affected was: ${userWithResults.id}. Error: ${gptResponse.message}`,
          ErrorSeverity.Critical,
        ),
      )
      client.release()
      return
    }
    client.release()
  }
  //no webhook for this
  return res.status(200).end()
}
