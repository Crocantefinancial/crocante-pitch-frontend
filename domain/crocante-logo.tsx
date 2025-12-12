import Image from "next/image"

export function CrocanteLogo({ className = "w-32 h-auto" }: { className?: string }) {
  return <Image src="/crocante-logo.png" alt="Crocante" width={160} height={60} className={className} priority />
}
