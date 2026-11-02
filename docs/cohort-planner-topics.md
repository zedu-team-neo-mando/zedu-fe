# Weekly topics in the Cohort Communication Planner

At `/resources/cohort-communication-planner`, enter one curriculum topic per line.
Use `Week N: Topic` to reserve a particular week, or plain lines to fill the
remaining weeks in input order. Explicit weeks are reserved first regardless of
where they appear, so this input preserves all three topics:

```text
Introduction
Week 1: HTML
Week 3: JavaScript
```

Week 1 is HTML, week 2 is Introduction, and week 3 is JavaScript. When a week
number appears twice, the first entry is kept and the plan's notices identify
the conflicting week. Give the later topic another week number to include it.
Out-of-range and excess topics have a separate overflow notice. The selected
duration determines the number of weeks.

The screen, copied/downloaded Markdown and printed playbook all use the same
generated plan. Nothing is stored or sent to a server.

The parser and notices live in
[`generate-plan.ts`](<../src/app/(homepage)/_components/cohort-planner/generate-plan.ts>).
Run the focused checks with dependencies installed:

```sh
node --test 'src/app/(homepage)/_components/cohort-planner/generate-plan.test.mjs'
```

For manual verification, generate the example above and a duplicate-week example,
inspect the roadmap and notices, and compare copied/downloaded output. Check at
phone and desktop widths in both themes.
