const router = require("express").Router();

module.exports = db => {

  router.put("/prompts/:id", (request, response) => {
    db.query(`
      INSERT INTO prompts (info)
      VALUES 
        (
          '{ "drawings": $1 }
        )
    `, [request.drawing])
  });

  return router;
};