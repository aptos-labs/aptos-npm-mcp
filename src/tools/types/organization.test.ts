import { describe, expect, it } from "vitest";

import {
  CreateApiKeyToolScheme,
  CreateOrganizationToolScheme,
} from "./organization.js";

describe("organization tool schemas", () => {
  it("parses create organization input", () => {
    const parsed = CreateOrganizationToolScheme.parse({
      name: "Example Org",
    });

    expect(parsed.name).toBe("Example Org");
  });

  it("parses create api key input", () => {
    const parsed = CreateApiKeyToolScheme.parse({
      application_id: "app-1",
      name: "My API Key",
      organization_id: "org-1",
      project_id: "project-1",
    });

    expect(parsed.application_id).toBe("app-1");
    expect(parsed.name).toBe("My API Key");
  });

  it("rejects invalid create api key input", () => {
    expect(() =>
      CreateApiKeyToolScheme.parse({
        application_id: "app-1",
        name: "My API Key",
        organization_id: "org-1",
      }),
    ).toThrow();
  });
});
