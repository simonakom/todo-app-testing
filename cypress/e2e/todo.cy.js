const pageUrl = "https://todolist.james.am/#/";

// --------------------------------------Test Suits---------------------------------------------

// Group 1: Page load and display elements
describe('Page load and display elements', () => {
  beforeEach(() => {
    cy.visitTodoPage();
  });

  describe('Page elements before adding a todo', () => {
    it('The page is loaded successfully', () => {
      cy.url().should('eq', pageUrl);
    })

    it('The app in the page is loaded successfully', () => {
      cy.get('section.todoapp', { timeout: 10000 }).should('exist').and('be.visible');
    });

    it('Displays "To Do List" title on load', () => {
      cy.get('h1').should('exist').and('be.visible').and('have.text', 'To Do List'); 
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
      cy.get('footer.info p').should('have.text', 'Double-click to edit a toodo').should('exist').and('be.visible');
    });

    it('Navigation bar is not visible before a todo is added', () => {
      cy.get('.footer').should('not.be.visible');
    });

    it('Show no todos initially', () => {
       cy.verifyTodoCount(0);
     });
  });

  describe('Page elements after adding a todo', () => {
    it('Todo persist after page reload', () => {
      cy.addTodo('Learn Cypress'); 
      cy.verifyTodoCount(1);
      cy.reload();
      cy.verifyTodoCount(1);
      cy.get('.todo-list li').eq(0).should('contain', 'Learn Cypress');
    });

    it('Added new todos are marked as not completed', () => {
      cy.addTodo('Learn Cypress'); 
      cy.verifyTodoCount(1).and('not.have.class', 'completed');            
    });

    it('"Check All" button existx after adding a todo', () => {
      cy.addTodo('Learn Cypress');
      cy.verifyTodoCount(1);
      cy.get('#toggle-all').should('exist');
    });

    it('Checkbox exists after adding a todo', () => {
      cy.addTodo('Learn Cypress'); 
      cy.verifyTodoCount(1);
      cy.get('.todo-list li .toggle').should('exist');
    });

    it('Delete (X) button exists when hovering over a todo item', () => {
      cy.addTodo('Learn Cypress'); 
      cy.verifyTodoCount(1);
      cy.get('button.destroy').should('not.be.visible');
      cy.get('.todo-list li .view').trigger('mouseenter');
      cy.get('button.destroy').should('exist');
    });

    it('Displays navigation bar after todo is added', () => {
      cy.addTodo('Learn Cypress');
      cy.verifyTodoCount(1);
      cy.get('.footer').should('exist').and('be.visible');
    });

    it('Display todo count', () => {
      cy.addTodo('Learn Cypress');
      cy.verifyTodoCount(1);
      cy.get('.todo-count').should('exist').and('be.visible');
    });

    it('Display "clear" button', () => {
      cy.addTodo('Learn Cypress');
      cy.verifyTodoCount(1);
      cy.get('button.clear-completed').should('exist').and('be.visible');
    });

    it('Display "all" filter', () => {
      cy.addTodo('Learn Cypress');
      cy.verifyTodoCount(1);
      cy.get('li a[href="#/"]').should('exist').and('be.visible');
    });

    it('Display "active" filter', () => {
      cy.addTodo('Learn Cypress');
      cy.verifyTodoCount(1);
      cy.get('li a[href="#/active"]').should('exist').and('be.visible');
    });

    it('Display "completed" filter', () => {
      cy.addTodo('Learn Cypress');
      cy.verifyTodoCount(1);
      cy.get('li a[href="#/completed"]').should('exist').and('be.visible');
    });
  });  
})

