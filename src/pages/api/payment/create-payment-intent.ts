import { Constants } from '@/misc/Constants'
import { APIRes } from '@/types/misc'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  apiVersion: '2023-08-16',
})

async function handler(req: NextApiRequest, res: NextApiResponse<APIRes<string>>) {
  if (Constants.enhancePrice === null) {
    return res.status(500).send({ err: true, message: 'We are unable to determine the price of this item at this time' })
  }
  let clientSecret: string | undefined
  let error: string | undefined
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Constants.enhancePrice,
      currency: 'usd',
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
