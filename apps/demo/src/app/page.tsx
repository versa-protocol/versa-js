import { Suspense } from "react";
import { InteractiveStudio } from "@/components/studio/lib/interactiveStudio";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <InteractiveStudio />
      </Suspense>
    </main>
  );
}