// Group 2: Add new todos
describe('Add a new todo item', () => {
  beforeEach(() => {
    cy.visitTodoPage();
  });

  describe('Add succefully a new todo item with "Enter" key', () => {
    it('Allow adding a new todo item', () => {
      cy.addTodo('Learn Cypress');
      cy.verifyTodoCount(1);
      cy.get('.todo-list li').should('contain', 'Learn Cypress');
    });

    it('Clear the input field after adding a todo', () => {
      cy.addTodo('Learn Cypress');
      cy.verifyTodoCount(1);
      cy.get('.new-todo').should('have.value', '   '); 
    });

    it('New todo is not marked as completed', () => {
      cy.addTodo('Learn Cypress');
      cy.verifyTodoCount(1);
      cy.get('.todo-list li').should('not.have.class', 'completed');
    });

    it('Not allow adding an empty todo', () => {
      cy.get('.new-todo').type('{enter}');
      cy.verifyTodoCount(0);
    });

    it('Trim leading and trailing spaces when adding a todo', () => {
      cy.addTodo('   Learn Cypress   ');
      cy.get('.todo-list li').should('contain', 'Learn Cypress').and('not.contain', '   ');
    });
  
    it('Allow adding a todo item with numbers', () => {
      const todoText = 'Todo 123'; 
      cy.addTodo(todoText);
      cy.verifyTodoCount(1).and('contain', todoText);
    });
  
    it('Allow adding a todo item with symbols', () => {
      const todoText = 'Buy milk @ $3.99'; 
      cy.addTodo(todoText);
      cy.verifyTodoCount(1).and('contain', todoText);
    });

    it('Allow adding a todo with a very long string', () => {
      const longTodo = 'a'.repeat(1000); 
      cy.addTodo(longTodo);
      cy.verifyTodoCount(1).and('contain.text', longTodo);
    });

    ('Allow adding duplicate todo items', () => {
      const todoText = 'Learn Cypress';
      cy.addTodo(todoText);
      cy.verifyTodoCount(1).and('contain', todoText);
      cy.addTodo(todoText);
      cy.verifyTodoCount(2).and('contain', todoText);
    });
  });

  describe('Add a new todo item with different keys', () => {  
    it('Should not add a new todo item by pressing letter key', () => {
      const letterKeys = [
        ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65)), // A-Z
        ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 97)), // a-z
      ];
  
      letterKeys.forEach((key) => {
        cy.get('.new-todo').type('Buy groceries').trigger('keydown', { key });
        cy.verifyTodoCount(0);
      });
    });
  
    it('Should not add a new todo item by pressing number key', () => {
      const numberKeys = Array.from({ length: 10 }, (_, i) => i.toString()); // 0-9
  
      numberKeys.forEach((key) => {
        cy.get('.new-todo').type('Buy groceries').trigger('keydown', { key });
        cy.verifyTodoCount(0);
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
        cy.verifyTodoCount(0);
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
          cy.verifyTodoCount(0);
      });
    });
  });
});

// Group 3: Edit todo item
describe('Edit todo item', () => {
  beforeEach(() => {
    cy.visitTodoPage();
  });

  it('Edits a todo item', () => {
    cy.addTodo('Learn Cypress');
    cy.verifyTodoCount(1).and('contain', 'Learn Cypress');
    cy.get('.todo-list li label').dblclick();
    cy.get('.todo-list li .edit').should('exist').clear().type('Learn Cypress Testing{enter}'); 
    cy.verifyTodoCount(1).and('contain', 'Learn Cypress Testing');
  });

  it('Edit field is focused when editing', () => {
    cy.addTodo('Learn Cypress');
    cy.get('.todo-list li label').dblclick();
    cy.get('.todo-list li .edit').should('be.focused');
  });

  it('Cancel the edit without saving when pressing Escape', () => {
    cy.addTodo('Learn Cypress');
    cy.get('.todo-list li label').dblclick();
    cy.get('.todo-list li .edit').clear().type('Edited text{esc}');
    cy.verifyTodoCount(1)
      .and('contain', 'Learn Cypress')
      .and('not.contain', 'Edited text');
  });

  it('Trim leading and trailing spaces when editing a todo', () => {
    cy.addTodo('Learn Cypress');
    cy.get('.todo-list li label').dblclick();
    cy.get('.todo-list li .edit').clear().type('   Edited todo   {enter}');
    cy.verifyTodoCount(1)
      .and('contain', 'Edited todo')
      .and('not.contain', '   Edited todo   ');
  });

  it('Persist the edited todo after a page reload', () => {
    cy.addTodo('Learn Cypress');
    cy.get('.todo-list li label').dblclick();
    cy.get('.todo-list li .edit').clear().type('Master Cypress{enter}');
    cy.reload();
    cy.verifyTodoCount(1)
      .and('contain', 'Master Cypress');
  });

  it('Delete the todo when editing with a blank value', () => {
    cy.addTodo('Learn Cypress');
    cy.verifyTodoCount(1)
      .and('contain', 'Learn Cypress');
    cy.get('.todo-list li label').dblclick();
    cy.get('.todo-list li .edit').clear().type('{enter}');
    cy.verifyTodoCount(0);
  });

  it('Allow editing a todo item with numbers', () => {
    const updatedTodoText = 'Todo 456';
    cy.addTodo('Learn Cypress');
    cy.get('.todo-list li label').dblclick();
    cy.get('.todo-list li .edit').clear().type(updatedTodoText + '{enter}');
    cy.verifyTodoCount(1).and('contain', updatedTodoText);
  });

  it('Allow editing a todo item with symbols', () => {
    const updatedTodoText = 'Buy milk @ $3.99';
    cy.addTodo('Learn Cypress');
    cy.get('.todo-list li label').dblclick();
    cy.get('.todo-list li .edit').clear().type(updatedTodoText + '{enter}');
    cy.verifyTodoCount(1).and('contain', updatedTodoText);
  });

  it('Allow editing a todo with a very long string', () => {
    const longTodoText = 'b'.repeat(1000);
    cy.addTodo('Learn Cypress');
    cy.get('.todo-list li label').dblclick();
    cy.get('.todo-list li .edit').clear().type(longTodoText + '{enter}');
    cy.verifyTodoCount(1).and('contain.text', longTodoText);
  });
});

