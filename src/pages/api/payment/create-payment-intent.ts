import { Constants } from '@/misc/Constants'
import { SQL } from '@/misc/SQL'
import { SQLQueries } from '@/misc/SQLQueries'
import { SQLResult } from '@/types/SQLTypes'
import { APIRes, StripeMetadata, TestIDReq } from '@/types/misc'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { Session, getSession } from '@auth0/nextjs-auth0/edge'
import { VercelPoolClient, db } from '@vercel/postgres'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  apiVersion: '2023-08-16',
})

async function handler(req: NextApiRequest, res: NextApiResponse<APIRes<string>>) {
  const { testID } = req.body as Partial<TestIDReq>
  if (!testID) {
    return res.status(401).send({ err: true, message: `The request had no test ID`, res: null })
  }
  let session: Session | null | undefined = null
  let sessionError
  try {
    session = await getSession(req, res)
  } catch (err) {
    sessionError = err
  }
  if (sessionError) {
    return res.status(500).send({ err: true, message: 'Could not get authentication data' })
  }
  if (!(session?.user.email_verified as boolean | undefined)) {
    return res.status(401).send({ err: true, message: `Sorry, you will need to verify your email to purchase your full results` })
  }
  const userID = session?.user.sub as string | undefined
  if (!userID) {
    return res.status(500).send({ err: true, message: 'Could not read user id from authentication' })
  }
  let client: VercelPoolClient | undefined
  let dbError: string | undefined
  try {
    client = await db.connect()
  } catch (err) {
    dbError = err as string
  }
  if (dbError || !client) {
    return res.status(500).send({ err: true, message: dbError, res: null })
  }
  const sqlRes = await SQL.query<SQLResult>(client, SQLQueries.isTestValidToUpgrade(testID, userID))
  if (sqlRes.err) {
    return res.status(500).send({ err: true, message: sqlRes.message || Constants.unknownSQLError, res: null })
  }
  const resultRow = sqlRes.res?.length ? sqlRes.res[0] : undefined
  if (!resultRow?.result) {
    return res.status(400).send({
      err: true,
      message: 'You cannot get the full analysis for this test, it may be incomplete or already be upgraded',
      res: null,
    })
  }
  if (Constants.enhancePrice === null) {
    return res.status(500).send({ err: true, message: 'We are unable to determine the price of this item at this time' })
  }
  let clientSecret: string | undefined
  let error: string | undefined
  const metadata: StripeMetadata = {
    testID,
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Constants.enhancePrice,
      currency: 'usd',
      metadata,
    })
    clientSecret = paymentIntent.client_secret || undefined
  } catch (err) {
    err = error
  }

  if (error) {
    return res.status(500).send({ err: true, message: error })
  }

  if (!clientSecret) {
    return res.status(500).send({ err: true, message: `Failed to establish payment intent` })
  }

  return res.status(200).send({ err: false, res: clientSecret })
}

export default withApiAuthRequired(handler)
