const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    // Si hay una sesión activa (el usuario está autenticado), redirigir a /auth/main
    return res.redirect('/auth/main');
  }
  // Si no hay una sesión activa, continuar con el siguiente middleware
  next();
};

  
  module.exports = {
  isAuthenticated,
  };
  