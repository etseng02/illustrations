/*
CREATE A NEW ROW IN THE ROOM DATABASE
`
INSERT INTO rooms (code)
VALUES ($1)
`, [props.code]

the props element is the request to the database

*/

const router = require("express").Router();

module.exports = db => {

  router.put("/prompts/:id", (request, response) => {
    db.query(`
      INSERT INTO rooms (code)
      VALUES 
        ($1)
    `, [request.code])
  });

  return router;
};