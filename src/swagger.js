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
                  name: { type: "string", example: "Shreyansh" },
                  email: { type: "string", example: "viewer@zorvyn.com" },
                  password: { type: "string", example: "Viewer@123" }
                },
                required: ["name", "email", "password"]
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
                  email: { type: "string", example: "admin@zorvyn.com" },
                  password: { type: "string", example: "Admin@123" }
                },
                required: ["email", "password"]
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
        summary: "Get financial records (self)",
        tags: ["Records"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "type",
            in: "query",
            schema: { type: "string", enum: ["income", "expense"] }
          },
          {
            name: "category",
            in: "query",
            schema: { type: "string" }
          },
          {
            name: "startDate",
            in: "query",
            schema: { type: "string", format: "date" }
          },
          {
            name: "endDate",
            in: "query",
            schema: { type: "string", format: "date" }
          }
        ],
        responses: {
          200: { description: "Records fetched successfully" }
        }
      },

      post: {
        summary: "Create financial record (viewer)",
        tags: ["Records"],
        security: [{ bearerAuth: [] }],
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
          201: { description: "Record created successfully" }
        }
      }
    },

    "/api/records/{id}": {
      patch: {
        summary: "Update a financial record (owner or admin)",
        tags: ["Records"],
        security: [{ bearerAuth: [] }],
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
          403: { description: "Only owner or admin can update" }
        }
      },

      delete: {
        summary: "Delete a financial record (owner or admin)",
        tags: ["Records"],
        security: [{ bearerAuth: [] }],
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
          403: { description: "Only owner or admin can delete" }
        }
      }
    },

    "/api/dashboard/summary": {
      get: {
        summary: "Get personal dashboard summary (owner)",
        tags: ["Dashboard"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Summary fetched successfully" }
        }
      }
    },

    "/api/dashboard/overview": {
      get: {
        summary: "Get global overview dashboard (analyst or admin)",
        tags: ["Dashboard"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Overview fetched successfully" }
        }
      }
    },

    "/api/dashboard/user-overview": {
      get: {
        summary: "Get all users overview analytics (analyst or admin)",
        tags: ["Dashboard"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Users overview fetched successfully" }
        }
      }
    },

    "/api/dashboard/user/{id}": {
      get: {
        summary: "Get single user detailed dashboard (analyst or admin)",
        tags: ["Dashboard"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Single user dashboard fetched successfully" }
        }
      }
    },

    "/api/users": {
      get: {
        summary: "Get all users (admin only)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Users fetched successfully" }
        }
      }
    },

    "/api/users/{id}": {
      patch: {
        summary: "Update user role or status (admin only)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
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
                  role: { type: "string", example: "analyst" },
                  status: { type: "string", example: "active" }
                }
              }
            }
          }
        }
      },

      delete: {
        summary: "Delete a user and their records (admin only)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ]
      }
    }
  }
};

module.exports = swaggerDocument;