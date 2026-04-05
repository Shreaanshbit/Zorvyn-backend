const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Zorvyn Financial Dashboard API",
    version: "1.0.0",
    description:
      "A role-based financial dashboard backend built with Node.js, Express, MongoDB, and JWT authentication."
  },

  servers: [
    {
      url: "https://zorvyn-backend-08dd.onrender.com"
    },
    {
      url: "http://localhost:5000"
    }
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },

  security: [
    {
      bearerAuth: []
    }
  ],

  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a new user (viewer only)",
        tags: ["Authentication"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: "Shreyansh"
                  },
                  email: {
                    type: "string",
                    example: "viewer@zorvyn.com"
                  },
                  password: {
                    type: "string",
                    example: "Viewer@123"
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "User registered successfully" }
        }
      }
    },

    "/api/auth/login": {
      post: {
        summary: "Login and receive JWT token",
        tags: ["Authentication"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    example: "admin@zorvyn.com"
                  },
                  password: {
                    type: "string",
                    example: "Admin@123"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Login successful" }
        }
      }
    },

    "/api/records": {
      get: {
        summary: "Get financial records",
        tags: ["Records"],
        parameters: [
          {
            name: "type",
            in: "query",
            schema: { type: "string", enum: ["income", "expense"] },
            description: "Filter by record type"
          },
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
            description: "Filter by category"
          },
          {
            name: "startDate",
            in: "query",
            schema: { type: "string", format: "date" },
            description: "Start date for date range filter"
          },
          {
            name: "endDate",
            in: "query",
            schema: { type: "string", format: "date" },
            description: "End date for date range filter"
          }
        ],
        responses: {
          200: { description: "Records fetched successfully" },
          400: { description: "Invalid query parameters" },
          401: { description: "Unauthorized" }
        }
      },
      post: {
        summary: "Create financial record",
        tags: ["Records"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  amount: { type: "number", example: 5000 },
                  type: { type: "string", example: "expense" },
                  category: { type: "string", example: "Food" },
                  date: { type: "string", example: "2026-04-05" },
                  notes: { type: "string", example: "Dinner expense" }
                },
                required: ["amount", "type", "category", "date"]
              }
            }
          }
        },
        responses: {
          201: { description: "Record created successfully" },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" }
        }
      }
    },
    "/api/records/{id}": {
      patch: {
        summary: "Update a financial record",
        tags: ["Records"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  amount: { type: "number", example: 1000 },
                  type: { type: "string", example: "income" },
                  category: { type: "string", example: "Salary" },
                  date: { type: "string", example: "2026-04-05" },
                  notes: { type: "string", example: "April salary" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Record updated successfully" },
          400: { description: "Validation error or invalid ID" },
          401: { description: "Unauthorized" },
          403: { description: "Not authorized to update this record" },
          404: { description: "Record not found" }
        }
      },
      delete: {
        summary: "Delete a financial record",
        tags: ["Records"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Record deleted successfully" },
          400: { description: "Invalid record ID" },
          401: { description: "Unauthorized" },
          403: { description: "Not authorized to delete this record" },
          404: { description: "Record not found" }
        }
      }
    },

    "/api/dashboard/summary": {
      get: {
        summary: "Get personal dashboard summary",
        tags: ["Dashboard"]
      }
    },

    "/api/dashboard/overview": {
      get: {
        summary: "Get global overview dashboard",
        tags: ["Dashboard"]
      }
    },

    "/api/dashboard/users-overview": {
      get: {
        summary: "Get all users overview analytics",
        tags: ["Dashboard"]
      }
    },

    "/api/dashboard/user/{id}": {
      get: {
        summary: "Get single user detailed dashboard",
        tags: ["Dashboard"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ]
      }
    },

    "/api/users": {
      get: {
        summary: "Get all users",
        tags: ["Users"]
      }
    },

    "/api/users/{id}": {
      patch: {
        summary: "Update user role or status",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  role: {
                    type: "string",
                    example: "analyst"
                  },
                  status: {
                    type: "string",
                    example: "active"
                  }
                }
              }
            }
          }
        }
      },

      delete: {
        summary: "Delete a user and their records",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ]
      }
    }
  }
};

module.exports = swaggerDocument;