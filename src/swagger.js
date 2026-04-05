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
        tags: ["Records"]
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
                  amount: {
                    type: "number",
                    example: 5000
                  },
                  type: {
                    type: "string",
                    example: "expense"
                  },
                  category: {
                    type: "string",
                    example: "Food"
                  },
                  date: {
                    type: "string",
                    example: "2026-04-05"
                  },
                  notes: {
                    type: "string",
                    example: "Dinner expense"
                  }
                }
              }
            }
          }
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
      }
    }
  }
};

module.exports = swaggerDocument;