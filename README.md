# 📅🌳 BFHL Hierarchy Analyzer

---
## ✨ Overview

BFHL Hierarchy Analyzer is a full-stack web application built as part of the Chitkara Full Stack Engineering Challenge. The platform accepts hierarchical node relationships, processes them according to business rules, and provides comprehensive analytics. 

The application consists of a REST API and an interactive frontend. Users can submit node relationships, visualize generated trees, inspect cycle detection results, review invalid entries, and analyze data through a responsive interface.

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
| **Frontend**        | Next.js, TypeScript, React |
| **Styling**         | Tailwind CSS, PostCSS      |
| **Backend**         | Next.js API Routes        |
| **API Testing**     | Postman                   |
| **Deployment**      | Vercel                    |
| **Version Control** | Git & GitHub              |

---

## 📁 Directory Structure

```text
Bajaj-Finserv-FullStack/
├── app/
│   ├── api/
│   │   └── bfhl/
│   │       └── route.ts          # API endpoint handler
│   ├── bfhl/
│   │   └── page.tsx              # BFHL page component
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── components/
│   ├── ui/
│   │   ├── button.tsx            # Button UI component
│   │   └── card.tsx              # Card UI component
│   └── bfhl-form.tsx             # BFHL form component
│
├── lib/
│   ├── bfhl-processor.ts         # Core hierarchy processing logic
│   └── utils.ts                  # Utility functions
│
├── public/
│   ├── apple-icon.png            # Apple favicon
│   ├── icon-dark-32x32.png       # Dark theme icon
│   ├── icon-light-32x32.png      # Light theme icon
│   └── icon.svg                  # SVG icon
│
├── .gitignore                    # Git ignore file
├── components.json               # Component configuration
├── LICENSE                       # MIT License
├── next.config.mjs               # Next.js configuration
├── package.json                  # Project dependencies
├── package-lock.json             # Dependency lock file
├── pnpm-lock.yaml                # PNPM lock file
├── postcss.config.mjs            # PostCSS configuration
├── README.md                     # Project documentation
├── tsconfig.json                 # TypeScript configuration
└── next-env.d.ts                 # Next.js environment types
```

---

## 🚀 API Endpoint

### POST `/api/bfhl`

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

* Node.js (v16 or higher)
* npm or pnpm

### Installation

#### Clone Repository

```bash
git clone https://github.com/Anmol283/Bajaj-Finserv-FullStack.git
cd Bajaj-Finserv-FullStack
```

#### Install Dependencies

```bash
npm install
# or
pnpm install
```

#### Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000

NEXT_PUBLIC_USER_ID=yourname_ddmmyyyy
NEXT_PUBLIC_EMAIL_ID=yourcollegeemail@example.com
NEXT_PUBLIC_COLLEGE_ROLL_NUMBER=your_roll_number
```

#### Run the Application

```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

Development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm start
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
* API integration with `/api/bfhl`
* Tree visualization
* Cycle detection display
* Summary statistics dashboard
* Responsive UI design
* Error handling and validation messages
* Dark/Light theme support

---

## 🌐 Deployment

### Deploy to Vercel

The easiest way to deploy this Next.js app is using Vercel:

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

Visit: https://bajaj-finserv-full-stack-lac.vercel.app

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

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

⭐ **If you found this project useful, consider giving it a star!** ⭐
