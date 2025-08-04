Here is the **PostgreSQL schema documentation** for your `bus_tracker_db` database based on the output you've provided:

---

## 🗂️ Database: `bus_tracker_db`

---

### 1. **Table: `users`**

Stores information about users of the bus tracking system.

| Column         | Type           | Constraints                                                   |
| -------------- | -------------- | ------------------------------------------------------------- |
| user\_id       | `integer`      | Primary key, auto-incremented                                 |
| name           | `varchar(100)` | Not null                                                      |
| email          | `varchar(100)` | Not null, unique                                              |
| password\_hash | `text`         | Not null                                                      |
| role           | `varchar(10)`  | Not null, check constraint: `'student'`, `'staff'`, `'admin'` |
| created\_at    | `timestamp`    | Default: `CURRENT_TIMESTAMP`                                  |

**Referenced by**:

* `notifications(user_id)`

---

### 2. **Table: `notifications`**

Stores messages sent to users (e.g., alerts, updates).

| Column           | Type        | Constraints                    |
| ---------------- | ----------- | ------------------------------ |
| notification\_id | `integer`   | Primary key, auto-incremented  |
| user\_id         | `integer`   | Foreign key → `users(user_id)` |
| title            | `text`      |                                |
| message          | `text`      |                                |
| seen             | `boolean`   | Default: `false`               |
| sent\_at         | `timestamp` | Default: `CURRENT_TIMESTAMP`   |

---

### 3. **Table: `routes`**

Stores bus route information.

| Column      | Type           | Constraints                   |
| ----------- | -------------- | ----------------------------- |
| route\_id   | `integer`      | Primary key, auto-incremented |
| route\_name | `varchar(100)` | Not null                      |
| description | `text`         |                               |

**Referenced by**:

* `buses(route_id)`
* `stops(route_id)`

---

### 4. **Table: `buses`**

Stores details of buses including which route they operate on.

| Column        | Type           | Constraints                      |
| ------------- | -------------- | -------------------------------- |
| bus\_id       | `integer`      | Primary key, auto-incremented    |
| bus\_number   | `varchar(20)`  | Not null, unique                 |
| driver\_name  | `varchar(100)` |                                  |
| driver\_phone | `varchar(15)`  |                                  |
| route\_id     | `integer`      | Foreign key → `routes(route_id)` |
| is\_active    | `boolean`      | Default: `true`                  |

**Referenced by**:

* `bus_locations(bus_id)`

---

### 5. **Table: `bus_locations`**

Tracks live or recent GPS location of buses.

| Column       | Type               | Constraints                   |
| ------------ | ------------------ | ----------------------------- |
| location\_id | `integer`          | Primary key, auto-incremented |
| bus\_id      | `integer`          | Foreign key → `buses(bus_id)` |
| latitude     | `double precision` | Not null                      |
| longitude    | `double precision` | Not null                      |
| speed        | `double precision` |                               |
| timestamp    | `timestamp`        | Default: `CURRENT_TIMESTAMP`  |

---

### 6. **Table: `stops`**

Defines bus stops in a route, with stop order and location.

| Column      | Type               | Constraints                      |
| ----------- | ------------------ | -------------------------------- |
| stop\_id    | `integer`          | Primary key, auto-incremented    |
| route\_id   | `integer`          | Foreign key → `routes(route_id)` |
| stop\_name  | `varchar(100)`     | Not null                         |
| latitude    | `double precision` |                                  |
| longitude   | `double precision` |                                  |
| stop\_order | `integer`          | Indicates the order in the route |

---

If you'd like, I can export this schema to a **Markdown document**, **PDF**, or **SQL create script** for documentation or deployment purposes. Let me know your preference.
