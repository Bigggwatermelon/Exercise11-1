// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Student = require('./models/Student'); 

const app = express();
// 使用環境變數或預設 3000
const PORT = process.env.PORT || 3000; 

// Render 會在環境變數中設定 MONGODB_URI
// MONGODB_URI 將在步驟 4.3 中設定，以保持程式碼乾淨
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB 連接成功！'))
    .catch(err => {
        console.error('MongoDB 連接失敗:', err.message);
    });

// 中介軟體設定
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// --- API 路由實作 ---

// GET /students: 返回所有學生列表 [cite: 25]
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find({}); 
        res.json(students); 
    } catch (err) {
        res.status(500).json({ message: '無法取得學生資料' }); 
    }
});

// POST /students: 新增一個新學生 [cite: 26]
app.post('/students', async (req, res) => {
    const { name, age, grade } = req.body; 

    if (!name || !age || !grade) {
        return res.status(400).json({ message: '缺少必要的學生資訊' });
    }

    try {
        const newStudent = new Student({
            name,
            age: parseInt(age), 
            grade
        });

        const savedStudent = await newStudent.save(); 
        res.status(201).json(savedStudent); 
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`伺服器正在 port ${PORT} 運行`);
});
