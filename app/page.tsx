"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="mx-auto min-h-screen max-w-[1600px] space-y-32 bg-background px-24 py-32">
      <div className="max-w-4xl space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance lg:text-5xl">
          Spatial Logistics Management Framework
        </h1>
        <p className="text-xl text-muted-foreground">
          Core micro-system orchestration terminal for geodetic node registry
          and automated transit manifest serialization.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        <Link href="/spatial-registry" className="group">
          <Card className="h-full transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Spatial Node Registry
              </CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground">
                Geodetic coordinate ingestion system for manual cartographic
                anchoring of distribution points.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/manifest-generator" className="group">
          <Card className="h-full transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Manifest Vector Generator
              </CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground">
                Stochastic pipeline compilation for transient routing sequence
                data transformations and spreadsheet generation.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}