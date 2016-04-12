Parameters = new Mongo.Collection('parameters');

Parameters.allow({
  insert: function(userId, parameter) {
    return true;
  },
  update: function(userId, parameter, fields, modifier) {
    return true;
  },
  remove: function(userId, parameter) {
    return true;
  }
});

Parameters.after.update(function (userId, parameter, fieldNames, modifier, options) {
  if(fieldNames[0] == 'values'){
    Object.keys(parameter.values).length > 59 ? Parameters.update({_id:parameter._id},{$pop:{values:-1}}) : null;
  }
}, {fetchPrevious: false});
