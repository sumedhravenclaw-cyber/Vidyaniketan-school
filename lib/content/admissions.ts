import type { AdmissionStep } from "@/lib/types";

/**
 * Admissions.
 *
 * The existing site advertises "Admission open" but publishes no process, no
 * class list, no dates and no eligibility criteria anywhere. None of that is
 * invented here — a parent could act on it, and a wrong date or a wrong
 * document list costs a family a school place.
 *
 * `admissionSteps` is therefore empty by design. The admissions page renders an
 * honest "contact the office" state until the school fills this in through the
 * CMS, and the page still carries everything that IS verified: the board, the
 * affiliation number, the published fee structure, and how to reach the office.
 */
export const admissionSteps: AdmissionStep[] = [];

/** Set from the CMS. Left null so no stale year is ever displayed. */
export const currentAdmissionCycle: string | null = null;

export const admissionContactNote =
  "Application forms, eligibility criteria and the current admission dates are issued by the school office. Please call or write, and the office will confirm the process for your child's class.";
