# Canteen Food Ordering System - Backend

This is the Spring Boot backend built for the Business Canteen Food Ordering System. It includes features for Admins, Vendors, and Employees, with a specialized food recommendation engine based on employee health goals.

---

## 🚀 Prerequisites

Before you start, ensure you have the following installed on your Windows machine:
1. **Java Development Kit (JDK) 17 or higher**
2. **Maven 3.8+** (or use your IDE's built-in Maven)
3. **MySQL Server** (Running locally on port `3306`)
4. **MySQL Workbench** (For viewing the database)
5. **Postman** or **cURL** (To test the API endpoints)

---

## 🛠️ Setup & Configuration

### 1. Database Setup
The application is configured to automatically create the schema if it doesn't exist, but it needs a valid connection.
1. Open **MySQL Workbench**.
2. Connect to your local MySQL server.
3. Verify your root password. 
4. The application expects the username `root` and password `root`. If your MySQL password is different, you **must** update the `src/main/resources/application.properties` file:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_ACTUAL_PASSWORD
   ```

### 2. Running the Application
You can run the application either directly from your IDE (like IntelliJ IDEA, Eclipse, or VS Code) by running the `CanteenApplication.java` main class, or from the terminal using Maven:

Open a Command Prompt or PowerShell in the `canteen-backend` directory and run:
`mvn spring-boot:run`

The server will start on `http://localhost:8080`.
You can verify the database was created by refreshing the schemas in **MySQL Workbench**. You should see `canteen_db` with tables: `users`, `food_items`, and `health_goals`.

---

## 🧪 How to Verify and Test the APIs

You can test the following flows using Postman. The server must be running.

### 1. Predefined Admin
On startup, the system automatically creates a default Admin user:
- **Username:** `admin`
- **Password:** `admin`
*(You can use this user's ID to perform admin actions if needed, though right now the API doesn't enforce JWT auth on the routes).*

### 2. Create Users (Admin Flow)
*We need to create at least one Vendor and one Employee to test the system.*

**Create an Admin:**
- **Method & URL:** `POST http://localhost:8080/api/admin/admins`
- **Body (JSON):**
  ```json
  {
      "username": "super_admin2",
      "password": "password123",
      "fullName": "Secondary Admin"
  }
  ```

**Create a Vendor:**
- **Method & URL:** `POST http://localhost:8080/api/admin/vendors`
- **Body (JSON):**
  ```json
  {
      "username": "vendor_john",
      "password": "password123",
      "fullName": "John's Kitchen"
  }
  ```
  *(Note the returned `"id"` in the response. Let's assume the Vendor ID is `2`)*

**Create an Employee:**
- **Method & URL:** `POST http://localhost:8080/api/admin/users`
- **Body (JSON):**
  ```json
  {
      "username": "emp_alice",
      "password": "password123",
      "role": "EMPLOYEE",
      "fullName": "Alice Smith"
  }
  ```
  *(Note the returned `"id"`. Let's assume the Employee ID is `3`)*

### 3. Add Food Items (Vendor Flow)
*Assume the Vendor ID from above is `2`.*

**Add a healthy salad:**
- **Method & URL:** `POST http://localhost:8080/api/vendor/2/food-items`
- **Body (JSON):**
  ```json
  {
      "name": "Grilled Chicken Salad",
      "description": "Healthy salad with grilled chicken breast",
      "price": 12.50,
      "calories": 350,
      "protein": 35.0,
      "carbohydrates": 15.0,
      "fats": 10.0
  }
  ```

**Add a greasy burger:**
- **Method & URL:** `POST http://localhost:8080/api/vendor/1/food-items`
- **Body (JSON):**
  ```json
  {
      "name": "Double Cheese Burger",
      "description": "Large beef burger with extra cheese and fries",
      "price": 15.00,
      "calories": 1200,
      "protein": 40.0,
      "carbohydrates": 65.0,
      "fats": 55.0
  }
  ```

### 4. Set Health Goals & Get Recommendations (Employee Flow)
*Assume the Employee ID from above is `3`.*

**Set a Weight Loss Goal:**
- **Method & URL:** `POST http://localhost:8080/api/employee/3/health-goal`
- **Body (JSON):**
  ```json
  {
      "goalType": "WEIGHT_LOSS",
      "targetDailyCalories": 2000,
      "targetDailyProtein": 120.0,
      "currentWeight": 85.0,
      "targetWeight": 75.0
  }
  ```

**Get Food Recommendations:**
- **Method & URL:** `GET http://localhost:8080/api/employee/3/recommendations`
- **Expected Result:** The API returns the **Grilled Chicken Salad** and filters out the **Double Cheese Burger**.

### 5. Order Food (Employee Flow)
An employee can log what they eat. Let's assume the **Salad** has `ID = 1`.

- **Method & URL:** `POST http://localhost:8080/api/employee/3/order/1`
- **Expected Result:** A new `ConsumptionLog` is created. Do this a few times to simulate eating multiple meals.

### 6. Admin Reports & Controls
**Generate Nutrition Report for Employee `3`:**
- **Method & URL:** `GET http://localhost:8080/api/admin/reports/nutrition/3`
- **Expected Result:** An aggregated JSON object showing total meals logged, total calories, protein, carbs, and fats consumed by Alice based on her `ConsumptionLog` history.

**Toggle Food Item (Turn Off Food):**
If the Admin notices a food has a low rating, they can disable it. Let's turn off the Burger (assume `ID = 2`).
- **Method & URL:** `PUT http://localhost:8080/api/admin/food-items/2/toggle?isActive=false`
- **Expected Result:** Ensure the food's `isActive` flag is false. It will no longer appear in Employee recommendations or allow new orders!
