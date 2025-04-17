# Role-Based Access Control (RBAC)

## Learning Objectives
By the end of this lesson, students will be able to:
- Understand RBAC concepts
- Implement role and permission systems
- Create role-based middleware
- Handle complex authorization scenarios

## Prerequisites
- JWT Authentication
- Middleware implementation
- Prisma ORM basics

## Lesson Content

### 1. RBAC Schema Design
```prisma
// schema.prisma
model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    password  String
    name      String?
    role      Role     @default(USER)
    permissions UserPermission[]
}

model Permission {
    id          Int       @id @default(autoincrement())
    name        String    @unique
    description String?
    users       UserPermission[]
}

model UserPermission {
    user        User       @relation(fields: [userId], references: [id])
    userId      Int
    permission  Permission @relation(fields: [permissionId], references: [id])
    permissionId Int
    
    @@id([userId, permissionId])
}

enum Role {
    USER
    EDITOR
    ADMIN
}
```

### 2. RBAC Middleware Implementation
```javascript
// middleware/rbac.js
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Forbidden'
            });
        }

        next();
    };
};

const checkPermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            const { userId } = req.user;

            const userWithPermissions = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    permissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            });

            const hasPermission = userWithPermissions.permissions.some(
                up => up.permission.name === permissionName
            );

            if (!hasPermission) {
                return res.status(403).json({
                    message: 'Insufficient permissions'
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
```

### 3. Using RBAC in Routes
```javascript
// routes/articles.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { checkRole, checkPermission } = require('../middleware/rbac');

// Public route
router.get('/', articlesController.list);

// Protected routes
router.post('/',
    auth,
    checkRole(['EDITOR', 'ADMIN']),
    checkPermission('create:articles'),
    articlesController.create
);

router.put('/:id',
    auth,
    checkRole(['EDITOR', 'ADMIN']),
    checkPermission('edit:articles'),
    articlesController.update
);

router.delete('/:id',
    auth,
    checkRole(['ADMIN']),
    checkPermission('delete:articles'),
    articlesController.delete
);
```

### 4. Permission Management
```javascript
// services/permission.service.js
class PermissionService {
    static async assignPermissionToUser(userId, permissionName) {
        const permission = await prisma.permission.findUnique({
            where: { name: permissionName }
        });

        if (!permission) {
            throw new Error('Permission not found');
        }

        return prisma.userPermission.create({
            data: {
                userId,
                permissionId: permission.id
            }
        });
    }

    static async removePermissionFromUser(userId, permissionName) {
        const permission = await prisma.permission.findUnique({
            where: { name: permissionName }
        });

        if (!permission) {
            throw new Error('Permission not found');
        }

        return prisma.userPermission.delete({
            where: {
                userId_permissionId: {
                    userId,
                    permissionId: permission.id
                }
            }
        });
    }

    static async getUserPermissions(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });

        return user.permissions.map(up => up.permission);
    }
}
```

## Exercises
1. Implement complete RBAC system
2. Create permission management API
3. Add role hierarchy
4. Implement complex permission rules

## Additional Resources
- [RBAC Design Patterns](https://auth0.com/blog/role-based-access-control-rbac-and-react-apps/)
- [Authorization Best Practices](https://www.oauth.com/oauth2-servers/access-control/)
- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

## Teaching Notes
- Explain RBAC vs ACL
- Show permission inheritance
- Demonstrate role hierarchy
- Cover edge cases
- Discuss scaling considerations

## Common Issues & Solutions
1. Role vs Permission confusion
2. Permission checking performance
3. Role hierarchy complexity
4. Database schema design
5. Middleware order

## Homework
Build a complete RBAC system with:
- Multiple roles and permissions
- Permission management API
- Role hierarchy
- Custom middleware
- Permission inheritance
- Audit logging
- Admin dashboard
