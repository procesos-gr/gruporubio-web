"use client"

import { useEffect } from "react"
import { analytics, type AnalyticsItem } from "@/lib/analytics"

// Dispara view_item al montar (páginas de producto, que son server components)
export function TrackViewItem({ value, item }: { value: number; item: AnalyticsItem }) {
  useEffect(() => {
    analytics.viewItem(value, [item])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.item_id])

  return null
}
