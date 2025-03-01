import { Project } from "./types";

export const projects: Project[] = [
  {
    name: "Faro Study Designer ",
    id: "1",
    description:
      "A clinical trial software tool that helps investigators design and optimize their clinical studies by providing real-time analytics and streamlining the planning process.",
    img: "/dark_spiral.jpg",
    content: [
      <div>
        <h3>Utilizing AI for clinical study development.</h3>
        <p>
          The company's flagship product, the Faro Study Designer, is designed
          to enhance the efficiency and patient-friendliness of clinical
          protocols.
        </p>
        <p>
          Faro Health has received significant investment, securing a total of
          $38.3 million in funding, with the most recent $20 million raised
          approximately two years ago.
        </p>
        <p>Key features include:</p>
        <div>
          <p>
            Real-time Collaboration: Facilitates accurate and efficient
            documentation processes.
          </p>
          <p>
            Feasibility Analysis: Assesses the impact of design decisions on
            study success rates.
          </p>
          <p>
            Benchmarking: Compares protocols with historical data and design
            variations.
          </p>
        </div>
      </div>,
    ],
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
    description: "A realtime video streaming and chat application",
    content: [
      <div>
        <p>
          The Viewer is an interactive webcam platform where users can engage in
          live video chats with performers, offering a real-time, personalized
          experience. The platform allows users to view live broadcasts,
          participate in private sessions, and connect with performers through
          video, audio, and chat features.
        </p>
      </div>,
    ],
    skills: ["2", "3", "7", "8", "9", "10", "13", "17", "18", "21"],
  },
  {
    name: "Faro Data Analytics Dashboard POC",
    id: "5",
    img: "/imgs/clinical-data.jpg",
    description: "",
    content: [],
    skills: ["1", "12", "17"],
  },
  {
    name: "Faro B2C SSO Implementation",
    id: "6",
    img: "/imgs/lock.jpg",
    description:
      "A IDP agnostic Single Sign On implementation for the study designer application.",
    content: [],
    skills: ["19", "20"],
  },
  {
    name: "San Anselmo City Plan Website",
    id: "3",
    description:
      "A survey and informational website about upcoming changes to for the city of San Anselmo",
    img: "/imgs/downtown.jpg",
    content: [],
    skills: ["6", "7", "8", "17", "18", "23"],
  },
  {
    name: "Launch Brigade Website",
    id: "4",
    description: "",
    content: [],
    skills: ["6", "7", "8", "17", "18", "21", "22", "23"],
  },
  {
    name: "LotLinx Website",
    id: "7",
    description: "",
    content: [],
    skills: ["6", "7", "8"],
  },
  {
    name: "Metafold 3D MVP",
    id: "8",
    description: "",
    content: [],
    skills: ["3", "7", "8", "9"],
  },
];
