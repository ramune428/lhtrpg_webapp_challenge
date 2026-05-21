import PageShell from "@/components/page-shell";
import CharacterGeneratorForm from "@/components/character/character-generator-form";
import {
  CharacterNoticeSection,
  CharacterPageHeader,
  EnemyToolLinkSection,
  HowToSection,
  InformationSection,
  ReferenceSection,
} from "@/components/character/character-static-sections";

export default function HomePage() {
  return (
    <PageShell current="character">
      <CharacterPageHeader />
      <CharacterNoticeSection />
      <EnemyToolLinkSection />
      <HowToSection />
      <CharacterGeneratorForm />
      <InformationSection />
      <ReferenceSection />
    </PageShell>
  );
}
