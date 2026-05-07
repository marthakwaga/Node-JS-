const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');   
};

//Checks if a logged in user is a manager
const isManager = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'manager') {
      return next();
    }
    res.status(403).send('Access denied: You are not a manager.');
};

//Checks if a logged in user is admin
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    res.status(403).send('Access denied: You are not an admin.');
};
//Checks if a logged in user is an attendant
const isAttendant = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'attendant') {
      return next();
    }
    res.status(403).send('Access denied: You are not an attendant.');
};

const isManagerOrAdmin = (req, res, next) => {
    if (req.isAuthenticated() && (req.user.role === 'manager' || req.user.role === 'admin')) {
      return next();
    } res.status(403).send('Access denied: You are not authorized to access this resource.');
}
  const isAttendantOrAdmin = (req, res, next) => {
    if (req.isAuthenticated() && (req.user.role === 'attendant' || req.user.role === 'admin')) {
      return next();
    }
    res.status(403).send('Access denied: You are not authorized to access this resource.');
};

module.exports = {isAuthenticated, isManager, isAdmin, isAttendant, isManagerOrAdmin, isAttendantOrAdmin}