import { useEffect } from "react";

export const useJsonLd = (schema: Record<string, any>) => {
  useEffect(() => {
    const scriptId = "jsonld-schema";

    // Remove old schema if navigating
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [schema]);
};
