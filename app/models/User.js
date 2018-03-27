var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var userSchema = mongoose.Schema({
		
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	},

	google: {
		id: {type: String, required: true},
		token: String,
		email: String,
		name: String
	},

	local: {
		username: String,
		password: String,
		fullName: String,
		birthDay: Date,
		phone: String
/*		username: { 
			type: String,
			validate: {
	         	validator: function(value) {
	         		var emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
	            	return emailRegex.test(value);
	          	},
	          	message: 'Email is not valid!'
	        },
			required: true 
		},
		password: { 
			type: String,
			required: true  
		},
		fullName: { 
			type: String,
			required: [ true, "Name is required"]
		},
		birthDay: { 
			type: Date 
		},
		phone: { 
			type: String,
			validate: {
	         	validator: function(value) {
	            	return /^(01[2689]|09|08)\d{8}/.test(value);
	          	},
	          	message: '{VALUE} is not a valid phone number!'
	        },
	        required: true 
		},*/
	},
	

});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);