// Hide & Show Button on Page 1
function hideShow() {
    var x = document.getElementById("hideshow");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

// Scroll to elements on Page 2
function scrollToAnchor(aid){
    var aTag = $("a[name='"+ aid +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}

$("#meth1").click(function() {
   scrollToAnchor('metho1');
});

$("#meth2").click(function() {
   scrollToAnchor('metho2');
});


Backbone.Model.prototype.idAttribute = '_id';

// Backbone Model
var ContactList = Backbone.Model.extend({
	defaults: {
		name: '',
		phone: '',
		email: ''
	}
});

// Backbone Collection ("array" of contacts)
var Contacts = Backbone.Collection.extend({
	url: 'http://localhost:3000/contacts'
});

// instantiate two Contacts
/*var contact1 = new ContactList({
	name: 'Michael Sky',
	phone: '416-555-5555',
	email: 'michael_sky@gmail.com'
});

var contact2 = new ContactList({
	name: 'John Doe',
	phone: '555-555-5555',
	email: 'johndoe@hotmail.com
});*/

// instantiate a Collection
var contacts = new Contacts([]);

// Views

// Backbone View for one contact
var ContactView = Backbone.View.extend({
	model: new ContactList(),
	tagName: 'tr', // individual rows
	initialize: function() {
		this.template = _.template($('.contacts-list-template').html());
	},
	events: {
		'click .edit-contact': 'edit',
		'click .update-contact': 'update',
		'click .cancel': 'cancel',
		'click .delete-contact': 'delete'
	},
	edit: function() {
		$('.edit-contact').hide();
		$('.delete-contact').hide();
		this.$('.update-contact').show();
		this.$('.cancel').show();

		var name = this.$('.name').html();
		var phone = this.$('.phone').html();
		var email = this.$('.email').html();

		this.$('.name').html('<input type="text" class="form-control name-update" value="' + name + '">');
		this.$('.phone').html('<input type="text" class="form-control phone-update" value="' + phone + '">');
		this.$('.email').html('<input type="text" class="form-control email-update" value="' + email + '">');
	},
	update: function() {
		this.model.set('name', $('.name-update').val());
		this.model.set('phone', $('.phone-update').val());
		this.model.set('email', $('.email-update').val());

		this.model.save(null, {
			success: function(response) {
				console.log('Successfully UPDATED contact with _id: ' + response.toJSON()._id);
			},
			error: function(err) {
				console.log('Failed to update contact!');
			}
		});
	},
	cancel: function() {
		contactsView.render();
	},
	delete: function() {
		this.model.destroy({
			success: function(response) {
				console.log('Successfully DELETED contact with _id: ' + response.toJSON()._id);
			},
			error: function(err) {
				console.log('Failed to delete contact!');
			}
		});
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

// Backbone View for all contacts
var ContactsView = Backbone.View.extend({
	model: contacts,
	el: $('.contacts-list'),
	initialize: function() {
		var self = this;
		this.model.on('add', this.render, this);
		this.model.on('change', function() {
			setTimeout(function() {
				self.render();
			}, 30);
		},this);
		this.model.on('remove', this.render, this);

		this.model.fetch({
			success: function(response) {
				_.each(response.toJSON(), function(item) {
					console.log('Successfully GOT contact with _id: ' + item._id);
				})
			},
			error: function() {
				console.log('Failed to get contacts!');
			}
		});
	},
	render: function() {
		var self = this;
		this.$el.html('');
		_.each(this.model.toArray(), function(contact) {
			self.$el.append((new ContactView({model: contact})).render().$el);
		});
		return this;
	}
});

var contactsView = new ContactsView();

$(document).ready(function() {
	$('.add-contact').on('click', function() {
		var contact = new ContactList({
			name: $('.name-input').val(),
			phone: $('.phone-input').val(),
			email: $('.email-input').val()
		});
		$('.name-input').val('');
		$('.phone-input').val('');
		$('.email-input').val('');
		contacts.add(contact);
		contact.save(null, {
			success: function(response) {
				console.log('Successfully SAVED contact with _id: ' + response.toJSON()._id);
			},
			error: function() {
				console.log('Failed to save contact!');
			}
		});
	});
})