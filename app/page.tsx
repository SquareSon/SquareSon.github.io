import type { Metadata } from "next";
import { HomePage } from "../components/home-page";

export const metadata: Metadata = {
  title: "方子｜三维感知、具身智能与医疗机器人",
  description:
    "方子的学术个人主页：自由手三维超声、神经场、多扫查配准、医学影像语义与医疗机器人。",
  alternates: {
    canonical: "/",
    languages: { "zh-CN": "/", en: "/en/" },
  },
};

export default function Page() {
  return <HomePage locale="zh" />;
}
