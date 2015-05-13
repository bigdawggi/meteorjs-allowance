var Clients = new Mongo.Collection('clients');

if (Meteor.isClient) {
  Template.registerHelper('isAdmin', function(){
    return Meteor.isAdmin();
  });

  Template.clients.helpers({
    clients: function() {
      return Clients.find({}, {sort: {name: 1}});
    }
  });

  Template.client.events({
    'click .delete': function(event){
      // var delBtn = event.target;
      if(confirm('Are you sure you want to delete this user?')){
        Meteor.call('deleteClient', this._id);
      }
    },
    'click .edit': function(event){
      var editBtn = $(event.target),
          editForm = $('#edit-client'),
          clientRow = $('#client-' + this._id);
      clientRow.css('color', 'grey');
      clientRow.find('button').attr('disabled', 'disabled');
      editForm.find('input[name="clientId"]').val(this._id);
      editForm.find('input[name="newname"]').val(this.name);
      editForm.find('input[name="newmoney"]').val(this.money);
      editForm.show();
    },
  });

  Template.addNew.events({
    'click #show-add-new-client-form': function(event){
      $('#add-new-client').show();
      $('#show-add-new-client-form').hide();
    },
    'submit': function(event) {
      var form = event.target,
          nameInput = form.name;
          moneyInput = form.money

      Meteor.call('addClient', {
        name: nameInput.value,
        money: moneyInput.value
      });

      nameInput.value = "";
      moneyInput.value = "";
      $('#add-new-client').hide();
      $('#show-add-new-client-form').show();
      return false;
    }
  });

  Template.editClient.events({
    'submit #edit-client': function(event){
      var form = event.target,
          newName = form.newname,
          newMoney = form.newmoney,
          clientId = form.clientId.value,
          $form = $(form);

      Meteor.call('updateClient', {
        id: clientId,
        name: newName.value,
        money: newMoney.value
      });

      form.reset();
      var clientRow = $('#client-' + clientId);
      clientRow.find('.hide-when-edit').show();
      clientRow.css('color', '');
      clientRow.find('button').removeAttr('disabled');

      $form.hide();
      return false;
    }
  });


  // At the bottom of the client code
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Meteor.isAdmin = function() {
  var r = false;
  if ( Meteor.userId() ) {
    if ( Meteor.user() ) {
      var username = Meteor.user().username;
      r = _.contains(['bigdawggi','ann'], username);
    }
  }
  return r;
}
Meteor.methods({
  addClient: function (details) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.isAdmin()) {
      throw new Meteor.Error("not-authenticated");
    }

    Clients.insert({
      name: details.name,
      money: details.money,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteClient: function (clientId) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.isAdmin()) {
      throw new Meteor.Error("not-authenticated");
    }
    Clients.remove(clientId);
  },
  updateClient: function( details ) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.isAdmin()) {
      throw new Meteor.Error("not-authenticated");
    }
    Clients.update(details.id, {
      name: details.name,
      money: details.money
    });
  }
});
