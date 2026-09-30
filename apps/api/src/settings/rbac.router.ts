import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export default async function rbacRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // GET /roles — List all roles with permissions and assigned users
  server.get('/roles', async (req, reply) => {
    const roles = await server.prisma.role.findMany({
      include: {
        permissions: true,
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            phone: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    return { roles };
  });

  // GET /roles/assignable-users — List users available to be assigned roles
  server.get('/roles/assignable-users', async (req, reply) => {
    const user = (req as any).user;
    const cookies = require('cookie').parse(req.headers.cookie || '');
    const activeTenantId = cookies['echo_impersonate_tenant'] || user?.organizationId || null;

    const where: any = {};
    if (activeTenantId) {
      where.organizationId = activeTenantId;
    }

    const users = await server.prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        customRoleId: true,
        customRole: {
          select: { id: true, name: true }
        }
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      take: 250
    });

    return { users };
  });

  // POST /roles — Create a new custom role
  server.post('/roles', {
    schema: {
      body: z.object({
        name: z.string(),
        description: z.string().optional(),
        permissions: z.array(z.object({
          resource: z.string(),
          action: z.string()
        }))
      })
    }
  }, async (req, reply) => {
    const data = req.body;
    
    const role = await server.prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: {
          create: data.permissions
        }
      },
      include: { 
        permissions: true,
        User: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });
    
    return reply.status(201).send(role);
  });

  // PATCH /roles/:id — Update role name, description, and permissions
  server.patch('/roles/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        permissions: z.array(z.object({
          resource: z.string(),
          action: z.string()
        })).optional()
      })
    }
  }, async (req, reply) => {
    const { id } = req.params;
    const data = req.body;
    
    // If updating permissions, replace all existing ones
    if (data.permissions) {
      await server.prisma.permission.deleteMany({ where: { roleId: id } });
    }

    const role = await server.prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        ...(data.permissions && {
          permissions: {
            create: data.permissions
          }
        })
      },
      include: { 
        permissions: true,
        User: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });
    
    return reply.status(200).send(role);
  });

  // POST /roles/:id/assign — Assign one or more staff members to this role
  server.post('/roles/:id/assign', {
    schema: {
      params: z.object({ id: z.string() }),
      body: z.object({
        userIds: z.array(z.string()).optional(),
        userId: z.string().optional()
      })
    }
  }, async (req, reply) => {
    const { id } = req.params;
    const { userIds, userId } = req.body;
    const targetIds = userIds || (userId ? [userId] : []);

    if (targetIds.length === 0) {
      return reply.status(400).send({ error: "No user IDs provided for role assignment" });
    }

    const role = await server.prisma.role.findUnique({ where: { id } });
    if (!role) {
      return reply.status(404).send({ error: "Role not found" });
    }

    await server.prisma.user.updateMany({
      where: { id: { in: targetIds } },
      data: { customRoleId: id }
    });

    return { 
      success: true, 
      message: `Assigned ${targetIds.length} staff member(s) to '${role.name}'.` 
    };
  });

  // POST /roles/:id/unassign — Unassign staff members from this role
  server.post('/roles/:id/unassign', {
    schema: {
      params: z.object({ id: z.string() }),
      body: z.object({
        userIds: z.array(z.string()).optional(),
        userId: z.string().optional()
      })
    }
  }, async (req, reply) => {
    const { id } = req.params;
    const { userIds, userId } = req.body;
    const targetIds = userIds || (userId ? [userId] : []);

    if (targetIds.length === 0) {
      return reply.status(400).send({ error: "No user IDs provided" });
    }

    await server.prisma.user.updateMany({
      where: { id: { in: targetIds }, customRoleId: id },
      data: { customRoleId: null }
    });

    return { 
      success: true, 
      message: `Unassigned ${targetIds.length} staff member(s) from this role.` 
    };
  });

  // DELETE /roles/:id — Delete custom role
  server.delete('/roles/:id', {
    schema: {
      params: z.object({ id: z.string() })
    }
  }, async (req, reply) => {
    const { id } = req.params;
    const role = await server.prisma.role.findUnique({ where: { id } });
    if (!role) {
      return reply.status(404).send({ error: "Role not found" });
    }
    if (role.isSystem || role.name === "Super Admin") {
      return reply.status(400).send({ error: "Cannot delete system protected role" });
    }

    await server.prisma.user.updateMany({
      where: { customRoleId: id },
      data: { customRoleId: null }
    });
    await server.prisma.permission.deleteMany({ where: { roleId: id } });
    await server.prisma.role.delete({ where: { id } });

    return { success: true, message: `Role '${role.name}' deleted successfully.` };
  });

  // System settings
  server.get('/system', async (req, reply) => {
    const settings = await server.prisma.systemSetting.findMany();
    return { settings };
  });

  server.put('/system/:key', {
    schema: {
      params: z.object({ key: z.string() }),
      body: z.object({
        value: z.any()
      })
    }
  }, async (req, reply) => {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await server.prisma.systemSetting.upsert({
      where: { key },
      update: { value, updatedBy: "cuid-admin-1" },
      create: { key, value, updatedBy: "cuid-admin-1" }
    });

    return reply.status(200).send(setting);
  });
}
