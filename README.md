# Online-Banking-System
- Developed using following languages/technologies:
  - Database: MongoDB
  - Framework: ExpressJS
  - FrontEnd: HTML & CSS
  - BackEnd: NodeJS
- Software Required:
  - Visual Studio Code : https://code.visualstudio.com/
  - NodeJS : https://nodejs.org/en/

- Usage: (For more details information, check the "Setup.txt" file)
  - Clone/download the project files from "dev" branch of this repository
  - Install node modules (Dependencies & Dev-dependencies) using following commands:
    - $ **npm i body-parser dotenv ejs express mongoopse nodemon --save**
    - $ **npm i axios bcrypt connect-flash express-ejs-layouts express-session method-override passport passport-local path router --save**
  - Open "server/config/keys.js" and add your MongoDB URI, local or Atlas for connecting to your database
  - Now you are ready to run this application using command: $  **node app.js** OR **npm run devStart**
  - Visit http://localhost:3000/ in your browser to use this application

- Features:
  - Admin Role Features:
    - Authenticated & validated login
    - Allows to add, update, view, and delete a user/customer with proper validation.
     - Depositing money to the account as well as transacting funds to user's accounts.
    - Keeping records of successful & failed transactions and flashing these records accordingly to the user's A/c statement.
  - User Role Features:
    - Authenticated & validated login, so only registered users can log in to their respective accounts
    - Interactive Dashboard.
    - Viewing profile details as well as updating some field data.
    - Allows transacting funds between registered users & checking transaction records.
