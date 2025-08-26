
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Shield, School } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/icons";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background">
      <div className="flex flex-col items-center justify-center space-y-6 text-center w-full max-w-md">
        <Logo className="h-12 w-auto" />
        <Card className="w-full shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary">Welcome Back</CardTitle>
            <CardDescription className="pt-2 font-body text-base">
              Select your role and enter your credentials to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup defaultValue="school" className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                <Label
                  htmlFor="admin"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Shield className="mb-3 h-6 w-6" />
                  Admin
                </Label>
              </div>
              <div>
                <RadioGroupItem value="school" id="school" className="peer sr-only" />
                <Label
                  htmlFor="school"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <School className="mb-3 h-6 w-6" />
                  School
                </Label>
              </div>
            </RadioGroup>
            
            <div className="space-y-4 text-left">
                 <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="Enter your username" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter your password" />
                </div>
            </div>

            {/* This is a mock navigation. In a real app, you'd handle auth state. */}
            {/* For now, we'll just link to the pages. The user can pick based on the radio button. */}
            <div className="flex gap-2">
                <Link href="/admin" className="w-full">
                    <Button className="w-full">
                        Login as Admin <ArrowRight />
                    </Button>
                </Link>
                <Link href="/school" className="w-full">
                    <Button variant="secondary" className="w-full">
                        Login as School <ArrowRight />
                    </Button>
                </Link>
            </div>
          </CardContent>
          <CardFooter>
             <p className="text-xs text-muted-foreground w-full">This is a simulated login. Select a role and click the corresponding button to proceed.</p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
