const mongoose = require('mongoose');

const explicitContentSchema = mongoose.Schema({
  // Information about the content
  contentUrl: { type: String, required: true },
  contentType: { type: String, required: true }, // E.g., "image", "video", etc.

  // Result of the explicit content detection
  Category: { type: String, required: true },

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ExplicitContent', explicitContentSchema);
