# To-do app - automated testing with Cypress
 
This project is about testing <a href="https://todolist.james.am/">To-do app</a> with Cypress automated tests.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js: [Download here](https://nodejs.org/).
- npm (Node Package Manager): Comes with Node.js installation.

## Set up 

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Continue with `Cypress` setup.

## Set up of Cypress

- Install 'package.json': `npm init -y`.
- Install Cypress library: `npm install cypress -D`.
- Add a new test script to 'package.json': 

````
  "scripts": {
    "test": "npx cypress open",
    "test:cmd": "npx cypress run"
  }
````

- To run and open 'Cypress' user interface (GUI):  `npm run test`. 
  - In Cypress UI choose E2E Testing in preffered browser and choose existing "spec": `todo.cy.js`.
- To run Cypress tests in your terminal or command line interface (CLI): `npm run test:cmd`. 


## Run

- Open terminal window and execute the test script: `npm run test` or `npm run test:cmd`. 

## Automated tests with Cypress

- Tests can be found: `cypress/e2e/todo.cy.js`
- Commands can be found: `cypress/support/commands.js`.

