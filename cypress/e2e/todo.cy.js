const pageUrl = "https://todolist.james.am/#/";

const addTodo = (todoText, key = '{enter}') => { 
  cy.get('.new-todo').type(`${todoText}${key}`);
};

// --------------------------------------Test Suits---------------------------------------------

// Group 1: Page load and display elements
describe('Page load and display elements for the first time', () => {
  beforeEach(() => {
    cy.visit(pageUrl); 
  });

  it('The page is loaded successfully', () => {
    cy.url().should('eq', pageUrl);
  })

  it('The app in the page is loaded successfully', () => {
    cy.get('section.todoapp', { timeout: 10000 }).should('exist').and('be.visible');
  });

  it('Displays "To Do List" title on load', () => {
    cy.get('h1').should('be.visible').and('have.text', 'To Do List'); 
  })

  it('Display input field on load', () => {
    cy.get("form.todo-form input.new-todo").should('exist').and('be.visible');
  });

  it('Displays the correct placeholder text on the input field on load', () => {
    cy.get("form.todo-form input.new-todo").should('exist').and('be.visible').should('have.attr', 'placeholder', "What need's to be done?");
  });

  it('Input field is initially empty', () => {
   cy.get("form.todo-form input.new-todo").should('have.value', ''); 
  });

  it('Display footer text on load', () => {
    cy.get('footer.info p').should('have.text', 'Double-click to edit a toodo'); 
  });

})

// Group 2: Add new todos

describe('Add a new todo item', () => {
  beforeEach(() => {
    cy.visit(pageUrl); 
  });

  describe('Add succefully a new todo item', () => {
    it('Should allow adding a new todo item', () => {
      cy.get('.new-todo').type('Buy groceries{enter}');
      cy.get('.todo-list li').should('have.length', 1);
      cy.get('.todo-list li').should('contain', 'Buy groceries');
    });
  });

  describe('Add a new todo item with different keys', () => {
    it('Should allow adding a new todo item with the "Enter" key', () => {
      addTodo('Buy groceries');
      cy.get('.todo-list li').should('have.length', 1).and('contain', 'Buy groceries');
    });
  
    it('Should not add a new todo item by pressing letter key', () => {
      const letterKeys = [
        ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65)), // A-Z
        ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 97)), // a-z
      ];
  
      letterKeys.forEach((key) => {
        cy.get('.new-todo').type('Buy groceries').trigger('keydown', { key });
        cy.get('.todo-list li').should('have.length', 0);
      });
    });
  
    it('Should not add a new todo item by pressing number key', () => {
      const numberKeys = Array.from({ length: 10 }, (_, i) => i.toString()); // 0-9
  
      numberKeys.forEach((key) => {
        cy.get('.new-todo').type('Buy groceries').trigger('keydown', { key });
        cy.get('.todo-list li').should('have.length', 0);
      });
    });
  
    it('Should not add a new todo item by pressing symbol key', () => {
      const symbolKeys = [
        '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
        '-', '=', '_', '+', '{', '}', '[', ']', '|',
        ':', ';', '"', "'", '<', '>', ',', '.', '?', '/', 
        '~', '`' 
      ];
  
      symbolKeys.forEach((key) => {
        cy.get('.new-todo').type('Buy groceries').trigger('keydown', { key });
        cy.get('.todo-list li').should('have.length', 0);
      });
    });
  
    it('Should not add a new todo item by pressing control key', () => {
      const controlKeys = [
        '{esc}', '{arrowdown}', '{arrowup}', '{home}',
        '{end}', '{pageup}', '{pagedown}', '{tab}',
        '{backspace}', '{shift}', '{ctrl}', '{alt}',
        'Insert', 'Delete', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
        'NumLock', 'ScrollLock' 
      ];
  
      controlKeys.forEach((key) => {
        cy.get('.new-todo')
          .type('Buy groceries')
          .trigger('keydown', { key: key.replace('{', '').replace('}', '') }); // Remove curly braces
        cy.get('.todo-list li').should('have.length', 0);
      });
    });
  });
});

// Group 3: Check if no todos initially
describe('No todos initially', () => {
  beforeEach(() => {
    cy.visit(pageUrl); 
  });

  it('Should show no todos initially', () => {
    cy.get('.todo-list li').should('have.length', 0);
  });
});

