"use client";

import Fund from "@/domain/invest/fund";
import { useParams } from "next/navigation";

export default function FundDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  return <Fund slug={slug} />;
}