// Group 4: Complete todo item
describe('Complete todo item', () => {
  beforeEach(() => {
    cy.visitTodoPage();
  });

  it('Should mark a todo item as completed', () => {
    cy.addTodo('Learn Cypress');
    cy.get('.toggle').click();
    cy.get('.todo-list li').should('have.class', 'completed');
    cy.verifyTodoCount(1);
  });

  it('Should mark all todos as complete', () => {
    cy.addTodo('Learn Cypress');
    cy.addTodo('Walk the dog');
    cy.verifyTodoCount(2);
    cy.get('#toggle-all').click({ force: true });

    cy.get('.todo-list li').each(($el) => {
      cy.wrap($el).should('have.class', 'completed');
    });
  });

  it('Should unmark a completed todo', () => {
    cy.addTodo('Learn Cypress');
    cy.get('.toggle').click(); 
    cy.get('.toggle').click();
    cy.get('.todo-list li').should('not.have.class', 'completed');
  });
  
  it('Should persist completed status after page reload', () => {
    cy.addTodo('Learn Cypress');
    cy.get('.toggle').click();
    cy.reload();
    cy.get('.todo-list li').should('have.class', 'completed');
  });

  it('Should only toggle the specific todo when clicking on its toggle button', () => {
    cy.addTodo('Learn Cypress');
    cy.addTodo('Walk the dog');
    cy.get('.todo-list li').eq(0).find('.toggle').click(); 
    cy.get('.todo-list li').eq(0).should('have.class', 'completed');
    cy.get('.todo-list li').eq(1).should('not.have.class', 'completed'); 
  });
});

// Group 5: Delete todo item
describe('Delete todo item', () => {
  beforeEach(() => {
    cy.visitTodoPage();
  });

  it('Should delete completed todo item by cliclikng "X"', () => {
    cy.addTodo('Learn Cypress');
    cy.verifyTodoCount(1);
    cy.get('button[title="TODO:REMOVE THIS EVENTUALLY"]').click({ force: true });
    cy.verifyTodoCount(0);
  });

  it('Should not delete not selected todo item by cliclikng "Clear"', () => {
    cy.addTodo('Learn Cypress');
    cy.verifyTodoCount(1);
    cy.contains('Clear').click();
    cy.verifyTodoCount(1);
  });

  it('Should delete selected todo item by cliclikng "Clear"', () => {
    cy.addTodo('Learn Cypress');
    cy.verifyTodoCount(1);
      cy.get('.toggle').click();
      cy.get('.clear-completed').click();
      cy.verifyTodoCount(0);
  });

  it('Should delete multiple selected todo items by cliclikng "Clear"' , () => {
    cy.addTodo('Read a book');
    cy.addTodo('Go for a walk'); 
    cy.get('.toggle').eq(0).click(); 
    cy.get('.toggle').eq(1).click(); 
    cy.get('.clear-completed').click(); 
    cy.verifyTodoCount(0);
  });

  it('Should delete an edited todo item by cliclikng "X"', () => {
    cy.addTodo('Learn Cypress');
    cy.get('.todo-list li label').dblclick();
    cy.get('.todo-list li .edit').clear().type('Go for a run in the park{enter}');
    cy.get('button[title="TODO:REMOVE THIS EVENTUALLY"]').click({ force: true });
    cy.verifyTodoCount(0);
  });

  it('Should not show deleted todo after page reload', () => {
    cy.addTodo('Wash the car');
    cy.get('.toggle').click(); 
    cy.get('button[title="TODO:REMOVE THIS EVENTUALLY"]').click({ force: true });
    cy.reload();
    cy.verifyTodoCount(0);
  });
});

