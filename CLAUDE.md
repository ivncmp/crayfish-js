# CLAUDE.md - CrayfishJS Developer Guide

## 📦 Project Overview

**CrayfishJS** is a lightweight TypeScript backend framework specifically built for **AWS Lambda serverless** environments. It provides scaffolding, decorators, routing, and authentication utilities to accelerate serverless API development.

**Type:** npm package (CLI + framework library)  
**Version:** 1.3.0  
**License:** GPL-3.0-only  
**Author:** Iván Campillo (ivncmp@gmail.com)  
**Repository:** https://github.com/ivncmp/crayfish-js  

---

## 🎯 Purpose

CrayfishJS solves:
- ✅ **Serverless boilerplate** - Scaffold Lambda-ready projects in seconds
- ✅ **TypeScript-first** - Full type safety with decorators
- ✅ **AWS integration** - Cognito auth, SDK pre-configured
- ✅ **MVC pattern** - Controllers, services, models with dependency injection
- ✅ **Zero config routing** - Automatic route discovery via decorators

---

## 🏗️ Stack

- **Runtime:** Node.js 22+
- **Language:** TypeScript 5.8+
- **Framework:** Express.js (for local dev server)
- **Cloud:** AWS Lambda + API Gateway + Cognito
- **Dependencies:**
  - `@aws-sdk/client-cognito-identity-provider` - Cognito auth
  - `aws-sdk` - AWS services
  - `bcrypt` - Password hashing
  - `jsonwebtoken` - JWT tokens
  - `lodash` - Utilities
  - `reflect-metadata` - Decorator metadata
  - `chalk` - CLI colors
  - `commander` - CLI parser
  - `fs-extra` - File operations

---

## 📁 Project Structure

```
crayfish-js/
├── src/
│   ├── cli/                    # CLI commands
│   │   ├── index.ts           # CLI entry point (#!/usr/bin/env node)
│   │   └── commands.ts        # init, generate, pack, start-server
│   │
│   ├── framework/             # Core framework
│   │   ├── base/              # Base classes
│   │   │   ├── base-controller.ts   # Controller base
│   │   │   ├── base-service.ts      # Service base
│   │   │   ├── base-model.ts        # Model base
│   │   │   ├── base-user-model.ts   # User model
│   │   │   └── base-authentication.ts
│   │   │
│   │   ├── authentication/    # Auth implementations
│   │   │   ├── jwt-authentication.ts
│   │   │   └── cognito-authentication.ts
│   │   │
│   │   ├── service/
│   │   │   └── authentication-service.ts
│   │   │
│   │   ├── utils/
│   │   │   └── swagger.ts     # Swagger doc generation
│   │   │
│   │   ├── decorator.ts       # @Route, @Inject, @Authenticated
│   │   ├── router.ts          # Auto-discovery router
│   │   ├── environment.ts     # Env config
│   │   ├── logger.ts          # Logging
│   │   ├── types.ts           # TypeScript types
│   │   └── index.ts           # Framework exports
│   │
│   └── tools/
│       └── prepend-shebang.ts # Add shebang to CLI build
│
├── templates/                  # Project scaffolding templates
│   ├── index.ts.t             # Main entry point
│   ├── environment.ts.t       # Env config
│   ├── auth-controller.ts.t   # Example auth controller
│   ├── health-controller.ts.t # Health check endpoint
│   ├── health-service.ts.t    # Health service
│   ├── user-model.ts.t        # User model
│   ├── production.ts.t        # Production env
│   ├── staging.ts.t           # Staging env
│   ├── tsconfig.json.t        # TypeScript config
│   └── .gitignore.t           # Git ignore
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 CLI Commands

### 1. **`crayfish init <project-name>`**

Scaffolds a new serverless project.

**What it creates:**
```
my-project/
├── src/
│   ├── controller/
│   │   ├── auth-controller.ts
│   │   └── health-controller.ts
│   ├── service/
│   │   └── health-service.ts
│   ├── model/
│   │   └── user-model.ts
│   ├── environments/
│   │   ├── production.ts
│   │   └── staging.ts
│   ├── types/
│   │   └── project-types.ts
│   ├── index.ts
│   └── environment.ts
├── package.json
├── tsconfig.json
└── .gitignore
```

**Auto-installs:**
- `crayfish-js` (this framework)
- `express` (dev server)
- `typescript`, `ts-node`
- `@types/express`, `@types/node`

**Example:**
```bash
crayfish init my-api
cd my-api
npm run build
```

---

### 2. **`crayfish generate-controller <name>`**

Generates a new controller with a basic route.

**Template:**
```typescript
// src/controller/my-controller.ts
import { BaseController, Route } from "crayfish-js";

