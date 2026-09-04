export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { accountNumber, bankCode } = req.body;

    if (!accountNumber || !bankCode) {
        return res.status(400).json({ error: 'Account number and bank code are required' });
    }

    try {
        const response = await fetch(`https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json({ error: data.message || 'Failed to resolve account' });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error during account verification' });
    }
}

