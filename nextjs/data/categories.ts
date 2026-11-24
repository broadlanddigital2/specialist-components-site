import type { Category } from "@/components/category/types";

/**
 * The live category tree, taken from the current site (7 top-level, 21 sub categories).
 * In the app, build this from your API. Image paths here point at the static demo's
 * local copies, so swap them for the API image URLs.
 */
export const categories: Category[] = [
  {
    "name": "Complete Crate Engines",
    "href": "/shop/complete-engines.html",
    "image": "/images/motor-1.webp",
    "subcategories": [
      {
        "name": "5 Port Rotrex Engines (S-Pack)",
        "href": "/shop/5-port-rotrex-engines-s-pack.html",
        "image": "/images/291d0714a792eed3541863b048764caf.webp"
      },
      {
        "name": "7 Port Engines",
        "href": "/shop/7-port-engines.html",
        "image": "/images/f7aa50340655eca3cf74a7d0aedd1173.webp"
      },
      {
        "name": "5 Port EFI Crate Engines",
        "href": "/shop/complete-a-series-crate-engines-n-a.html",
        "image": "/images/5_port_engine_017.webp"
      },
      {
        "name": "Supercharged Twinkam 16v Engines",
        "href": "/shop/supercharged-twinkam-16v-engines.html",
        "image": "/images/4cca4610d4f93ac845f0a37695b3fdf8.webp"
      },
      {
        "name": "Twinkam 16v Engines",
        "href": "/shop/twinkam-16v-engines.html",
        "image": "/images/18bf991b8c02ce8dd4ccb863ce58e003.webp"
      }
    ]
  },
  {
    "name": "Classic Mini Performance Parts",
    "href": "/shop/classic-mini-performance-parts.html",
    "image": "/images/car-1.webp",
    "subcategories": [
      {
        "name": "Classic Mini Fuel Injection and Management",
        "href": "/shop/classic-mini-injection-and-management.html",
        "image": "/images/0236b121579f9cede38578fdd9621c3e.webp"
      },
      {
        "name": "Classic Mini Split Rim Wheels",
        "href": "/shop/classic-mini-split-rim-wheels.html",
        "image": "/images/fb7a6124918df680372b6067ddd18e3a.webp"
      },
      {
        "name": "5 Port and 7 Port Cylinder Heads",
        "href": "/shop/5-port-7-port-cylinder-heads.html",
        "image": "/images/9bdc01abfe2e346e2a2ba9e957f8dc27.webp"
      },
      {
        "name": "Classic Mini Body and Chassis Components",
        "href": "/shop/classic-mini-suspension-components.html",
        "image": "/images/57b01fed7a84a53da0e9ad29f52fb8e3.webp"
      },
      {
        "name": "A-series Performance Packages",
        "href": "/shop/a-series-performance-packages.html",
        "image": "/images/eaac5b63180de94685ade45390d2c23e.webp"
      },
      {
        "name": "A Series Engine Components",
        "href": "/shop/a-series-engine-components.html",
        "image": "/images/8cac2330cb3247575f003d656f9e27de-trim.webp"
      },
      {
        "name": "Classic Mini Ancillaries and Accessories",
        "href": "/shop/classic-mini-accessories.html",
        "image": "/images/377a5d282f38b2587c1d77045f6080c1.webp"
      },
      {
        "name": "SC Merchandise",
        "href": "/shop/sc-merchandise.html",
        "image": "/images/f49389303e2f5772307f57dc54d17b32.webp"
      },
      {
        "name": "Classic Mini Interior Components",
        "href": "/shop/classic-mini-interior-components.html",
        "image": "/images/038b7baa34c420487d2e9a26932312b7.webp"
      }
    ]
  },
  {
    "name": "TwinKam 16v Conversion",
    "href": "/shop/twinkam-16v-conversion.html",
    "image": "/images/motor-6.webp",
    "subcategories": [
      {
        "name": "Twinkam 16v Cylinder Heads",
        "href": "/shop/twinkam-16v-cylinder-heads.html",
        "image": "/images/IMG_1389.webp"
      },
      {
        "name": "Twinkam Complete Engines",
        "href": "/shop/twinkam-complete-engines.html",
        "image": "/images/motor-3.webp"
      },
      {
        "name": "Twinkam Accessories",
        "href": "/shop/accessories.html",
        "image": "/images/motor-7-2.webp"
      },
      {
        "name": "Twinkam Conversion Kits",
        "href": "/shop/twinkam-conversion-kits.html",
        "image": "/images/details.webp"
      }
    ]
  },
  {
    "name": "Engine Management",
    "href": "/shop/engine-management.html",
    "image": "/images/motor-7.webp",
    "subcategories": [
      {
        "name": "Engine Management Accessories",
        "href": "/shop/engine-managemennt-accessories.html",
        "image": "/images/94eff54c367e3b9e2862a378dfd0cc5a.webp"
      },
      {
        "name": "MGB Engine Management",
        "href": "/shop/mgb-engine-management.html",
        "image": "/images/265b05fe739a328a18d06a20f79ae148.webp"
      },
      {
        "name": "Porsche Engine Management",
        "href": "/shop/posche-engine-management.html",
        "image": "/images/96601e611c2ea550ed8d94436c29d144.webp"
      }
    ]
  },
  {
    "name": "MG Performance Parts",
    "href": "/shop/mg-performance-parts.html",
    "image": "/images/motor-4.webp",
    "subcategories": []
  },
  {
    "name": "SC Cars",
    "href": "/shop/sc-cars.html",
    "image": "/images/car-1-2.webp",
    "subcategories": []
  },
  {
    "name": "Sale & Special Offers",
    "href": "/shop/sales-and-special-offers.html",
    "image": "/images/start.webp",
    "subcategories": []
  }
];
