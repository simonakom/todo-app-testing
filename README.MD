# To-do app - automated testing with Cypress
 
This project is about testing CRUD functionality of <a href="https://todolist.james.am/">To-do app</a> with Cypress automated tests + CI/CD.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js: [Download here](https://nodejs.org/).
- npm (Node Package Manager): Comes with Node.js installation.

## Set up 

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.

## Run Cypress

- To run and open 'Cypress' user interface (GUI):  `npm run test`. 
  - In Cypress UI choose E2E Testing in preffered browser and choose existing "spec": `todo.cy.js`.
- To run Cypress tests in your terminal or command line interface (CLI): `npm run test:cmd`. 

## Automated tests with Cypress

- Tests can be found: `cypress/e2e/todo.cy.js` (Tests with errors are commented).
- Commands can be found: `cypress/support/commands.js`.


## CI/CD Integration with GitHub Actions

This project uses GitHub Actions to automate the testing of the To-do app with Cypress. Every time changes are pushed to the main branch or a pull request is created, the Cypress tests are automatically executed against the live application at https://todolist.james.am/.

### GitHub Actions Workflow
The CI/CD process is defined in the .github/workflows/main.yml file, which includes the following steps:

1. Checkout Code: The workflow checks out the latest code from the repository.
2. Set Up Node.js: The workflow uses Node.js version 16 to run the tests.
3. Install Dependencies: All necessary dependencies, including Cypress, are installed.
4. Run Cypress Tests: The Cypress tests are executed using the command npm run test:cmd, which runs the tests against the live To-do app.

### How to View Test Results
Test results can be viewed in the "Actions" tab of your GitHub repository. Each workflow run will show the logs of the test execution, including any failures or errors encountered during the test runs.