import type { Metadata } from "next";
import { siteUrl } from "~/lib/env-urls";

export const metadata: Metadata = {
  title: "Team Ibis Contributors",
  description: "Meet the active members of Team Ibis contributing to Zedu.",
  alternates: {
    canonical: siteUrl("/contributors/ibis"),
  },
};

const contributors = [
  "@rotimi",
  "@debanjo_israel",
  "@ezekiel",
  "@Himesan",
  "@chukwus618",
  "@Ren",
  "@Damola",
  "@Adegbola",
  "@meklitseife86",
  "@emeka iwegbu",
  "@IheanachoVictory",
  "@Chinwendu Enyinnah",
  "@Ahurika",
  "@Toria",
  "@Habeeb",
  "@Diara",
  "@Winner",
  "@rugue",
  "@AdeneeyDev",
  "@Roy Ibemgbo",
  "@Gadus",
  "@Agad$",
  "@Katsayal",
  "@mariam",
  "@Michael",
  "@oladapo.jacob",
  "@Bee",
  "@Leke",
  "@abdillah issa",
  "@Richard oduh",
  "@andybundy",
  "@rhema omerah",
  "@Adebimpe",
  "@sophie",
  "@eshiet_inyang",
  "@adeniyi_peter",
  "@Adegoke Samuel Bamidele",
  "@Priest",
  "@ibironkeibikunlef",
  "@Inioluwa Oguntobi",
  "@Roland",
  "@TechLead",
  "@Taiwo",
  "@Dayve007",
];

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue-600">
            HNG Internship
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Team Ibis Contributors
          </h1>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Meet the members of Team Ibis who contributed to the Zedu platform.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {contributors.length} contributors
          </p>
        </div>

        {/* Contributors */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contributors.map((contributor) => (
            <li
              key={contributor}
              className="rounded-xl border border-border bg-background p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                {getInitials(contributor)}
              </div>

              <h2 className="break-words text-base font-semibold text-foreground">
                {contributor}
              </h2>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function getInitials(name: string) {
  return name
    .replace("@", "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
