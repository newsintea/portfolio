export type Label = "観光" | "自然" | "グルメ" | "温泉" | "文化" | "ドライブ";

export type TripLocation = {
  name: string;
  lat: number;
  lng: number;
  date?: string;
  photos?: string[];   // 複数写真（1枚目がサムネイルに使われる）
  memo?: string;
  labels?: Label[];
};

export type Trip = {
  id: string;
  title: string;
  date: string;
  color: string;
  locations: TripLocation[];
};

export const trips: Trip[] = [
  {
    id: "fukui-2024",
    title: "福井",
    date: "2024.02",
    color: "#2563EB",
    locations: [
      { name: "永平寺",                   lat: 36.0906, lng: 136.5247, date: "2024.02.23", photos: ["/images/trips/fukui/eiheiji.jpg", "/images/trips/fukui/eiheiji2.jpg"],                                         labels: ["文化"] },
      { name: "福井県立恐竜博物館",       lat: 36.0831, lng: 136.5066, date: "2024.02.23", photos: ["/images/trips/fukui/dinosaur.jpg"],                                                                                        labels: ["文化"] },
      { name: "平泉寺白山神社",           lat: 36.0436, lng: 136.5421, date: "2024.02.23", photos: ["/images/trips/fukui/heisenji.jpg"],                                                                                        labels: ["観光", "自然"] },
      { name: "一乗谷朝倉氏遺跡",         lat: 35.9998, lng: 136.2952, date: "2024.02.23", photos: ["/images/trips/fukui/ichijodani.jpg"],                                                                                      labels: ["文化"] },
      { name: "プラントピア",             lat: 35.9693, lng: 136.1183, date: "2024.02.24", photos: ["/images/trips/fukui/plantpia.jpg"],                                                                                        labels: ["自然"] },
      { name: "越前海岸 展望台",           lat: 35.9819, lng: 135.9655, date: "2024.02.24", photos: ["/images/trips/fukui/echizen-coast.jpg"],                                                                                   labels: ["自然", "ドライブ"] },
      { name: "五太古の滝",               lat: 36.0823, lng: 136.0449, date: "2024.02.24", photos: ["/images/trips/fukui/gotako.jpg", "/images/trips/fukui/gotako2.jpg"],                                                       labels: ["自然"] },
      { name: "東尋坊",                   lat: 36.2463, lng: 136.1229, date: "2024.02.24", photos: ["/images/trips/fukui/tojinbo.jpg", "/images/trips/fukui/tojinbo2.jpg", "/images/trips/fukui/tojinbo3.jpg"],                  labels: ["観光", "自然"] },
      { name: "三方五湖 レインボーライン", lat: 35.6012, lng: 135.8689, date: "2024.02.25", photos: ["/images/trips/fukui/mikata.jpg"],                                                                                          labels: ["自然", "ドライブ"] },
      { name: "日本海さかな街",           lat: 35.6395, lng: 136.0624, date: "2024.02.25", photos: ["/images/trips/fukui/sakana.jpg", "/images/trips/fukui/sakana2.jpg"],                                                        labels: ["グルメ"] },
    ],
  },
];
