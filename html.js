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
      var editBtn = $(event.target);
      editBtn.parent().siblings('.name-holder').hide();
      editBtn.parent().siblings('.name-edit').show();
    },
    'submit .edit-name': function(event){
      var form = event.target,
          newName = form.newname,
          newMoney = form.newmoney,
          $form = $(form);
      Clients.update(this._id, {
        name: newName.value,
        money: newMoney.value
      });
      $form.parent().siblings('.name-holder').show();
      $form.parent().hide();
      return false;
    }
  })

  Template.addNew.events({
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
      return false;
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
