describe("Library Full Flow", () => {
  const unique = Date.now();

  const testBook = {
    id: `book-${unique}`,
    title: "Cypress Test Book",
    author: "Cypress Author",
    picture: "https://picsum.photos/200",
    precis: "Test Book Description",
  };

  const testUser = {
    id: `user-${unique}`,
    name: "Cypress User",
    email: `cypress${unique}@mail.com`,
    password: "123456",
  };

  beforeEach(() => {
    cy.clearLocalStorage();

    // json-server health check
    cy.request("http://localhost:9000/books").its("status").should("eq", 200);

    cy.request("http://localhost:9000/users").its("status").should("eq", 200);

    cy.visit("http://127.0.0.1:3000");
  });

  it("User Flow + Admin Flow", () => {
    // =====================================
    // USER LOGIN
    // =====================================

    cy.get('input[placeholder="ایمیل"]').should("be.visible").type("user");

    cy.get('input[placeholder="رمز عبور"]').should("be.visible").type("user");

    cy.get('button[type="submit"]').click();

    cy.get(".current-user").should("exist");

    // =====================================
    // SEARCH PYTHON BOOK
    // =====================================

    cy.get(".search").clear().type("python");

    cy.get(".list-books li", {
      timeout: 10000,
    }).should("have.length.greaterThan", 0);

    cy.contains(".list-books li", /python/i).click();

    // =====================================
    // BORROW FOR 5 DAYS
    // =====================================

    cy.get(".details").should("be.visible");

    cy.get('.rating [role="button"]').eq(4).click();

    cy.get(".btn-add").click();

    cy.contains("کتاب‌های امانت گرفته شده");

    cy.get(".btn-delete").should("exist");

    // =====================================
    // WAIT 3 SEC
    // =====================================

    cy.wait(3000);

    // =====================================
    // RETURN BOOK
    // =====================================

    cy.get(".btn-delete").first().click();

    cy.get(".btn-delete").should("not.exist");

    // =====================================
    // LOGOUT USER
    // =====================================

    cy.get(".logout-btn").click();

    cy.contains("ورود").should("be.visible");

    // =====================================
    // LOGIN ADMIN
    // =====================================

    cy.get('input[placeholder="ایمیل"]').type("admin");

    cy.get('input[placeholder="رمز عبور"]').type("admin");

    cy.get('button[type="submit"]').click();

    cy.wait(3000);

    // =====================================
    // ADMIN DASHBOARD
    // =====================================

    cy.contains("پنل مدیریت", {
      timeout: 10000,
    }).should("be.visible");

    // =====================================
    // ADD BOOK
    // =====================================

    cy.contains("افزودن کتاب").click();

    cy.get('input[placeholder="شناسه کتاب"]').clear().type(testBook.id);

    cy.get('input[placeholder="نام کتاب"]').clear().type(testBook.title);

    cy.get('input[placeholder="نام نویسنده"]').clear().type(testBook.author);

    cy.get('input[placeholder="لینک تصویر"]').clear().type(testBook.picture);

    cy.get("textarea").clear().type(testBook.precis);

    // cy.contains("ذخیره کتاب").click();
    cy.get('button[type="submit"]').click();

    cy.contains(testBook.title, {
      timeout: 10000,
    }).should("exist");

    // =====================================
    // EDIT BOOK
    // =====================================

    cy.contains("tr", testBook.title).find("button").first().click();

    cy.get('input[placeholder="نام کتاب"]').clear().type("Edited Cypress Book");

    cy.contains("ذخیره").click();

    cy.contains("Edited Cypress Book", {
      timeout: 10000,
    }).should("exist");

    // =====================================
    // DELETE BOOK
    // =====================================

    cy.contains("tr", "Edited Cypress Book").find("button").last().click();

    cy.on("window:confirm", () => true);

    cy.contains("Edited Cypress Book").should("not.exist");

    cy.wait(3000);

    // =====================================
    // USERS TAB
    // =====================================

    cy.contains("مدیریت کاربران").click();

    // =====================================
    // ADD USER
    // =====================================

    cy.contains("افزودن کاربر").click();

    cy.get('input[placeholder="شناسه"]').clear().type(testUser.id);

    cy.get('input[placeholder="نام"]').clear().type(testUser.name);

    cy.get('input[placeholder="ایمیل"]').clear().type(testUser.email);

    cy.get('input[placeholder="رمز عبور"]').clear().type(testUser.password);

    cy.get("select").select("user");

    cy.contains("ذخیره کاربر").click();

    cy.contains(testUser.name, {
      timeout: 10000,
    }).should("exist");

    // =====================================
    // DELETE USER
    // =====================================

    cy.contains("tr", testUser.name).find("button").click();

    cy.on("window:confirm", () => true);

    cy.contains(testUser.name).should("not.exist");

    // =====================================
    // LOGOUT ADMIN
    // =====================================

    cy.get(".logout-btn").click();

    cy.contains("ورود").should("be.visible");
  });
});
