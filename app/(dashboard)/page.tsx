'use client'
import { Button } from "@/components/ui/button";
import { useCreateAccount } from "@/features/accounts/hooks/use-create-account";

export default function Home() {
  const { onOpen } = useCreateAccount()
  return (
    <div>
      <Button onClick={onOpen}>Create</Button>

    </div>
  );
}
