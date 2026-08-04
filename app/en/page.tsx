import type { Metadata } from "next";
import { HomePage } from "../../components/home-page";

export const metadata: Metadata = {
  title: "Zi Fang | 3D Perception, Embodied Intelligence & Medical Robotics",
  description:
    "Academic homepage of Zi Fang: freehand 3D ultrasound, neural fields, multi-sweep registration, medical-image semantics, and medical robotics.",
  alternates: {
    canonical: "/en/",
    languages: { "zh-CN": "/", en: "/en/" },
  },
};

export default function EnglishPage() {
  return <HomePage locale="en" />;
}
