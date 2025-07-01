import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Falta el email' });
  }

  try {
    const customers = await stripe.customers.list({ email });

    if (customers.data.length === 0) {
      return res.status(200).json({ active: false });
    }

    const customerId = customers.data[0].id;

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 5,
    });

    const activeSub = subscriptions.data.find(
      sub => sub.status === 'active' || sub.status === 'trialing'
    );

    if (activeSub) {
      return res.status(200).json({ active: true, subId: activeSub.id });
    } else {
      return res.status(200).json({ active: false });
    }
  } catch (err) {
    console.error('Error en check-stripe:', err);
    res.status(500).json({ error: err.message });
  }
}
