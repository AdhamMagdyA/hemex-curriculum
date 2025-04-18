# Database Relationships: Connecting Our Todo Universe! 🌌

## Lesson Overview

Welcome to our magical database adventure! Today we'll learn how different data can connect and work together, like friends holding hands 🤝. We'll discover:
- One-to-One: Best friends who always pair up 👯
- One-to-Many: A teacher with many students 👩🏫👨🎓👩🎓
- Many-to-Many: Students in multiple classes 📚↔️👨🎓

## For Instructors

### Teaching Strategy
1. **Visual Analogies**: Use classroom examples (teacher-students, friends)
2. **Hands-on**: Build relationships step-by-step in the todo app
3. **Storytelling**: Frame as "connecting our todo universe"

### Key Concepts
1. Relationship types and when to use them
2. Prisma schema syntax for relationships
3. Querying related data
4. Raw SQL fallback option

## Part 1: Relationship Types - Making Database Friends

### One-to-One: Best Friends Forever
```prisma
model User {
  id      Int      @id @default(autoincrement())
  profile Profile? // One user has one profile
}

model Profile {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int  @unique // The special friendship bracelet
}
```

### One-to-Many: Teacher and Students
```prisma
model Teacher {
  id      Int     @id @default(autoincrement())
  students Student[] // One teacher, many students
}

model Student {
  id       Int    @id @default(autoincrement())
  teacher  Teacher @relation(fields: [teacherId], references: [id])
  teacherId Int    
}
```

### Many-to-Many: Students and Classes
```prisma
model Student {
  id      Int      @id @default(autoincrement())
  classes Class[]  // Many students in many classes!
}

model Class {
  id       Int      @id @default(autoincrement())
  students Student[] // Many classes for many students!
}
```

## Part 2: Querying Related Data

### Including Related Records
```javascript
// Find a user with their todos
const userWithTodos = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    todos: true // Bring the todos along!
  }
});
```

### Nested Writes
```javascript
// Create user with todos in one spell!
const newUser = await prisma.user.create({
  data: {
    name: 'Wizard',
    todos: {
      create: [
        { task: 'Learn magic' },
        { task: 'Buy wand' }
      ]
    }
  }
});
```

## Part 3: When Magic Needs Help - Raw Queries

```javascript
// Sometimes we need to speak SQL directly
const results = await prisma.$queryRaw`
  SELECT * FROM User 
  WHERE createdAt > NOW() - INTERVAL 1 DAY
`;
```

## Exercises

1. Create teacher/student relationships
3. Try a complex raw query

## Additional Resources
- [Prisma Relations Docs](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
