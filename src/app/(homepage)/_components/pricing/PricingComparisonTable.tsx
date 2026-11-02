import { ReactNode } from "react";
import { Bot } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type {
  PricingComparisonCellValue,
  PricingComparisonPlan,
  PricingComparisonSection,
  PricingComparisonSectionIcon,
} from "../../_lib/pricingComparisonData";
import { CallIcon, CheckIcon, CommunitiesIcon, ToolIcon } from "../svgs";
import { cn } from "~/lib/utils";
import { ShieldIcon } from "../svgs";

type PricingComparisonTableProps = {
  plans: PricingComparisonPlan[];
  section: PricingComparisonSection;
  title?: string;
  titleIcon?: ReactNode;
  sectionTitleIcon?: ReactNode;
  rowInfoIcon?: ReactNode;
  featureColumnLabel?: string;
  className?: string;
};

const renderCellValue = (value: PricingComparisonCellValue) => {
  if (typeof value === "boolean") {
    if (value) {
      return (
        <span className="inline-flex justify-center" aria-label="Included">
          <CheckIcon />
        </span>
      );
    }

    return <span aria-hidden="true">&nbsp;</span>;
  }

  if (value === null || value === undefined || value === "") {
    return <span aria-hidden="true">&nbsp;</span>;
  }

  return <span className="text-sm text-neutral-700">{value}</span>;
};

const renderSectionIcon = (icon?: PricingComparisonSectionIcon) => {
  switch (icon) {
    case "community":
      return <CommunitiesIcon />;
    case "communication":
      return <CallIcon />;
    case "learning":
      return <ToolIcon />;
    case "automation":
      return <Bot className="size-6 text-purple-500" />;
    case "security":
      return <ShieldIcon />;
    default:
      return null;
  }
};

export const PricingComparisonTable = ({
  plans,
  section,
  title,
  titleIcon,
  sectionTitleIcon,
  rowInfoIcon,
  className,
}: PricingComparisonTableProps) => {
  return (
    <div className={cn("w-full max-w-7xl text-left no-scrollbar", className)}>
      {title ? (
        <div className="mb-4 flex items-center gap-2">
          {titleIcon ? <span className="inline-flex">{titleIcon}</span> : null}
          <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl">
            {title}
          </h2>
        </div>
      ) : null}

      <Table className="min-w-[680px] table-fixed sm:min-w-[760px]">
        <colgroup>
          <col className="w-[40%]" />
          {plans.map((plan) => (
            <col key={plan.key} style={{ width: `${60 / plans.length}%` }} />
          ))}
        </colgroup>

        <TableHeader>
          <TableRow className="border-b border-neutral-200 hover:bg-transparent">
            <TableHead
              colSpan={plans.length + 1}
              className="pb-2 pt-5 text-sm font-semibold text-neutral-900"
            >
              <span className="flex items-center gap-2">
                {section.titleIcon ? (
                  <span className="inline-flex">
                    {renderSectionIcon(section.titleIcon)}
                  </span>
                ) : sectionTitleIcon ? (
                  <span className="inline-flex">{sectionTitleIcon}</span>
                ) : null}
                {section.title}
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {section.rows.map((row, rowIndex) => {
            const isLastRow = rowIndex === section.rows.length - 1;

            return (
              <TableRow
                key={row.key}
                className={cn(
                  "border-0 hover:bg-white",
                  rowIndex % 2 === 1 && "bg-neutral-100 hover:bg-neutral-100"
                )}
              >
                <TableCell
                  className={cn(
                    "border-r border-neutral-200 px-4 py-3 text-sm text-neutral-700",
                    isLastRow && "!border-b !border-neutral-200"
                  )}
                >
                  <span className="flex w-full items-center justify-between gap-3">
                    <span>{row.label}</span>
                    {row.showInfoIcon && rowInfoIcon ? (
                      <span className="inline-flex shrink-0">
                        {rowInfoIcon}
                      </span>
                    ) : null}
                  </span>
                </TableCell>

                {plans.map((plan) => (
                  <TableCell
                    key={`${row.key}-${plan.key}`}
                    className={cn(
                      "border-r border-neutral-200 px-4 py-3 text-center last:border-r-0",
                      isLastRow && "!border-b !border-neutral-200"
                    )}
                  >
                    {renderCellValue(row.values[plan.key])}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
