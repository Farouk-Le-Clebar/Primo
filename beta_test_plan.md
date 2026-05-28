### **PRIMO BETA TEST PLAN**

## **1. Project context**

**Primo** is a platform designed to centralize and simplify access to real estate and environmental data for a specific land plot.

Currently, potential buyers and tenants struggle to gather crucial information (such as cadastral data, local services, transport, weather, and safety) because the data is scattered across multiple technical or non-ergonomic public sources (INSEE, Cadastre, etc.). This fragmentation leads to significant time loss and uninformed decision-making.

The objective of **Primo** is to provide a "one-click" solution that aggregates these disparate data points into a single, user-friendly interface. By using a map-based search and AI-driven insights, the platform allows users to instantly visualize the full potential and constraints of any plot, making professional-grade geographical data accessible to everyone.

## **2. User role**

| **Role Name** | **Description** |
| :--- | :--- |
| **ADMIN** | All permission on website (Dev team) |
| **USER Lvl 1** | User with free offer (Website without AI) |
| **USER Lvl 2** | Professional user (Website + AI) |

---

## **3. Feature table**

| **Feature ID** | **User Role** | **Feature Name** | **Short Description** |
| :--- | :--- | :--- | :--- |
| **F1** | Everyone | Register | Sign in with an existing account. |
| **F2** | Everyone | Login | Register a new account. |
| **F3** | Everyone | OAuth | Authentication with Google. |
| **F4** | Everyone | Account Verification | Account verification by Email. |
| **F5** | Everyone | Create a project | Initialize a new workspace by providing a name and description. |
| **F6** | Everyone | Invite collaborators | Add other users to a specific project using their identifiers. |
| **F7** | Everyone | Search for a plot | Locate a land plot by entering an address or navigating the map. |
| **F8** | User Lvl 2 | Search via AI | Use basic natural language inputs to find plots with very basic information. |
| **F9** | Everyone | Filter map data | Toggle specific map layers or criteria to customize the display. |
| **F10** | Everyone | View plot details | Click on a plot to display its technical and administrative information. |
| **F11** | Everyone | View building category | Possibility to view details on the building built on a plot. |
| **F12** | Everyone | View DPE category | Possibility to see energetic category of a building / house / apartment. |
| **F13** | Everyone | View PLU category | Oversee Plan Local d'Urbanisme prescription applicable to a plot. |
| **F14** | Everyone | View DVF category | See all financial transactions due to a plot from the last 5 years. |
| **F15** | Everyone | Assign plot to project | Link a selected plot to an existing project for tracking. |
| **F16** | Everyone | Manage profile | Update user information, such as name or avatar settings. |
| **F17** | Everyone | Oversee project | Access a dashboard summarizing all plots saved within a specific project. |
| **F18** | Admin | Admin panel | Access an admin panel with users information. |
| **F19** | Everyone | Feedback system | Possibility for users to create feedback directly on the tool. |
| **F20** | Admin | Feedback panel | Possibility to see the users' feedback through the admin panel. |
| **F21** | Admin | Handle Website ADMIN | Handle website administrators through the admin panel. |
| **F22** | Everyone | Switch theme color | Possibility to switch between white and dark theme. |

---

## **4. Success Criteria**

| **Feature ID** | **Key Success Criteria** | **Indicator / Metric** | **Result** |
| :--- | :--- | :--- | :--- |
| **F1** | User can successfully sign in with valid credentials | 20 login attempts, 0 authentication errors | Achieved |
| **F2** | User can create a new account and access the platform immediately | 10 registrations, 100% account activation | Achieved |
| **F3** | User can authenticate seamlessly using their Google Account | 10 Google OAuth attempts, 100% success rate | Achieved |
| **F4** | Verification link is received and activates the account upon click | 10 emails sent, link valid for 24h, 100% activation | Achieved |
| **F5** | Project is created and appears immediately in the user list | 10 projects created, 100% visibility | Achieved |
| **F6** | Invited collaborators gain immediate access to the project | 5 invitations sent, 5 successful accesses | Achieved |
| **F7** | Map correctly centers on the searched address or coordinates | 15 searches, accuracy > 95% | Achieved |
| **F8** | AI provides relevant plot suggestions based on text input | 10 queries, average response time < 15s | Partially achieved (20s or >) |
| **F9** | Selected filters correctly hide/show relevant map layers | 10 toggle tests, 0 display glitches | Achieved |
| **F10** | Technical data is displayed upon clicking | 20 plots tested, 100% data consistency | Achieved |
| **F11** | Detailed building specs load without error | 15 buildings checked, 100% data rendering | Achieved |
| **F12** | Energy rating (A-G) and related metrics are clearly visible | 15 checks, energy tags match official sources | Achieved |
| **F13** | Zoning regulations and PLU constraints are readable and accurate | 10 plots checked, PLU documents load < 3s | Achieved |
| **F14** | Display historical real estate sales prices & dates matching data | 10 plots verified, data matches last 5 years DVF | Achieved |
| **F15** | Plot is successfully linked and saved within the selected project | 10 assignments, 0 data persistence issues | Achieved |
| **F16** | Profile updates (name, avatar) are saved and visible after refresh | 5 updates, 5 successful persistences | Achieved |
| **F17** | Dashboard displays a full and accurate summary of project plots | 10 project overviews, all plots accounted for | Achieved |
| **F18** | Admin can access the admin panel and view accurate user information | 5 admin accesses, 100% data accuracy | Achieved |
| **F19** | User can submit a ticket/bug/comment directly from the interface | 10 feedbacks sent, 100% delivery to DB | Achieved |
| **F20** | Admins can view, filter, and manage user feedback from the panel | Panel dashboard loads instantly, all user reports visible | Achieved |
| **F21** | Admin can promote/demote users to Admin role securely | 3 role changes, permissions updated instantly | Achieved |
| **F22** | Interface dynamically switches between Light and Dark modes | 10 theme toggles, 0 style breakage, user choice saved | Achieved |