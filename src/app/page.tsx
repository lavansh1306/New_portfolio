import { AppProvider } from "@/components/providers/AppProvider";
import { Loader } from "@/components/ui/Loader";
import { Cursor } from "@/components/ui/Cursor";
import { HUD } from "@/components/story/HUD";
import { StoryWorld } from "@/components/story/StoryWorld";
import { Scene } from "@/components/story/Scene";
import { JourneyScene } from "@/components/story/JourneyScene";
import { Epilogue } from "@/components/story/Epilogue";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { TechUniverse } from "@/components/sections/TechUniverse";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Achievements } from "@/components/sections/Achievements";
import { Beyond } from "@/components/sections/Beyond";
import { story } from "@/content/profile";

const ch = (id: string) => story.find((c) => c.id === id)!;

export default function Home() {
  return (
    <AppProvider>
      <a
        href="#about"
        className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-signal focus:px-4 focus:py-2 focus:text-carbon"
      >
        Skip to content
      </a>
      <Loader />
      <Cursor />
      <HUD />
      <StoryWorld />
      <main>
        <div data-chapter="prologue">
          <Hero />
        </div>
        <div data-chapter="person">
          <Scene chapter={ch("person")} />
          <About />
        </div>
        <div data-chapter="roots">
          <JourneyScene chapterId="roots" />
        </div>
        <div data-chapter="toolkit">
          <Scene chapter={ch("toolkit")} />
          <TechUniverse />
        </div>
        <div data-chapter="builds">
          <Scene chapter={ch("builds")} />
          <Projects />
        </div>
        <div data-chapter="road">
          <JourneyScene chapterId="road" />
          <Experience />
        </div>
        <div data-chapter="arena">
          <Scene chapter={ch("arena")} />
          <Achievements />
        </div>
        <div data-chapter="beyond">
          <Scene chapter={ch("beyond")} />
          <Beyond />
        </div>
        <div data-chapter="signal" id="contact">
          <Epilogue />
        </div>
      </main>
    </AppProvider>
  );
}
