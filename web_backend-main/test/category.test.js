// // const chai = require("chai");
// // const chaiHttp = require("chai-http");
// // const { initializeApp } = require('../server');
// // const { expect } = chai;

// // chai.use(chaiHttp);

// // let server;
// // let categoryId; // To store the created category ID
// // let token; // To store the JWT token for authentication

// // before(async () => {
// //   server = await initializeApp(); // Initialize the server
// //   // Assuming you already have a login test or manual login, retrieve the token
// //   const res = await chai.request(server)
// //     .post("/users/login")
// //     .send({
// //       email: "testuser66@example.com",
// //       password: "password123"
// //     });

// //   token = res.body.data.token; // Store the JWT token for subsequent authenticated requests
// // });

// // describe("Category API Tests", () => {
// //   // Test case for fetching all categories
// //   it("should get a list of categories", async () => {
// //     const res = await chai.request(server)
// //       .get("/category")
// //       .set("Authorization", `Bearer ${token}`) // Attach the token for authorization
// //       .query({ page: 1, size: 10 })
// //       .send();

// //     expect(res).to.have.status(200);
// //     expect(res.body.success).to.be.true;
// //     expect(res.body.data).to.be.an('array');
// //     expect(res.body.data.length).to.be.greaterThan(0);
// //   });

 

 

// // });

// // after(async () => {
// //   server.close(); // Close the server after tests are done
// // });



// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const { initializeApp } = require('../server');
// const { expect } = chai;
// const Category = require("..//api/models/Category");

// chai.use(chaiHttp);

// let server;
// let categoryId; // To store the created category ID
// let token; // To store the JWT token for authentication

// before(async () => {
//   server = await initializeApp(); // Initialize the server

//   // Authenticate and get the token
//   const res = await chai.request(server)
//     .post("/users/login")
//     .send({
//       email: "testuser66@example.com",
//       password: "password123"
//     });

//   if (!res.body.success || !res.body.data || !res.body.data.token) {
//     throw new Error("Login failed! Check credentials and authentication API.");
//   }

//   token = res.body.data.token;

//   // Create a test category in the database for viewing tests
//   const testCategory = await Category.create({ name: "View Test Category" });
//   categoryId = testCategory._id;
// });

// describe("📂 Category API Tests", () => {

//   // 1️⃣ Fetch all categories
//   it("📋 Should fetch all categories successfully", async () => {
//     const res = await chai.request(server)
//       .get("/category")
//       .set("Authorization", `Bearer ${token}`)
//       .query({ page: 1, size: 10 });

//     expect(res).to.have.status(200);
//     expect(res.body.success).to.be.true;
//     expect(res.body.data).to.be.an('array');
//   });

//   // 2️⃣ Fetch a single category by ID
//   it("🔍 Should fetch a single category by ID", async () => {
//     const res = await chai.request(server)
//       .get(`/category/${categoryId}`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(res).to.have.status(200);
//     expect(res.body.success).to.be.true;
//     expect(res.body.data).to.have.property("_id", categoryId.toString());
//   });

//   // 3️⃣ Fetch paginated categories
//   it("📄 Should fetch paginated categories", async () => {
//     const res = await chai.request(server)
//       .get("/category?page=1&size=2")
//       .set("Authorization", `Bearer ${token}`);

//     expect(res).to.have.status(200);
//     expect(res.body.success).to.be.true;
//     expect(res.body.data).to.be.an("array");
//     expect(res.body.data.length).to.be.lessThanOrEqual(2);
//   });

//   // 4️⃣ Search for a category by name
//   it("🔎 Should search for a category by name", async () => {
//     const res = await chai.request(server)
//       .get(`/category?search=View Test Category`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(res).to.have.status(200);
//     expect(res.body.success).to.be.true;
//     expect(res.body.data).to.be.an("array");
//     expect(res.body.data.length).to.be.greaterThan(0);
//     expect(res.body.data[0].name).to.equal("View Test Category");
//   });

//   // 5️⃣ Return error for a non-existent category
//   it("❌ Should return an error for a non-existent category", async () => {
//     const res = await chai.request(server)
//       .get("/category/660000000000000000000000") // Invalid ObjectId
//       .set("Authorization", `Bearer ${token}`);

//     expect(res).to.have.status(404);
//     expect(res.body.success).to.be.false;
//     expect(res.body.msg).to.equal("Category Not Found!!");
//   });

 

// });

// after(async () => {
//   server.close(); // Close the server after tests are done
// });
