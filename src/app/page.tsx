"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/icons";
import { useToast } from '@/hooks/use-toast';
import { loginAction } from '@/lib/actions';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    // Admin hardcoded check
    if (email === 'admin01' && password === 'password123') {
      router.push('/admin');
      return;
    }

    // School User login
    try {
      const result = await loginAction(email);
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
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background">
      <div className="flex flex-col items-center justify-center space-y-6 text-center w-full max-w-md">
        <Logo className="h-12 w-auto" />
        <Card className="w-full shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary">Welcome Back</CardTitle>
            <CardDescription className="pt-2 font-body text-base">
              Enter your credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 text-left">
                 <div className="space-y-2">
                    <Label htmlFor="username">Username / Email</Label>
                    <Input 
                      id="username" 
                      placeholder="Enter your username or email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