export default class MyController extends BaseController {
  
  @Route({ method: "get", path: "/my-endpoint" })
  async getEndpoint(event: any) {
    return this.success({ message: "Hello from MyController!" });
  }
}
```

**Example:**
```bash
cd my-api
crayfish generate-controller user
# Creates src/controller/user-controller.ts
```

---

### 3. **`crayfish generate-service <name>`**

Generates a new service class.

**Template:**
```typescript
// src/service/my-service.ts
import { BaseService } from "crayfish-js";

export default class MyService extends BaseService {
  
  async getData() {
    return { data: "example" };
  }
}
```

**Example:**
```bash
crayfish generate-service user
# Creates src/service/user-service.ts
```

---

### 4. **`crayfish start-server <environment>`**

Starts local Express server for development (NOT for production).

**Example:**
```bash
crayfish start-server staging
# Loads src/environments/staging.ts
# Starts Express server (default port: 3000)
```

**Note:** This is for **local testing only**. Production runs on AWS Lambda.

---

### 5. **`crayfish pack`**

Builds and packages the project for AWS Lambda deployment.

**What it does:**
1. Runs `npm run build` (TypeScript compilation)
2. Packages Lambda handler for deployment

**Example:**
```bash
crayfish pack
# Outputs distribution package ready for Lambda
```

---

## 🎨 Decorator API

### `@Route(config: RouteConfig)`

Declares an HTTP route on a controller method.

**Config:**
```typescript
interface RouteConfig {
  method: "get" | "post" | "put" | "delete" | "patch";
  path: string;
  authenticated?: boolean;  // Require auth (default: false)
}
```

**Example:**
```typescript
@Route({ method: "post", path: "/users", authenticated: true })
async createUser(event: any) {
  const body = JSON.parse(event.body);
  return this.success({ user: body });
}
```

---

### `@Inject(ServiceClass: any)`

Dependency injection for services into controllers.

**Example:**
```typescript
import { BaseController, Inject } from "crayfish-js";
import UserService from "../service/user-service";

export default class UserController extends BaseController {
  
  @Inject(UserService)
  private userService!: UserService;
  
  @Route({ method: "get", path: "/users/:id" })
  async getUser(event: any) {
    const userId = event.pathParameters.id;
    const user = await this.userService.findById(userId);
    return this.success({ user });
  }
}
```

---

### `@Authenticated`

Enforces authentication on a route (alternative to `authenticated: true` in `@Route`).

**Example:**
```typescript
@Authenticated
@Route({ method: "delete", path: "/users/:id" })
async deleteUser(event: any) {
  // Only authenticated users can access this
  return this.success({ deleted: true });
}
```

---

## 🧩 Base Classes

### `BaseController`

All controllers extend this.

**Methods:**
```typescript
class BaseController {
  success(data: any, statusCode = 200): Response;
  error(message: string, statusCode = 500): Response;
  unauthorized(message = "Unauthorized"): Response;
  notFound(message = "Not Found"): Response;
}
```

**Example:**
```typescript
export default class MyController extends BaseController {
  @Route({ method: "get", path: "/status" })
  async status() {
    return this.success({ status: "OK" });
  }
}
```

---

### `BaseService`

All services extend this.

**Example:**
```typescript
import { BaseService } from "crayfish-js";

export default class UserService extends BaseService {
  
  async findAll() {
    // Logic to fetch users from DB
    return [];
  }
  
  async findById(id: string) {
    // Logic to fetch user by ID
    return { id, name: "John" };
  }
}
```

---

### `BaseModel`

Base class for models (optional, for ORM-like patterns).

**Example:**
```typescript
import { BaseModel } from "crayfish-js";

export default class User extends BaseModel {
  id: string;
  email: string;
  name: string;
  
  constructor(data: any) {
    super();
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
  }
}
```

---

### `BaseUserModel`

Pre-configured user model with common fields.

**Fields:**
- `id: string`
- `email: string`
- `password: string` (hashed)
- `createdAt: Date`

---

## 🔐 Authentication

### JWT Authentication

**Setup:**
```typescript
// src/index.ts
import { JwtAuthentication } from "crayfish-js";