// Group 4: Complete todo item
describe('Complete todo item', () => {
  beforeEach(() => {
    cy.visit(pageUrl); 
  });

  it('Should mark a todo item as completed', () => {
    addTodo('Walk the dog');
    cy.get('.toggle').click();
    cy.get('.todo-list li').should('have.class', 'completed');
    cy.get('.todo-list li').should('have.length', 1);
  });

  it('Should mark all todos as complete', () => {
    addTodo('Read');
    addTodo('Walk the dog');
    cy.get('.todo-list li').should('have.length', 2);
    cy.get('#toggle-all').click({ force: true });

    cy.get('.todo-list li').each(($el) => {
      cy.wrap($el).should('have.class', 'completed');
    });
  });
});

// Group 5: Delete todo item
describe('Delete todo item', () => {
  beforeEach(() => {
    cy.visit(pageUrl); 
  });

  it('Should delete completed todo item by cliclikng "X"', () => {
    addTodo('Read a book');
    cy.get('.todo-list li').should('have.length', 1);
    cy.get('button[title="TODO:REMOVE THIS EVENTUALLY"]').click({ force: true });
    cy.get('.todo-list li').should('have.length', 0);
  });

  // it('Should show/hide clear completed button based on task completion', () => {
  //   addTodo('Read a book');
  //   cy.get('.clear-completed').should('not.be.visible');
  //   cy.get('.toggle').click();
  //   cy.get('.clear-completed').should('be.visible');
  // });

  it('Should delete completed todo item by cliclikng "Clear"', () => {
  
    it('Should clear completed todos', () => {
      addTodo('Cook dinner'); 
      cy.get('.todo-list li').should('have.length', 1);
      cy.get('.toggle').click();
      cy.get('.clear-completed').click();
      cy.get('.todo-list li').should('have.length', 0);
    });
  });
});

// Group 6: Edit todo item
describe('Edit todo item', () => {
  beforeEach(() => {
    cy.visit(pageUrl); 
  });

  it('Should edit a todo item', () => {
    addTodo('Learn Cypress'); 
    cy.get('.todo-list li label').dblclick();
    cy.get('.todo-list li .edit').should('exist'); 
    cy.get('.todo-list li .edit').clear().type('Learn Cypress Testing{enter}'); 
    cy.get('.todo-list li').should('contain', 'Learn Cypress Testing'); 
    cy.get('.todo-list li').should('have.length', 1); 
  });
});

// Group 7: Filter todo items
describe('Filter Todos', () => {
  beforeEach(() => {
    cy.visit(pageUrl); 
  });

  it('Should filter todos to show only active tasks', () => {
    addTodo('Walk a dog'); 
    addTodo('Clean a room'); 
    addTodo('Go for a walk'); 
    cy.get('.todo-list li').should('have.length', 3)
    cy.get('.todo-list li:first .toggle').click(); 
    cy.get('li a[href="#/active"]').click();
    cy.get('.todo-list li').should('have.length', 2).and('not.have.class', 'completed');
    cy.get('.todo-list li').eq(0).should('contain', 'Clean a room');
    cy.get('.todo-list li').eq(1).should('contain', 'Go for a walk');
  });

  it('Should filter todos to show only completed tasks', () => {
    addTodo('Walk a dog'); 
    addTodo('Clean a living room'); 
    addTodo('Read a book'); 
    cy.get('.todo-list li').should('have.length', 3)
    cy.get('.todo-list li:first .toggle').click(); 
    cy.get('li a[href="#/completed"]').click();
    cy.get('.todo-list li').should('have.length', 1).and('have.class', 'completed');
    cy.get('.todo-list li').eq(0).should('contain', 'Walk a dog');
  });

  it('Should show all todos', () => {
    addTodo('Walk a dog'); 
    addTodo('Clean a living room'); 
    addTodo('Read a book'); 
    cy.get('.todo-list li').should('have.length', 3); 
    cy.get('.todo-list li:first .toggle').click(); 
    cy.get('li a[href="#/"]').click(); 
    cy.get('.todo-list li').should('have.length', 3); 
    cy.get('.todo-list li').eq(0).should('contain', 'Walk a dog');
    cy.get('.todo-list li').eq(1).should('contain', 'Clean a living room');
    cy.get('.todo-list li').eq(2).should('contain', 'Read a book');
  });
});

// Group 8: Todos count

// describe('Todo count', () => {
//   beforeEach(() => {
//     cy.visit(pageUrl); 
//   });

//   it('Should show the correct remaining todo count', () => {
//     addTodo('Walk a dog'); 
//     addTodo('Clean a living room'); 
//     addTodo('Read a book'); 
//     cy.get('.todo-count strong').should('contain', '3');
//     cy.get('.todo-list li:first .toggle').click();
//     cy.get('.todo-count strong').should('contain', '2');
//   });
// });

