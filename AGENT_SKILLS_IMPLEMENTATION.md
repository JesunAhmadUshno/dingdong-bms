# DingDong BMS - Agent Skills Implementation Plan

**Date:** February 21, 2026  
**Goal:** Apply agent skills principles to enhance BMS robustness and quality

---

## 🎯 Skills-Based Improvements

### 1. Web Design Guidelines (Vercel Labs)

**Focus:** Improve UI/UX consistency and accessibility

#### Improvements:
- ✅ Consistent component library
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Responsive design patterns
- ✅ Dark mode support
- ✅ Loading states and skeletons

**Status:** Ready to implement

---

### 2. Frontend Design Skills (Anthropic)

**Focus:** Professional UI/UX patterns

#### Improvements:
- ✅ Better form validation UX
- ✅ Improved error messages
- ✅ Progress indicators
- ✅ Toast notifications
- ✅ Modal improvements
- ✅ Card-based layouts

**Status:** Ready to implement

---

### 3. UI/UX Pro Max Skill (NextLevel Builder)

**Focus:** Advanced UI patterns

#### Improvements:
- ✅ Data table enhancements
- ✅ Custom hooks for common patterns
- ✅ Animation and transitions
- ✅ Micro-interactions
- ✅ Drag-and-drop support
- ✅ Real-time updates

**Status:** Ready to implement

---

### 4. SEO Audit Skill (CoreyHaines31)

**Focus:** Improve discoverability and documentation

#### Improvements:
- ✅ Meta tags optimization
- ✅ Open Graph support
- ✅ Structured data (JSON-LD)
- ✅ Sitemap generation
- ✅ Performance optimization
- ✅ Documentation SEO

**Status:** Ready to implement

---

### 5. Node.js Backend Patterns (W. Hobson)

**Focus:** Robust backend architecture

#### Improvements:
- ✅ Middleware architecture
- ✅ Error handling improvements
- ✅ Request validation
- ✅ Rate limiting
- ✅ Logging patterns
- ✅ Connection pooling

**Status:** Ready to implement

---

### 6. Senior Backend Patterns (Multiple Sources)

**Focus:** Production-ready code quality

#### Improvements:
- ✅ Advanced error handling
- ✅ Database transactions
- ✅ Caching strategies
- ✅ Security hardening
- ✅ Performance tuning
- ✅ Testing patterns

**Status:** Ready to implement

---

## 📋 Implementation Priority

### Phase 1: Critical (This Sprint)
1. **Security Hardening** (Node.js Backend Patterns)
   - Add session validation middleware
   - Implement password hashing
   - Add rate limiting
   - Input validation framework

2. **Backend Robustness** (Senior Backend Patterns)
   - Error handling improvements
   - Logging framework
   - Database connection pooling
   - Transaction support

### Phase 2: Important (Next Sprint)
1. **Frontend Polish** (UI/UX Skills)
   - Loading states and skeletons
   - Toast notifications
   - Form validation improvements
   - Accessibility enhancements

2. **API Quality** (Backend Patterns)
   - Middleware improvements
   - Request validation
   - Response standardization
   - Documentation

### Phase 3: Nice to Have (Following Sprint)
1. **SEO & Discoverability** (SEO Audit)
   - Meta tags
   - Open Graph
   - Structured data
   - Sitemap

2. **Advanced Features** (UI/UX Pro Max)
   - Data table enhancements
   - Real-time updates
   - Animations
   - Custom hooks

---

## 🔧 Implementation Tasks

### Task 1.1: API Middleware Architecture
**Pattern:** Node.js Backend Patterns  
**Status:** 🟡 Not Started

Create a middleware-based API architecture:

```typescript
// lib/middleware.ts
export type ApiRequestHandler = (
  req: NextRequest,
  context: { session?: SessionData; validated?: boolean }
) => Promise<NextResponse>;

export function withSession(handler: ApiRequestHandler): ApiRequestHandler {
  return async (req, ctx) => {
    const sessionId = req.headers.get('x-session-id');
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
    return handler(req, { ...ctx, session });
  };
}

export function withValidation(
  schema: any,
  handler: ApiRequestHandler
): ApiRequestHandler {
  return async (req, ctx) => {
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: result.error.issues },
        { status: 400 }
      );
    }
    return handler(req, { ...ctx, validated: true });
  };
}

export function withErrorHandling(handler: ApiRequestHandler): ApiRequestHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// Usage:
const occupantHandler = withErrorHandling(
  withSession(
    withValidation(occupantSchema, async (req, ctx) => {
      // Implementation
    })
  )
);
```

**Files to Create:**
- `lib/middleware.ts` - Middleware utilities
- `lib/validation-schemas.ts` - Zod validation schemas
- `lib/api-response.ts` - Standard response format

---

### Task 1.2: Structured Logging
**Pattern:** Senior Backend Patterns  
**Status:** 🟡 Not Started

