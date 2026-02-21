import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDatabase } from '@/lib/db';
import { withMiddleware, withSession, MiddlewareContext } from '@/lib/middleware';
import { validateSession } from '@/lib/api-auth';
import { logger } from '@/lib/logger';
import { AppError, ValidationError, NotFoundError } from '@/lib/error-handler';

// Initialize DB on first request
try {
  initializeDatabase();
} catch (e) {
  console.log('Database already initialized');
}

// GET occupants - with session validation
export const GET = withMiddleware(
  withSession(async (request: NextRequest, context: MiddlewareContext) => {
    try {
      const propertyId = request.nextUrl.searchParams.get('property_id');
      const unitId = request.nextUrl.searchParams.get('unit_id');
      const leaseId = request.nextUrl.searchParams.get('lease_id');

      let stmt;
      let records: any[] = [];

      if (propertyId) {
        stmt = db.prepare('SELECT * FROM occupants WHERE property_id = ? ORDER BY created_at DESC');
        records = stmt.all(parseInt(propertyId)) as any[];
      } else if (unitId) {
        stmt = db.prepare('SELECT * FROM occupants WHERE unit_id = ? ORDER BY created_at DESC');
        records = stmt.all(parseInt(unitId)) as any[];
      } else if (leaseId) {
        stmt = db.prepare('SELECT * FROM occupants WHERE lease_id = ? ORDER BY created_at DESC');
        records = stmt.all(parseInt(leaseId)) as any[];
      } else {
        stmt = db.prepare('SELECT * FROM occupants ORDER BY created_at DESC');
        records = stmt.all() as any[];
      }

      logger.debug(`Retrieved ${records.length} occupants`, {
        requestId: context.requestId,
        userId: context.userId,
        username: context.username,
      });

      return NextResponse.json({
        success: true,
        occupants: records.map(o => ({
          occupant_id: o.occupant_id,
          lease_id: o.lease_id,
          property_id: o.property_id,
          unit_id: o.unit_id,
          name: o.name,
          email: o.email,
          phone: o.phone,
          relationshipToLeaseholder: o.relationshipToLeaseholder,
          registrationDate: o.registrationDate,
          status: o.status,
          created_at: o.created_at,
        }))
      });
    } catch (error) {
      throw error;
    }
  })
)

// POST - Create occupant - with session validation
export const POST = withMiddleware(
  withSession(async (request: NextRequest, context: MiddlewareContext) => {
    try {
      const body = await request.json();
      const { lease_id, property_id, unit_id, name, email, phone, relationshipToLeaseholder, registrationDate, status } = body;

      // Validate required fields
      if (!name || !email || !property_id) {
        throw new ValidationError([
          !name && { path: 'name', message: 'Required' },
          !email && { path: 'email', message: 'Required' },
          !property_id && { path: 'property_id', message: 'Required' },
        ].filter(Boolean) as any[]);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new ValidationError([
          { path: 'email', message: 'Invalid email format' }
        ]);
      }

      const stmt = db.prepare(`
        INSERT INTO occupants (lease_id, property_id, unit_id, name, email, phone, relationshipToLeaseholder, registrationDate, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        lease_id || 2,
        property_id,
        unit_id || 3,
        name,
        email,
        phone || '',
        relationshipToLeaseholder || 'Co-occupant',
        registrationDate || new Date().toISOString().split('T')[0],
        status || 'active'
      );

      logger.logAudit('CREATE_OCCUPANT', 'occupants', {
        requestId: context.requestId,
        userId: context.userId,
        username: context.username,
      });

      return NextResponse.json(
        {
          success: true,
          occupant_id: result.lastInsertRowid,
          message: 'Occupant created successfully'
        },
        { status: 201 }
      );
    } catch (error) {
      throw error;
    }
  })
)

// PUT - Update occupant - with session validation
export const PUT = withMiddleware(
  withSession(async (request: NextRequest, context: MiddlewareContext) => {
    try {
      const { occupant_id, ...updates } = await request.json();

      if (!occupant_id) {
        throw new ValidationError([
          { path: 'occupant_id', message: 'Required' }
        ]);
      }

      if (Object.keys(updates).length === 0) {
        throw new AppError(
          'VALIDATION_ERROR',
          400,
          'No fields to update'
        );
      }

      const updateFields = Object.keys(updates)
        .map(key => `${key} = ?`)
        .join(', ');

      const updateValues = Object.values(updates);

      const stmt = db.prepare(`UPDATE occupants SET ${updateFields} WHERE occupant_id = ?`);
      const result = stmt.run(...updateValues, occupant_id);

      if ((result as any).changes === 0) {
        throw new NotFoundError(`Occupant with ID ${occupant_id}`);
      }

      logger.logAudit('UPDATE_OCCUPANT', `occupants/${occupant_id}`, {
        requestId: context.requestId,
        userId: context.userId,
        username: context.username,
      });

      return NextResponse.json({
        success: true,
        message: 'Occupant updated successfully'
      });
    } catch (error) {
      throw error;
    }
  })
)

// DELETE - Remove occupant - with session validation
export const DELETE = withMiddleware(
  withSession(async (request: NextRequest, context: MiddlewareContext) => {
    try {
      const occupantId = request.nextUrl.searchParams.get('occupant_id');

      if (!occupantId) {
        throw new ValidationError([
          { path: 'occupant_id', message: 'Required' }
        ]);
      }

      const stmt = db.prepare('DELETE FROM occupants WHERE occupant_id = ?');
      const result = stmt.run(parseInt(occupantId));

      if ((result as any).changes === 0) {
        throw new NotFoundError(`Occupant with ID ${occupantId}`);
      }

      logger.logAudit('DELETE_OCCUPANT', `occupants/${occupantId}`, {
        requestId: context.requestId,
        userId: context.userId,
        username: context.username,
      });

      return NextResponse.json({
        success: true,
        message: 'Occupant deleted successfully'
      });
    } catch (error) {
      throw error;
    }
  })
)
