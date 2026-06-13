const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const getRawBody = (req) => {
  return new Promise((resolve, reject) => {
    let chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', err => reject(err));
  });
};

const mapCampusOneRole = (coRole) => {
  const role = coRole?.toLowerCase();
  if (role === 'student') return 'student';
  if (['staff', 'consultant', 'therapist', 'counselor'].includes(role)) return 'counselor';
  if (['admin', 'administrator'].includes(role)) return 'admin';
  if (['desk_officer', 'desk-officer', 'officer', 'desk_officer_role'].includes(role)) return 'desk_officer';
  return 'student'; // default/fallback
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const signature = req.headers['x-campus-one-signature'];
    const webhookSecret = process.env.CAMPUS_ONE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('CAMPUS_ONE_WEBHOOK_SECRET is not configured.');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    if (!signature) {
      return res.status(401).json({ error: 'Missing X-Campus-One-Signature header' });
    }

    const rawBody = await getRawBody(req);

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.warn('Invalid signature received. Expected:', expectedSignature, 'Got:', signature);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const payload = JSON.parse(rawBody);
    console.log('Valid webhook received:', payload);

    const { event, data } = payload;

    if (event === 'user.role_changed') {
      const { userId, email, role: newCoRole } = data || {};
      const mappedRole = mapCampusOneRole(newCoRole);

      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Supabase URL or Service Role Key not configured.');
        return res.status(500).json({ error: 'Supabase credentials missing' });
      }

      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      let query = supabase.from('profiles').update({ role: mappedRole });

      if (userId) {
        query = query.eq('id', userId);
      } else if (email) {
        query = query.eq('email', email);
      } else {
        return res.status(400).json({ error: 'Payload missing userId or email' });
      }

      const { data: updatedData, error } = await query.select();

      if (error) {
        console.error('Failed to update profile role:', error);
        return res.status(500).json({ error: 'Database update failed', details: error.message });
      }

      console.log('Successfully updated role for user. Result:', updatedData);
      return res.status(200).json({ success: true, message: `Role updated to ${mappedRole}` });
    }

    // Handle other events gracefully
    return res.status(200).json({ success: true, message: `Event ${event} acknowledged` });

  } catch (err) {
    console.error('Error handling webhook:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

// Export config for raw body parsing in Vercel
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
