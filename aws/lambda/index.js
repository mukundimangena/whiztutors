// Runs the site's API handlers (written Netlify-style in netlify/functions/) on AWS Lambda
// behind API Gateway HTTP API (payload format 2.0). aws/deploy.js copies the handler
// files next to this one before packaging, so there is a single copy of the real logic.
const enquiry = require('./enquiry.js');
const reviews = require('./reviews.js');

// API Gateway v2 event → the Netlify event shape the handlers expect
function toNetlifyEvent(ev) {
  const headers = { ...(ev.headers || {}) };
  // CloudFront + API Gateway append their own hops; the visitor's IP is the first entry
  if (headers['x-forwarded-for']) headers['x-forwarded-for'] = headers['x-forwarded-for'].split(',')[0].trim();
  return {
    httpMethod: ev.requestContext && ev.requestContext.http ? ev.requestContext.http.method : ev.httpMethod,
    path: ev.rawPath,
    headers,
    queryStringParameters: ev.queryStringParameters || {},
    body: ev.body && ev.isBase64Encoded ? Buffer.from(ev.body, 'base64').toString('utf8') : ev.body
  };
}

exports.enquiry = ev => enquiry.handler(toNetlifyEvent(ev));
exports.reviews = ev => reviews.handler(toNetlifyEvent(ev));