// Group 6: Filter todo items
describe('Filter Todos', () => {
  beforeEach(() => {
    cy.visitTodoPage();
  });

  it('Should filter todos to show only active tasks', () => {
    cy.addTodo('Learn Cypress');
    cy.addTodo('Clean a room'); 
    cy.addTodo('Go for a walk'); 
    cy.verifyTodoCount(3);
    cy.get('.todo-list li:first .toggle').click(); 
    cy.get('li a[href="#/active"]').click();
    cy.verifyTodoCount(2).and('not.have.class', 'completed');
    cy.get('.todo-list li').eq(0).should('contain', 'Clean a room');
    cy.get('.todo-list li').eq(1).should('contain', 'Go for a walk');
  });

  it('Should filter todos to show only completed tasks', () => {
    cy.addTodo('Learn Cypress');
    cy.addTodo('Clean a living room'); 
    cy.addTodo('Read a book'); 
    cy.verifyTodoCount(3);
    cy.get('.todo-list li:first .toggle').click(); 
    cy.get('li a[href="#/completed"]').click();
    cy.verifyTodoCount(1).and('have.class', 'completed');
    cy.get('.todo-list li').eq(0).should('contain', 'Learn Cypress');
  });

  it('Should show all todos', () => {
    cy.addTodo('Learn Cypress');
    cy.addTodo('Clean a living room'); 
    cy.addTodo('Read a book'); 
    cy.verifyTodoCount(3);
    cy.get('.todo-list li:first .toggle').click(); 
    cy.get('li a[href="#/"]').click(); 
    cy.verifyTodoCount(3);
    cy.get('.todo-list li').eq(0).should('contain', 'Learn Cypress');
    cy.get('.todo-list li').eq(1).should('contain', 'Clean a living room');
    cy.get('.todo-list li').eq(2).should('contain', 'Read a book');
  });

  it('Should update the displayed todos when adding new ones after filtering', () => {
    cy.addTodo('Learn Cypress');
    cy.verifyTodoCount(1);
    cy.get('li a[href="#/completed"]').first().click(); 
    cy.verifyTodoCount(0);
    cy.addTodo('Read a book');
    cy.verifyTodoCount(0);
  });

  it('Should show no completed todos when all are active', () => {
    cy.addTodo('Learn Cypress');
    cy.addTodo('Go for a run');
    cy.verifyTodoCount(2);
    cy.get('li a[href="#/completed"]').click();
    cy.verifyTodoCount(0);
  });

  it('Should toggle back to all todos after filtering', () => {
    cy.addTodo('Learn Cypress');
    cy.addTodo('Go shopping');
    cy.verifyTodoCount(2);
    cy.get('.todo-list li:first .toggle').click();
    cy.get('li a[href="#/completed"]').click();
    cy.verifyTodoCount(1);
    cy.get('li a[href="#/"]').click();
    cy.verifyTodoCount(2);
  });

  it('Should preserve filter state on page reload', () => {
    cy.addTodo('Learn Cypress');
    cy. addTodo('Write tests');
    cy.verifyTodoCount(2);
    cy.get('.todo-list li:first .toggle').click();
    cy.get('li a[href="#/completed"]').click();
    cy.verifyTodoCount(1);
    cy.reload();
    cy.verifyTodoCount(1);
  });

  it('Should update the displayed todos when adding new ones after filtering', () => {
    cy.addTodo('Learn Cypress');
    cy.verifyTodoCount(1);
    cy.get('li a[href="#/completed"]').click();
    cy.verifyTodoCount(0);
    cy.addTodo('Read a book');
   cy.verifyTodoCount(0);
  });
});

// Group 7: Todos count
describe('Todo count', () => {
  beforeEach(() => {
    cy.visitTodoPage();
  });

  it('Shows INCORRECT remaining todo count', () => {
    cy.addTodo('Walk a dog'); 
    cy.addTodo('Clean a living room'); 
    cy.addTodo('Read a book'); 
    cy.get('.todo-count strong').should('contain', '2');
    cy.get('.todo-list li:first .toggle').click();
    cy.get('.todo-count strong').should('contain', '1');
  });

  it('Should increase todo count when a new todo is added', () => {
    cy.addTodo('Buy groceries');
    cy.get('.todo-count strong').should('contain', '0');
    cy.addTodo('Walk the dog');
    cy.get('.todo-count strong').should('contain', '1');
  });

  it('Should decrease todo count when a todo is marked as completed', () => {
    cy.addTodo('Walk a dog');
    cy.addTodo('Clean a living room');
    cy.get('.todo-list li:first .toggle').click(); 
    cy.get('.todo-count strong').should('contain', '0');
  });  
});



