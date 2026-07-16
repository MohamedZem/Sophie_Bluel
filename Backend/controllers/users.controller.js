const db = require('./../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = db.users;

exports.signup = async (req, res) => {
	if(!req.body.email || !req.body.password){
		return res.status(400).send({
			message: "Must have email and password"
		});
	}
	try{
		const hash = await bcrypt.hash(req.body.password, 10)
		const user = {
			email: req.body.email,
			password: hash
		}
		await Users.create(user)
		return res.status(201).json({message: 'User Created'})
	}catch (err){
		return res.status(500).send({
			message: err.message
		});
	}

}

exports.login = async (req, res) => {
	const user = await Users.findOne({where: {email: req.body.email}});
	if(user === null){
		return res.status(404).json({message: 'user not found'})
	}else {
		const valid = await bcrypt.compare(req.body.password, user.password)
		if(!valid){
			return res.status(401).json({ error: new Error('Not Authorized') })
		}
		return res.status(200).json({
			userId: user.id,
			token: jwt.sign(
				{userId : user.id},
				process.env.TOKEN_SECRET,
				{ expiresIn: '24h' }
			)
		})

	}
}

exports.changePassword = async (req, res) => {
	const { currentPassword, newPassword } = req.body;

	if (!currentPassword || !newPassword) {
		return res.status(400).json({ message: 'Current password and new password are required' });
	}

	try {
		const user = await Users.findOne({ where: { id: req.auth.userId } });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const valid = await bcrypt.compare(currentPassword, user.password);
		if (!valid) {
			return res.status(401).json({ message: 'Current password is incorrect' });
		}

		const hash = await bcrypt.hash(newPassword, 10);
		await user.update({ password: hash });

		return res.status(200).json({ message: 'Password updated successfully' });
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};
