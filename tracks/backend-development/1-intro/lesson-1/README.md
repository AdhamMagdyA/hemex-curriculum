**[presentation](https://gamma.app/docs/JavaScripts-Adventure-From-Browser-to-Server--8eiflxhdbivktav)**

# JavaScript's Adventure: From Browser to Server! 🚀

## Lesson Overview

Welcome to an exciting journey where we'll discover how JavaScript transforms from a browser superhero to a powerful server ninja! We'll learn about its different powers in each world and how to handle tasks like a pro.

## For Instructors

### Lesson Objectives

Students will learn:

- A quick review over JavaScript main concepts
- The differences between browser and Node.js JavaScript
- How to work with asynchronous code
- How to handle errors properly

### Teaching Strategy

- Start with a discussion on the differences between browser and Node.js JavaScript, focusing on the main concepts and not getting too deep into the details.
- Provide a simple example of asynchronous code using callbacks and ask students to identify its limitations.
- Introduce Promises and explain how they can handle the limitations of callbacks.
- Move to the exercises and have students work to complete them.
- Encourage students to ask questions and help each other out.
- During the review, focus on the concepts and not the syntax, and ask students to explain their thought process when solving the exercises.


### JavaScript Review 🔄

#### 1. Variables and Data Types

```javascript
// Different ways to create variables
let age = 10;            // Number
const name = 'Alex';     // String
var isHappy = true;      // Boolean (old way, prefer let/const)

// Arrays - like a toy box with different toys
let colors = ['red', 'blue', 'green'];
colors.push('yellow');   // Adding a new toy
colors.pop();           // Taking out the last toy

// Objects - like a backpack with labeled pockets
let student = {
    name: 'Alex',
    age: 10,
    grades: [90, 85, 95]
};
```

#### 2. Functions

```javascript
// Regular function - like a recipe
function makeIceCream(flavor, toppings) {
    return `${flavor} ice cream with ${toppings}`;
}

// Arrow function - like a recipe
const makeIceCream = (flavor, toppings) => {
    return `${flavor} milkshake with ${toppings}`;
}

// Arrow function - shorter way to write recipes
const makeShake = (flavor) => `${flavor} milkshake`;

// Function with default values
function greet(name = 'friend') {
    return `Hello, ${name}!`;
}
```

#### 3. Control Flow

```javascript
// If statements - making decisions
let weather = 'sunny';
if (weather === 'sunny') {
    console.log('Let\'s play outside!');
} else if (weather === 'rainy') {
    console.log('Let\'s stay inside!');
} else {
    console.log('Let\'s check the weather!');
}

// Loops - doing things multiple times
for (let i = 0; i < 5; i++) {
    console.log(`Count: ${i}`);
}

// While loop - doing things multiple times
let i = 0;
while (i < 5) {
    console.log(`Count: ${i}`);
    i++;
}

// forEach - doing something with each item
const colors = ['red', 'blue', 'green'];
colors.forEach(color => {
    console.log(`I love ${color}!`);
});
```

#### 4. Modern JavaScript Features

```javascript
// Template literals - making strings easier
let story = `My name is ${name} and I am ${age} years old`;

// Destructuring - unpacking values
let {name: studentName, age: studentAge} = student;

// Spread operator - copying arrays and objects
let newColors = [...colors, 'purple'];
let updatedStudent = {...student, grade: 'A'};

// Map and filter - working with arrays
let numbers = [1, 2, 3, 4, 5];
let doubled = numbers.map(n => n * 2);      // [2, 4, 6, 8, 10]
let evenNumbers = numbers.filter(n => n % 2 === 0);  // [2, 4]
```

#### Fun Activity: "JavaScript Treasure Hunt!"

1. Create a treasure object with different types of data
2. Write functions to:

   - Add new treasures
   - Find specific treasures
   - Count total treasures
3. Use different loops to list all treasures
4. **Async Programming**

   - Like a restaurant kitchen:
     - Callbacks = Giving your order number and waiting to be called
     - Promises = Getting a buzzer that will vibrate when food is ready
     - Async/await = Like having a waiter who handles everything for you
5. **Error Handling**

   - Like having a safety net when practicing circus tricks
   - Different nets for different heights (different error handling methods)

## Lesson Content

### 1. JavaScript's Two Homes 🏠

#### Browser JavaScript

```javascript
// Browser's special tools
console.log(window);  // The browser's main toolbox
console.log(document);  // For working with web pages
```

#### Server JavaScript (Node.js)

```javascript
// Node.js special tools
console.log(global);  // Node's main toolbox
console.log(process);  // Information about our program
console.log(__dirname);  // Where our files are located

// Sharing code between files
const myModule = require('./myModule');  // Getting other files
module.exports = { myFunction };  // Sharing our code
```

**Fun Activity**: "Find the Differences!"

- Make two lists: Browser JS vs Node.js
- Circle the unique tools each one has
- Draw pictures of what each tool does

### 2. Making Things Happen in Order 📝

#### The Old Way (Callbacks)

```javascript
// Reading a file like waiting for a friend to finish a task
const fs = require('fs');

fs.readFile('story.txt', 'utf8', (error, story) => {
    if (error) {
        console.log('Oops! Could not read the story!');
        return;
    }
    console.log('Here is your story:', story);
});
```

#### The Promise Way

```javascript
// Like getting a promise from a friend
const fsPromises = require('fs').promises;

fsPromises.readFile('story.txt', 'utf8')
    .then(story => {
        console.log('Here is your story:', story);
    })
    .catch(error => {
        console.log('Oops! Could not read the story!');
    });
```

#### The Modern Way (Async/Await)

```javascript
// Like having a magic wand that makes things happen smoothly
async function readStory() {
    try {
        const story = await fsPromises.readFile('story.txt', 'utf8');
        console.log('Here is your story:', story);
    } catch (error) {
        console.log('Oops! Could not read the story!');
    }
}

readStory();
```

**Fun Activity**: "Restaurant Order Simulation"

1. Write three versions of taking a food order:
   - Callback style (taking order number)
   - Promise style (getting a buzzer)
   - Async/await style (having a waiter)

### 3. Catching Problems Like a Superhero! 🦸‍♂️

#### Callback Error Handling

```javascript
function getIceCream(flavor, callback) {
    if (flavor === 'vanilla') {
        callback(null, '🍦');
    } else {
        callback(new Error('We only have vanilla!'));
    }
}

getIceCream('chocolate', (error, iceCream) => {
    if (error) {
        console.log('Oh no:', error.message);
        return;
    }
    console.log('Here is your ice cream:', iceCream);
});
```

#### Promise Error Handling

```javascript
function getIceCreamPromise(flavor) {
    return new Promise((resolve, reject) => {
        if (flavor === 'vanilla') {
            resolve('🍦');
        } else {
            reject(new Error('We only have vanilla!'));
        }
    });
}

getIceCreamPromise('chocolate')
    .then(iceCream => console.log('Here is your ice cream:', iceCream))
    .catch(error => console.log('Oh no:', error.message));
```

#### Async/Await Error Handling

```javascript
async function getMyIceCream(flavor) {
    try {
        const iceCream = await getIceCreamPromise(flavor);
        console.log('Here is your ice cream:', iceCream);
    } catch (error) {
        console.log('Oh no:', error.message);
    }
}

getMyIceCream('chocolate');
```

## Exercises

### 1. Browser vs Node.js Explorer
Create a list of things you can do in:

- Only the browser
- Only Node.js
- Both places

| Feature | Browser | Node.js |
| --- | --- | --- |
| Run JavaScript code | ✔️ | ✔️ |
| Read and write files | ❌ | ✔️ |
| Access the DOM | ✔️ | ❌ |
| Use the `fetch` API | ✔️ | ✔️ |
| Run in the background | ❌ | ✔️ |
| Create a web server | ❌ | ✔️ |

### 2. Async Time Machine

Take this callback-based code and convert it to:

1. Promises
2. Async/await

```javascript
fs.readFile('todo.txt', 'utf8', (error, todos) => {
    if (error) {
        console.log('Could not read todos!');
        return;
    }
    console.log('My todos:', todos);
});
```

### 3. Error Catcher Game

Create three different scenarios where you:

1. Handle a callback error
2. Catch a promise error
3. Use try/catch with async/await

### 4. Super Challenge: The Magic Toy Shop! 🧸

Create a program that combines everything we've learned:

```javascript
// Toy shop inventory management system
const fs = require('fs').promises;

// Our toy inventory
const toyShop = {
    toys: [],
    async addToy(toy) {
        this.toys.push(toy);
        await this.saveToys();
    },

    async saveToys() {
        try {
            await fs.writeFile('toys.json', JSON.stringify(this.toys, null, 2));
            console.log('Toys saved successfully! 🎉');
        } catch (error) {
            console.log('Oh no! Could not save toys 😢', error.message);
        }
    },

    async loadToys() {
        try {
            const data = await fs.readFile('toys.json', 'utf8');
            this.toys = JSON.parse(data);
            console.log('Toys loaded successfully! 🎮');
        } catch (error) {
            console.log('Starting with empty toy box 📦');
            this.toys = [];
        }
    }
};

// Using modern JavaScript features with our toy shop
async function runToyShop() {
    await toyShop.loadToys();

    // Add some toys using template literals and objects
    const newToys = [
        { name: 'Robot', price: 20, inStock: true },
        { name: 'Teddy Bear', price: 15, inStock: true },
        { name: 'Race Car', price: 25, inStock: false }
    ];

    // Use array methods to add toys
    for (const toy of newToys) {
        await toyShop.addToy(toy);
    }

    // Use array methods to find toys
    const availableToys = toyShop.toys.filter(toy => toy.inStock);
    console.log('Available toys:', availableToys);

    // Calculate total inventory value using reduce
    const totalValue = toyShop.toys.reduce((sum, toy) => sum + toy.price, 0);
    console.log(`Total inventory value: $${totalValue}`);
}

// Run our toy shop
runToyShop().catch(error => {
    console.log('Something went wrong in the toy shop!', error.message);
});
```

This challenge includes:

- Modern JavaScript features (async/await, arrow functions, template literals)
- File operations with Node.js
- Error handling
- Array methods
- Object manipulation
- Async programming

Tasks for students:

1. Add more features to the toy shop (like removing toys, updating prices)
2. Add input validation
3. Add a search function to find toys by name
4. Create a simple command-line interface for the toy shop

## Additional Resources

- [Node.js](https://nodejs.org/en/docs/guides/getting-started-guide)
- [JavaScript Promises](https://www.youtube.com/watch?v=DHvZLI7Db8E)
- [Async/Await Visual Guide](https://dev.to/lydiahallie/javascript-visualized-promises-async-await-5gke)

