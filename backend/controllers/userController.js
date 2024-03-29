import AsyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

//@ desc  Auth user & get token
//@ route POST /api/user/login
//@ access Public

const authUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

//@ desc  REgister a new user
//@ route POST /api/users
//@ access Public

const registerUser = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name) {
    res.status(400)
    throw new Error('Name is Required')
  }

  if (!email) {
    res.status(400)
    throw new Error('Email is Required')
  }

  if (!password) {
    res.status(400)
    throw new Error('Password is Required')
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

//@ desc  Get user profile
//@ route GET /api/user/profile
//@ access Private

const getUserProfile = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//@ desc  Update user profile
//@ route PUT /api/user/profile
//@ access Private

const updateUserProfile = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  console.log(user)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updateUser = await user.save()

    res.json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
      token: generateToken(updateUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//@ desc  Get all users
//@ route GET /api/user
//@ access Private/Admin

const getUsers = AsyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

//@ desc  Delete user
//@ route DELETE /api/user/:id
//@ access Private/Admin

const deleteUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//@ desc  Get user by ID
//@ route GET /api/user/:id
//@ access Private/Admin

const getUsersById = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//@ desc  Update
//@ route PUT /api/user/:id
//@ access Private/Admin

const updateUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin === true ? true : false

    const updateUser = await user.save()

    res.json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUsersById,
  updateUser,
}
