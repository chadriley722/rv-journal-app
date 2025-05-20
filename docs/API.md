# RV Journal API Documentation

## Overview

This document provides detailed information about the API endpoints available in the RV Journal application.

## Authentication

All API endpoints require authentication unless specified otherwise. Authentication is handled using JWT tokens.

### Login

- **Endpoint**: `/api/auth/login`
- **Method**: POST
- **Request Body**: 
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "token": "string",
    "user": {
      "id": "string",
      "email": "string",
      "username": "string"
    }
  }
  ```

## Users

### Get User Profile
- **Endpoint**: `/api/users/me`
- **Method**: GET
- **Response**: 
  ```json
  {
    "id": "string",
    "email": "string",
    "username": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

## Journals

### Create Journal Entry
- **Endpoint**: `/api/journals`
- **Method**: POST
- **Request Body**: 
  ```json
  {
    "title": "string",
    "content": "string",
    "isPublic": boolean,
    "tags": ["string"]
  }
  ```

### Get Journal Entries
- **Endpoint**: `/api/journals`
- **Method**: GET
- **Query Parameters**: 
  - `page`: number (optional)
  - `limit`: number (optional)
  - `tag`: string (optional)
  - `public`: boolean (optional)

## Error Responses

All error responses will follow this format:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": any
  }
}
```
