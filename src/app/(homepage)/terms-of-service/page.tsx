"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SectionWrapper from "./_components/SectionWrapper";

function TermsOfService() {
  const [activeSection, setActiveSection] = useState<string>("");

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.25,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    sections.forEach((section) => {
      observer.observe(section);
      sectionRefs.current[section.id] = section as HTMLElement;
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <SectionWrapper container="wide" variant="small">
      <div className="w-full flex py-8 ">
        <div className="hidden w-[314px] md:block mt-28 top-16 sticky self-start">
          <p className="text-2xl font-semibold leading-8 text-stone-900">
            Contents
          </p>
          <ul className="list-decimal p-4 flex flex-col gap-5 text-zinc-800">
            <Link href="#acceptance">
              <li
                className={`hover:text-blue-500 ${
                  activeSection === "acceptance" ? "text-blue-500" : ""
                }`}
              >
                Acceptance of Terms
              </li>
            </Link>
            <Link href="#use">
              <li
                className={`hover:text-blue-500 ${
                  activeSection === "use" ? "text-blue-500" : ""
                }`}
              >
                Use of the App
              </li>
            </Link>
            <Link href="#user-content">
              <li
                className={`hover:text-blue-500 ${
                  activeSection === "user-content" ? "text-blue-500" : ""
                }`}
              >
                User Content
              </li>
            </Link>
            <Link href="#privacy">
              <li
                className={`hover:text-blue-500 ${
                  activeSection === "privacy" ? "text-blue-500" : ""
                }`}
              >
                Privacy
              </li>
            </Link>
            <Link href="#intellectual-property">
              <li
                className={`hover:text-blue-500 ${
                  activeSection === "intellectual-property"
                    ? "text-blue-500"
                    : ""
                }`}
              >
                Intellectual Property
              </li>
            </Link>
            <Link href="#subscription">
              <li
                className={`hover:text-blue-500 ${
                  activeSection === "subscription" ? "text-blue-500" : ""
                }`}
              >
                Subscription &amp; Payment
              </li>
            </Link>
            <Link href="#liability">
              <li
                className={`hover:text-blue-500 ${
                  activeSection === "liability" ? "text-blue-500" : ""
                }`}
              >
                Limitation of Liability
              </li>
            </Link>
            <Link href="#termination">
              <li
                className={`hover:text-blue-500 ${
                  activeSection === "termination" ? "text-blue-500" : ""
                }`}
              >
                Termination
              </li>
            </Link>
            <Link href="#governing-law">
              <li
                className={`hover:text-blue-500 ${
                  activeSection === "governing-law" ? "text-blue-500" : ""
                }`}
              >
                Governing Law
              </li>
            </Link>
          </ul>
        </div>

        <div className="mt-16 md:mt-10 w-[375px] md:w-[700px] lg:w-[815px] py-3 px-5 text-black">
          <p className="text-2xl md:text-4xl font-semibold leading-10 pb-5">
            Terms of Service
          </p>

          <section id="acceptance" className="p-5">
            <h2 className="text-base lg:text-xl font-semibold">
              Acceptance of Terms
            </h2>
            <p className="text-[#5C5C5C] text-sm lg:text-xl">
              By downloading, installing, or using the Zedu App, you agree to
              these Terms and any future updates or modifications. We reserve
              the right to update these Terms at any time, and your continued
              use of the App constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section id="use" className="p-5">
            <h2 className="text-base lg:text-xl font-semibold">
              Use of the App
            </h2>
            <p className="text-[#5C5C5C] text-sm lg:text-xl">
              The Zedu App is a workflow automation platform that uses AI agents
              to streamline processes like content creation, invoice processing,
              customer engagement, document handling, and other business
              operations for enterprise teams and individuals. You agree to use
              the App only for lawful purposes and in accordance with these
              Terms. You agree not to:
            </p>
            <ul className="list-disc ml-5 my-2 text-[#5C5C5C] text-sm lg:text-xl">
              <li>
                Use the App in any manner that could disable, overburden,
                damage, or impair the App.
              </li>
              <li>
                Use any automated means, including robots, spiders, or scrapers,
                to access the App for any purpose without our prior written
                consent.
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the App,
                other users' accounts, or any related networks or systems.
              </li>
            </ul>
          </section>

          <section id="user-content" className="p-5">
            <h2 className="text-base lg:text-xl font-semibold">User Content</h2>
            <p className="text-[#5C5C5C] text-sm lg:text-xl">
              You may be able to submit, upload, or otherwise make available
              content, including notifications and messages, through the App
              ("User Content"). You retain ownership of your User Content, but
              you grant us a worldwide, non-exclusive, royalty-free license to
              use, distribute, modify, and display your User Content in
              connection with operating the App. You are solely responsible for
              the accuracy, quality, and legality of your User Content.
            </p>
          </section>

          <section id="privacy" className="p-5">
            <h2 className="text-base lg:text-xl font-semibold">Privacy</h2>
            <p className="text-[#5C5C5C] text-sm lg:text-xl">
              Your use of the Zedu App is subject to our Privacy Policy, which
              is incorporated into these Terms by reference. Please review our
              Privacy Policy to understand how we collect, use, and protect your
              personal information.
            </p>
          </section>

          <section id="intellectual-property" className="p-5">
            <h2 className="text-base lg:text-xl font-semibold">
              Intellectual Property
            </h2>
            <p className="text-[#5C5C5C] text-sm lg:text-xl">
              The Zedu App, including its design, features, and functionality,
              is the exclusive property of Zedu and is protected by copyright,
              trademark, and other intellectual property laws. You may not copy,
              modify, distribute, or create derivative works based on the App
              without our prior written consent.
            </p>
          </section>

          <section id="subscription" className="p-5">
            <h2 className="text-base lg:text-xl font-semibold">
              Subscription and Payment
            </h2>
            <p className="text-[#5C5C5C] text-sm lg:text-xl">
              Zedu offers subscription-based services or features. By
              subscribing, you agree to pay the applicable fees as described at
              the time of purchase. All payments are non-refundable.
            </p>
          </section>

          <section id="liability" className="p-5">
            <h2 className="text-base lg:text-xl font-semibold">
              Limitation of Liability
            </h2>
            <p className="text-[#5C5C5C] text-sm lg:text-xl">
              To the maximum extent permitted by applicable law, Zedu shall not
              be liable for any indirect, incidental, special, consequential, or
              punitive damages, including but not limited to loss of profits,
              data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ol className="list-decimal ml-5 text-[#5C5C5C] text-sm lg:text-xl">
              <li style={{ listStyleType: "lower-roman" }}>
                Your access to or use of or inability to access or use the App
              </li>
              <li style={{ listStyleType: "lower-roman" }}>
                Any conduct or content of any third party on the App
              </li>
              <li style={{ listStyleType: "lower-roman" }}>
                Unauthorized access, use, or alteration of your content.
              </li>
            </ol>
          </section>

          <section id="termination" className="p-5">
            <h2 className="text-base lg:text-xl font-semibold">Termination</h2>
            <p className="text-[#5C5C5C] text-sm lg:text-xl">
              We reserve the right to suspend or terminate your access to the
              App at any time, without notice or liability, if you violate these
              Terms or use the App in a way that could harm Zedu, its users, or
              third parties.
            </p>
          </section>

          <section id="governing-law" className="p-5">
            <h2 className="text-base lg:text-xl font-semibold">
              Governing Law
            </h2>
            <p className="text-[#5C5C5C] text-sm lg:text-xl">
              These Terms shall be governed by and construed in accordance with
              the laws of the United Kingdom, without regard to its conflict of
              law principles.
            </p>
          </section>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default TermsOfService;
