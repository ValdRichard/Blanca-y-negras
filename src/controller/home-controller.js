module.exports = {
  home: function (req, res) {
    res.render("index");
  },
  juego: function (req, res) {
    res.render("juego");
  },
  sala: function (req, res) {
    res.render("sala");
  },
};
