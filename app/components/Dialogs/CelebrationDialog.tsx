import { useFetcher, useOutletContext } from "@remix-run/react";
import type { Dayjs } from "dayjs";
import { useEffect, useRef } from "react";
import Exclamation from "../Exclamation";
import Button from "../Button";
import Checkbox from "../Forms/CheckboxField";
import Field from "../Forms/InputField";
import Loader from "../Loader";

export default function CelebrationDialog() {
  const context: {
    date: {
      dateOfTheDay: Dayjs;
    };
    celebrations: {
      setOpenDialogCelebration: any;
    };
  } = useOutletContext();
  const date = context.date.dateOfTheDay;
  const fetcher = useFetcher();
  const isAdding =
    fetcher.state === "submitting" &&
    fetcher.submission.formData.get("action") === "create-celebration";
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (
      !isAdding &&
      fetcher.state === "idle" &&
      fetcher.data &&
      !fetcher.data.error
    ) {
      context.celebrations?.setOpenDialogCelebration(false);
    }
  }, [isAdding, context, fetcher]);

  return (
    <>
      <div className="mb-4 flex justify-between">
        <h4>Nova Data Comemorativa</h4>
        <div>{isAdding && <Loader />}</div>
      </div>
      {fetcher.data && fetcher.data.error ? (
        <Exclamation type="error" icon>
          {fetcher.data.error.message}
        </Exclamation>
      ) : null}

      <fetcher.Form method="post" ref={formRef} action="/handle-action">
        <input type="hidden" name="action" value="create-celebration" />
        <Field name="name" title="Nome" />
        <Field
          name="date"
          title="Data"
          pattern="[0-9]{2}/[0-9]{2}"
          value={date.format("DD/MM")}
          placeholder="dd/mm"
        />
        <Checkbox title="Feriado" name="is_holiday" />
        <div className="flex items-center justify-end pt-4">
          <Button primary type="submit">
            Adicionar
          </Button>
        </div>
      </fetcher.Form>
    </>
  );
}