const { connection, createConnection } = require("../database");

const createStore = async (req, res) => {
  const { name, address, store_number, open, close } = req.body;

  if (!name || !address || !store_number || !open || !close) {
    return res.status(400).json({
      message: "name, address, store_number, open, close are required",
    });
  }

  try {
    const connect = await createConnection();

    const [rows] = await connect.execute(
      "SELECT * FROM store WHERE store_number = ?",
      [store_number]
    );
    if (rows.length > 0) {
      return res.status(400).json({ message: "Store number already exists" });
    }

    await connect.execute(
      "INSERT INTO store (name, address, store_number, open, close) VALUES (?, ?, ?, ?, ?)",
      [name, address, store_number, open, close]
    );

    await connect.end();

    return res
      .status(201)
      .json({ success: true, message: "Store created successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getStore = async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM store");
    res.status(200).json({ success: true, rows });
  } catch (err) {
    console.error("Error retrieving store:", err);
    res.status(500).send("Error retrieving store");
  }
};

const deleteStore = async (req, res) => {
  const storeId = req.params.id;
  const query = "DELETE FROM store WHERE id = ?";

  try {
    const [result] = await connection.execute(query, [storeId]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Store not found");
    }

    res.send(`Store with ID ${storeId} deleted successfully`);
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).send("Error deleting store");
  }
};

const updateStore = async (req, res) => {
  const storeId = req.params.id;
  const { name, address, store_number, open, close } = req.body;
  const query =
    "UPDATE store SET name = ?, address = ?, store_number = ?, open = ?, close = ? WHERE id = ?";

  try {
    const [result] = await connection.execute(query, [
      name,
      address,
      store_number,
      open,
      close,
      storeId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Store not found");
    }

    res.send(`Store with ID ${storeId} updated successfully`);
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).send("Error updating store");
  }
};

module.exports = {
  createStore,
  getStore,
  updateStore,
  deleteStore,
};
