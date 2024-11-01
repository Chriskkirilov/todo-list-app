describe("To-Do List Application", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should add a new task", () => {
    cy.get('input[name="task"]').type("Buy groceries");
    cy.get('select[name="priority"]').select("medium");
    cy.get('input[name="dueDate"]').type("2023-11-15");
    cy.get('button[type="submit"]').click();

    cy.get(".task-list")
      .should("contain", "Buy groceries")
      .and("contain", "Priority: Medium");
  });

  it("should mark a task as complete", () => {
    cy.get('input[name="task"]').type("Complete JavaScript project");
    cy.get('button[type="submit"]').click();
    cy.get(".task-list")
      .contains("Complete JavaScript project")
      .parent()
      .find('input[type="checkbox"]')
      .check();

    cy.get(".task-list")
      .contains("Complete JavaScript project")
      .should("have.class", "completed");
  });

  it("should delete a task", () => {
    cy.get('input[name="task"]').type("Read a book");
    cy.get('button[type="submit"]').click();
    cy.get(".task-list")
      .contains("Read a book")
      .parent()
      .find("button.delete")
      .click();

    cy.get(".task-list").should("not.contain", "Read a book");
  });
});
