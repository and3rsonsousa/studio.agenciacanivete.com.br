import {
  Form,
  useFetcher,
  useMatches,
  useOutletContext,
} from "@remix-run/react";
import { format, formatDistance } from "date-fns";
import { useEffect, useRef, useState } from "react";
import type {
  AccountModel,
  ActionModelFull,
  CampaignModel,
  PersonModel,
} from "~/lib/models";
import Button from "../Forms/Button";
import { default as Field, default as InputField } from "../Forms/InputField";
import SelectField from "../Forms/SelectField";
import TextareaField from "../Forms/TextareaField";

import { ptBR } from "date-fns/locale";
import Exclamation from "../Exclamation";

export default function ActionDialog({
  date,
  action,
}: {
  date?: Date;
  action?: ActionModelFull;
}) {
  const matches = useMatches();
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);

  const context: {
    actions: {
      openDialogAction: boolean;
      setOpenDialogAction: any;
    };
  } = useOutletContext();

  const accounts: AccountModel[] = matches[1].data.accounts;
  const tags: CampaignModel[] = matches[1].data.tags;
  const status: CampaignModel[] = matches[1].data.status;
  const persons: PersonModel[] = matches[1].data.persons;
  const campaigns: CampaignModel[] = matches[2].data.campaigns;

  const creator: PersonModel = action ? action.creator : matches[1].data.person;
  const account: AccountModel = action
    ? action.account
    : matches[2].data.account;

  const accountItems = accounts.map((account) => ({
    title: account.name,
    value: account.id,
  }));

  const personsItems = persons.map((person) => ({
    title: person.name,
    value: person.id,
  }));

  const [selectedAccount, setSelectedAccount] = useState(
    account ? account.id : ""
  );
  const [isDirty, setDirty] = useState(false);

  const campaignItems =
    selectedAccount && campaigns
      ? campaigns
          .filter((campaign) => campaign.account === selectedAccount)
          .map((campaign) => ({
            title: campaign.name,
            value: campaign.id,
          }))
      : [];

  const isAdding =
    fetcher.state === "submitting" &&
    fetcher.submission.formData.get("action") === "create-action";

  const isUpdating =
    fetcher.state === "submitting" &&
    fetcher.submission.formData.get("action") === "update-action";

  useEffect(() => {
    if (
      !isAdding &&
      fetcher.state === "idle" &&
      fetcher.data &&
      !fetcher.data.error
    ) {
      context.actions.setOpenDialogAction(false);
    }
  }, [isAdding, context, fetcher]);

  useEffect(() => {
    function getDirty() {
      setDirty(true);
    }

    window.addEventListener("keydown", getDirty);
    window.addEventListener("mousedown", getDirty);

    if (action) {
      const save = setInterval(() => {
        if (isDirty) {
          fetcher.submit(formRef.current, {
            method: "post",
            action: `/handle-action`,
          });
          setDirty(false);
        }
      }, 5000);
      return () => {
        clearInterval(save);
        window.removeEventListener("keydown", getDirty);
        window.removeEventListener("mousedown", getDirty);
      };
    }
  }, [action, isDirty, fetcher]);
  return (
    <>
      <div className="mb-4 flex justify-between">
        <div>
          <h4 className="m-0 dark:text-gray-200">
            {action ? `Editar Ação` : `Nova Ação`}
          </h4>
          {action ? (
            <div className="mt-1 text-xs font-normal text-gray-300 dark:text-gray-700">
              #{action.id}
            </div>
          ) : null}
        </div>

        {/* Mostra há quanto tempo foi criado ou atualizado */}
        {action && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div>
              {isUpdating ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-brand-300"></div>
              ) : null}
            </div>
            <div>
              {format(new Date(action.created_at), "y-MM-dd HH:mm:ss") ===
              format(new Date(action.updated_at), "y-MM-dd HH:mm:ss")
                ? "Criado há "
                : "Atualizado há "}

              {formatDistance(new Date(), new Date(action.updated_at), {
                locale: ptBR,
              })}
            </div>
          </div>
        )}
      </div>

      {fetcher.data && fetcher.data.error ? (
        <Exclamation type="error" icon>
          {fetcher.data.error.message}
        </Exclamation>
      ) : null}

      <fetcher.Form method="post" ref={formRef} action="/handle-action">
        <input
          type="hidden"
          name="action"
          value={action ? "update-action" : "create-action"}
        />
        <input type="hidden" name="creator" value={creator.id} />
        {action ? <input type="hidden" name="id" value={action.id} /> : null}

        <Field
          name="name"
          title="Nome"
          value={action ? action.name : undefined}
        />
        {action ? (
          <input type="hidden" name="account" value={account.id} />
        ) : (
          <SelectField
            name="account"
            title="Cliente"
            value={account ? account.id : undefined}
            items={accountItems}
            onChange={setSelectedAccount}
          />
        )}
        <SelectField
          name="campaign"
          title="Campanha"
          items={campaignItems}
          placeholder={
            selectedAccount
              ? campaignItems?.length > 0
                ? "Selecione uma campanha"
                : "Nenhum campanha para esse cliente"
              : "Escolha um cliente primeiro"
          }
          disabled={campaignItems?.length === 0 && selectedAccount !== ""}
          value={action ? action.campaign?.id : undefined}
        />
        <TextareaField
          name="description"
          title="Descrição"
          value={action ? action.description : undefined}
          lines={action ? 5 : 3}
        />

        <div className="grid w-full grid-cols-2 gap-4">
          <SelectField
            name="tag"
            title="Tags"
            value={
              action ? action.tag.id : "d90224a7-abf2-4bc7-be60-e5d165a6a37a"
            }
            items={tags.map((tag) => ({ title: tag.name, value: tag.id }))}
          />

          <SelectField
            name="status"
            title="Status"
            value={
              action ? action.status.id : "32a26e75-5f4a-4ae7-8805-877909abb477"
            }
            items={status.map((stat) => ({
              title: stat.name,
              value: stat.id,
            }))}
          />

          <InputField
            name="date"
            title="Data"
            type="datetime-local"
            value={format(
              action ? new Date(action.date) : date ?? new Date(),
              "y-MM-dd 11:12"
            )}
          />

          <SelectField
            name="responsible"
            title="Responsável"
            items={personsItems}
            value={action ? action.responsible.id : creator.id}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-4">
          {action && (
            <Form method="post">
              <input type="hidden" name="id" value={action.id} />
              <input type="hidden" name="action" value="delete-action" />
              <Button>Excluir</Button>
            </Form>
          )}
          <Button primary type="submit">
            {action ? "Atualizar" : "Adicionar"}
          </Button>
        </div>
      </fetcher.Form>
    </>
  );
}
