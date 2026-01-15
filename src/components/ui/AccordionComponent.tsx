import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type CategoryBudget = {
  category: string;
  allocated: number;
  used: number;
};

type AccordionComponentProps = {
  data: CategoryBudget[];
};

function AccordionComponent({ data }: AccordionComponentProps) {
  return (
    <div className="bg-white rounded-md shadow-md">
      <Accordion type="single" className="px-5" collapsible>
        {data.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex gap-3">
                <span>{item.category}</span>
                <span
                  className={`${
                    item.used > item.allocated
                      ? "text-red-500 bg-red-400/40 rounded-full px-2 pt-0.5 text-xs font-semibold hover:no-underline"
                      : "hidden"
                  }`}
                >
                  EXCEEDED
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="text-muted-foreground">
              Budget Allocated:{" "}
              <span className="font-semibold text-foreground">
                ${item.allocated.toLocaleString()}
              </span>
            </AccordionContent>
            <AccordionContent className="text-muted-foreground">
              Amount Spent:{" "}
              <span
                className={`font-semibold text-foreground ${
                  item.used > item.allocated
                    ? "text-red-500"
                    : " text-green-500"
                }`}
              >
                ${item.used.toLocaleString()}
              </span>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default AccordionComponent;
