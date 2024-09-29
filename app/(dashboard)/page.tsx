'use client'
import { Button } from "@/components/ui/button";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

export default function Home() {
  const { onOpen } = useOpenAccount()
  return (
    <div>
      <Button onClick={onOpen}>Create</Button>

    </div>
  );
}
