import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, School } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/icons";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <Logo className="h-12 w-auto" />
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary">Sign In</CardTitle>
            <CardDescription className="pt-2 font-body text-base">
              Select your role to access the portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">For testing purposes, you can use the following roles. No password is required.</p>
            
            <div className="text-left p-4 border rounded-lg bg-muted/50">
                <h3 className="font-bold flex items-center"><Shield className="mr-2 h-4 w-4" /> Admin User</h3>
                <p className="text-sm"><b>Username:</b> admin</p>
            </div>

            <Link href="/admin">
              <Button size="lg" className="w-full">
                Login as Admin <ArrowRight className="ml-2" />
              </Button>
            </Link>
            
            <Separator className="my-2" />
            
            <div className="text-left p-4 border rounded-lg bg-muted/50">
                <h3 className="font-bold flex items-center"><School className="mr-2 h-4 w-4" /> School User</h3>
                <p className="text-sm"><b>Username:</b> school</p>
            </div>
            
            <Link href="/school">
              <Button size="lg" variant="secondary" className="w-full">
                Login as School <ArrowRight className="ml-2" />
              </Button>
            </Link>

          </CardContent>
          <CardFooter>
             <p className="text-xs text-muted-foreground w-full">This is a simulated login. No authentication is performed.</p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
