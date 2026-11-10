import type { Product } from "@/components/product/types";

/**
 * Example data for the SC ECU USB-CAN PC Interface page.
 * Facts come from the current product page. Items marked SAMPLE are placeholders
 * to show the layout: replace them with real data before going live.
 */
export const ecuInterface: Product = {
  name: "SC ECU USB-CAN PC Interface",
  slug: "sc-ecu-usb-can-pc-interface",
  sku: "SC072",
  category: { name: "Engine Management", href: "/shop/engine-management.html" },
  price: 100,
  inStock: false,
  images: [
    { src: "http://api.specialist-components.co.uk/storage/348/1-img20241206114446.jpg" },
    { src: "http://api.specialist-components.co.uk/storage/349/2-img20241206114452.jpg" },
    { src: "http://api.specialist-components.co.uk/storage/350/3-img20241206114503.jpg" },
    { src: "http://api.specialist-components.co.uk/storage/351/4-img20241206114610.jpg" },
    { src: "http://api.specialist-components.co.uk/storage/352/5-img_20241206_114653.jpg" },
  ],
  // SAMPLE configurable options
  options: [
    {
      id: "cable",
      label: "Cable length",
      values: [
        { value: "1m", label: "1 m (included)" },
        { value: "3m", label: "3 m", priceDelta: 10 },
        { value: "5m", label: "5 m", priceDelta: 18 },
      ],
    },
    {
      id: "connector",
      label: "Connector",
      values: [
        { value: "usb-a", label: "USB-A (standard)" },
        { value: "usb-c", label: "USB-C", priceDelta: 5 },
      ],
    },
  ],
  description: {
    lead: "The new-generation CAN bus to USB interface for connecting your PC to Specialist Components ECUs, with faster communications in a robust enclosure.",
    paragraphs: ["View data from the ECU in real time, adjust parameters on the fly, and store your changes either in the ECU itself or on disk."],
    bullets: [
      "Faster communications than the previous interface",
      "Robust enclosure built for the workshop and the paddock",
      "Supplied with 1 m of cable and a USB connector",
      "Two micro LEDs on the rear; the red LED flashes while communicating with the ECU",
    ],
  },
  specs: [
    { label: "SKU", value: "SC072" },
    { label: "Interface", value: "CAN bus to USB" },
    { label: "Compatibility", value: "Specialist Components ECUs" },
    { label: "Cable", value: "1 m, with USB connector" },
    { label: "Indicators", value: "2 × micro LED (red flashes during ECU communication)" },
    { label: "Functions", value: "Live data view, parameter editing, save to ECU or disk" },
    // SAMPLE rows
    { label: "Operating system", value: "Windows 10 / 11" },
    { label: "Dimensions", value: "80 × 45 × 22 mm" },
    { label: "Weight", value: "95 g" },
  ],
  videoUrl: undefined, // e.g. "https://www.youtube-nocookie.com/embed/VIDEO_ID"
  faqs: [
    { question: "What's in the box?", answer: "The USB-CAN interface with 1 m of cable and a USB connector." },
    { question: "Which ECUs does it work with?", answer: "It's designed to connect your PC to Specialist Components ECUs. If you're not sure about your setup, give us a call and we'll check for you." },
    { question: "Can I change settings while the engine is running?", answer: "Yes. You can view live data, change parameters in real time, and then save them to the ECU or to disk." },
    { question: "How do I know it's communicating with the ECU?", answer: "There are two micro LEDs on the rear of the unit. The red LED flashes while it's talking to the ECU." },
    { question: "When will it be back in stock?", answer: "Call us on +44 (0)1953 789311 or email info@specialist-components.co.uk and we'll give you a lead time." },
  ],
};
