"use client"

import * as React from "react"
import { supabase } from "@/lib/supabase"
import { MasterLocation, ResidentialBlock } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MapboxLngLat {
  lng: number
  lat: number
}

export default function SpatialRegistryPage() {
  const mapContainerRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<any>(null)
  const markerRef = React.useRef<any>(null)

  const [mounted, setMounted] = React.useState<boolean>(false)
  const [activeTab, setActiveTab] = React.useState<string>("depot")
  const [locations, setLocations] = React.useState<MasterLocation[]>([])
  const [editingId, setEditingId] = React.useState<number | null>(null)

  const [blockName, setBlockName] = React.useState<ResidentialBlock>("A")
  const [blockNumber, setBlockNumber] = React.useState<string>("")
  const [houseNumber, setHouseNumber] = React.useState<string>("")
  const [depotIdentifier, setDepotIdentifier] =
    React.useState<string>("DEPOT_CENTRAL")

  const [lat, setLat] = React.useState<number>(-6.2612)
  const [lng, setLng] = React.useState<number>(107.1234)
  const [initialEditCoords, setInitialEditCoords] = React.useState<{
    lat: number
    lng: number
  } | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const fetchInitialData = React.useCallback(async () => {
    const { data, error } = await supabase
      .from("master_locations")
      .select("*")
      .order("id", { ascending: true })

    if (!error && data) {
      const fetchedLocations = data as MasterLocation[]
      setLocations(fetchedLocations)

      const depot = fetchedLocations.find((l) => l.id === 1)
      if (depot && editingId === null && activeTab === "depot") {
        setDepotIdentifier(depot.house_number)
        setLat(Number(depot.latitude))
        setLng(Number(depot.longitude))
      }
    }
  }, [editingId, activeTab])

  React.useEffect(() => {
    setMounted(true)
    fetchInitialData()
  }, [fetchInitialData])

  React.useEffect(() => {
    if (!mounted || !mapContainerRef.current) return

    const injectAssets = () => {
      const linkId = "mapbox-style-cdn"
      const scriptId = "mapbox-script-cdn"

      if (!document.getElementById(linkId)) {
        const link = document.createElement("link")
        link.id = linkId
        link.href = "https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css"
        link.rel = "stylesheet"
        document.head.appendChild(link)
      }

      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script")
        script.id = scriptId
        script.src = "https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.js"
        script.async = true
        script.onload = () => initializeMap()
        document.body.appendChild(script)
      } else if ((window as any).mapboxgl) {
        initializeMap()
      }
    }

    const initializeMap = () => {
      const mapboxgl = (window as any).mapboxgl
      if (!mapboxgl || mapRef.current) return

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: 15,
      })

      mapInstance.addControl(new mapboxgl.NavigationControl(), "top-right")
      mapInstance.addControl(new mapboxgl.FullscreenControl(), "top-right")
      mapInstance.addControl(new mapboxgl.ScaleControl(), "bottom-left")

      const isDraggable = !(activeTab === "depot" && editingId === null)
      const markerInstance = new mapboxgl.Marker({ draggable: isDraggable })

      markerInstance.on("dragend", () => {
        const lngLat: MapboxLngLat = markerInstance.getLngLat()
        setLat(parseFloat(lngLat.lat.toFixed(8)))
        setLng(parseFloat(lngLat.lng.toFixed(8)))
      })

      mapInstance.on("click", (e: any) => {
        if (activeTab === "depot" && editingId === null) return
        markerInstance.addTo(mapInstance)
        markerInstance.setLngLat([e.lngLat.lng, e.lngLat.lat])
        setLat(parseFloat(e.lngLat.lat.toFixed(8)))
        setLng(parseFloat(e.lngLat.lng.toFixed(8)))
      })

      mapRef.current = mapInstance
      markerRef.current = markerInstance

      const depot = locations.find((l) => l.id === 1)
      if (activeTab === "depot" && editingId === null) {
        if (depot) {
          const dLat = Number(depot.latitude)
          const dLng = Number(depot.longitude)
          setLat(dLat)
          setLng(dLng)
          markerInstance.addTo(mapInstance)
          markerInstance.setLngLat([dLng, dLat])
          mapInstance.setCenter([dLng, dLat])
        }
      } else {
        markerInstance.addTo(mapInstance)
        markerInstance.setLngLat([lng, lat])
        mapInstance.setCenter([lng, lat])
      }
    }

    injectAssets()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [mounted])

  const handleCancelModification = () => {
    setEditingId(null)
    setInitialEditCoords(null)
    if (activeTab === "consumer") {
      setBlockNumber("")
      setHouseNumber("")
    } else {
      const existingDepot = locations.find((l) => l.id === 1)
      if (existingDepot) {
        setDepotIdentifier(existingDepot.house_number)
        setLat(Number(existingDepot.latitude))
        setLng(Number(existingDepot.longitude))
      }
    }
    if (markerRef.current) markerRef.current.remove()
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setEditingId(null)
    setInitialEditCoords(null)

    if (value === "depot") {
      const existingDepot = locations.find((l) => l.id === 1)
      if (existingDepot) {
        setDepotIdentifier(existingDepot.house_number)
        const dLat = Number(existingDepot.latitude)
        const dLng = Number(existingDepot.longitude)
        setLat(dLat)
        setLng(dLng)
        if (markerRef.current && mapRef.current) {
          markerRef.current.setDraggable(false)
          markerRef.current.addTo(mapRef.current)
          markerRef.current.setLngLat([dLng, dLat])
          mapRef.current.setCenter([dLng, dLat])
        }
      }
    } else {
      setBlockNumber("")
      setHouseNumber("")
      setLat(-6.2612)
      setLng(107.1234)
      if (markerRef.current && mapRef.current) {
        markerRef.current.setDraggable(true)
        markerRef.current.addTo(mapRef.current)
        markerRef.current.setLngLat([107.1234, -6.2612])
        mapRef.current.setCenter([107.1234, -6.2612])
      }
    }
  }

  const handleEditInitiation = (loc: MasterLocation) => {
    const originalLat = Number(loc.latitude)
    const originalLng = Number(loc.longitude)

    setEditingId(loc.id)
    setLat(originalLat)
    setLng(originalLng)
    setInitialEditCoords({ lat: originalLat, lng: originalLng })

    const targetTab = loc.id === 1 ? "depot" : "consumer"
    setActiveTab(targetTab)

    if (loc.id === 1) {
      setDepotIdentifier(loc.house_number)
    } else {
      setBlockName(loc.block_name || "A")
      setBlockNumber(loc.block_number)
      setHouseNumber(loc.house_number)
    }

    if (markerRef.current && mapRef.current) {
      markerRef.current.setDraggable(true)
      markerRef.current.addTo(mapRef.current)
      markerRef.current.setLngLat([originalLng, originalLat])
      mapRef.current.flyTo({ center: [originalLng, originalLat], zoom: 16 })
    }

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDeleteExecution = async (id: number) => {
    if (id === 1) return
    setIsLoading(true)
    await supabase.from("master_locations").delete().eq("id", id)
    await fetchInitialData()
    setIsLoading(false)
  }

  const handleCommitNode = async () => {
    if (
      editingId &&
      initialEditCoords &&
      lat === initialEditCoords.lat &&
      lng === initialEditCoords.lng
    ) {
      return
    }

    setIsLoading(true)
    const payload =
      activeTab === "depot"
        ? { house_number: depotIdentifier, latitude: lat, longitude: lng }
        : {
            block_name: blockName,
            block_number: blockNumber,
            house_number: houseNumber,
            latitude: lat,
            longitude: lng,
          }

    const query = editingId
      ? supabase.from("master_locations").update(payload).eq("id", editingId)
      : supabase.from("master_locations").insert([payload])

    await query
    await fetchInitialData()
    setIsLoading(false)

    setEditingId(null)
    setInitialEditCoords(null)
    if (activeTab === "consumer") {
      setBlockNumber("")
      setHouseNumber("")
    }
    if (markerRef.current) markerRef.current.remove()
  }

  const collisionData = React.useMemo(() => {
    if (activeTab === "depot") {
      return locations.find(
        (l) =>
          l.id !== editingId &&
          l.house_number.toLowerCase() ===
            depotIdentifier.trim().toLowerCase() &&
          Number(l.latitude) === lat &&
          Number(l.longitude) === lng
      )
    } else {
      if (!blockNumber.trim() || !houseNumber.trim()) return null
      return locations.find(
        (l) =>
          l.id !== editingId &&
          l.block_name === blockName &&
          l.block_number.trim() === blockNumber.trim() &&
          l.house_number.trim() === houseNumber.trim()
      )
    }
  }, [
    activeTab,
    blockName,
    blockNumber,
    houseNumber,
    depotIdentifier,
    lat,
    lng,
    locations,
    editingId,
  ])

  const isButtonDisabled = React.useMemo(() => {
    if (isLoading || !!collisionData) return true
    if (
      editingId &&
      initialEditCoords &&
      lat === initialEditCoords.lat &&
      lng === initialEditCoords.lng
    )
      return true
    return activeTab === "depot"
      ? !depotIdentifier.trim()
      : !blockNumber.trim() || !houseNumber.trim()
  }, [
    activeTab,
    blockNumber,
    houseNumber,
    depotIdentifier,
    collisionData,
    isLoading,
    editingId,
    initialEditCoords,
    lat,
    lng,
  ])

  if (!mounted) return null

  return (
    <div className="mx-auto min-h-screen max-w-[1600px] space-y-12 bg-background p-12">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance lg:text-5xl">
          Spatial Node Registry
        </h1>
        <p className="text-xl text-muted-foreground">
          Infrastructural ingestion panel for mapping core cartographic matrix
          nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <Card className="relative h-[600px] overflow-hidden lg:col-span-7">
          <CardContent className="absolute inset-0 p-0">
            <div ref={mapContainerRef} className="h-full w-full" />
          </CardContent>
        </Card>

        <Card className="flex h-[600px] flex-col overflow-hidden lg:col-span-5">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="flex h-full w-full flex-col justify-between"
          >
            <div className="space-y-4">
              <CardHeader className="pb-2">
                <TabsList className="mb-4 grid w-full grid-cols-2">
                  <TabsTrigger value="depot">Base Depot</TabsTrigger>
                  <TabsTrigger value="consumer">Consumer Nodes</TabsTrigger>
                </TabsList>
                <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  {editingId
                    ? "Modify Infrastructure Node"
                    : "Node Configuration"}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Map geodetic coordinates to formal structures.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <TabsContent value="depot" className="m-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="depot-id">Depot Reference Code</Label>
                    <Input
                      id="depot-id"
                      value={depotIdentifier}
                      onChange={(e) => setDepotIdentifier(e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="consumer" className="m-0 space-y-4">
                  <div className="space-y-2">
                    <Label>Quadrant Sector</Label>
                    <Select
                      value={blockName}
                      onValueChange={(v) => setBlockName(v as ResidentialBlock)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["A", "B", "C", "D", "E"].map((s) => (
                          <SelectItem key={s} value={s}>
                            Sector {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="block-no">Block</Label>
                      <Input
                        id="block-no"
                        value={blockNumber}
                        onChange={(e) => setBlockNumber(e.target.value)}
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="house-no">House</Label>
                      <Input
                        id="house-no"
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                        placeholder="e.g. 12"
                      />
                    </div>
                  </div>
                </TabsContent>

                <div className="grid grid-cols-2 gap-4 border-t border-dashed pt-4">
                  <div className="space-y-2">
                    <Label>Latitude (Action Node)</Label>
                    <Input
                      readOnly
                      value={lat.toFixed(8)}
                      className="bg-muted font-mono text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Longitude (Action Node)</Label>
                    <Input
                      readOnly
                      value={lng.toFixed(8)}
                      className="bg-muted font-mono text-foreground"
                    />
                  </div>
                </div>
              </CardContent>
            </div>

            <CardFooter className="mt-auto flex-col space-y-2">
              {editingId && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCancelModification}
                >
                  Cancel Modification
                </Button>
              )}
              <Button
                className="w-full"
                onClick={handleCommitNode}
                disabled={isButtonDisabled}
              >
                {activeTab === "depot"
                  ? "Synchronize Depot Base"
                  : editingId
                    ? "Update Spatial Node"
                    : "Commit Data Entry"}
              </Button>
            </CardFooter>
          </Tabs>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Active Master Matrices
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Database storage registry panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader className="border-b bg-muted/50">
              <TableRow>
                <TableHead className="h-12 px-6 text-sm font-semibold text-foreground">
                  Index
                </TableHead>
                <TableHead className="h-12 px-6 text-sm font-semibold text-foreground">
                  Address Code
                </TableHead>
                <TableHead className="h-12 px-6 text-sm font-semibold text-foreground">
                  Latitude
                </TableHead>
                <TableHead className="h-12 px-6 text-sm font-semibold text-foreground">
                  Longitude
                </TableHead>
                <TableHead className="h-12 px-6 text-right text-sm font-semibold text-foreground">
                  Operations
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center font-mono text-xs tracking-wider text-muted-foreground uppercase"
                  >
                    No records stored in baseline.
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((loc, index) => (
                  <TableRow
                    key={loc.id}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <TableCell className="px-6 py-4 font-mono text-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-medium text-foreground">
                      {loc.id === 1
                        ? "DEPOT"
                        : `${loc.block_name}${loc.block_number}/${loc.house_number}`}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-mono text-xs text-foreground">
                      {Number(loc.latitude).toFixed(8)}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-mono text-xs text-foreground">
                      {Number(loc.longitude).toFixed(8)}
                    </TableCell>
                    <TableCell className="space-x-2 px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditInitiation(loc)}
                      >
                        Modify
                      </Button>
                      {loc.id !== 1 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteExecution(loc.id)}
                        >
                          Purge
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}