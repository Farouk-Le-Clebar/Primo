import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@tremor/react";

// COMPONENTS
import UserChart from "./components/UserChart/UserChart";
import UsersList from "./components/UsersList/UsersList";
import AdminList from "./components/AdminList/AdminList";
import FeedbacksList from "./components/Feedback/FeedbacksList";

const AdminPanel = () => {
    return (
        <div className="flex flex-col w-full h-full p-10 overflow-y-auto bg-transparent dark:bg-[#0A0A0A] transition-colors duration-200">
            <div className="mb-2">
                <h1 className="font-inter font-bold text-3xl text-gray-900 dark:text-white transition-colors duration-200">
                    Panel Administration
                </h1>
                <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                    Gérez vos utilisateurs, administrateurs et analysez les statistiques de la plateforme.
                </p>
            </div>

            <TabGroup className="mt-6 flex-1 flex flex-col">
                <TabList className="mb-6">
                    <Tab className="text-gray-700 dark:text-gray-300 dark:hover:text-white aria-selected:!text-black aria-selected:!border-black dark:aria-selected:!text-white dark:aria-selected:!border-white">Aperçu</Tab>
                    <Tab className="text-gray-700 dark:text-gray-300 dark:hover:text-white aria-selected:!text-black aria-selected:!border-black dark:aria-selected:!text-white dark:aria-selected:!border-white">Utilisateurs</Tab>
                    <Tab className="text-gray-700 dark:text-gray-300 dark:hover:text-white aria-selected:!text-black aria-selected:!border-black dark:aria-selected:!text-white dark:aria-selected:!border-white">Administrateurs</Tab>
                    <Tab className="text-gray-700 dark:text-gray-300 dark:hover:text-white aria-selected:!text-black aria-selected:!border-black dark:aria-selected:!text-white dark:aria-selected:!border-white">Retours & Suggestions</Tab>
                </TabList>

                <TabPanels className="flex-1">
                    <TabPanel>
                        <div className="animate-fade-in">
                            <UserChart />
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="animate-fade-in">
                            <UsersList />
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="animate-fade-in">
                            <AdminList />
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="animate-fade-in">
                            <FeedbacksList />
                        </div>
                    </TabPanel>

                </TabPanels>
            </TabGroup>
            
        </div>
    );
};

export default AdminPanel;