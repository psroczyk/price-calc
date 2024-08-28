export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType =
  | "Photography"
  | "VideoRecording"
  | "BlurayPackage"
  | "TwoDayEvent"
  | "WeddingSession";

export type ServicePackage =
  | "Photography_VideoRecording"
  | "WeddingSession_Photography"
  | "WeddingSession_VideoRecording"
  | "WeddingSession_VideoRecording_Photography";

  export interface ServicePrice {
  price: number;

}
type YearlyServicePrice = Record<ServiceType, ServicePrice>;
type YearlyServicePackagesPrice = Record<ServicePackage, ServicePrice>;

export type ServicePricing = Record<ServiceYear, YearlyServicePrice>;
export type ServicePackagePricing = Record<ServiceYear, YearlyServicePackagesPrice>;
export type ServiceDependencies = Record<ServiceType, ServiceType[]>;
