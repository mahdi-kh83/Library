describe("Library Full Flow", () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    // Verify json-server is alive
    cy.request("http://localhost:9000/users").its("status").should("eq", 200);

    cy.request("http://localhost:9000/books").its("status").should("eq", 200);

    cy.visit("http://127.0.0.1:3000");
  });

  it("logs in, searches python book, borrows for 5 days and returns it after 8 seconds", () => {
    // LOGIN

    cy.get('input[placeholder="ایمیل"]').should("be.visible").type("user");

    cy.get('input[placeholder="رمز عبور"]').should("be.visible").type("user");

    cy.get('button[type="submit"]').contains("ورود").click();

    // User successfully logged in

    cy.contains("👤").should("be.visible");

    // SEARCH PYTHON

    cy.get(".search").should("be.visible").clear().type("python");

    // Wait for books to render

    cy.get(".list-books li", { timeout: 10000 }).should(
      "have.length.greaterThan",
      0,
    );

    // Click first python book

    cy.contains(".list-books li", /python/i).click();

    // Book details loaded from json-server

    cy.get(".details", { timeout: 10000 }).should("be.visible");

    // Select 5 days borrowing period

    cy.get('.rating [role="button"]').eq(4).click();

    // Borrow book

    cy.get(".btn-add").should("be.visible").click();

    // Verify book appears in borrowed section

    cy.contains("کتاب‌های امانت گرفته شده").should("be.visible");

    cy.get(".btn-delete").should("exist");

    // Wait 8 seconds

    cy.wait(8000);

    // Return book

    cy.get(".btn-delete").first().click();

    // Verify returned

    cy.get(".btn-delete").should("not.exist");
  });
});
