import { z } from 'zod';

// Session validation
export const sessionSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
});

// Occupant validation
export const occupantSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string()
    .email('Invalid email format'),
  phone: z.string()
    .max(20, 'Phone number too long')
    .optional(),
  lease_id: z.number()
    .int('lease_id must be an integer')
    .positive('lease_id must be positive')
    .optional(),
  property_id: z.number()
    .int('property_id must be an integer')
    .positive('property_id must be positive'),
  unit_id: z.number()
    .int('unit_id must be an integer')
    .positive('unit_id must be positive')
    .optional(),
  relationshipToLeaseholder: z.enum(
    ['Primary Leaseholder', 'Co-occupant', 'Dependent', 'Other']
  ).optional(),
  registrationDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .optional(),
  status: z.enum(['active', 'inactive'])
    .optional(),
});

// Maintenance request validation
export const maintenanceSchema = z.object({
  property_id: z.number()
    .int('property_id must be an integer')
    .positive('property_id must be positive'),
  unit_number: z.string()
    .min(1, 'Unit number required')
    .max(20, 'Unit number too long'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'in_progress', 'completed'])
    .optional(),
});

// Type exports for use in handlers
export type SessionInput = z.infer<typeof sessionSchema>;
export type OccupantInput = z.infer<typeof occupantSchema>;
export type MaintenanceInput = z.infer<typeof maintenanceSchema>;

// Validation errors format
export interface ValidationError {
  field: string;
  message: string;
}

export function parseValidationErrors(error: z.ZodError): ValidationError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}
