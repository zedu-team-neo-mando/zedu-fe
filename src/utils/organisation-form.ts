export const ORGANISATION_NAME_MIN_LENGTH = 2;
export const ORGANISATION_NAME_MAX_LENGTH = 255;

type OrganisationFormInput = {
  organisationName: string;
  organisationType: string;
  country?: string | null;
};

/**
 * Validates the create-organisation form. Shared by the onboarding page
 * (welcome/create-organization) and the in-app page (organization/create) so
 * both send the API the same checked payload.
 *
 * Returns the error message to show, or null when the form is valid. Values
 * are checked after trimming, and the name length counts characters rather
 * than UTF-16 units, so an emoji counts as one.
 */
export const validateOrganisationForm = ({
  organisationName,
  organisationType,
  country,
}: OrganisationFormInput): string | null => {
  const name = organisationName.trim();
  const type = organisationType.trim();

  if (!name) return "Please enter an organisation name.";

  const nameLength = Array.from(name).length;
  if (
    nameLength < ORGANISATION_NAME_MIN_LENGTH ||
    nameLength > ORGANISATION_NAME_MAX_LENGTH
  ) {
    return `Organisation name must be between ${ORGANISATION_NAME_MIN_LENGTH} and ${ORGANISATION_NAME_MAX_LENGTH} characters.`;
  }

  if (!type) return "Please enter an organisation type.";

  if (!country) return "Please select a country.";

  return null;
};
