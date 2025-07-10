


// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const { initializeApp } = require("../server"); // Import server initialization
// const { expect } = chai;
// const jwt = require("jsonwebtoken");
// const User = require("../api/models/User");
// const path = require("path");
// require("dotenv").config();

// chai.use(chaiHttp);

// let server;
// let authToken;
// let userId;
// let resetToken;
// let testEmail = "test786@example.com";

// before(async () => {
//   server = await initializeApp(); // Initialize the server
// });

// describe("🛠 User API Tests", function () {
//   this.timeout(10000); // ⏳ Increase timeout for email sending operations

//   it("✅ Should register a new user", async () => {
//     const res = await chai.request(server)
//       .post("/users/register")
//       .send({
//         name: "Test User",
//         email: testEmail,
//         password: "password123",
//         mobile_no: "9876543211"
//       });

//     expect(res).to.have.status(200);
//     expect(res.body.success).to.be.true;
//   });

//   it("❌ Should fail to register a user if email already exists", async () => {
//     const res = await chai.request(server)
//       .post("/users/register")
//       .send({
//         name: "Existing User",
//         email: testEmail,  // Using the already registered email
//         password: "password123",
//         mobile_no: "9876543212"
//       });

//     expect(res).to.have.status(409);
//     expect(res.body.success).to.be.false;
//     expect(res.body.msg).to.equal("User Already Exists!!");
//   });

//   it("✅ Should log in the user and return a JWT token", async () => {
//     const res = await chai.request(server)
//       .post("/users/login")
//       .send({
//         email: testEmail,
//         password: "password123"
//       });

//     expect(res).to.have.status(200);
//     expect(res.body.success).to.be.true;
//     expect(res.body.data).to.have.property("token");

//     authToken = res.body.data.token;
//     userId = res.body.data._id;
//   });

//   it("❌ Should fail to log in with incorrect password", async () => {
//     const res = await chai.request(server)
//       .post("/users/login")
//       .send({
//         email: testEmail,
//         password: "wrongpassword"
//       });

//     expect(res).to.have.status(401);
//     expect(res.body.success).to.be.false;
//     expect(res.body.msg).to.equal("Email or Password Incorrect!!");
//   });

//   it("✅ Should fetch the user's profile", async () => {
//     const res = await chai.request(server)
//       .get("/users/my-profile")
//       .set("Authorization", `Bearer ${authToken}`);

//     expect(res).to.have.status(200);
//     expect(res.body.success).to.be.true;
//     expect(res.body.data.email).to.equal(testEmail);
//   });

//   it("✅ Should update the user's profile", async () => {
//     const res = await chai.request(server)
//       .put(`/users/update-profile/${userId}`)
//       .set("Authorization", `Bearer ${authToken}`)
//       .send({
//         name: "Updated Test User"
//       });

//     expect(res).to.have.status(200);
//     expect(res.body.success).to.be.true;
//     expect(res.body.msg).to.equal("User Profile Updated!!");
//   });


//   it("📩 Should request a password reset email", async () => {
//     const res = await chai.request(server)
//       .post("/users/reset-password-request")
//       .send({
//         email: testEmail
//       });

//     expect(res).to.have.status(200);
//     expect(res.body.message).to.equal("Password reset email sent successfully");

//     // 🔹 Mocking a generated reset token for testing
//     resetToken = jwt.sign({ user_id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
//   });

//   // it("🔑 Should reset the user’s password", async () => {
//   //   const res = await chai.request(server)
//   //     .post("/users/reset-password")
//   //     .send({
//   //       token: resetToken,
//   //       newPassword: "resetpassword123"
//   //     });

//   //   expect(res).to.have.status(200);
//   //   expect(res.body.message).to.equal("Password reset successfully. You can now log in with your new password.");
//   // });

//   // it("🖼 Should upload a profile picture", async () => {
//   //   const res = await chai.request(server)
//   //     .post("/users/upload-pp")
//   //     .set("Authorization", `Bearer ${authToken}`)
//   //     .attach("image", "public/images/avatar.jpg"); // Ensure you have a sample image in the `public` directory

//   //   expect(res).to.have.status(200);
//   //   expect(res.body.success).to.be.true;
//   //   expect(res.body.msg).to.equal("Profile Image Updated!!");
//   // });



//   it("❌ Should prevent unauthorized access to profile", async () => {
//     const res = await chai.request(server)
//       .get("/users/my-profile");

//     expect(res).to.have.status(401);
//     expect(res.body.success).to.be.false;
//   });

 

// });

// after(async () => {
//   server.close(); // Close the server after tests are done
// });
