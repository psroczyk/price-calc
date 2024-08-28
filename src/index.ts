import {
  ServiceDependencies,
  ServicePackage,
  ServicePackagePricing,
  ServicePricing,
  ServiceType,
  ServiceYear,
} from "./types";

const basePrices: ServicePricing = {
  "2020": {
    Photography: { price: 1700 },
    VideoRecording: { price: 1700 },
    WeddingSession: { price: 600 },
    BlurayPackage: { price: 300 },
    TwoDayEvent: { price: 400 },
  },
  "2021": {
    Photography: { price: 1800 },
    VideoRecording: { price: 1800 },
    WeddingSession: { price: 600 },
    BlurayPackage: { price: 300 },
    TwoDayEvent: { price: 400 },
  },
  "2022": {
    Photography: { price: 1900 },
    VideoRecording: { price: 1900 },
    WeddingSession: { price: 600 },
    BlurayPackage: { price: 300 },
    TwoDayEvent: { price: 400 },
  },
};

const packagePrices: ServicePackagePricing = {
  //TODO: this obviously could be changed to other discount-related info which will omit duplicates/use greater discount
  "2020": {
    Photography_VideoRecording: { price: 2200 },
    WeddingSession_Photography: { price: 2000 },
    WeddingSession_VideoRecording: { price: 2000 },
    WeddingSession_VideoRecording_Photography: { price: 2500 },
  },
  "2021": {
    Photography_VideoRecording: { price: 2300 },
    WeddingSession_Photography: { price: 2100 },
    WeddingSession_VideoRecording: { price: 2100 },
    WeddingSession_VideoRecording_Photography: { price: 2600 },
  },
  "2022": {
    Photography_VideoRecording: { price: 2500 },
    WeddingSession_Photography: { price: 1900 },
    WeddingSession_VideoRecording: { price: 2200 },
    WeddingSession_VideoRecording_Photography: { price: 2500 },
  },
};

const requiredServices: ServiceDependencies = {
  BlurayPackage: ["VideoRecording"],
  Photography: [],
  TwoDayEvent: ["Photography", "VideoRecording"],
  VideoRecording: [],
  WeddingSession: [],
};

export const updateSelectedServices = (
  previouslySelectedServices: ServiceType[],
  action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
  const selectedServices = [...previouslySelectedServices];

  switch (action.type) {
    case "Select":
      return selectService();
    case "Deselect":
      return deselectService();

    default:
      return selectedServices;
  }

  function selectService() {
    const required = requiredServices[action.service];
    if (
      required.length > 0 &&
      !selectedServices.some((selected) => required.includes(selected))
    )
      return selectedServices;

    if (!selectedServices.includes(action.service))
      selectedServices.push(action.service);

    return selectedServices;
  }

  function deselectService() {
    if (!selectedServices.includes(action.service)) return selectedServices;

    let updatedServices = selectedServices.filter(
      (ss) => ss !== action.service
    );
    const dependentServices = Object.keys(requiredServices).filter((service) =>
      requiredServices[service as ServiceType].includes(action.service)
    ) as ServiceType[];

    var hasOtherRequiredServicesSelected =
      dependentServices !== null && dependentServices.length > 0
        ? requiredServices[dependentServices[0]]
            .filter((req) => req !== action.service)
            .filter((req) => updatedServices.includes(req)).length > 0
        : false;
    if (hasOtherRequiredServicesSelected) {
      return updatedServices;
    }

    return updatedServices.filter(
      (service) => !dependentServices.includes(service)
    );
  }
};

export const calculatePrice = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
) => {
  let totalBasePrice = calculateBasePrice(selectedServices, selectedYear);
  let { finalPrice, hasDiscounts } = getPackagesPrice(
    selectedServices,
    selectedYear
  );
  finalPrice =
    finalPrice +
    getPriceForOutOfPackagesServices(selectedServices, selectedYear);
    
  return {
    basePrice: totalBasePrice,
    finalPrice: hasDiscounts ? finalPrice : totalBasePrice,
  };
};

function calculateBasePrice(
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
) {
  let totalBasePrice = 0;
  selectedServices.forEach((selectedService) => {
    totalBasePrice =
      totalBasePrice + basePrices[selectedYear][selectedService].price;
  });

  return totalBasePrice;
}

function getPackagesPrice(
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
) {
  let finalPrice = 0;
  const packages = getPackages(selectedServices);
  if (packages.length > 0)
    packages.forEach((pack) => {
      finalPrice = finalPrice + packagePrices[selectedYear][pack].price;
    });

  return { finalPrice: finalPrice, hasDiscounts: packages.length > 0 };
}

function getPriceForOutOfPackagesServices(
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
) {
  let finalPrice = 0;
  selectedServices
    .filter(
      (selectedService) =>
        selectedService !== "Photography" &&
        selectedService !== "VideoRecording" &&
        selectedService !== "WeddingSession"
    )
    .forEach((selectedService) => {
      finalPrice = finalPrice + basePrices[selectedYear][selectedService].price;
    });

  return finalPrice;
}

function getPackages(selectedServices: ServiceType[]) {
  let packages: ServicePackage[] = [];
  if (
    selectedServices.includes("Photography") &&
    selectedServices.includes("VideoRecording") &&
    selectedServices.includes("WeddingSession")
  ) {
    packages.push("WeddingSession_VideoRecording_Photography");
    return packages;
  }

  if (
    selectedServices.includes("Photography") &&
    selectedServices.includes("VideoRecording")
  ) {
    packages.push("Photography_VideoRecording");
  }

  if (
    selectedServices.includes("Photography") &&
    selectedServices.includes("WeddingSession")
  ) {
    packages.push("WeddingSession_Photography");
  }

  if (
    selectedServices.includes("VideoRecording") &&
    selectedServices.includes("WeddingSession")
  ) {
    packages.push("WeddingSession_VideoRecording");
  }

  return packages;
}
