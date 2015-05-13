module.exports = {
  createError: function(status, errorMessage){
    return {status: status, message: errorMessage};
  },

  respondWith: function(res, error) {
    res.status(error.status);
    res.json(error);
  }

};
