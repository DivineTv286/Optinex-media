export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: false, message: 'Method not allowed' });
    }

    const { action, account_number, bank_code } = req.body;

    try {
        // Handle fetching the bank list
        if (action === 'get_banks') {
            const response = await fetch('https://api.paystack.co/bank', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            });
            const data = await response.json();
            return res.status(200).json(data);
        }

        // Handle account resolution
        if (action === 'resolve_account') {
            if (!account_number || !bank_code) {
                return res.status(400).json({ status: false, message: 'Account number and bank code are required' });
            }

            const response = await fetch(`https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                return res.status(200).json({ status: false, message: data.message || 'Could not resolve account details' });
            }

            return res.status(200).json(data);
        }

        return res.status(400).json({ status: false, message: 'Invalid action specified' });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Internal server error during processing' });
    }
}
