export type ResidentialBlock = "A" | "B" | "C" | "D" | "E"

export interface MasterLocation {
  id: number
  block_name: ResidentialBlock | null
  block_number: string
  house_number: string
  latitude: number
  longitude: number
}

export interface GeneratorParameter {
  address_count: number
  max_packages_per_address: number
  default_due_time: number
}

export interface ManifestExportRow {
  sequence_id: number
  address_code: string
  latitude: number
  longitude: number
  package_quantity: number
  due_time: number
}