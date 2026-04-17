import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="text-center space-y-6 py-16">
      <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8 text-gold" />
      </div>
      <h1 className="font-display text-3xl font-bold text-white">You&apos;re a Hero! 🎉</h1>
      <p className="text-carbon-400 max-w-sm mx-auto">
        Subscription activated. You&apos;re now entered into the monthly draw and your charity is receiving your contribution.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/dashboard/scores">
          <Button>Add Your Scores</Button>
        </Link>
        <Link href="/dashboard/charity">
          <Button variant="outline">Choose Charity</Button>
        </Link>
      </div>
    </div>
  );
}
