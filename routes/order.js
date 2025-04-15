const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Ensure this imports the correct db object
const { isLoggedIn } = require('../middleware/auth');

// Route to render order page (GET)
router.get('/', isLoggedIn, (req, res) => {
  const message = req.session.message || null; // Retrieve message from session
  req.session.message = null; // Clear the message after retrieving it
  res.render('order', { user: req.session.user || null, message });
});

// Route to handle order submission (POST)
router.post('/', isLoggedIn, async (req, res) => {
  const { name, email, phone, pickup_state, pickup_city, pickup_address, delivery_state, delivery_city, delivery_address, pickup_date, arriving_date, packing_type, items, additional_notes, insurance } = req.body;
  const userId = req.session.user.id;

  // Validate required fields
  if (!name || !email || !phone || !pickup_state || !pickup_city || !pickup_address || !delivery_state || !delivery_city || !delivery_address || !pickup_date || !arriving_date || !packing_type) {
    req.session.message = 'All required fields must be filled.';
    return res.redirect('/order');
  }

  const sql = `
    INSERT INTO orders (user_id, name, email, phone, pickup_state, pickup_city, pickup_address, delivery_state, delivery_city, delivery_address, pickup_date, arriving_date, packing_type, items, additional_notes, insurance)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await db.execute(sql, [
      userId,
      name,
      email,
      phone,
      pickup_state,
      pickup_city,
      pickup_address,
      delivery_state,
      delivery_city,
      delivery_address,
      pickup_date,
      arriving_date,
      packing_type,
      items || null, // Handle optional fields
      additional_notes || null, // Handle optional fields
      insurance || 'No' // Default to 'No' if not provided
    ]);
    req.session.message = 'Order placed successfully!';
    res.redirect('/'); // Redirect to the index page after placing the order
  } catch (err) {
    console.error('Order submission error:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
