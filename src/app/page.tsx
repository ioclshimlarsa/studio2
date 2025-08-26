import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/icons";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <Logo className="h-12 w-auto" />
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-primary">Welcome to Bharat Scouts and Guides Punjab Camp Connect</CardTitle>
            <CardDescription className="pt-2 font-body text-base">
              Your portal for discovering and managing Scouts and Guides camps in Punjab.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button size="lg" className="w-full">
                Proceed to Login <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </CardContent>
          <CardFooter>
             <p className="text-xs text-muted-foreground w-full">Click above to proceed to the login page.</p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
