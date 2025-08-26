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
            <CardTitle className="text-3xl font-headline text-primary">Welcome to CampConnect</CardTitle>
            <CardDescription className="pt-2 font-body text-base">
              Your portal for discovering and managing educational and recreational camps in Punjab.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/admin">
              <Button size="lg" className="w-full">
                Admin Portal <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/school">
              <Button size="lg" variant="secondary" className="w-full">
                School Portal <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </CardContent>
          <CardFooter>
             <p className="text-xs text-muted-foreground w-full">Select your role to sign in.</p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
