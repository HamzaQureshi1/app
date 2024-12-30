import { hashSync, compareSync } from "bcrypt";
import { BadRequestsException } from "../exceptions/bad-request.js";
import { Validation } from "../exceptions/validation.js";
import { ErrorCodes } from "../exceptions/root.js";
import { SignUpSchema } from '../schema/users.js';
import  jwt from 'jsonwebtoken'
const { sign, verify } = jwt;
import sqlite3 from 'sqlite3';
const isProduction = process.env.NODE_ENV === "production";

const db = new sqlite3.Database("./your_database.sqlite", (err) => {
  if (err) {
      console.error("Error connecting to SQLite database:", err.message);
  } else {
      console.log("Connected to SQLite database.");
  }
});

// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const query = `SELECT * FROM users WHERE email = '${email}'`;

//     db.get(query, (err, user) => {
//       if (err) {
//         console.error('Database error:', err.message);
//         return res.status(500).json({
//           message: 'Database error',
//           code: 'DB_ERROR',
//         });
//       }

//       if (!user) {
//         return res.status(404).json({
//           message: 'User not found',
//           code: 'USER_NOT_FOUND',
//         });
//       }

//       res.cookie("token", token, {
//       httpOnly: true,
//       secure: isProduction,
//       sameSite: isProduction ? "None" : "Lax",
//       expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)),
//     });

//       res.json({
//         user: { id: user.id, email: user.email }
//       });
//     });
//   } catch (error) {
//     return res.status(500)
//   }
// };








// export const signup = async (req, res, next) => {
//     try {
//         // Validate input using your schema
//         SignUpSchema.parse(req.body);
//     } catch (error) {
//         throw new Validation(
//             error?.issues,
//             'Unprocessable entity',
//             ErrorCodes.UNPROCESSABLE_ENTITY
//         );
//     }

//     const { email, password, name } = req.body;

//     // Check if the user already exists
//     db.get('SELECT * FROM user WHERE email = ${email}', (err, user) => {
//         if (err) {
//             console.error('Database error:', err.message);
//             return next(err);
//         }

//         if (user) {
//             // Throw an exception if the user already exists
//             return next(
//                 new BadRequestsException(
//                     'User already exists',
//                     ErrorCodes.USER_ALREADY_EXISTS
//                 )
//             );
//         }

//         // Hash the password
//         const hashedPassword = hashSync(password, 10);

//         // Insert the new user into the database
//         const query = `
//             INSERT INTO user (fullName, email, password)
//             VALUES (?, ?, ?)
//         `;

//         db.run(query, [name, email, hashedPassword], function (err) {
//             if (err) {
//                 console.error('Database error:', err.message);
//                 return next(err);
//             }

//             // Respond with the created user
//             res.json({
//                 id: this.lastID, // ID of the newly inserted user
//                 fullName: name,
//                 email,
//             });
//         });
//     });
// };





// export const login = async (req, res, next) =>{
//     try{
//     const {email, password, name} = req.body;
    
//     let user = await prismaClient.user.findFirst({where: {email}})
  
//     if (!user) {
//         return res.status(404).json({ message: "User not found", code: "USER_NOT_FOUND" });
//       }
  
//       if (!compareSync(password, user.password)) {
//         return res.status(401).json({ message: "Credentials not recognised.", code: "INCORRECT_PASSWORD" });
//       }

//     const token = jwt.sign({
//         id: user.id
//     },JWT_SECRET)

//     const maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days

//   res.cookie("token", token, {

//     httpOnly: true,
//     secure: isProduction,
//     sameSite: isProduction ? "None" : "Lax",
//     expires: new Date(Date.now() + maxAge),
//   });

//       res.json({user, token})
     
//     } catch (error) {
//         console.error("Error during login:", error);
    
//         // Handle unexpected errors
//         return res.status(500).json({
//           message: "An unexpected error occurred",
//           code: "INTERNAL_SERVER_ERROR",
//         });
//       }}





//     export const me = async (req, res, next) =>{
  
        
//         res.json(req.user)
//         } 





//     export const logout = async (req, res, next) => {
        
//         res.cookie("token", "", {

//             httpOnly: true,
//             secure: isProduction,
//             sameSite: isProduction ? "None" : "Lax",
//             expires: new Date(0),
//           });
//           res.status(200).json({ message: "Logged out successfully" })
  
//         }



// export const login = async (req, res, next) => {
  

//   const { email, password, name } = req.body;

//   // Insecure query: directly interpolates user input into the SQL query
//   const checkUserQuery = `SELECT * FROM user WHERE email = '${email}' LIMIT 1`;
//   db.get(checkUserQuery, (err, user) => {
//       if (err) {
//           console.error('Database error:', err.message);
//           return res.status(500).json({ message: 'Database error', code: 'DB_ERROR' });
//       }

 

//       if (user) {
//           // User already exists
//           return res.status(400).json({
//               message: 'User already exists',
//               code: 'USER_ALREADY_EXISTS',
//           });
//       }


//       // Hash the password (still secure hashing, but irrelevant if SQL injection is possible)
//       const hashedPassword = hashSync(password, 10);

//       // Insecure insertion query
//       const insertQuery = `
//           INSERT INTO user (fullName, email, password)
//           VALUES ('${name}', '${email}', '${hashedPassword}')
//       `;
//       db.run(insertQuery, function (err) {
//           if (err) {
//               console.error('Database error:', err.message);
//               return res.status(500).json({ message: 'Database error', code: 'DB_ERROR' });
//           }
//           console.log(email, "email")
//           // Respond with the created user
//           res.status(201).json({
//               id: this.lastID, // ID of the newly inserted user
//               fullName: name,
//               email,
//           });
//       });
//   });
// };

// export const login = async (req, res, next) => {
//   try {

//     console.log('inside login')
//       const { email, password } = req.body;

//       // Insecure query: directly interpolates user input into the SQL query
//       const query = `SELECT * FROM user WHERE email = '${email}'`;

//       db.post(query, (err, user) => {
//           if (err) {
//               console.error('Database error:', err.message);
//               return res.status(500).json({
//                   message: 'Database error',
//                   code: 'DB_ERROR',
//               });
//           }
//           const maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days

//           // Set the token in an HTTP-only cookie
//           // res.cookie('token', token, {
//           //     httpOnly: true,
//           //     secure: isProduction,
//           //     sameSite: isProduction ? 'None' : 'Lax',
//           //     expires: new Date(Date.now() + maxAge),
//           // });

//           res.json('{ user: { id: user.id, email: user.email }, token }');
//       });
//   } catch (error) {
//       console.error('Error during login:', error);

//       // Handle unexpected errors
//       return res.status(500).json({
//           message: 'An unexpected error occurred',
//           code: 'INTERNAL_SERVER_ERROR',
//       });
//   }
// };