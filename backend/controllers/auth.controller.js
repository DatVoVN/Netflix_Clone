import { User } from "../models/user.model.js"
import bycryptjs from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generateToken.js"
export async function signup(req, res) {
  try {
    const { email, password, username } = req.body
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" })
    }
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" })
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      })
    }
    const existingUserByEmail = await User.findOne({ email: email })
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      })
    }
    const existingUserByUsername = await User.findOne({ username: username })
    if (existingUserByUsername) {
      return res.status(400).json({
        success: false,
        message: "UserName already exists",
      })
    }
    const salt = await bycryptjs.genSalt(10)
    const hashedPassword = await bycryptjs.hash(password, salt)
    const PROFILE_PICS = [
      "../assets/avatar1.png",
      "../assets/avatar2.png",
      "../assets/avatar3.png",
    ]
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)]
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image,
    })
    generateTokenAndSetCookie(newUser._id, res)
    await newUser.save()
    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        password: "",
      },
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success: false, massage: "Internal server error" })
  }
}
export async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" })
    }
    const user = await User.findOne({ email: email })
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" })
    }
    const isPasswordCorrect = await bycryptjs.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" })
    }
    generateTokenAndSetCookie(user._id, res)
    res.status(201).json({
      success: true,
      user: {
        ...user._doc,
        password: "",
      },
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success: false, massage: "Internal server error" })
  }
}
export async function logout(req, res) {
  try {
    res.clearCookie("jwt-netflix")
    res.status(200).json({ success: true, message: "Logged out successfully" })
  } catch (error) {
    console.log(error.massage)
    res.status(500).json({ success: false, massage: "Internal server error" })
  }
}
