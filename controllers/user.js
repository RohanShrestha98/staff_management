const bcrypt = require("bcrypt");
const { connection, createConnection } = require("../database");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "username, email, and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const connect = await createConnection();

    const [rows] = await connect.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await connect.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    await connect.end();

    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "email, and password are required" });
  }
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const userData = rows?.[0];
    const comparePassword = await bcrypt.compareSync(
      password,
      userData?.password
    );
    if (comparePassword) {
      const data = {
        id: userData?.id,
        email: userData?.email,
        username: userData?.username,
      };
      const accessToken = jwt.sign(
        {
          user: data,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3000s" }
      );
      res.status(200).json({
        accessToken,
        success: true,
        data,
      });
    }
  } catch (err) {
    console.error("Failed to login", err);
    res.status(500).send("Failed to login");
  }
};

const getUsers = async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT id, username, email FROM users"
    );
    console.log("rows", rows);
    res.status(200).json({ success: true, rows });
  } catch (err) {
    console.error("Error retrieving users:", err);
    res.status(500).send("Error retrieving users");
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const query = "DELETE FROM users WHERE id = ?";

  try {
    const [result] = await connection.execute(query, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).send("User not found");
    }

    res.send(`User with ID ${userId} deleted successfully`);
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).send("Error deleting user");
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;
  const query = "UPDATE users SET username = ?, email = ? WHERE id = ?";

  try {
    const [result] = await connection.execute(query, [username, email, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).send("User not found");
    }

    res.send(`User with ID ${userId} updated successfully`);
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).send("Error updating user");
  }
};

module.exports = {
  signUp,
  login,
  getUsers,
  updateUser,
  deleteUser,
};
