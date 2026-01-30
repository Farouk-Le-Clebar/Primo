### **PRIMO BETA TEST PLAN**

## **1. Project context**

**Primo** is a platform designed to centralize and simplify access to real estate and environmental data for a specific land plot.

Currently, potential buyers and tenants struggle to gather crucial information (such as cadastral data, local services, transport, weather, and safety) because the data is scattered across multiple technical or non-ergonomic public sources (INSEE, Cadastre, etc.). This fragmentation leads to significant time loss and uninformed decision-making.

The objective of **Primo** is to provide a "one-click" solution that aggregates these disparate data points into a single, user-friendly interface. By using a map-based search and AI-driven insights, the platform allows users to instantly visualize the full potential and constraints of any plot, making professional-grade geographical data accessible to everyone.

## **2. User role**

| **Role Name**  | **Description** |
|--------|----------------------|
| ADMIN          | All permission on website (Dev team) |
| USER Lvl 1     | User with free offer ( Website without AI) |
| USER Lvl 2     | Professional user (Website + AI) |
---

## **3. Feature table**

| **Feature ID** | **User Role** | **Feature Name** | **Short Description** |
| :--- | :--- | :--- | :--- |
| **F1** | Everyone | Register | Sign in with an existing account. |
| **F2** | Everyone | Login | Register a new account. |
| **F3** | Everyone | Create a project | Initialize a new workspace by providing a name and description. |
| **F4** | Everyone | Invite collaborators | Add other users to a specific project using their identifiers. |
| **F5** | Everyone | Search for a plot | Locate a land plot by entering an address or navigating the map. |
| **F6** | User Lvl 2 | Search via AI | Use basic natural language inputs to find plots with very basical informations. |
| **F7** | Everyone | Filter map data | Toggle specific map layers or criteria to customize the display. |
| **F8** | Everyone | View plot details | Click on a plot to display its technical and administrative information. |
| **F9** | Everyone | Assign plot to project | Link a selected plot to an existing project for tracking. |
| **F10** | Everyone | Manage profile | Update user information, such as name or avatar settings. |
| **F11** | Everyone | Oversee project | Access a dashboard summarizing all plots saved within a specific project. |
| **F12** | Admin | Admin panel | Access an admin panel with users informations |

---

## **4. Success Criteria**

| **Feature ID** | **Key Success Criteria** | **Indicator / Metric** | **Result** |
| :--- | :--- | :--- | :--- |
| **F1** | User can successfully sign in with valid credentials | 20 login attempts, 0 authentication errors | Achieved |
| **F2** | User can create a new account and access the platform immediately | 10 registrations, 100% account activation | Achieved |
| **F3** | Project is created and appears immediately in the user list | 10 projects created, 100% visibility | Achieved |
| **F4** | Invited collaborators gain immediate access to the project | 5 invitations sent, 5 successful accesses | Achieved |
| **F5** | Map correctly centers on the searched address or coordinates | 15 searches, accuracy > 95% | Achieved |
| **F6** | AI provides relevant plot suggestions based on text input | 10 queries, average response time < 15s | Partially achieved (20s or >) |
| **F7** | Selected filters correctly hide/show relevant map layers | 10 toggle tests, 0 display glitches | Achieved |
| **F8** | Technical data is displayed upon clicking | 20 plots tested, 100% data consistency | Achieved |
| **F9** | Plot is successfully linked and saved within the selected project | 10 assignments, 0 data persistence issues | Achieved |
| **F10** | Profile updates (name, avatar) are saved and visible after refresh | 5 updates, 5 successful persistences | Achieved |
| **F11** | Dashboard displays a full and accurate summary of project plots | 10 project overviews, all plots accounted for | Achieved |
| **F12** | Admin can access the admin panel and view accurate user information | 5 admin accesses, 100% data accuracy | Achieved |