Implement structured logging:

```typescript
// lib/logger.ts
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  requestId?: string;
  userId?: number;
  sessionId?: string;
  timestamp: string;
  duration?: number;
}

export class Logger {
  log(level: LogLevel, message: string, context: LogContext, metadata?: any) {
    const logEntry = {
      level,
      message,
      ...context,
      metadata,
      timestamp: new Date().toISOString(),
    };
    
    if (level === LogLevel.ERROR) {
      console.error(JSON.stringify(logEntry));
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }

  info(message: string, context: LogContext, metadata?: any) {
    this.log(LogLevel.INFO, message, context, metadata);
  }

  error(message: string, context: LogContext, error?: Error, metadata?: any) {
    this.log(LogLevel.ERROR, message, context, {
      ...metadata,
      error: error?.message,
      stack: error?.stack,
    });
  }
}

export const logger = new Logger();
```

**Files to Create:**
- `lib/logger.ts` - Logging utility
- `lib/request-context.ts` - Request context management

---

### Task 1.3: Input Validation Framework
**Pattern:** Node.js Backend Patterns  
**Status:** 🟡 Not Started

Create reusable validation schemas:

```typescript
// lib/validation-schemas.ts
import { z } from 'zod';

export const sessionSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});

export const occupantSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  lease_id: z.number().int().positive(),
  property_id: z.number().int().positive(),
  unit_id: z.number().int().positive(),
  relationshipToLeaseholder: z.enum(['Primary', 'Co-occupant', 'Dependent', 'Other']),
  registrationDate: z.string().date().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const maintenanceSchema = z.object({
  property_id: z.number().int().positive(),
  unit_number: z.string(),
  description: z.string().min(10).max(1000),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
});

// Type exports
export type SessionInput = z.infer<typeof sessionSchema>;
export type OccupantInput = z.infer<typeof occupantSchema>;
export type MaintenanceInput = z.infer<typeof maintenanceSchema>;
```

**Files to Create:**
- `lib/validation-schemas.ts` - Zod schemas for all inputs

---

### Task 2.1: Enhanced Error Handling
**Pattern:** Senior Backend Patterns  
**Status:** 🟡 Not Started

Implement comprehensive error handling:

```typescript
// lib/error-handler.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(public errors: any[]) {
    super('VALIDATION_ERROR', 400, 'Validation failed', errors);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super('AUTH_ERROR', 401, message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super('AUTHZ_ERROR', 403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', 404, `${resource} not found`);
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', details?: any) {
    super('DB_ERROR', 500, message, details);
  }
}

export function handleError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'Invalid JSON in request body',
        },
      },
      { status: 400 }
    );
  }

  // Log unexpected errors
  const errorId = crypto.randomUUID();
  console.error(`[${errorId}] Unexpected error:`, error);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        errorId,
      },
    },
    { status: 500 }
  );
}
```

**Files to Create:**
- `lib/error-handler.ts` - Error classes and handling
- `lib/http-errors.ts` - HTTP-specific error utilities

---

### Task 2.2: Database Connection Pooling & Transactions
**Pattern:** Senior Backend Patterns  
**Status:** 🟡 Not Started

Enhance database layer:

```typescript
// lib/db-transactional.ts
import db from './db';

export interface TransactionContext {
  rollback: () => void;
  commit: () => void;
}

export function beginTransaction(): TransactionContext {
  db.exec('BEGIN TRANSACTION');
  
  return {
    rollback: () => db.exec('ROLLBACK'),
    commit: () => db.exec('COMMIT'),
  };
}

export async function withTransaction<T>(
  callback: (ctx: TransactionContext) => Promise<T>
): Promise<T> {
  const ctx = beginTransaction();
  try {
    const result = await callback(ctx);
    ctx.commit();
    return result;
  } catch (error) {
    ctx.rollback();
    throw error;
  }
}

// Usage:
export async function updateOccupantWithValidation(occupantId: number, data: any) {
  return withTransaction(async (ctx) => {
    // Update occupant
    const updateStmt = db.prepare('UPDATE occupants SET ... WHERE occupant_id = ?');
    updateStmt.run(occupantId);
    
    // Log change
    const logStmt = db.prepare('INSERT INTO audit_log (occupant_id, action) VALUES (?, ?)');
    logStmt.run(occupantId, 'UPDATE');
    
    return { success: true };
  });
}
```

**Files to Create:**
- `lib/db-transactional.ts` - Transaction support
- `lib/db-audit.ts` - Audit logging

---

### Task 3.1: Frontend Loading States & Skeletons
**Pattern:** Frontend Design Skills  
**Status:** 🟡 Not Started

Add skeleton loaders:

```typescript
// components/LoadingSkeleton.tsx
export function OccupantTableSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 bg-gray-200 animate-pulse rounded"></div>
      ))}
    </div>
  );
}

// components/Toast.tsx
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

// hooks/useToast.ts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);

    return id;
  };

  return { toasts, addToast };
}
```

