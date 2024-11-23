import { currentUser } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { User } from "lucide-react";
import { Button } from "../ui/button";

export default async function Account() {
  const user = await currentUser();

  return (
    <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white/80">Account Details</CardTitle>
        <CardDescription className="text-white/60">
          Manage your account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <User className="h-6 w-6 text-white/70" />
          </div>
          <div>
            <p className="font-semibold text-white/80">
              {user?.fullName || "N/A"}
            </p>
            <p className="text-sm text-white/60">
              {user?.primaryEmailAddress?.emailAddress || "N/A"}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="username" className="text-white/80">
            Username
          </Label>
          <Input
            id="username"
            value={user?.username || ""}
            readOnly
            className="bg-white/5 border-white/10 text-white/80"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="bg-white/10 text-white/80 hover:bg-white/20">
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
