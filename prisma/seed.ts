import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

// Curated, verified list of active Slovak NGOs — researched and fact-checked
// against their official sites (2026-09-13). Swap freely if priorities change.
const CHARITIES = [
  {
    name: "Človek v ohrození",
    category: "Humanitarian & Disaster Relief",
    description:
      "Delivers humanitarian and development aid abroad and supports human rights and marginalized communities within Slovakia.",
    logoUrl: "/charities/clovek-v-ohrozeni.svg",
    websiteUrl: "https://clovekvohrozeni.sk/",
  },
  {
    name: "Mareena",
    category: "Human Rights & Minorities",
    description:
      "Helps migrants and refugees integrate into Slovak society through volunteering, education, and community events.",
    logoUrl: "/charities/mareena.svg",
    websiteUrl: "https://mareena.sk/",
  },
  {
    name: "Lesoochranárske zoskupenie VLK",
    category: "Environment & Wildlife",
    description:
      "Protects Slovakia's old-growth forests and large carnivores by creating strictly protected, human-free wilderness reserves.",
    logoUrl: "/charities/vlk.jpg",
    websiteUrl: "https://www.wolf.sk/",
  },
  {
    name: "Humánny pokrok",
    category: "Animal Welfare",
    description:
      "Campaigns against factory farming and for animal-welfare law reform and public education in Slovakia.",
    logoUrl: "/charities/humanny-pokrok.png",
    websiteUrl: "https://humannypokrok.sk/",
  },
  {
    name: "Nadácia Milana Šimečku",
    category: "Human Rights & Minorities",
    description:
      "Foundation defending human and minority rights in Slovakia, focused on historical memory, diversity, and inclusion.",
    logoUrl: "/charities/nadacia-milana-simecku.svg",
    websiteUrl: "https://nadaciamilanasimecku.sk/",
  },
  {
    name: "Nadácia pre deti Slovenska",
    category: "Children & Family",
    description:
      "Nationwide grant-making foundation funding programs that support children, youth, and families across Slovakia.",
    logoUrl: "/charities/nadacia-pre-deti-slovenska.svg",
    websiteUrl: "https://www.nds.sk/",
  },
  {
    name: "Plamienok",
    category: "Health & Disability",
    description:
      "Slovakia's pioneering children's home hospice, providing free palliative care and grief support to families.",
    logoUrl: "/charities/plamienok.png",
    websiteUrl: "https://www.plamienok.sk/",
  },
  {
    name: "Vagus",
    category: "Poverty & Homelessness",
    description:
      "Runs street outreach, a low-threshold day centre, and reintegration support for homeless people in Bratislava.",
    logoUrl: "/charities/vagus.png",
    websiteUrl: "https://vagus.sk/",
  },
  {
    name: "DEBRA Slovensko",
    category: "Health & Disability",
    description:
      'Supports patients with epidermolysis bullosa ("butterfly skin") and their families with supplies and advocacy.',
    logoUrl: "/charities/debra-slovensko.svg",
    websiteUrl: "https://www.debra-slovakia.org/",
  },
  {
    name: "Liga za duševné zdravie SR",
    category: "Health & Disability",
    description:
      "Umbrella body of nearly 40 groups promoting mental health and running Slovakia's Nezábudka crisis helpline.",
    logoUrl: "/charities/liga-za-dusevne-zdravie.png",
    websiteUrl: "https://dusevnezdravie.sk/",
  },
  {
    name: "Únia nevidiacich a slabozrakých Slovenska",
    category: "Health & Disability",
    description:
      "Represents and supports blind and visually impaired Slovaks through counselling, rehabilitation, and accessibility work.",
    logoUrl: "/charities/unss.png",
    websiteUrl: "https://unss.sk/",
  },
  {
    name: "Nadácia Pontis",
    category: "Education & Community Development",
    description:
      "Connects businesses, NGOs, and government on projects addressing education, anti-corruption, and poverty in Slovakia.",
    logoUrl: "/charities/nadacia-pontis.png",
    websiteUrl: "https://www.nadaciapontis.sk/",
  },
  {
    name: "Cesta von",
    category: "Poverty & Homelessness",
    description:
      'Trains local "omama" mentors to support early childhood development and help families exit generational poverty.',
    logoUrl: "/charities/cesta-von.svg",
    websiteUrl: "https://cestavon.sk/",
  },
  {
    name: "Slovenský Červený kríž",
    category: "Humanitarian & Disaster Relief",
    description:
      "National Red Cross branch coordinating disaster relief, blood donation, first-aid training, and humanitarian volunteering.",
    logoUrl: "/charities/slovensky-cerveny-kriz.svg",
    websiteUrl: "https://redcross.sk/",
  },
  {
    name: "Áno pre život",
    category: "Children & Family",
    description:
      "Runs shelters and counselling for pregnant women in crisis and for mothers and children fleeing domestic violence.",
    logoUrl: "/charities/ano-pre-zivot.png",
    websiteUrl: "https://anoprezivot.sk/",
  },
  {
    name: "eduRoma",
    category: "Education & Community Development",
    description:
      "Supports school inclusion and education access for Roma children and marginalized communities.",
    logoUrl: "/charities/eduroma.png",
    websiteUrl: "https://eduroma.sk",
  },
  {
    name: "Depaul Slovensko",
    category: "Poverty & Homelessness",
    description:
      "Runs shelters and street outreach offering food, hygiene, and case-work help to homeless people.",
    logoUrl: "/charities/depaul-slovensko.svg",
    websiteUrl: "https://depaul.sk",
  },
  {
    name: "Liga proti rakovine",
    category: "Health & Disability",
    description:
      "Independent association funding oncology support, a patient helpline, and cancer-prevention campaigns since 1990.",
    logoUrl: "/charities/liga-proti-rakovine.png",
    websiteUrl: "https://www.lpr.sk",
  },
  {
    name: "Návrat",
    category: "Children & Family",
    description:
      "Recruits, trains, and supports foster and adoptive families for children without parental care.",
    logoUrl: "/charities/navrat.svg",
    websiteUrl: "https://www.navrat.sk",
  },
  {
    name: "Úsmev ako dar",
    category: "Children & Family",
    description:
      "Slovakia's oldest child-welfare NGO, helping at-risk families stay together and supporting youth leaving care.",
    logoUrl: "/charities/usmev-ako-dar.png",
    websiteUrl: "https://www.usmev.sk",
  },
  {
    name: "Dobrý anjel",
    category: "Health & Disability",
    description:
      "Collects monthly donations and channels them transparently to families facing a parent's or child's serious illness.",
    logoUrl: "/charities/dobry-anjel.svg",
    websiteUrl: "https://dobryanjel.sk",
  },
  {
    name: "Greenpeace Slovensko",
    category: "Environment & Wildlife",
    description:
      "Slovak branch of the global network campaigning on climate, pollution, and nature-protection issues.",
    logoUrl: "/charities/greenpeace-slovensko.svg",
    websiteUrl: "https://www.greenpeace.org/slovakia",
  },
  {
    name: "SOSNA",
    category: "Environment & Wildlife",
    description:
      "Eastern-Slovak civic group promoting sustainable rural development, river restoration, and nature education since 1992.",
    logoUrl: "/charities/sosna.png",
    websiteUrl: "https://www.sosna.sk",
  },
  {
    name: "Strom života",
    category: "Environment & Wildlife",
    description:
      "Delivers outdoor and experiential environmental-education programs for Slovak children and youth.",
    logoUrl: "/charities/strom-zivota.svg",
    websiteUrl: "https://stromzivota.sk",
  },
  {
    name: "Amnesty International Slovensko",
    category: "Human Rights & Minorities",
    description:
      "Slovak office of the worldwide movement campaigning against human-rights violations and for civil liberties.",
    logoUrl: "/charities/amnesty-international-slovensko.jpg",
    websiteUrl: "https://www.amnesty.sk",
  },
  {
    name: "Iniciatíva Inakosť",
    category: "Human Rights & Minorities",
    description:
      "Advocates for LGBTI rights in Slovakia and runs a counseling and community center in Bratislava.",
    logoUrl: "/charities/iniciativa-inakost.svg",
    websiteUrl: "https://inakost.sk",
  },
  {
    name: "Sloboda zvierat",
    category: "Animal Welfare",
    description:
      "Nationwide animal-protection group running shelters and lobbying for stronger Slovak animal-welfare laws.",
    logoUrl: "/charities/sloboda-zvierat.png",
    websiteUrl: "https://slobodazvierat.sk",
  },
  {
    name: "Transparency International Slovensko",
    category: "Education & Community Development",
    description:
      "Researches and publicizes corruption cases while pushing for more transparent Slovak public institutions.",
    logoUrl: "/charities/transparency-international-slovensko.svg",
    websiteUrl: "https://transparency.sk",
  },
  {
    name: "Slovenská nadácia pre UNICEF",
    category: "Children & Family",
    description:
      "The independently registered Slovak foundation that raises local funds for UNICEF's international child programs.",
    logoUrl: "/charities/slovenska-nadacia-pre-unicef.jpg",
    websiteUrl: "https://unicef.sk",
  },
  {
    name: "Nadácia Výskum rakoviny",
    category: "Health & Disability",
    description:
      "Funds Slovak oncology research aimed at making cancer treatment more effective and reliably curable.",
    logoUrl: "/charities/nadacia-vyskum-rakoviny.svg",
    websiteUrl: "https://www.nvr.sk",
  },
  {
    name: "Nota bene",
    category: "Poverty & Homelessness",
    description: "Street newspaper sold by homeless vendors, published by the association Proti prúdu since 2001.",
    logoUrl: "/charities/nota-bene.svg",
    websiteUrl: "https://www.notabene.sk",
  },
  {
    name: "OZ Odyseus",
    category: "Poverty & Homelessness",
    description:
      "Provides harm-reduction services, needle exchange, and outreach to drug users, sex workers, and homeless people.",
    logoUrl: "/charities/oz-odyseus.png",
    websiteUrl: "https://www.ozodyseus.sk",
  },
  {
    name: "Slovenský skauting",
    category: "Education & Community Development",
    description:
      "Slovakia's national scouting association running outdoor and character-development programs for children and youth.",
    logoUrl: "/charities/slovensky-skauting.png",
    websiteUrl: "https://skauting.sk",
  },
  {
    name: "ADRA Slovensko",
    category: "Humanitarian & Disaster Relief",
    description:
      "Slovak branch of an international network delivering disaster relief and development-aid projects abroad and locally.",
    logoUrl: "/charities/adra-slovensko.png",
    websiteUrl: "https://www.adra.sk",
  },
  {
    name: "Slovenská aliancia ochrancov zvierat",
    category: "Animal Welfare",
    description:
      "Alliance of Slovak groups funding shelters, coordinating foster care, and animal-protection legislation.",
    logoUrl: "/charities/saoz.png",
    websiteUrl: "https://www.saoz.sk/",
  },
  {
    name: "Zvierací ombudsman",
    category: "Animal Welfare",
    description: "Legal-advocacy initiative fighting for stricter Slovak animal-cruelty laws and enforcement.",
    logoUrl: "/charities/zvieraci-ombudsman.png",
    websiteUrl: "https://zvieraciombudsman.sk/",
  },
  {
    name: "Nádej pre kone a ľudí",
    category: "Animal Welfare",
    description: "Runs a horse-rescue shelter near Macov and campaigns for equine-welfare legislation.",
    logoUrl: "/charities/nadej-pre-kone-a-ludi.png",
    websiteUrl: "https://www.nadejprekonealudi.sk/",
  },
  {
    name: "Nadácia Ekopolis",
    category: "Environment & Wildlife",
    description:
      "Grant-making foundation since 1991 funding community environmental and public-space projects nationwide.",
    logoUrl: "/charities/nadacia-ekopolis.svg",
    websiteUrl: "https://ekopolis.sk/",
  },
  {
    name: "VIA IURIS",
    category: "Human Rights & Minorities",
    description: "Legal watchdog defending civil liberties, rule of law, and citizens' access to justice.",
    logoUrl: "/charities/via-iuris.png",
    websiteUrl: "https://viaiuris.sk/",
  },
  {
    name: "Slovenská humanitná rada",
    category: "Humanitarian & Disaster Relief",
    description:
      "National umbrella council coordinating over 160 charitable organizations and refugee-support programs.",
    logoUrl: "/charities/slovenska-humanitna-rada.png",
    websiteUrl: "https://shr.sk/",
  },
  {
    name: "Únia materských centier",
    category: "Children & Family",
    description:
      "Umbrella network linking Slovak maternity and family centers that support parents of young children.",
    logoUrl: "/charities/unia-materskych-centier.png",
    websiteUrl: "https://www.materskecentra.sk/",
  },
  {
    name: "Občianske združenie STOPA Slovensko",
    category: "Poverty & Homelessness",
    description: "Runs housing-first and social-counseling programs to end street homelessness in Bratislava.",
    logoUrl: "/charities/stopa-slovensko.png",
    websiteUrl: "https://www.stopaslovensko.sk/",
  },
  {
    name: "Nadácia Orange",
    category: "Education & Community Development",
    description: "Corporate foundation granting funds for digital literacy, inclusion, and local community initiatives.",
    logoUrl: "/charities/nadacia-orange.jpg",
    websiteUrl: "https://www.nadaciaorange.sk/",
  },
  {
    name: "Centrum environmentálnej a etickej výchovy Živica",
    category: "Education & Community Development",
    description: "Runs Slovakia's Green School program and an eco-education center training people in sustainability.",
    logoUrl: "/charities/zivica.svg",
    websiteUrl: "https://zivica.sk/",
  },
];

async function main() {
  const keepNames = CHARITIES.map((c) => c.name);
  await prisma.charity.deleteMany({ where: { name: { notIn: keepNames } } });

  for (const charity of CHARITIES) {
    await prisma.charity.upsert({
      where: { name: charity.name },
      update: charity,
      create: charity,
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
