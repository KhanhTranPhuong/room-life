# Admin API - Get Users

## Overview
This document describes the new admin APIs for user management. These APIs allow admin users to retrieve user information and statistics.

## Authentication
All admin APIs (except admin creation) require:
- Valid JWT token in the Authorization header
- Admin role (ADMIN)

## Endpoints

### 1. Get All Users
Retrieve a paginated list of all users in the system.

**Endpoint:** `GET /admin/users`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of users per page (default: 10, max: 100)
- `role` (optional): Filter by user role (ADMIN, CUSTOMER, COLLABORATOR)

**Example Request:**
```
GET /admin/users?page=1&limit=10&role=CUSTOMER
```

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "user_id_here",
        "fullName": "John Doe",
        "email": "john@example.com",
        "role": "CUSTOMER",
        "status": "active",
        "createdAt": "2025-11-01T10:00:00.000Z",
        "updatedAt": "2025-11-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "usersPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### 2. Get User Statistics
Retrieve user statistics for admin dashboard.

**Endpoint:** `GET /admin/users/stats`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "totalUsers": 150,
    "usersByRole": {
      "admins": 2,
      "customers": 140,
      "collaborators": 8
    },
    "activeUsers": 150
  }
}
```

### 3. Create Admin (Public Endpoint)
Create a new admin user. This endpoint is public and doesn't require authentication.

**Endpoint:** `POST /admin/create`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "secure_password"
}
```

## Features

### Security Features:
- JWT authentication required for user retrieval endpoints
- Role-based access control (Admin only)
- Password exclusion from user data responses
- Input validation for pagination parameters

### Pagination Features:
- Configurable page size (1-100 users per page)
- Complete pagination metadata
- Navigation helpers (hasNextPage, hasPreviousPage)

### Filtering Features:
- Filter users by role
- Sort by creation date (newest first)

## Error Responses

### Invalid Pagination:
```json
{
  "success": false,
  "message": "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100."
}
```

### Unauthorized Access:
```json
{
  "success": false,
  "message": "Unauthorized",
  "statusCode": 401
}
```

### Forbidden (Non-Admin):
```json
{
  "success": false,
  "message": "Forbidden resource",
  "statusCode": 403
}
```

## Future Enhancements (CRUD Operations)

The current implementation provides the foundation for full CRUD operations. Future updates will include:

1. **Update User** - `PUT /admin/users/:id`
   - Update user profile information
   - Change user role
   - Update user status (active/inactive/suspended)

2. **Delete User** - `DELETE /admin/users/:id`
   - Soft delete user accounts
   - Hard delete with confirmation

3. **Get Single User** - `GET /admin/users/:id`
   - Detailed user information
   - User activity logs

4. **Bulk Operations** - `POST /admin/users/bulk`
   - Bulk user status updates
   - Bulk role assignments
   - Export user data

5. **Advanced Filtering**
   - Search by name, email
   - Date range filters
   - Status filters
   - Sort by multiple fields

## Usage Examples

### Get all customers with pagination:
```bash
curl -X GET "http://localhost:3000/admin/users?role=CUSTOMER&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Get user statistics:
```bash
curl -X GET "http://localhost:3000/admin/users/stats" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Create admin account:
```bash
curl -X POST "http://localhost:3000/admin/create" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"securepassword123"}'
```