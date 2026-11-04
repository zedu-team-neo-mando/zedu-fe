// Homepage testimonials (Ziki #2045). These are SAMPLE quotes: they are not from
// real users. Replace them with approved quotes and set `testimonialsAreSamples`
// to false; the "Sample content" label then disappears.

export const testimonialsAreSamples = true;

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  school: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Our cohort used to live in three chat apps and a shared drive. Now lessons, files and questions sit in one place.",
    name: "Sample Educator",
    role: "Bootcamp instructor",
    school: "Demo Bootcamp",
  },
  {
    quote:
      "Channels per class made it easy to see who needed help, and live sessions happen without sending a separate link.",
    name: "Sample Teacher",
    role: "Head of programmes",
    school: "Demo Academy",
  },
  {
    quote:
      "Students find announcements and past recordings faster, so I spend less time repeating myself.",
    name: "Sample Lecturer",
    role: "Course lead",
    school: "Demo University",
  },
];
