import Link from "next/link";
import { Button } from "@/components/ui";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
        <Ghost className="w-10 h-10 text-primary animate-pulse-glow" />
      </div>
      
      <h1 className="text-6xl font-bold text-foreground mb-4 font-heading tracking-tight">
        404
      </h1>
      <h2 className="text-2xl font-bold text-foreground mb-6 font-heading">
        Sector Not Found
      </h2>
      
      <p className="text-foreground-muted mb-8 max-w-md">
        The coordinates you entered lead to an empty void. The project or profile you are looking for does not exist here.
      </p>
      
      <Link href="/">
        <Button variant="primary" size="lg">
          Return to Hub
        </Button>
      </Link>
    </div>
  );
}
