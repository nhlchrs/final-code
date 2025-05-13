import { Request, Response } from "express";
import Users from "../models/user.models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
console.log("Auth controller loaded", process.env.JWT_SECRET_KEY);
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, lname, email, password } = req.body;
    if (!name || !lname || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await Users.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      name,
      lname,
      email: normalizedEmail,
      password: hashPassword,
    });

    await newUser.save();

    res.status(200).json({
      message: "User registered successfully",
      status: 1,
      user: {
        name: newUser.name,
        lname: newUser.lname,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existing = await Users.findOne({ email });

    if (!existing) {
      res.status(500).json({ message: "User does not exist", status : 0, });

      return;
    }

    const isMatch = await bcrypt.compare(password, existing.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      {
        name: existing.name,
        email: existing.email,
        id: existing._id,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      status : 1,
      token,
      user: {
        name: existing.name,
        lname: existing.lname,
        email: existing.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
