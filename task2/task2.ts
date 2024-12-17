const superagent = require('superagent');
const User = require('./models/User'); // User model setted
const Shop = require('./models/Shop'); // Shop model setted

exports.inviteUser = async (req, res, next) => {
  const { body: invitationBody } = req; // Request body
  const { shopId } = req.params; // get the shopId from params
  const authUrl = "https://url.to.auth.system.com/invitation";

  try {
    // Send the request
    const invitationResponse = await superagent.post(authUrl).send(invitationBody);

    if (invitationResponse.status === 201) {
      // Create user in database
      const { authId } = invitationResponse.body;
      const createdUser = await User.findOneAndUpdate(
        { authId },
        { authId, email: invitationBody.email },
        { upsert: true, new: true }
      );

      if (!createdUser) {
        return res.status(500).json({ error: true, message: 'User not created as properly' });
      }

      // Find and update the shop
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(404).json({ error: true, message: 'Shop not found' });
      }

      // Update shop users
      if (!shop.invitations.includes(invitationResponse.body.invitationId)) {
        shop.invitations.push(invitationResponse.body.invitationId);
      }
      if (!shop.users.includes(createdUser._id)) {
        shop.users.push(createdUser._id);
      }

      await shop.save();

      // Successfully response
      return res.status(200).json({
        message: 'User successfully invited',
        userId: createdUser._id,
        shopId: shop._id,
      });

    } else if (invitationResponse.status === 200) {
      return res.status(400).json({
        error: true,
        message: 'The user is being invited to this shop',
      });
    }

  } catch (err) {
    // ERROR HANDLING
    console.error('Error sending user invitation:', err);
    return res.status(500).json({
      error: true,
      message: 'Internal server error',
      details: err.message,
    });
  }
};
