import pool from "../config/db.js";

export const createStudent = async (req, res, next) => {
  try {
    const { name, age, city } = req.body;
    if (!name || !age || !city) {
      return res.status(401).json({
        success: false,
        message: "All fields required",
      });
    }
    let photo = null;
    if (req.files?.photo) {
      const file = req.files.photo;
      photo = Date.now() + "_" + file.name;
      await file.mv("./uploads/" + photo);
    }
    const [result] = await pool.execute(`INSERT INTO students (name, age, city, photo) VALUES (?,?,?,?)`,[name, age, city, photo]);
    res.status(201).json({
      success: true,
      studentId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudents = async (req, res, next) => {
  try {
    let { page = 1, limit = 5, city = "", sort = "id" } = req.query;
    const offset = (page - 1) * limit;
    let query = "SELECT * FROM students";
    let values= [];
    if(city){
        query += " WHERE city=?";
        values.push(city);
    }
    query += ` ORDER BY ${sort} LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
    // values.push(Number(limit), Number(offset));
    const [students] = await pool.execute(query, values);
    res.json({
        success: true,
        data: students
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {name, age, city} = req.body;
        await pool.execute(`UPDATE students SET name=?, age=?, city=? WHERE id=?`, [name, age, city, id]);
        res.json({
            success: true,
            message: "Student Updated"
        });
    } catch (error) {
        next(error);
    }
};

export const deleteStudent = async (req, res, next) => {
    try {
        const {id} = req.params;
        await pool.execute("DELETE FROM students WHERE id=?", [id]);
        res.json({
            success: true,
            message: "Student Deleted"
        });
    } catch (error) {
        next(error);
    }
};
