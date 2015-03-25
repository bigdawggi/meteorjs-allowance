var Clients = new Mongo.Collection('clients');

if (Meteor.isClient) {

  Template.clients.helpers({
    clients: function() {
      return Clients.find({}, {sort: {name: 1}});
    }
  });

  Template.client.events({
    'click .delete': function(event){
      // var delBtn = event.target;
      Clients.remove(this._id);
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

      Clients.insert({
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

      Clients.update(clientId, {
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
