import React from "react";
import { Helmet } from "react-helmet-async";
import { PolicyLayout } from "./PolicyLayout";
import { usePageMeta } from "../../hooks/usePageMeta";

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | GenPDF</title>
        <meta
          name="description"
          content="Read GenPDF's privacy policy. We do not sell data, store uploaded files, or use invasive tracking technologies."
        />
        <link rel="canonical" href="https://genpdf.app/privacy" />
      </Helmet>

      <PolicyLayout title="Privacy Policy">
        <p>
          Your privacy is extremely important to us. GenPDF does not sell, rent, or share personal information with third parties.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect only information necessary to operate the service, such as optional contact messages or feedback submissions. Uploaded documents are processed temporarily and are not stored after processing is complete.
        </p>

        <h2>2. How We Use Information</h2>
        <ul>
          <li>To operate PDF conversion tools</li>
          <li>To respond to support requests</li>
          <li>To improve performance and reliability</li>
        </ul>

        <h2>3. Cookies & Analytics</h2>
        <p>
          GenPDF uses minimal, privacy-friendly analytics to understand general usage patterns. We do not use advertising trackers or cross-site profiling technologies.
        </p>

        <p className="text-sm text-slate-500 mt-8">
          Last updated: 2024
        </p>
      </PolicyLayout>
    </>
  );
};