const jwtAuth = new JwtAuthentication({
  secret: process.env.JWT_SECRET || "my-secret",
  expiresIn: "7d"
});

// Use in controllers
export default class AuthController extends BaseController {
  
  @Route({ method: "post", path: "/login" })
  async login(event: any) {
    const { email, password } = JSON.parse(event.body);
    
    // Verify credentials...
    
    const token = jwtAuth.sign({ userId: "123", email });
    return this.success({ token });
  }
  
  @Route({ method: "get", path: "/me", authenticated: true })
  async getMe(event: any) {
    const decoded = jwtAuth.verify(event.headers.Authorization);
    return this.success({ user: decoded });
  }
}
```

---

### AWS Cognito Authentication

**Setup:**
```typescript
// src/index.ts
import { CognitoAuthentication } from "crayfish-js";

const cognitoAuth = new CognitoAuthentication({
  region: "us-east-1",
  userPoolId: "us-east-1_XXXXXX",
  clientId: "your-client-id"
});

// Use in controllers
export default class AuthController extends BaseController {
  
  @Route({ method: "post", path: "/signup" })
  async signup(event: any) {
    const { email, password } = JSON.parse(event.body);
    const result = await cognitoAuth.signUp(email, password);
    return this.success(result);
  }
  
  @Route({ method: "post", path: "/login" })
  async login(event: any) {
    const { email, password } = JSON.parse(event.body);
    const result = await cognitoAuth.signIn(email, password);
    return this.success(result);
  }
}
```

---

## 🌍 Environment Configuration

**File:** `src/environments/production.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: "https://api.example.com",
  jwtSecret: process.env.JWT_SECRET,
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  cognitoClientId: process.env.COGNITO_CLIENT_ID,
};
```

**Load environment:**
```typescript
// src/index.ts
import { environment } from "./environments/production";

console.log("API URL:", environment.apiUrl);
```

---

## 🔄 Auto-Discovery Router

CrayfishJS automatically discovers controllers and routes via decorators.

**How it works:**
1. Scans `src/controller/*.ts`
2. Finds classes extending `BaseController`
3. Finds methods with `@Route` decorator
4. Registers routes to Express (dev) or Lambda handler (prod)

**No manual routing required!**

---

## 📦 Deployment (AWS Lambda)

### 1. Build project
```bash
npm run build
```

### 2. Package for Lambda
```bash
crayfish pack
```

### 3. Deploy to AWS Lambda
- Create Lambda function
- Upload packaged code
- Set handler: `index.handler`
- Configure API Gateway trigger

---

## 🛠️ Development Workflow

```bash
# 1. Init project
crayfish init my-api
cd my-api

# 2. Generate components
crayfish generate-controller user
crayfish generate-service user

# 3. Code your logic
# Edit src/controller/user-controller.ts
# Edit src/service/user-service.ts

# 4. Test locally
crayfish start-server staging
curl http://localhost:3000/users

# 5. Build for production
npm run build

# 6. Package for Lambda
crayfish pack

# 7. Deploy to AWS
# (via AWS Console, SAM, or Serverless Framework)
```

---

## 🧪 Testing

**Currently:** No testing framework included in scaffolded projects.

**Recommendation:** Add Vitest or Jest for unit/integration tests.

---

## 📝 Conventions

- **Controllers:** PascalCase, suffix with `Controller` (`UserController`)
- **Services:** PascalCase, suffix with `Service` (`UserService`)
- **Models:** PascalCase (`User`, `Product`)
- **Files:** kebab-case (`user-controller.ts`, `auth-service.ts`)
- **Routes:** lowercase with hyphens (`/users`, `/auth/login`)

---

## 🚧 Limitations

- ⚠️ **Express dev server** is NOT for production (use AWS Lambda)
- ⚠️ **No database ORM** included (bring your own: TypeORM, Prisma, etc.)
- ⚠️ **No validation** out-of-the-box (add Zod, Joi, etc.)
- ⚠️ **No testing utilities** (add Vitest/Jest manually)

---

## 🔗 Useful Resources

- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)
- [AWS Cognito Docs](https://docs.aws.amazon.com/cognito/)
- [TypeScript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [Express.js](https://expressjs.com/)

---

## 🤝 Contributing

This is a personal project by Iván Campillo. Contributions welcome via GitHub PRs.

---

## 📄 License

**GPL-3.0-only**

---

**Last updated:** 22/03/2026  
**Maintainer:** Iván Campillo (ivncmp@gmail.com)