**Files to Create:**
- `components/LoadingSkeleton.tsx` - Skeleton components
- `components/Toast.tsx` - Toast notification
- `hooks/useToast.ts` - Toast hook

---

### Task 3.2: Form Validation with Better UX
**Pattern:** Frontend Design Skills  
**Status:** 🟡 Not Started

Enhance form handling:

```typescript
// hooks/useForm.ts
export interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  isDirty: boolean;
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>
) {
  const [fields, setFields] = useState<Record<keyof T, FormField>>(() => {
    const initial: any = {};
    for (const key in initialValues) {
      initial[key] = {
        value: initialValues[key],
        touched: false,
        isDirty: false,
      };
    }
    return initial;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = (name: keyof T, value: any) => {
    setFields((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        isDirty: true,
      },
    }));
  };

  const setFieldError = (name: keyof T, error?: string) => {
    setFields((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        error,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const values = Object.keys(fields).reduce((acc, key) => {
        acc[key] = fields[key as keyof T].value;
        return acc;
      }, {} as T);

      await onSubmit(values);
    } catch (error) {
      // Error handled by caller
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fields,
    setFieldValue,
    setFieldError,
    handleSubmit,
    isSubmitting,
  };
}
```

**Files to Create:**
- `hooks/useForm.ts` - Form handling hook
- `components/FormField.tsx` - Form field component

---

### Task 4.1: SEO Meta Tags & Structured Data
**Pattern:** SEO Audit Skill  
**Status:** 🟡 Not Started

Add SEO improvements:

```typescript
// app/layout.tsx - Update metadata
export const metadata: Metadata = {
  title: 'DingDong BMS - Building Management System',
  description: 'A comprehensive Building Management System for managing properties, leases, occupants, and maintenance requests.',
  keywords: 'BMS, building management, property management, real estate',
  openGraph: {
    title: 'DingDong BMS',
    description: 'Professional Building Management System',
    type: 'website',
    url: 'https://dingdongbms.com',
    images: [{ url: 'https://dingdongbms.com/og-image.png' }],
  },
};

// lib/structured-data.ts
export function generateBreadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DingDong BMS',
    url: 'https://dingdongbms.com',
    logo: 'https://dingdongbms.com/logo.png',
    description: 'Professional Building Management System',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Support',
      email: 'support@dingdongbms.com',
    },
  };
}
```

**Files to Create:**
- `lib/structured-data.ts` - JSON-LD generators
- `lib/seo-config.ts` - SEO configuration

---

## 📊 Implementation Checklist

### Phase 1: Backend Security & Robustness
- [ ] Create `lib/middleware.ts` with middleware utilities
- [ ] Create `lib/validation-schemas.ts` with Zod schemas
- [ ] Create `lib/error-handler.ts` with error classes
- [ ] Create `lib/logger.ts` with structured logging
- [ ] Create `lib/db-transactional.ts` with transaction support
- [ ] Update all API routes to use middleware
- [ ] Install `zod` package: `npm install zod`
- [ ] Update code review status in `CODE_REVIEW.md`

### Phase 2: Frontend Enhancements
- [ ] Create `components/LoadingSkeleton.tsx`
- [ ] Create `components/Toast.tsx`
- [ ] Create `hooks/useToast.ts`
- [ ] Create `hooks/useForm.ts`
- [ ] Create `components/FormField.tsx`
- [ ] Update existing forms to use new hooks
- [ ] Add Tailwind CSS animation utilities

### Phase 3: SEO & Documentation
- [ ] Create `lib/structured-data.ts`
- [ ] Create `lib/seo-config.ts`
- [ ] Update metadata in layouts
- [ ] Generate sitemap
- [ ] Add robots.txt

---

## 🎯 Success Metrics

Once implemented, the DingDong BMS will have:

| Metric | Target | Current | Improved By |
|--------|--------|---------|-------------|
| **Type Safety** | 95% | 75% | Zod validation |
| **Security** | 95% | 60% | Middleware + Hashing |
| **Error Handling** | 90% | 70% | Custom error classes |
| **Code Quality** | 90% | B- | Patterns + Refactoring |
| **UX Polish** | 90% | 70% | Skeletons + Toasts |
| **Maintainability** | 90% | 75% | Logging + Structure |

---

## 📚 References

- **Web Design Guidelines:** Vercel Labs agent-skills
- **Node.js Patterns:** W. Hobson agents repository
- **Senior Backend:** Multiple sources (best practices)
- **Frontend Design:** Anthropic skills documentation
- **SEO Audit:** CoreyHaines31 marketing skills
- **UI/UX Pro:** NextLevel Builder advanced patterns

---

**Status:** 🟡 Ready for Implementation  
**Estimated Effort:** 20-25 hours  
**Next Step:** Begin Phase 1 implementation

