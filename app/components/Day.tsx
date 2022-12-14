import { useFetcher, useMatches, useOutletContext } from "@remix-run/react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  actionsByAccount,
  actionsByCategory,
  actionsByPriority,
} from "~/lib/functions";
import type {
  AccountModel,
  ContextType,
  DayModel,
  ItemModel,
} from "~/lib/models";
import { ActionLine } from "./Actions";
import Button from "./Button";
import { CampaignLine } from "./Campaign";
import Celebration from "./Celebrations";

export default function Day({
  day,
  selectedDay,
  firstDayOfCurrentMonth,
  height,
  setSelectedDay,
  filter,
}: {
  day: DayModel;
  selectedDay: string;
  firstDayOfCurrentMonth: Dayjs;
  height: number;
  setSelectedDay: (date: string) => void;
  filter: string;
}) {
  const fetcher = useFetcher();
  const matches = useMatches();
  const tags: ItemModel[] = matches[1].data.tags;
  const accounts: AccountModel[] = matches[1].data.accounts;

  const context: ContextType = useOutletContext();

  return (
    <div
      data-date={day.date.format("YYYY-MM-DD[T]HH:mm")}
      onDragOver={(e) => {
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.classList.add("dragover");
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove("dragover");
      }}
      onDrop={(e) => {
        e.currentTarget.classList.remove("dragover");

        const dragging = document.querySelector(".dragging");
        const id = dragging?.getAttribute("data-id") as string;
        const draggingDate = dragging?.getAttribute("data-date") as string;
        const dropDate = e.currentTarget.getAttribute("data-date") as string;

        fetcher.submit(
          {
            action: "update-date",
            date: `${dayjs(dropDate).format("YYYY-MM-DD")}T${dayjs(
              draggingDate
            ).format("HH:mm")}`,
            id,
          },
          {
            action: "/handle-action",
            method: "post",
          }
        );
      }}
      className={`calendar-day ${
        day.date.format("MM") === firstDayOfCurrentMonth.format("MM")
          ? ""
          : " not-this-month"
      }${
        dayjs(selectedDay).format("YYYY-MM-DD") ===
        day.date.format("YYYY-MM-DD")
          ? " is-selected"
          : ""
      } flex flex-col justify-between`}
      date-attr={day.date.format("YYYY-MM-DD")}
    >
      <div>
        <div className="px-2 lg:px-1">
          <Button
            icon
            small
            squared
            className={
              day.date.format("MM") !== firstDayOfCurrentMonth.format("MM") &&
              dayjs(selectedDay).format("YYYY-MM-DD") !==
                day.date.format("YYYY-MM-DD")
                ? "opacity-25"
                : ""
            }
            link={
              dayjs(selectedDay).format("YYYY-MM-DD") !==
              day.date.format("YYYY-MM-DD")
            }
            primary={
              dayjs(selectedDay).format("YYYY-MM-DD") ===
              day.date.format("YYYY-MM-DD")
            }
            onClick={() => {
              context.date.setDay(day.date);
              setSelectedDay(day.date.format("YYYY-MM-DD"));
            }}
          >
            {day.date.format("D")}
          </Button>
        </div>

        {/* Campanhas Campaigns */}

        <div className={`mt-2 ${height > 0 ? "mb-2 pb-2" : ""}`}>
          <div style={{ height: 24 * height + (height - 1) * 4 + "px" }}>
            {day.campaigns.map((campaign) => (
              <div key={campaign.id} className="relative mt-1 h-6">
                {/* Caso seja oprimeiro dia
              ou seja o primeiro da semana */}
                {day.date.format("YYYY-MM-DD") ===
                  dayjs(campaign.date_start).format("YYYY-MM-DD") ||
                day.date.day() === 0 ? (
                  <div
                    className={`absolute z-10 overflow-hidden ${
                      // Caso seja o primeiro dia
                      day.date.format("YYYY-MM-DD") ===
                      dayjs(campaign.date_start).format("YYYY-MM-DD")
                        ? // Caso o ??ltimo dia esteja na mesma linha
                          dayjs(campaign.date_end).diff(day.date, "days") < 7
                          ? " ml-1 rounded-md"
                          : " ml-1 rounded-l-md"
                        : // Caso n??o seja o primeiro dia, mas representa o ??ltimo
                        dayjs(campaign.date_end).diff(day.date, "days") < 7
                        ? " rounded-r-md "
                        : ""
                    }`}
                    style={{
                      width: ` calc(${
                        //Caso o ??ltimo dia n??o seja na mesma linha
                        (dayjs(campaign.date_end).diff(day.date, "days") > 7
                          ? //quantos dias falta para o ??ltimo
                            7 - day.date.day()
                          : //Caso o ??ltimo dia esteja na mesma linha
                            dayjs(campaign.date_end).diff(day.date, "days") +
                            1) * 100
                      }% - ${
                        dayjs(campaign.date_end).diff(day.date, "days") < 7
                          ? dayjs(campaign.date_start).format("YYYY-MM-DD") ===
                            day.date.format("YYYY-MM-DD")
                            ? 8
                            : 4
                          : 0
                      }px)`,
                    }}
                  >
                    <CampaignLine campaign={campaign} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className={`space-y-4`}>
          {filter === "allcategory"
            ? actionsByCategory(day.actions, tags).map(
                (category, index) =>
                  category.actions?.length !== 0 && (
                    <div key={index}>
                      <div className="mb-1 flex items-center gap-2">
                        <div
                          className={`mb-1/2 h-1 w-1 rounded-full bg-${category.tag.slug}`}
                        ></div>
                        <div
                          className={`text-xx font-bold uppercase tracking-[1px] text-gray-300`}
                        >
                          {category.tag?.name}
                        </div>
                      </div>
                      {category.actions?.map((action, index) => (
                        <ActionLine key={index} action={action} />
                      ))}
                    </div>
                  )
              )
            : filter === "allaccount"
            ? actionsByAccount(day.actions, accounts).map(
                (account, index) =>
                  account.actions?.length !== 0 && (
                    <div key={index}>
                      <div className="mb-1 flex items-center gap-2">
                        <div
                          className={`mb-1/2 h-1 w-1 rounded-full bg-brand`}
                        ></div>
                        <div
                          className={`text-[10px] font-bold uppercase tracking-[1px] text-gray-500`}
                        >
                          {account.account?.short}
                        </div>
                      </div>
                      {account.actions?.map((action, index) => (
                        <ActionLine key={index} action={action} />
                      ))}
                    </div>
                  )
              )
            : filter === "priority"
            ? actionsByPriority(day.actions).map((action, index) => (
                <ActionLine key={index} action={action} />
              ))
            : day.actions.map((action, index) => (
                <ActionLine key={index} action={action} />
              ))}
        </div>
      </div>

      <div className="p-1">
        {day.celebrations.map((celebration) => (
          <Celebration celebration={celebration} key={celebration.id} small />
        ))}
      </div>
    </div>
  );
}
