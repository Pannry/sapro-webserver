module.exports = (app) => {
  const turmas = {

    get: (req, res, next) => {
      if (req.user.tipo === 'professor') {
        const entrada = req.user.id;

        const ejs = {
          user: req.user,
          page_name: req.path,
          accountType: req.user.tipo,
        };

        const conexaoDb = app.infra.banco.dbConnection();
        const salaDAO = new app.infra.banco.SalaDAO(conexaoDb);

        salaDAO.salasDoProfessor(entrada, (err, resultado) => {
          if (err) throw err;
          ejs.listaSala = resultado;
          res.render('professor/perfil/turmas/turmas', ejs);
        });

        conexaoDb.end();
      } else next();
    },
  };

  return turmas;
};
