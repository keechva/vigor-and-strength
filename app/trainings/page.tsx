import type { Metadata } from "next";
import { TrainingsHero } from "@/app/_components/trainings/TrainingsHero";
import { TrainingsIntro } from "@/app/_components/trainings/TrainingsIntro";
import { TrainingsKungfu } from "@/app/_components/trainings/TrainingsKungfu";
import { TrainingsCoach } from "@/app/_components/trainings/TrainingsCoach";
import { TrainingsRoadmap } from "@/app/_components/trainings/TrainingsRoadmap";
import { TrainingsCrossLinks } from "@/app/_components/trainings/TrainingsCrossLinks";
import { TrainingsContact } from "@/app/_components/trainings/TrainingsContact";
import { Footer } from "@/app/_components/Footer";

export const metadata: Metadata = {
  title: "Тренировки — Бодрость и Сила",
  description:
    "Тренировки в Оренбурге. Сейчас работаем по кунгфу с индивидуальным и групповым форматом. Дальше — медитации и работа с дыханием. Сбор листа ожидания.",
};

export default function TrainingsPage() {
  return (
    <main>
      <TrainingsHero />
      <div className="bridge-warm-in" aria-hidden="true" />
      <TrainingsIntro />
      <TrainingsKungfu />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <TrainingsCoach />
      <div className="bridge-cool-to-warm" aria-hidden="true" />
      <TrainingsRoadmap />
      <div className="bridge-warm-to-cool" aria-hidden="true" />
      <TrainingsCrossLinks />
      <div className="bridge-cool-to-neutral" aria-hidden="true" />
      <TrainingsContact />
      <div className="bridge-cool-to-darkneutral" aria-hidden="true" />
      <Footer />
    </main>
  );
}
