import { LoadingOverlayContext } from '@/contexts/LoadingOverlayContext'
import { PopUpContext } from '@/contexts/PopUpContext'
import { Constants } from '@/misc/Constants'
import { Utils } from '@/misc/Utils'
import { Button } from '@mui/material'
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useContext } from 'react'

type Props = {
  email: string
  testID: string
}

export default function CheckoutForm({ email, testID }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const { toggle } = useContext(LoadingOverlayContext)
  const { pushPopUpMessage } = useContext(PopUpContext)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!stripe || !elements) {
      return
    }
    toggle(true)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: Utils.constructCompletionRoute(testID),
      },
    })
    if (!error) {
      return
    }
    pushPopUpMessage({ message: error.message as string, title: 'Payment Error Occurred', type: 'error' })
    toggle(false)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} style={{ padding: 10 }}>
      <LinkAuthenticationElement id="link-authentication-element" options={{ defaultValues: { email } }} />
      <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
      <Button disabled={!stripe || !elements} id="submit" style={{ marginTop: 20 }} variant="contained" fullWidth type="submit">
        Pay Now {Utils.toDineroFormat(Constants.enhancePrice)}
      </Button>
    </form>
  )
}
