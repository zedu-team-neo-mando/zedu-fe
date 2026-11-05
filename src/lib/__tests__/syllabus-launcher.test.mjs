import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  slugifyChannelName,
  formatWeekSlug,
  extractCourseCode,
  generateAnnouncementPost,
  generateWelcomeTemplate,
  parseRawSyllabusText,
} from "../../app/(homepage)/_components/launch/syllabus-parser.ts";

describe("Syllabus-to-Workspace AI Launcher", () => {
  it("slugifies channel names into clean lowercase strings", () => {
    const slug1 = slugifyChannelName("Week 1: Modern JavaScript & DOM Events!");
    assert.equal(slug1, "week-1-modern-javascript-dom-events");

    const slugWithPrefix = slugifyChannelName("Database Schemas", "week-04");
    assert.equal(slugWithPrefix, "week-04-database-schemas");
  });

  it("formats week numbers with leading zeros", () => {
    assert.equal(formatWeekSlug(1), "01");
    assert.equal(formatWeekSlug(9), "09");
    assert.equal(formatWeekSlug(10), "10");
    assert.equal(formatWeekSlug(14), "14");
  });

  it("extracts course codes from syllabus text headers", () => {
    const text1 = "CS 106A: Programming Methodology and Web Apps";
    assert.equal(extractCourseCode(text1), "CS 106A");

    const text2 = "Syllabus for INFO 202: Data Design and Storage Systems";
    assert.equal(extractCourseCode(text2), "INFO 202");

    const fallback = "General Software Engineering Bootcamp";
    assert.equal(extractCourseCode(fallback), "COURSE-101");
  });

  it("generates structured weekly announcement posts", () => {
    const post = generateAnnouncementPost(
      2,
      "React Component State",
      ["Hooks", "Lifecycle"],
      [
        {
          id: "1",
          title: "Lab 2: Todo App",
          dueDate: "Sunday",
          type: "homework",
        },
      ]
    );

    assert.ok(post.includes("Welcome to Week 2: React Component State"));
    assert.ok(post.includes("• Hooks"));
    assert.ok(post.includes("Lab 2: Todo App"));
    assert.ok(post.includes("Buzz voice room"));
  });

  it("generates student welcome email template", () => {
    const template = generateWelcomeTemplate(
      "Intro to Computer Science",
      "Prof. Smith",
      "/join/cs101"
    );

    assert.ok(
      template.includes("Welcome to Intro to Computer Science on Zedu Chat!")
    );
    assert.ok(template.includes("/join/cs101"));
    assert.ok(template.includes("Prof. Smith"));
  });

  it("parses structured syllabus text into modules, assignments, and office hours", () => {
    const syllabus = `
# CS 106A: Fullstack Web Development
Instructor: Dr. Sarah Chen

Week 1: TypeScript and Runtimes
- Introduction to Node.js
- Strict TypeScript configuration
- Assignment 1: Vector Math Library due Friday

Week 2: React Component Hierarchy
- Declarative state machines
- Custom hooks architecture
- Project 1: Collaborative Kanban Board due Sunday
    `.trim();

    const result = parseRawSyllabusText(syllabus, "cs106a.md");

    assert.equal(result.courseName, "CS 106A: Fullstack Web Development");
    assert.equal(result.code, "CS 106A");
    assert.equal(result.instructor, "Dr. Sarah Chen");
    assert.equal(result.modules.length, 2);

    const mod1 = result.modules[0];
    assert.equal(mod1.weekNumber, 1);
    assert.equal(mod1.channelName, "week-01-typescript-and-runtimes");
    assert.equal(mod1.assignments.length, 1);
    assert.equal(
      mod1.assignments[0].title,
      "Assignment 1: Vector Math Library due Friday"
    );

    const mod2 = result.modules[1];
    assert.equal(mod2.weekNumber, 2);
    assert.equal(mod2.channelName, "week-02-react-component-hierarchy");
    assert.equal(mod2.assignments.length, 1);

    assert.equal(result.officeHours.length, 2);
  });

  it("provides structured fallback modules when parsing unstructured documents", () => {
    const unstructured =
      "Quick notes for an intensive web engineering workshop.";
    const result = parseRawSyllabusText(unstructured);

    assert.ok(result.modules.length >= 6);
    assert.equal(result.modules[0].weekNumber, 1);
    assert.ok(result.modules[0].channelName.startsWith("week-01-"));
  });
});
