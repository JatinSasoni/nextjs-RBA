import Header from "../components/layout/Header";
import { apiClient } from "../lib/apiClient";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await apiClient.getCurrentUser();
  return (
    <div>
      <Header user={user || null} />
      <main>{children}</main>
    </div>
  );
};
export default MainLayout;
