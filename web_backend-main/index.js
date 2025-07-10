// const { initializeApp } = require('./server');

// async function startServer() {
//   try {
//     const app = await initializeApp();

//     const port = process.env.PORT || 8000;
//     app.set('PORT', port);

//     app.listen(port, () => {
//       console.log(`App listening on port ${port}`);
//     });
//   } catch (error) {
//     console.error('Error starting server:', error);
//     process.exit(1);
//   }
// }

// startServer();

const { initializeApp } = require('./server');

async function startServer() {
  try {
    const app = await initializeApp(); // Make sure it returns the express app

    const port = process.env.PORT || 8000;
    
    // Instead of app.set('PORT', port), you can directly pass the port to app.listen
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
