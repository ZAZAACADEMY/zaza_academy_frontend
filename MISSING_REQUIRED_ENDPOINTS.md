# Missing Backend Endpoints & Features for Production

This document provides a detailed specification of the backend functionalities required to move from mock data to a fully operational production environment.

---

## 1. Child Progress & Analytics (Critical)

### `GET /api/v1/children/{id}/progress/`
*   **Description**: Overall curriculum completion for a specific child.
*   **Input**: `id` (UUID) in path.
*   **Response**: `200 OK`
    ```json
    {
      "overall_percentage": 75,
      "completed_modules": 4,
      "total_modules": 12,
      "last_activity": "2026-03-07T10:00:00Z"
    }
    ```

### `GET /api/v1/children/{id}/stats/`
*   **Description**: High-level metrics for dashboard cards.
*   **Input**: `id` (UUID) in path.
*   **Response**: `200 OK`
    ```json
    {
      "videos_watched": 18,
      "badges_earned": 7,
      "study_time_hours": 6.5,
      "weekly_progress_increment": 12
    }
    ```

### `POST /api/v1/content/videos/{id}/track/`
*   **Description**: Track a child's progress on a specific video.
*   **Input**: `id` (UUID) in path. **Body**:
    ```json
    {
      "child_id": "uuid",
      "status": "watching|completed",
      "last_position_seconds": 120
    }
    ```
*   **Response**: `200 OK` or `201 Created`

### `GET /api/v1/children/{id}/activity/`
*   **Description**: Feed of recent actions.
*   **Input**: `id` (UUID) in path. Optional `limit` query param.
*   **Response**: `200 OK`
    ```json
    [
      { "type": "video", "title": "Intro to Saving", "date": "...", "status": "completed" },
      { "type": "quiz", "title": "Needs vs Wants", "score": 95, "date": "..." }
    ]
    ```

---

## 2. Gamification & Achievements

### `GET /api/v1/children/{id}/achievements/`
*   **Description**: List of badges/certificates unlocked.
*   **Input**: `id` (UUID) in path.
*   **Response**: `200 OK`
    ```json
    [
      { "id": "uuid", "title": "Budget Master", "icon_url": "...", "date_earned": "...", "type": "badge" }
    ]
    ```

### `GET /api/v1/children/milestones/`
*   **Description**: Global feed of milestones for all children of the parent.
*   **Input**: Authenticated parent session.
*   **Response**: `200 OK`
    ```json
    [
      { "child_name": "Emma", "milestone": "First Savings Goal", "date": "..." }
    ]
    ```

---

## 3. Subscription & Billing Lifecycle

### Stripe/Momo Webhooks (Non-API Endpoint)
*   **Requirement**: A listener at `/api/v1/payments/webhook/` to handle `payment_intent.succeeded`, `subscription.deleted`, etc.

### `GET /api/v1/payments/{id}/invoice/`
*   **Description**: Download a PDF invoice.
*   **Input**: `id` (UUID) in path.
*   **Response**: `200 OK` with `Content-Type: application/pdf`.

### `POST /api/v1/subscriptions/{id}/cancel/`
*   **Description**: Scheduled cancellation.
*   **Input**: `id` (UUID) in path.
*   **Response**: `200 OK`
    ```json
    { "message": "Subscription will end on [Date]", "end_date": "..." }
    ```

---

## 4. Live Sessions Management

### `GET /api/v1/live-sessions/`
*   **Description**: List class schedule.
*   **Input**: Query params `age_group` (5-8, 9-12, 13-16).
*   **Response**: `200 OK`
    ```json
    [
      { "id": "uuid", "title": "...", "start_time": "...", "instructor": "...", "zoom_link": "..." }
    ]
    ```

---

## 5. User Content Persistence

### `GET /api/v1/users/me/favorites/` & `POST /api/v1/content/videos/{id}/favorite/`
*   **Description**: Save videos for later.
*   **POST Body**: Empty (Toggle logic).
*   **Response**: `200 OK` or `204 No Content`.

---

## 6. Account Security & Compliance

### `POST /api/v1/auth/password/change/`
*   **Description**: Authenticated password update.
*   **Input Body**:
    ```json
    {
      "current_password": "...",
      "new_password": "...",
      "new_password_confirm": "..."
    }
    ```
*   **Response**: `200 OK` or `400 Bad Request` (wrong current password).

---

## 7. Schema Adjustments

### User Registration & Profile
*   **Field `motivations`**: Update `Register` and `UserSerializer` to include `motivations: string[]`.

### Child Profile
*   **Field `gender`**: Update `Child` schema to include `gender: string` (choices: `Boy`, `Girl`, `Other`).

---

## Priority Matrix

| Priority | Feature | Requirement |
| :--- | :--- | :--- |
| **P0** | **Webhooks** | Essential for subscription status accuracy. |
| **P0** | **Progress Tracking** | Mandatory for the learning dashboard. |
| **P1** | **Live Sessions** | Essential for Premium/Family value. |
| **P1** | **Server Favorites** | Essential for multi-device sync. |
| **P2** | **Invoice PDF** | Legal compliance and professional UX. |
