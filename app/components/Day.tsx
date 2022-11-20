import { useFetcher, useOutletContext } from "@remix-run/react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { actionsByPriority } from "~/lib/functions";
import type { DayModel } from "~/lib/models";
import { Action } from "./Actions";
import Button from "./Button";
import { CampaignLine } from "./Campaign";
import Celebration from "./Celebrations";

export default function Day({
  day,
  selectedDay,
  firstDayOfCurrentMonth,
  index,
  height,
  setSelectedDay,
}: {
  day: DayModel;
  selectedDay: string;
  firstDayOfCurrentMonth: Dayjs;
  index: number;
  height: number;
  setSelectedDay: (date: string) => void;
}) {
  const fetcher = useFetcher();
  const context: {
    date: {
      setDateOfTheDay: (value: Dayjs) => void;
    };
  } = useOutletContext();

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
      className={`calendar-day${
        day.date.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
          ? " is-today"
          : ""
      }${
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
            className="day-button appearance-none"
            icon
            small
            link
            onClick={() => {
              context.date.setDateOfTheDay(day.date);
              setSelectedDay(day.date.format("YYYY-MM-DD"));
            }}
          >
            {day.date.format("D")}
          </Button>
        </div>

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
                        ? // Caso o último dia esteja na mesma linha
                          dayjs(campaign.date_end).diff(day.date, "days") < 7
                          ? " ml-1 rounded"
                          : " ml-1 rounded-l"
                        : // Caso não seja o primeiro dia, mas representa o último
                        dayjs(campaign.date_end).diff(day.date, "days") < 7
                        ? " rounded-r "
                        : ""
                    }`}
                    style={{
                      width: ` calc(${
                        //Caso o último dia não seja na mesma linha
                        (dayjs(campaign.date_end).diff(day.date, "days") > 7
                          ? //quantos dias falta para o último
                            7 - day.date.day()
                          : //Caso o último dia esteja na mesma linha
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

        <div>
          {actionsByPriority(day.actions).map((action, index) => (
            <Action key={action.id} action={action} />
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
