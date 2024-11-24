import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "@/components/dashboard/overview";
import ApiKey from "@/components/dashboard/api-key";
import Billing from "@/components/dashboard/billing";
import Account from "@/components/dashboard/account";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white/80 font-sans">
      <main className="py-8 pt-0 px-4 sm:px-6 max-w-7xl mx-auto">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10 backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white/80"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="api-key"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white/80"
            >
              API Key
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white/80"
            >
              Billing
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white/80"
            >
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Overview />
          </TabsContent>

          <TabsContent value="api-key">
            <ApiKey />
          </TabsContent>

          <TabsContent value="billing">
            <Billing />
          </TabsContent>

          <TabsContent value="account">
            <Account />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
