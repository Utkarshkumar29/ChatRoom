const admin = require('firebase-admin');
const serviceAccount = require('./your-service-account-file.json'); // Adjust the path

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com" // Optional
});

module.exports = admin; // Export for use in other modules
