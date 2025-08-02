Here's a detailed breakdown of **use cases for each table** in your `bus_tracker_db` PostgreSQL database. These use cases describe how your backend API and frontend app will utilize each table in real-world scenarios.

---

## 🧩 TABLE-WISE USE CASES

---

### ✅ 1. `users` Table

Stores details of **students, staff, and admins** who access the app.

#### 📌 Use Cases:

* User **registration** and **login**
* Role-based access: student vs. admin
* Retrieve profile info
* Send notifications to a user
* Display user-specific notifications or settings

---

### ✅ 2. `buses` Table

Stores metadata for each **college bus**.

#### 📌 Use Cases:

* Show bus number, driver name, and route in app
* Admin can **add/edit** bus details
* Students select a specific bus to track
* Link a bus to its current route
* Enable/disable buses (`is_active` flag)

---

### ✅ 3. `routes` Table

Defines different **routes** that buses follow.

#### 📌 Use Cases:

* Assign routes to buses
* Students can view all available routes
* Admin can create/edit routes
* Associate a list of stops to each route

---

### ✅ 4. `stops` Table

Stores all **bus stops** for each route in sequential order.

#### 📌 Use Cases:

* Show stop names and locations on the map (e.g., “Hostel”, “Library”)
* Display **ordered stops** when a student selects a route
* Calculate ETA for a bus reaching a specific stop
* Admin can add or update stops on a route

---

### ✅ 5. `bus_locations` Table

Stores **real-time GPS coordinates** received from ESP32 + GPS module.

#### 📌 Use Cases:

* Update and store real-time bus locations every few seconds
* Query the **latest bus location** for tracking
* Track **historical routes** driven by a bus
* Plot location markers and movement on the app's map
* Detect **bus delays** based on timestamp differences

---

### ✅ 6. `notifications` Table

Stores system-generated messages or **push notifications** for users.

#### 📌 Use Cases:

* Send notifications to students:

  * “Bus 5 is 5 minutes away”
  * “Bus 12 is delayed due to traffic”
* Allow students to view notification history
* Mark notifications as seen/unseen
* Admin panel to broadcast messages to selected users

---

## 🎯 Example Real-Life Flow (Combining Use Cases)

**Scenario: A student opens the app to check their bus**

1. The app uses `/login` to authenticate the user (`users`).
2. Shows a list of available buses from the `buses` table.
3. When a bus is selected, it fetches the assigned `route_id` from the `buses` table.
4. Loads stops for that route from the `stops` table.
5. Shows live bus position using the latest entry from `bus_locations`.
6. Calculates ETA to next stop.
7. Pushes notifications from `notifications` table (if any).

---

Would you like **ER Diagram** visuals or a **complete UML use case diagram** for this system?
