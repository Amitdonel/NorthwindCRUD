# Northwind Fullstack Product Management App

A fullstack CRUD application to manage products in the classic Northwind database.  
Built with **React (TypeScript)** frontend, **ASP.NET 6 Web API** backend, and **SQL Server** in **Docker**.

---

## 🚀 Features

- 🧾 View, search, and filter products
- ➕ Add new products using dropdowns for categories and suppliers
- ✏️ Update product details with pre-filled forms
- ❌ Delete products with confirmation modals
- 📊 View customer order statistics
- 🔒 Robust error handling on both client and server

---

## 🎁 Bonus Features
- 🔗 Enforce referential integrity: prevent deletion if the product is in any existing order (or cascade removal if implemented)
- 🌗 Switch between Light and Dark themes
- 📤 Export product list to CSV or PDF
- 📝 Form Persistence: draft inputs saved to localStorage, with option to clear
- 🧹 Bulk Actions: select multiple products to delete or toggle status
- 🧪Postman collection to test all API endpoints

---

## ⚠️ Requirements

To run this project locally, make sure you have:

- ✅ [.NET 6 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
- ✅ [Node.js (v18+)](https://nodejs.org/)
- ✅ [Docker Desktop](https://www.docker.com/products/docker-desktop)
- ✅ [SSMS or Azure Data Studio](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
- ✅ [Git](https://git-scm.com/)
- ✅ (Optional) [Postman](https://www.postman.com/downloads/)

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Amitdonel/NorthwindCRUD
cd NorthwindCRUD
```

### 2️⃣ Run SQL Server using Docker

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong!Passw0rd" -p 1433:1433 --name sql_server_northwind -d mcr.microsoft.com/mssql/server:2019-latest
```

> ⚠️ **IMPORTANT**: After running the container, you must import the Northwind SQL schema manually.

To do this:
1. Open **SSMS** or **Azure Data Studio**
2. Connect to `localhost,1433` using:
   - Login: `sa`
   - Password: `YourStrong!Passw0rd`
3. Download the full database script from [here](https://en.wikiversity.org/wiki/Northwind_Database)
4. Run the script to create all tables, data, and stored procedures

---

### 3️⃣ Run the Backend (ASP.NET Web API)

```bash
cd NorthwindAPI
dotnet run
```

- Runs on: https://localhost:7258
- Swagger Docs: https://localhost:7258/swagger

---

### 4️⃣ Run the Frontend (React)

```bash
cd northwind-client
npm install
npm start
```

- Runs on: http://localhost:3000

---

## 📬 Postman Collection (Bonus)

A full **Postman collection** is included in the repo root - NorthwindAPI:  
📁 `Northwind.postman_collection.json`

- Import into Postman to test **all endpoints**
- Run individual or grouped requests (GET, POST, PUT, DELETE)

---

## 📌 API Endpoints Summary

| Method | Endpoint                         | Description              |
|--------|----------------------------------|--------------------------|
| GET    | `/api/product`                   | Get all products         |
| GET    | `/api/product/{id}`              | Get product by ID        |
| POST   | `/api/product/add`               | Add new product          |
| PUT    | `/api/product/update`            | Update product           |
| DELETE | `/api/product/{id}`              | Delete product           |
| GET    | `/api/product/categories`        | Get all categories       |
| GET    | `/api/product/suppliers`         | Get all suppliers        |
| GET    | `/api/product/customer-orders`   | Get customer order stats |

---

## 🔍 Design Choices

- **Repository pattern** for clean separation of concerns
- Used **stored procedures** for better performance and enterprise realism
- **Dark mode support** using CSS variables
- Centralized Axios error handling
- Modularized frontend UI components
- Code is heavily commented and formatted for clarity

---

## 🧠 AI-Generated Acknowledgment

Some sections (especially UI design, CSS structure, and error handling strategy) were co-created with ChatGPT-4 to enhance clarity and maintainability.  
All code was reviewed, validated, and refactored before submission.

---

## 🙋 Author

**Amit Donel**  
3rd Year CS Student 

---
