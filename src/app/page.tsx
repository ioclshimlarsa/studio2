"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/icons";
import { useToast } from '@/hooks/use-toast';
import { loginAction } from '@/lib/actions';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<'school' | 'admin'>('school');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    if (role === 'admin') {
      if (username === 'admin01' && password === 'password123') {
        router.push('/admin');
        return;
      } else {
        toast({ variant: 'destructive', title: "Login Failed", description: "Invalid admin credentials." });
        setIsLoading(false);
      }
    } else { // role === 'school'
      try {
        const result = await loginAction(username);
        if (result.success) {
          toast({ title: "Login Successful", description: "Redirecting to your dashboard..." });
          router.push('/school');
        } else {
          toast({ variant: 'destructive', title: "Login Failed", description: result.message });
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: "Error", description: "An unexpected error occurred." });
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background">
      <div className="flex flex-col items-center justify-center space-y-6 text-center w-full max-w-md">
        <Logo className="h-12 w-auto" />
        <Card className="w-full shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary">Welcome</CardTitle>
            <CardDescription className="pt-2 font-body text-base">
              Select your role and enter credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              defaultValue="school"
              onValueChange={(value: 'school' | 'admin') => setRole(value)}
              className="grid grid-cols-2 gap-4"
              disabled={isLoading}
            >
              <div>
                <RadioGroupItem value="school" id="school" className="peer sr-only" />
                <Label
                  htmlFor="school"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  School Login
                </Label>
              </div>
              <div>
                <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                <Label
                  htmlFor="admin"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Admin Login
                </Label>
              </div>
            </RadioGroup>

            <div className="space-y-4 text-left">
                 <div className="space-y-2">
                    <Label htmlFor="username">{role === 'admin' ? 'Username' : 'School Email'}</Label>
                    <Input 
                      id="username" 
                      placeholder={role === 'admin' ? 'Enter your username' : 'Enter your school email'} 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                </div>
            </div>
            <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'} <ArrowRight />
            </Button>
          </CardContent>
          <CardFooter>
             <p className="text-xs text-muted-foreground w-full text-center">
                Contact us at Bharat Scouts and Guides Punjab for creating login credentials for your school.
             </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
