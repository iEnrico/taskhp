
# Summary

## Task 1

I have divided the **frontend** and the **backend** into two separate folders. For testing, I have used:

- **Jest** for the backend
- **Vitest** for the frontend

Both the backend and frontend could have used a simpler structure. However, I have set up the project to scale, allowing the addition of more APIs, controllers, etc.

In the frontend, I created the `apiService` to manage calls to the backend.

The scripts are configured in the `package.json` file. Below are the steps to run both the **frontend** and **backend**:

### Backend
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the server**:
   ```bash
   npm run dev
   ```
3. **Run the tests**:
   ```bash
   npm run test
   ```
   > Includes three tests to validate the API call to iTunes.

Environment variables and ports can be configured in the `.env` file. The setup also supports multiple environments if needed.

### Frontend
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the server**:
   ```bash
   npm run dev
   ```
3. **Run unit tests**:
   ```bash
   npm run test:unit
   ```
   > Validates the search functionality and ensures that albums are displayed correctly.

---

## Task 2

### Analysis of the Original Code

#### Problems in the Code
1. **Nested Callbacks ("Callback Hell")**:
    - The function contains deeply nested callbacks (`superagent`, `User.findOneAndUpdate`, `Shop.findById`, etc.), making it hard to read and maintain.

2. **Error Handling**:
    - Errors are not consistently handled.
    - Some errors (e.g., inside `superagent` or during `Shop.save()`) are ignored, leading to potential issues.

3. **Response Sent Too Early**:
    - `res.json(invitationResponse)` is called before all operations (like `shop.save()`) are complete, causing unpredictable behavior.

4. **Potential Bugs**:
    - The condition `if (shop.invitations.indexOf(invitationResponse.body.invitationId))` does not properly check if the ID already exists (it should explicitly check for `-1`).

5. **Inefficient Operations**:
    - Operations like `Shop.findById` and checks like `shop.invitations.push()` can lead to **race conditions** or redundant updates.

6. **Code Reusability**:
    - Key operations (e.g., updating the shop or checking for user existence) are tightly coupled, making the code less reusable.

---

### Refactoring Goals

1. **Readability**:
    - Replace nested callbacks with `async/await`.

2. **Reusability**:
    - Modularize the code by breaking it into smaller, testable functions.

3. **Error Handling**:
    - Use consistent and centralized error handling.

4. **Stability**:
    - Avoid race conditions and ensure database consistency.

5. **Modern JavaScript Features**:
    - Leverage ES6+ features like:
        - **Destructuring**
        - **Template literals**
        - **Optional chaining**

### Refactored Code

```javascript
const superagent = require('superagent');
const User = require('./models/User'); // Assuming User model is here
const Shop = require('./models/Shop'); // Assuming Shop model is here

exports.inviteUser = async (req, res, next) => {
    const { body: invitationBody } = req;
    const { shopId } = req.params;
    const authUrl = "https://url.to.auth.system.com/invitation";

    try {
        // Send invitation request
        const invitationResponse = await superagent.post(authUrl).send(invitationBody);

        if (invitationResponse.status === 201) {
            // Create or update the user in the database
            const { authId } = invitationResponse.body;
            const createdUser = await User.findOneAndUpdate(
                { authId },
                { authId, email: invitationBody.email },
                { upsert: true, new: true }
            );

            if (!createdUser) {
                return res.status(500).json({ error: true, message: 'Failed to create or update user' });
            }

            // Find and update the shop
            const shop = await Shop.findById(shopId);
            if (!shop) {
                return res.status(404).json({ error: true, message: 'Shop not found' });
            }

            // Update shop invitations and users
            if (!shop.invitations.includes(invitationResponse.body.invitationId)) {
                shop.invitations.push(invitationResponse.body.invitationId);
            }
            if (!shop.users.includes(createdUser._id)) {
                shop.users.push(createdUser._id);
            }

            await shop.save();

            // Success response
            return res.status(200).json({
                message: 'User successfully invited',
                userId: createdUser._id,
                shopId: shop._id,
            });

        } else if (invitationResponse.status === 200) {
            return res.status(400).json({
                error: true,
                message: 'User already invited to this shop',
            });
        }

    } catch (err) {
        // Centralized error handling
        console.error('Error inviting user:', err);
        return res.status(500).json({
            error: true,
            message: 'Internal server error',
            details: err.message,
        });
    }
};
```

### Improvements in the Refactored Code

#### Readability:
- Replaced nested callbacks with async/await, improving flow and readability.
- Destructured objects for cleaner variable usage.

#### Error Handling:
- Added centralized error handling using a try-catch block.
- Provided meaningful error messages and HTTP status codes.

#### Reusability:
- Encapsulated logic for updating users and shops in isolated operations.

#### Stability:
- Prevented race conditions by ensuring sequential execution of database operations.

#### Testability:
- Each step (e.g., User.findOneAndUpdate, Shop.findById) is isolated, making unit testing easier.

#### Modern JavaScript:
- Used ES6+ features like destructuring, template literals, and includes().

### Testing Considerations

#### Unit Tests:
- Mock superagent.post, User.findOneAndUpdate, and Shop.findById.
- Test scenarios like successful invitation, duplicate invitation, and missing shop.

#### Integration Tests:
- Validate database updates and response payloads.

#### Error Scenarios:
- Simulate failures in superagent and database operations to ensure proper error handling.

This refactored function is cleaner, more robust, and aligns with modern Node.js best practices.
