// Debug JWT token từ login admin mới
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwic3ViIjoiNjkwNTE1NWVmNTBiZjIwYmRmOGViYjQ3Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzYxOTQxMDgwLCJleHAiOjE3NjIwMjc0ODB9.01x8bjAnrW4MHKi6pF3nIF5cBxjuJ7CPVyYOjL8tbu0";

// Decode base64 payload (without verification for debugging)
const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
console.log('JWT Payload:', payload);

// Check if token is expired
const now = Math.floor(Date.now() / 1000);
console.log('Current time:', now);
console.log('Token expires at:', payload.exp);
console.log('Token is expired:', now > payload.exp);