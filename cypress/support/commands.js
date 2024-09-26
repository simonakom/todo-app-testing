Cypress.Commands.add('visitTodoPage', () => {
    cy.visit('https://todolist.james.am/#/');
  });
Cypress.Commands.add('addTodo', (todoText, key = '{enter}') => {
    cy.get('.new-todo').type(`${todoText}${key}`);
});
Cypress.Commands.add('verifyTodoCount', (count) => { 
    cy.get('.todo-list li').should('have.length', count);
});