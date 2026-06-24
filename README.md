# 📅🌳 BFHL Hierarchy Analyzer

---
## ✨ Overview

BFHL Hierarchy Analyzer is a full-stack web application built as part of the Chitkara Full Stack Engineering Challenge. The platform accepts hierarchical node relationships, processes them according to predefined rules, detects cycles, removes duplicates, validates inputs, and returns structured hierarchy insights.

The application consists of a REST API and an interactive frontend. Users can submit node relationships, visualize generated trees, inspect cycle detection results, review invalid entries, and analyze summary statistics through a clean and responsive interface.

The solution is designed with performance, scalability, and maintainability in mind, ensuring responses remain fast even for larger datasets.

---

## 🌟 Features

### 🔗 Hierarchy Processing

* Accepts hierarchical relationships in `X->Y` format
* Supports multiple independent trees
* Automatically identifies root nodes
* Generates nested hierarchy structures

### 🔄 Cycle Detection

* Detects cyclic relationships
* Marks cyclic groups separately
* Prevents invalid tree generation

### ✅ Data Validation

* Validates node format (`A->B`)
* Rejects malformed entries
* Detects self-loops
* Trims unnecessary whitespace

### 📋 Duplicate Handling

* Detects duplicate edges
* Preserves only the first occurrence
* Returns duplicate entries separately

### 📊 Analytics & Summary

* Total valid trees count
* Total cyclic groups count
* Largest tree root identification
* Tree depth calculation

### 🎨 Interactive Frontend

* User-friendly input interface
* Structured response visualization
* Error handling and validation messages
* Responsive design

---

## 🛠️ Tech Stack

| Category            | Technologies              |
| ------------------- | ------------------------- |
| **Backend**         | Node.js, Express.js       |
| **Frontend**        | HTML, CSS, JavaScript     |
| **API Testing**     | Postman                   |
| **Deployment**      | Render / Railway / Vercel |
| **Version Control** | Git & GitHub              |

---

## 📁 Directory Structure

```text
BFHL-Hierarchy-Analyzer/
├── backend/
│   ├── controllers/
│   │   └── hierarchyController.js
│   ├── routes/
│   │   └── bfhlRoutes.js
│   ├── utils/
│   │   ├── validator.js
│   │   ├── treeBuilder.js
│   │   └── cycleDetector.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── index.html
│   └── assets/
│
├── README.md
├── .gitignore
└── package.json
```

---

## 🚀 API Endpoint

### POST `/bfhl`

#### Request Body

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

#### Sample Response

```json
{
  "user_id": "yourname_ddmmyyyy",
  "email_id": "yourcollegeemail@example.com",
  "college_roll_number": "your_roll_number",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": {
            "D": {}
          },
          "C": {}
        }
      },
      "depth": 3
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js
* npm

### Installation

#### Clone Repository

```bash
git clone https://github.com/yourusername/BFHL-Hierarchy-Analyzer.git
cd BFHL-Hierarchy-Analyzer
```

#### Install Dependencies

```bash
npm install
```

#### Configure Environment Variables

Create a `.env` file:

```env
PORT=3000

USER_ID=yourname_ddmmyyyy
EMAIL_ID=yourcollegeemail@example.com
COLLEGE_ROLL_NUMBER=your_roll_number
```

#### Run the Application

```bash
npm start
```

Development mode:

```bash
npm run dev
```

---

## 🔍 Processing Rules Implemented

* Validates node format `X->Y`
* Rejects self-loops (`A->A`)
* Removes duplicate edges
* Handles multi-parent conflicts
* Detects cyclic structures
* Builds nested tree hierarchies
* Calculates maximum depth
* Generates summary statistics

---

## 🎨 Frontend Features

* Input area for node relationships
* API integration with `/bfhl`
* Tree visualization
* Cycle detection display
* Summary statistics dashboard
* Responsive UI design
* Error handling

---

## 🌐 Deployment

### Backend

Deploy using:

* Render
* Railway
* Vercel
* AWS

### Frontend

Deploy using:

* Vercel
* Netlify
* GitHub Pages

---

## 📈 Performance

* Handles up to 50 node relationships efficiently
* Optimized graph traversal algorithms
* Response time under 3 seconds
* CORS enabled for cross-origin requests

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-branch
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push changes

```bash
git push origin feature-branch
```

5. Create a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

⭐ **If you found this project useful, consider giving it a star!** ⭐
