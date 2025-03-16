import { Project } from "./types";

export const projects: Project[] = [
  {
    name: "Faro Study Designer ",
    id: "1",
    img: "/imgs/dark_spiral.jpg",
    skills: [
      "2",
      "3",
      "4",
      "5",
      "7",
      "8",
      "9",
      "11",
      "13",
      "15",
      "16",
      "17",
      "20",
      "23",
    ],
  },
  {
    name: "Various Inc Viewer",
    id: "2",
    img: "/imgs/streamer.jpg",
    skills: ["2", "3", "7", "8", "9", "10", "13", "17", "18", "21"],
  },
  {
    name: "Faro Data Analytics Dashboard POC",
    id: "5",
    img: "/imgs/clinical-data.jpg",
    skills: ["1", "12", "17"],
  },
  {
    name: "Faro B2C SSO Implementation",
    id: "6",
    img: "/imgs/lock.jpg",
    skills: ["19", "20"],
  },
  {
    name: "San Anselmo City Plan Website",
    previewImgs: ["/imgs/san_anselmo_preview.png"],
    id: "3",
    img: "/imgs/downtown.jpg",
    skills: ["6", "7", "8", "17", "18", "23"],
  },
  {
    name: "Launch Brigade Website",
    id: "4",
    img: "/imgs/rocket.jpg",
    skills: ["6", "7", "8", "17", "18", "21", "22", "23"],
  },
  {
    name: "LotLinx Website",
    id: "7",
    img: "/imgs/car.jpg",
    previewVideos: ["/imgs/lotlinx_preview.mov", "/imgs/lotlinx_preview2.mov"],
    skills: ["6", "7", "8"],
  },
  {
    name: "Metafold 3D MVP",
    id: "8",
    img: "/imgs/3dshapes.jpg",
    skills: ["3", "7", "8", "9"],
  },
];
