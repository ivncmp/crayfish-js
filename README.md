# 🦐 CrayfishJS

![CrayfishJS](https://i.ibb.co/HDbbkMHx/logo.png)

> The easiest TypeScript Backend Framework specially built for AWS Lambda Serverless.

[![npm version](https://img.shields.io/badge/npm-1.3.0-blue)](https://www.npmjs.com/package/crayfish-js)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-GPL--3.0-red)](./LICENSE)

---

## 🚀 Quick Start

### Install globally

```bash
npm install -g crayfish-js
```

### Create a new project

```bash
crayfish init my-api
cd my-api
```

### Start development server

```bash
crayfish start-server staging
```

**🎉 Your API is running at `http://localhost:3000`**

**Test it:**
```bash
curl http://localhost:3000/health
# {"status": "OK"}
```

---

## ✨ Features

✅ **Instant Scaffolding** - Full serverless project in one command  
✅ **TypeScript-First** - Full type safety with decorators  
✅ **Zero Config Routing** - Auto-discovery via `@Route` decorator  
✅ **AWS Ready** - Cognito auth, Lambda handler pre-configured  
✅ **MVC Pattern** - Controllers, services, models with DI  
✅ **Local Dev Server** - Express.js for rapid development  
✅ **Production Ready** - Pack and deploy to AWS Lambda  

---

## 📦 What's Included?

When you run `crayfish init my-api`, you get:

```
my-api/
├── src/
│   ├── controller/
│   │   ├── auth-controller.ts     # Example auth endpoints
│   │   └── health-controller.ts   # Health check endpoint
│   ├── service/
│   │   └── health-service.ts      # Example service
│   ├── model/
│   │   └── user-model.ts          # Example user model
│   ├── environments/
│   │   ├── production.ts          # Production config
│   │   └── staging.ts             # Staging config
│   ├── types/
│   │   └── project-types.ts       # Custom types
│   ├── index.ts                   # Main entry point
│   └── environment.ts             # Environment loader
├── package.json
├── tsconfig.json
└── .gitignore
```

**Auto-installed dependencies:**
- `crayfish-js` - The framework
- `express` - Dev server
- `typescript`, `ts-node` - TypeScript runtime
- `@types/express`, `@types/node` - Type definitions

---

## 🎯 Core Concepts

### 1️⃣ Controllers

Controllers handle HTTP requests using the `@Route` decorator.

**Example:**
```typescript
import { BaseController, Route } from "crayfish-js";

export default class UserController extends BaseController {
  
  @Route({ method: "get", path: "/users" })
  async getUsers(event: any) {
    return this.success({ users: [] });
  }
  
  @Route({ method: "post", path: "/users", authenticated: true })
  async createUser(event: any) {
    const body = JSON.parse(event.body);
    return this.success({ user: body });
  }
}
```

---

### 2️⃣ Services

Services contain business logic and can be injected into controllers.

**Example:**
```typescript
import { BaseService } from "crayfish-js";

export default class UserService extends BaseService {
  
  async findAll() {
    // Fetch from database
    return [{ id: 1, name: "John" }];
  }
}
```

**Inject into controller:**
```typescript
import { BaseController, Route, Inject } from "crayfish-js";
import UserService from "../service/user-service";

export default class UserController extends BaseController {
  
  @Inject(UserService)
  private userService!: UserService;
  
  @Route({ method: "get", path: "/users" })
  async getUsers() {
    const users = await this.userService.findAll();
    return this.success({ users });
  }
}
```

---

### 3️⃣ Models

Models define your data structures.

**Example:**
```typescript
import { BaseModel } from "crayfish-js";

export default class User extends BaseModel {
  id: string;
  email: string;
  name: string;
  
  constructor(data: any) {
    super();
    Object.assign(this, data);
  }
}
```

---

### 4️⃣ Authentication

CrayfishJS supports **JWT** and **AWS Cognito** authentication.

#### JWT Example
```typescript
import { JwtAuthentication } from "crayfish-js";

const jwt = new JwtAuthentication({
  secret: process.env.JWT_SECRET || "my-secret",
  expiresIn: "7d"
});

@Route({ method: "post", path: "/login" })
async login(event: any) {
  const { email, password } = JSON.parse(event.body);
  
  // Verify credentials...
  
  const token = jwt.sign({ userId: "123", email });
  return this.success({ token });
}

@Route({ method: "get", path: "/me", authenticated: true })
async getMe(event: any) {
  const user = jwt.verify(event.headers.Authorization);
  return this.success({ user });
}
```

#### AWS Cognito Example
```typescript
import { CognitoAuthentication } from "crayfish-js";

const cognito = new CognitoAuthentication({
  region: "us-east-1",
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  clientId: process.env.COGNITO_CLIENT_ID!
});

@Route({ method: "post", path: "/signup" })
async signup(event: any) {
  const { email, password } = JSON.parse(event.body);
  const result = await cognito.signUp(email, password);
  return this.success(result);
}
```

---

## 🛠️ CLI Commands

### `crayfish init <project-name>`
Scaffold a new serverless project.

**Example:**
```bash
crayfish init my-api
```

---

### `crayfish generate-controller <name>`
Generate a new controller.

**Example:**
```bash
cd my-api
crayfish generate-controller user
# Creates src/controller/user-controller.ts
```

---

### `crayfish generate-service <name>`
Generate a new service.

**Example:**
```bash
crayfish generate-service user
# Creates src/service/user-service.ts
```

---

### `crayfish start-server <environment>`
Start local Express dev server (NOT for production).

**Example:**
```bash
crayfish start-server staging
# Loads src/environments/staging.ts
# Server: http://localhost:3000
```

---

### `crayfish pack`
Build and package for AWS Lambda deployment.

**Example:**
```bash
npm run build
crayfish pack
# Ready to deploy to AWS Lambda
```

---

## 🚀 Deployment to AWS Lambda

### 1. Build your project
```bash
npm run build
```

### 2. Package for Lambda
```bash
crayfish pack
```

### 3. Deploy to AWS
- Create a new Lambda function in AWS Console
- Upload the packaged code
- Set handler: `index.handler`
- Add API Gateway trigger

**Or use AWS SAM / Serverless Framework:**
```bash
sam deploy
# or
serverless deploy
```

---

## 🧩 Decorators API

### `@Route(config: RouteConfig)`

Declares an HTTP route.

**Config:**
```typescript
{
  method: "get" | "post" | "put" | "delete" | "patch",
  path: string,
  authenticated?: boolean  // Require auth (default: false)
}
```

---

### `@Inject(ServiceClass)`

Dependency injection for services.

**Example:**
```typescript
@Inject(UserService)
private userService!: UserService;
```

---

### `@Authenticated`

Enforces authentication on a route.

**Example:**
```typescript
@Authenticated
@Route({ method: "delete", path: "/users/:id" })
async deleteUser(event: any) {
  // Only authenticated users can access
}
```

---

## 📚 Base Classes

### `BaseController`

All controllers extend this class.

**Methods:**
- `success(data, statusCode = 200)` - Return success response
- `error(message, statusCode = 500)` - Return error response
- `unauthorized(message)` - Return 401
- `notFound(message)` - Return 404

---

### `BaseService`

All services extend this class.

---

### `BaseModel`

Base class for models (optional).

---

### `BaseUserModel`

Pre-configured user model with common fields (`id`, `email`, `password`, `createdAt`).

---

## 🌍 Environment Configuration

**File:** `src/environments/production.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: "https://api.example.com",
  jwtSecret: process.env.JWT_SECRET,
};
```

**Load environment:**
```typescript
import { environment } from "./environments/production";
console.log(environment.apiUrl);
```

---

## 🧪 Testing

**Currently:** No testing framework included.

**Recommendation:** Add Vitest or Jest manually.

```bash
npm install -D vitest @vitest/ui
```

---

## 🔧 Advanced Usage

### Custom Response Format

Override `BaseController` methods:

```typescript
export default class MyController extends BaseController {
  
  success(data: any) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data }),
    };
  }
}
```

---

### Middleware Pattern

Add custom middleware logic in `src/index.ts`:

```typescript
export const handler = async (event: any) => {
  // Custom middleware logic
  console.log("Request:", event);
  
  // Call router
  return router.handle(event);
};
```

---

## 🛡️ Security Best Practices

✅ **Never hardcode secrets** - Use environment variables  
✅ **Hash passwords** - Use `bcrypt` (included)  
✅ **Validate inputs** - Add Zod or Joi validation  
✅ **Use HTTPS** - Always in production  
✅ **Enable CORS** - Configure API Gateway properly  

---

## 📝 Conventions

- **Controllers:** PascalCase, suffix with `Controller`
- **Services:** PascalCase, suffix with `Service`
- **Models:** PascalCase (e.g., `User`, `Product`)
- **Files:** kebab-case (e.g., `user-controller.ts`)
- **Routes:** lowercase with hyphens (`/users`, `/auth/login`)

---

## 🚧 Limitations

⚠️ **Express dev server** is NOT for production - Use AWS Lambda  
⚠️ **No ORM** - Bring your own (TypeORM, Prisma, etc.)  
⚠️ **No validation** - Add Zod, Joi, etc. manually  
⚠️ **No testing utilities** - Add Vitest/Jest manually  

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

**GPL-3.0-only**

See [LICENSE](./LICENSE) file for details.

---

## 🔗 Links

- **GitHub:** https://github.com/ivncmp/crayfish-js
- **npm:** https://www.npmjs.com/package/crayfish-js
- **Author:** Iván Campillo (ivncmp@gmail.com)

---

## 🙏 Acknowledgments

Built with ❤️ by [Iván Campillo](https://github.com/ivncmp)

Inspired by modern backend frameworks like NestJS, but optimized for serverless environments.

---

## 📖 Documentation

For detailed technical documentation, see [CLAUDE.md](./CLAUDE.md)

---

**Last updated:** 22/03/2026  
**Version:** 1.3.0
